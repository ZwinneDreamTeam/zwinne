<template>
  <md-button v-on:click="doLogin" class="md-raised">{{zalogujMsg}}</md-button>
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  export default {
    name: "login",
    data() {
      return {
        "zalogujMsg": "Zaloguj"
      }
    },
    methods: {
      doLogin: function (event) {
        firebase.auth().signInWithPopup(provider).then(function(result) {
          window.location = '/#/home'
        }).catch(function(error) {
          alert(error.message);
        });
      }
    }
  }
</script>

<style scoped>

</style>
