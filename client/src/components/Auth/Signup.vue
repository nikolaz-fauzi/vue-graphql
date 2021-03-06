<template>
  <v-container text-center mt-5 pt-5>
    <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h3>Get Started Here</h3>
      </v-flex>
    </v-layout>
    <!-- Error alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>
    <!-- Signup Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form
              v-model="isFormValid"
              ref="form"
              lazy-validation
              @submit.prevent="handleSignupUser"
            >
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="usernameRules"
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
                    :rules="emailRules"
                    v-model="email"
                    prepend-icon="email"
                    label="Email"
                    type="email"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
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
                  <v-text-field
                    :rules="passwordRules"
                    v-model="passwordConfirmation"
                    prepend-icon="gavel"
                    label="Confirm Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    :disabled="!isFormValid || loading"
                    color="accent"
                    type="submit"
                    :loading="loading"
                  >Signup</v-btn>
                  <h3>
                    Already have an account?
                    <router-link to="/signin">Signin</router-link>
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
import { mapGetters } from 'vuex';
export default {
  name: "Signup",
  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      usernameRules: [
        username => !!username || 'Username is required',
        username => username.length < 10 || "Username cannot be more than 10 characters"
      ],
      emailRules: [
        email => !!email || 'Email is required',
        email => /.@+./.test(email) || 'Email must be valid'
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || 'Password must be atlest 4 characters',
        confirmation => confirmation === this.password || 'Password must match'
      ],
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user']),
  },
  watch: {
    user(value) {
      // if user value changed redirect to home page
      if (value) {
        this.$router.push('/');
      }
    }
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          password: this.password
        })
      }
    }
  }
};
</script>

<style>
</style>