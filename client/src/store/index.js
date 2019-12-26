import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router';

import {
  defaultClient as apolloClient
} from '../main';

import {
  GET_POSTS,
  SIGNIN_USER,
  GET_CURRENT_USER
} from '../queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
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
    user: state => state.user,
    error: state => state.error
  }
})