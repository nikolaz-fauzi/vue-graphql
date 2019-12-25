<template>
  <v-container text-center mt-5 pt-5>
    <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h3>Welcome Back!</h3>
      </v-flex>
    </v-layout>
    <!-- Error alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message">
        </form-alert>
      </v-flex>
    </v-layout>
    <!-- Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form @submit.prevent="handleSigninUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="username"
                    prepend-icon="face"
                    label="Username"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    prepend-icon="extension"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn color="accent" type="submit">Signin</v-btn>
                  <h3>
                    Don't have an account?
                    <router-link to="/signup">Signup</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Signin",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  watch: {
    user(value) {
      // if user value changes(not null), redirect to home page
      if (value) {
        this.$router.push('/');
      }
    }
  },
  methods: {
    handleSigninUser() {
      this.$store.dispatch('signinUser', {
        username: this.username,
        password: this.password
      })
    }
  }
};
</script>

<style>
</style>