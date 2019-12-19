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
      <v-list-content>
        <v-list-item ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>
      </v-list-content>
    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-card color="grey lighten-4" flat>
      <v-toolbar fixed color="primary" dark>
        <!-- App Title -->
        <v-app-bar-nav-icon @click="sideNav = !sideNav"></v-app-bar-nav-icon>
        <v-toolbar-title class="hidden-xs-only">
          <v-toolbar-title>
            <router-link to="/" tag="span" style="cursor: pointer">
              VueShare
            </router-link>
          </v-toolbar-title>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Search Input -->
        <v-text-field
          flex
          prepend-icon="search"
          placeholder="Search posts"
          color="accent"
          single-line
          hide-details
        >
        </v-text-field>

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
            {{item.title}}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
    <!-- App content -->
    <main>
      <div>
        <router-view />
      </div>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sideNav: false
    };
  },
  computed: {
    horizontalNavItems() {
      return [
        { icon: "search", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Un", link: "/signup" }
      ];
    },
    sideNavItems() {
      return [
        { icon: "search", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Un", link: "/signup" }
      ];
    }
  }
};
</script>
