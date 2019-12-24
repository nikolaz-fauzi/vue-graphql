import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

Vue.use(VueApollo);

// Setup ApolloClient
// with or without /graphql is ok
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  // Include auth token with req made to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: (operation) => {
    // if no token of key 'token' in LS, prevent error
    if (!localStorage.token) {
      localStorage.setItem('token', '');
    }

    // operation adds the token to an authorization header, which is sent to BE
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log(err);
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app')
