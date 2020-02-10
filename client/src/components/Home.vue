<template>
  <v-container>
    <!-- Loading spinner -->
    <v-layout>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary">
            </v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- Export posts buttons -->
    <v-layout class="mt-2 mb-3" row wrap v-if="!loading">
      <v-flex xs12 style="text-align: center">
        <v-btn class="secondary" to="/posts" large dark>
          Explore Posts
        </v-btn>
      </v-flex>
    </v-layout>

  <!-- Posts Carousel -->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{'cycle': true}" interval="3000">
        <v-carousel-item @click.native="goToPost(post._id)" v-for="post in posts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
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
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    handleGetCarouselPosts() {
      // reach out to vuex store, fire action to get posts for carousel
      this.$store.dispatch("getPosts");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>

<style lang="scss">
#carousel__title {
  cursor: pointer;
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