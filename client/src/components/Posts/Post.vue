<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn @click="handleToggleLike" large icon v-if="user">
              <v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} Likes</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large
              >arrow_back</v-icon
            >
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <template v-slot:activator="{ on }">
              <v-img
                @click="toggleImageDialog"
                v-on="on"
                :src="getPost.imageUrl"
                id="post__image"
              />
            </template>
          </v-tooltip>

          <!-- Post Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="500px" />
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{
                category
              }}</v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form
            ref="form"
            v-model="isFormValid"
            lazy-validation
            @submit.prevent="handleAddPostMessage"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="messageRules"
                  clearable
                  v-model="messageBody"
                  :append-outer-icon="messageBody && 'send'"
                  label="Add Message"
                  type="text"
                  prepend-icon="email"
                  @click:append-outer="handleAddPostMessage"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Messages -->
            <v-layout row wrap>
              <v-flex xs12>
                <v-list subheader two-line>
                  <v-subheader
                    >Messages ({{ getPost.messages.length }})</v-subheader
                  >

                  <template v-for="message in getPost.messages">
                    <v-divider :key="message._id"></v-divider>
                    <v-list-item :key="message.title">
                      <v-list-item-icon>
                        <v-img :src="message.messageUser.avatar"></v-img>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title>
                          {{ message.messageBody }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <b>{{ message.messageUser.username }}</b>
                          <span
                            class="grey--text text-lighten-1 hidden-xs-only"
                          >
                            {{ getTimeFromNow(message.messageDate) }}
                          </span>
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action class="hidden-xs-only">
                        <v-icon
                          :color="
                            checkIfOwnMessage(message) ? 'accent' : 'grey'
                          "
                          >chat_bubble</v-icon
                        >
                      </v-list-item-action>

                      <v-list-item-avatar>
                        <v-img :src="message.avatar"></v-img>
                      </v-list-item-avatar>
                    </v-list-item>
                  </template>
                </v-list>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import moment from 'moment';
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST
} from "../../queries";
import { mapGetters } from "vuex";
export default {
  name: "Post",
  props: {
    postId: {
      type: String
    }
  },
  data() {
    return {
      postLiked: false,
      dialog: false,
      messageBody: "",
      isFormValid: true,
      messageRules: [
        message => !!message || "Message is Required",
        message =>
          message.length < 50 || "Message must be less than 50 characters"
      ]
    };
  },
  apollo: {
    // runs before params postId / server side / use variables function return
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    checkIfPostLiked(postId) {
      // check if user favorites includes post with id of 'postId'
      if (this.userFavorites && this.userFavorites.some(fave => fave._id === postId)) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    handleLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      }
      this.$apollo.mutate({
        mutation: LIKE_POST,
        variables,
        update: (cache, { data: { likePost }}) => {
          // get post after like, read query getpost
          const data = cache.readQuery({
            query: GET_POST,
            variables: {
              postId: this.postId
            }
          });
          // update likes in client getpost
          data.getPost.likes += 1;
          // write back to query getpost
          cache.writeQuery({
            query: GET_POST,
            variables: { postId: this.postId },
            data
          })
        }
      }).then(({ data }) => {
        // Update favorites (user) to User, CLIENT SIDE
        const updatedUser = { ...this.user, favorites: data.likePost.favorites };
        this.$store.commit('setUser', updatedUser);
      }).catch((err) => console.error(err));
    },
    handleUnlikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      }
      this.$apollo.mutate({
        mutation: UNLIKE_POST,
        variables,
        update: (cache, { data: { unlikePost }}) => {
          // get post after like, read query getpost
          const data = cache.readQuery({
            query: GET_POST,
            variables: {
              postId: this.postId
            }
          });
          // update likes in client getpost
          data.getPost.likes -= 1;
          // write back to query getpost
          cache.writeQuery({
            query: GET_POST,
            variables: { postId: this.postId },
            data
          })
        }
      }).then(({ data }) => {
        // Update favorites (user) to User, CLIENT SIDE
        const updatedUser = { ...this.user, favorites: data.unlikePost.favorites };
        this.$store.commit('setUser', updatedUser);
      }).catch((err) => console.error(err));
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            // update automaticly without refresh
            update: (cache, { data: { addPostMessage } }) => {
              // find all data
              const data = cache.readQuery({
                query: GET_POST,
                variables: {
                  postId: this.postId
                }
              });
              // add new data to first in existing data, temp
              data.getPost.messages.unshift(addPostMessage);
              // add back to our graphql
              cache.writeQuery({
                query: GET_POST,
                variables: {
                  postId: this.postId
                },
                data
              });
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset();
            console.log(data.addPostMessage);
          })
          .catch(err => console.error(err));
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    }
  },
  watch: {
    getPost(e) {
      console.log(e);
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 80vh !important;
}
</style>
