import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router';

import {
  defaultClient as apolloClient
} from '../main';

import {
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST,
  SEARCH_POSTS
} from '../queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearUser: state => state.user = null,
    clearError: state => state.error = null
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        commit('setLoading', false);
        // Add user data to state
        commit('setUser', data.getCurrentUser);
        console.log(data.getCurrentUser);
      })
      .catch((err) => {
        console.log(err);
        commit('setLoading', false);
      })
    },
    getPosts: ({
      commit
    }) => {
      commit('setLoading', true);
      // use ApolloClient to fire getPosts query
      // add export to main js (apollo client property)
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({
          data
        }) => {
          // Get data from actions and save to state via mutation
          // Commit passes data from action to mutation
          setTimeout(() => {
            commit('setPosts', data.getPosts);
            commit('setLoading', false);
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          commit('setLoading', false);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({ data }) => {
        commit('setSearchResults', data.searchPosts);
      }).catch(err => console.error(err));
    },
    addPost: ({commit}, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          // position update to beginning (unshift)
          update: (cache, { data : { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create update data
            data.getPosts.unshift(addPost);
            // write updated data back to query
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // Optimistic response ensures data is added immediately as we specified for the update
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          }
        })
        .then(({data}) => {
          console.log(data);
        })
        .catch(err => {
          console.error(err);
        })
    },
    signinUser: ({
      commit
    }, payload) => {
      localStorage.setItem('token', '');
      commit('clearError');
      commit('setLoading', true);
      apolloClient.mutate({
        variables: payload,
        mutation: SIGNIN_USER
      })
      .then(({data}) => {
        commit('setLoading', false);
        localStorage.setItem('token', data.signinUser.token);
        // to make sure created method is run in main.js
        // we run getCurrentUser, reload the page
        router.go();
      })
      .catch(err => {
        commit('setError', err);
        commit('setLoading', false);
        console.log(err)
      });
    },
    signupUser: ({
      commit
    }, payload) => {
      localStorage.setItem('token', '');
      commit('clearError');
      commit('setLoading', true);
      apolloClient.mutate({
        variables: payload,
        mutation: SIGNUP_USER
      })
      .then(({data}) => {
        commit('setLoading', false);
        localStorage.setItem('token', data.signupUser.token);
        // to make sure created method is run in main.js
        // we run getCurrentUser, reload the page
        router.go();
      })
      .catch(err => {
        commit('setError', err);
        commit('setLoading', false);
        console.log(err)
      });
    },
    signoutUser: async ({commit}) => {
      // clear user in state
      commit('clearUser');
      // remove token in LocalStorage, can use remove or set to ''
      localStorage.setItem('token', '');
      // end session
      await apolloClient.resetStore();
      // redirect home - kick user out of private page
      router.push('/');
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    searchResults: state => state.searchResults,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError
  }
})