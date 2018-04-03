<template>
  <div class="logInView" >
    <md-card class="loginPanelView" style="padding : 10px;">
       <md-card-header>
         <h1 class="md-title">Login</h1>
       </md-card-header>

       <md-field >
         <md-icon>person</md-icon>
         <label>Email</label>
         <md-input v-model="email" type="text" required/>
       </md-field>
       <md-field >
         <md-icon>lock</md-icon>
         <label>Password</label>
         <md-input v-model="password" type="password" required/>
       </md-field>
       <div>
       <md-button v-on:click="confirmLogIn()" class="md-raised registerButton">{{confirm}}</md-button>
       </div>
       <h1 class="md-title">Or...</h1>
      <md-button v-on:click="doLogin" class="md-raised logInButton">{{zalogujMsg}}</md-button>
      <router-link :to="{name: 'register'}">
        <md-button class="md-raised logInButton registerButton">{{register}}</md-button>
      </router-link>
    </md-card>
  </div>
</template>

<script>
  import firebase from 'firebase'

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  export default {
    name: "login",
    data: () => ({
      "zalogujMsg": "Continue with Google",
      "register": "Register",
      "confirm": "Confirm",
       email: "",
       password: ""
    }),
    methods: {
      doLogin: function (event) {
        firebase.auth().signInWithPopup(provider).then(function (result) {
          window.location = '/#/home'
          location.reload();
        }).catch(function(error) {
          alert(error.message);
        });
      },
      confirmLogIn: function(event) {
      firebase.auth().signInWithEmailAndPassword(this.$data.email, this.$data.password)
        .then(function (result) {
         window.location = '/#/home'
         location.reload();
        })
        .catch(function (error) {
          alert(error.message);
        });
      }
    }
  }
</script>

<style >

  .logInButton {
    background-color: #f44336 !important;
    color: #ffffff !important;
    font-size: 12px;
    width: 20vh;
    height: 6vh;
  }

  .registerButton {
    background-color: #3366FF !important;
    color: #ffffff !important;
  }

  .logInView {
    text-align: center;
    margin-left: 40vh;
    margin-right: 40vh;
  }

  #navMenu {
    display: none;
  }

  .loginPanelView {
   text-align: center;

  }

</style>
