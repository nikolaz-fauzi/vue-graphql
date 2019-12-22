<template>
  <v-container>
    <h1>Home</h1>
    <ul>
      <li v-for="post in getPosts" :key="post.id">
        {{post.title}}
        {{post.imageUrl}}
        {{post.description}}
      </li>
    </ul>
  </v-container>
</template>

<script>
import { gql } from 'apollo-boost';
export default {
  name: 'home',
  apollo: {
    getPosts: {
      query: gql`
        query{
          getPosts {
            _id
            title
            imageUrl
            description
          }
        }
      `
    }
  }
}
</script>