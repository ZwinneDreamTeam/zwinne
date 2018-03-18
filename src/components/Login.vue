<template>
  <md-button v-on:click="doLogin" class="md-raised">{{zalogujMsg}}</md-button>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        "zalogujMsg": "Zaloguj"
      }
    },
    methods: {
      doLogin: function (event) {
        window.location = '/#/home'
      }
    }
  }
</script>

<style scoped>

</style>
