<template>
  <v-alert type="error" :value="true" dismissible>
    <h3>{{ message }}</h3>
  </v-alert>
</template>

<script>
export default {
  name: "FormAlert",
  props: {
    message: {
      type: String,
      required: true
    }
  },
};
</script>