import Vue from 'vue'
import Vuex from 'vuex'

import {
  defaultClient as apolloClient
} from '../main';

import { GET_POSTS } from '../queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      // use ApolloClient to fire getPosts query
      // add export to main js (apollo client property)
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
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
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
})