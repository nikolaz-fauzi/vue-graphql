<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn large icon v-if="user">
              <v-icon large color="grey">favorite</v-icon>
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
          <v-form>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  clearable
                  append-outer-icon="send"
                  label="Add Message"
                  type="text"
                  prepend-icon="email"
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
                        <v-icon v-if="item.icon" color="pink">mdi-star</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title v-text="item.title">
                          {{ message.messageBody }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ message.messageUser.username }}
                          <span class="grey--text text-lighten-1 hidden-xs-only">
                            {{message.messageDate}}
                          </span>
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action class="hidden-xs-only">
                        <v-icon color="grey">chat_bubble</v-icon>
                      </v-list-item-action>

                      <v-list-item-avatar>
                        <v-img :src="message.avatar"></v-img>
                      </v-list-item-avatar>
                    </v-list-item>
                    v-list
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
import { GET_POST } from "../../queries";
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
      dialog: false
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
    ...mapGetters(["user"])
  },
  methods: {
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
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
