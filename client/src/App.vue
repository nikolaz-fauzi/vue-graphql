<template>
  <v-app style="background: #E3E3EE">
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-app-bar-nav-icon @click="sideNav = !sideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <div>
        <v-list-item
          ripple
          v-for="item in sideNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
        <!-- Signout button -->
        <v-list-item ripple v-if="user" @click="handleSignoutUser">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Signout</v-list-item-content>
        </v-list-item>
      </div>
    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-card color="grey lighten-4" flat style="position: relative; z-index: 10">
      <v-toolbar fixed color="primary" dark>
        <!-- App Title -->
        <v-app-bar-nav-icon @click="sideNav = !sideNav"></v-app-bar-nav-icon>
        <v-toolbar-title class="hidden-xs-only">
          <v-toolbar-title>
            <router-link to="/" tag="span" style="cursor: pointer"
              >VueShare</router-link
            >
          </v-toolbar-title>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Search Input -->
        <v-text-field
          v-model="searchTerm"
          @input="handleSearchPosts"
          flex
          prepend-icon="search"
          placeholder="Search posts"
          color="accent"
          single-line
          hide-details
        ></v-text-field>

        <!-- Search results card -->
        <v-card light v-if="searchResults.length" id="search__card">
          <v-card-text
            @click="goToSearchResult(result._id)"
            v-for="result in searchResults"
            :key="result._id"
          >
            <div class="text--primary" style="display: inline">
              {{ result.title }} -
              <span class="font-weight-thin">{{ formatDescription(result.description) }}</span>
            </div>
            <!-- Show icon if result favorited by user -->
            <span v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </span>
          </v-card-text>
        </v-card>

        <v-spacer></v-spacer>

        <!-- Horizontal navbar links -->
        <v-toolbar-items class="hidden-xs-only">
          <v-btn
            text
            v-for="item in horizontalNavItems"
            :key="item.title"
            :to="item.link"
          >
            <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>

          <!-- Profile button -->
          <v-btn text to="/profile" v-if="user">
            <v-icon class="hidden-sm-only" left>account_box</v-icon>
            <v-badge
              right
              color="blue darken-2"
              :class="{ bounce: badgeAnimated }"
            >
              <span slot="badge" v-if="!!userFavorites.length">{{
                userFavorites.length
              }}</span>
              Profile
            </v-badge>
          </v-btn>

          <!-- Signout button -->
          <v-btn text to="/profile" v-if="user" @click="handleSignoutUser">
            <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
            Signout
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
    <!-- App content -->
    <main>
      <div>
        <transition name="fade">
          <router-view />
        </transition>

        <!-- Auth Snackbar -->
        <v-snackbar
          v-model="authSnackbar"
          :timeout="5000"
          color="success"
          bottom
          left
        >
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark text @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar
          v-if="authError"
          v-model="authErrorSnackbar"
          :timeout="5000"
          color="warning"
          bottom
          left
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ authError.message }}</h3>
          <v-btn dark text to="/signin">Signin</v-btn>
        </v-snackbar>
      </div>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false,
      searchTerm: ""
    };
  },
  watch: {
    user(newValue, oldValue) {
      // if we had no value for user before, show snackbar
      if (!oldValue) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      // if auth error not full, show auth error snackbar
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      // if user favorites value changed at all
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => {
          this.badgeAnimated = false;
        }, 1000);
      }
    }
  },
  computed: {
    horizontalNavItems() {
      let items = [
        { icon: "search", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "search", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    },
    user() {
      return this.$store.getters.user;
    },
    searchResults() {
      return this.$store.getters.searchResults;
    },
    authError() {
      return this.$store.getters.authError;
    },
    userFavorites() {
      return this.$store.getters.userFavorites;
    }
  },
  methods: {
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    goToSearchResult(resultId) {
      // clear search term
      this.searchTerm = '';
      // Go to desired result page post
      this.$router.push(`/posts/${resultId}`);
      // Clear search results in state
      this.$store.commit('clearSearchResults');
    },
    formatDescription(desc) {
      return desc.length > 20 ? `${desc.slice(0, 20)}...` : desc;
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    checkIfUserFavorite(resultId) {
      return this.userFavorites && this.userFavorites.some(fave => fave._id === resultId);
    }
  }
};
</script>

<style lang="scss">
.v-carousel__controls {
  background: none !important;
}
.fade-enter-active,
.fade-leave-active {
  transition-property: all; //using opacity if fade only
  transition-duration: 0.25s;
}

// if not using this, the text will move from bottom to up
.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateX(-25px); // not using this if fade only
}

// Search results card
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
  cursor: pointer;
}

// User favorites animation
.bounce {
  animation: bounce 1s both; // both direction
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
