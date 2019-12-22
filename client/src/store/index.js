import Vue from 'vue'
import Vuex from 'vuex'

import {
  gql
} from 'apollo-boost';
import {
  defaultClient as apolloClient
} from '../main';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    }
  },
  actions: {
    getPosts: ({ commit }) => {
      // use ApolloClient to fire getPosts query
      // add export to main js (apollo client property)
      apolloClient
        .query({
          query: gql `
            query {
              getPosts {
                _id
                title
                imageUrl
              }
            }
          `
        })
        .then(({ data }) => {
          // Get data from actions and save to state via mutation
          // Commit passes data from action to mutation
          setTimeout(() => {
            commit('setPosts', data.getPosts);
          }, 2000);
        })
        .catch(err => console.log(err));
    }
  },
  getters: {
    posts: state => state.posts
  }
})