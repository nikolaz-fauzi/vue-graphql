<template>
  <v-container>
    <h1>Home</h1>
    <v-flex xs12>
      <v-carousel v-if="posts.length > 0" v-bind="{'cycle': true}" interval="3000">
        <v-carousel-item v-for="post in posts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
      <div v-else>
        <v-sheet class="px-3 pt-3 pb-3">
          <v-skeleton-loader max-width="100%" type="card"></v-skeleton-loader>
        </v-sheet>
      </div>
    </v-flex>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";
export default {
  name: "home",
  data() {
    return {};
  },
  created() {
    this.handleGetCarouselPosts();
  },
  computed: {
    posts() {
      return this.$store.getters.posts;
    }
  },
  methods: {
    handleGetCarouselPosts() {
      // reach out to vuex store, fire action to get posts for carousel
      this.$store.dispatch("getPosts");
    }
  }
};
</script>

<style lang="scss">
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.2);
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


  // apollo: {
  //   getPosts: {
  //     query: gql`
  //       query {
  //         getPosts {
  //           _id
  //           title
  //           imageUrl
  //           description
  //         }
  //       }
  //     `,
  //     result({ data, loading, networkStatus }) {
  //       if (!loading) {
  //         // this.posts = data.getPosts;
  //         console.log("[network status]", networkStatus);

  //         // Network status
  //         // loading = 1,
  //         // setVariables = 2,
  //         // fetchMore = 3,
  //         // refetch = 4
  //         // poll = 6,
  //         // ready = 7,
  //         // error = 9
  //       }
  //     },
  //     error(err) {
  //       console.log("[ERROR]", err);
  //     }
  //   }
  // }