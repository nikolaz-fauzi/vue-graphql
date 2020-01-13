<template>
  <v-container text-center mt-5 pt-5>
    <!-- Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h3 class="primary--text">Add Post</h3>
      </v-flex>
    </v-layout>

    <!-- Add Post Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isFormValid" ref="form" lazy-validation @submit.prevent="handleAddPost">
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                :rules="titleRules"
                v-model="title"
                label="Post Title"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-text-field
                :rules="imageRules"
                v-model="imageUrl"
                label="image URL"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image Preview -->
          <v-layout v-if="imageUrl">
            <v-flex xs12>
              <img :src="imageUrl" height="300px" />
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-select
                :rules="categoriesRules"
                v-model="categories"
                :items="['Art', 'Education', 'Travel', 'Photography']"
                multiple
                label="Categories"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-textarea
                :rules="descRules"
                v-model="description"
                label="Description"
                type="text"
                required
              ></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn
                :disabled="!isFormValid || loading"
                color="accent"
                type="submit"
                :loading="loading"
              >Submit</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description is required",
        desc =>
          desc.length < 200 || "Description must have less than 200 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading"])
  },
  methods: {
    handleAddPost() {
      
    }
  }
};
</script>

<style>
</style>