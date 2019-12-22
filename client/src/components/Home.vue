<template>
  <v-container v-if="getPosts">
    <h1>Home</h1>
    <v-flex xs12>
      <v-carousel v-bind="{'cycle': true}" interval="3000">
        <v-carousel-item v-for="post in getPosts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
    <div v-if="$apollo.loading">Loading...</div>
    <!-- <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: {loading, data, error} }">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error : {{ error.message }}</div>
        <ul v-else v-for="post in data.getPosts" :key="post.id">
          <li>
            {{post.title}}
            {{post.imageUrl}}
            {{post.likes}}
          </li>
        </ul>
      </template>
    </ApolloQuery>-->
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";
export default {
  name: "home",
  data() {
    return {
      // getPostsQuery: gql`
      //   query {
      //     getPosts {
      //       _id
      //       title
      //       imageUrl
      //       description
      //     }
      //   }
      // `
    };
  },
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
          }
        }
      `,
      result({ data, loading, networkStatus }) {
        if (!loading) {
          // this.posts = data.getPosts;
          console.log("[network status]", networkStatus);

          // Network status
          // loading = 1,
          // setVariables = 2,
          // fetchMore = 3,
          // refetch = 4
          // poll = 6,
          // ready = 7,
          // error = 9
        }
      },
      error(err) {
        console.log("[ERROR]", err);
      }
    }
  }
};
</script>

<style lang="scss">
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  padding-bottom: 50px;
  margin: 0 auto;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>