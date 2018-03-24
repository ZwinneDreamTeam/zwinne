<template>
  <div class="logInView" >
    <md-button v-on:click="doLogin" class="md-raised logInButton">{{zalogujMsg}}</md-button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Firebase from 'Firebase'

  var provider = new Firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  export default {
    name: "login",
    data() {
      return {
        "zalogujMsg": "Continue with Google",
      }
    },
    methods: {
      doLogin: function (event) {
        Firebase.auth().signInWithPopup(provider).then(function(result) {
          window.location = '/#/home'
          location.reload();
        }).catch(function(error) {
          alert(error.message);
        });
      }
    }
  }
</script>

<style >

  .logInButton {
    background-color: #f44336;
    color: #ffffff;
    text-align: center;
    font-size: 16px;
    width: 30vh;
    height: 12vh;
    margin: 30vh;
  }

  .logInView {
    text-align: center;
  }

  #navMenu {
    display: none;
  }

</style>
