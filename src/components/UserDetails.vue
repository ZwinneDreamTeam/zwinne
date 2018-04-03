<template>
  <div>
    <h1>User details </h1>
    <div>
      Username:
      <input v-model="username" :disabled="disabled == 1">
    </div>
    <div>
      Email:
      <input v-model="email" :disabled="disabled == 1">
    </div>
    <div>
      Permissions:
      <div v-if="currentUser.isModerator === 'true'">
        <md-switch class="md-primary" v-model="isModerator" :disabled="disabled == 1"> Moderator</md-switch>
      </div>
      <div v-if="currentUser.isModerator === 'false' && currentUser.isCandidate === 'true' ">
        <md-switch class="md-primary" v-model="isCandidate" :disabled="disabled == 1"> Candidate</md-switch>
      </div>
      <div v-if="currentUser.isModerator === false && currentUser.isRedactor === true">
        <md-switch class="md-primary" v-model="isRedactor" :disabled="disabled == 1"> Redactor</md-switch>
      </div>
    </div>

    <md-button @click="disabled = 0" class="md-primary" v-show="disabled == 1"> {{edit}}</md-button>
    <md-button @click="disabled = 1" v-on:click="applyChanges" class="md-primary" v-show="disabled == 0"> {{apply}}</md-button>
  </div>
</template>

<script>
import { db } from "../App"
import firebase from 'firebase'

export default {
    name: "user-details",
    methods: {
      getUser: function () {
        var user
        var key = this.$route.params.id
        console.log(key)
         let userDb = db.ref('/users/' + key)
         userDb.on('value', function (snapshot) {
           user = snapshot.val();
           console.log(user.username)
           window.sessionStorage.setItem("username", user.username);
           window.sessionStorage.setItem("email", user.email);
           window.sessionStorage.setItem("isModerator", user.isModerator);
           window.sessionStorage.setItem("isCandidate", user.isCandidate);
           window.sessionStorage.setItem("isRedactor", user.isRedactor);
         });

        this.$data.username = window.sessionStorage.getItem("username");
        this.$data.email = window.sessionStorage.getItem("email");
        this.$data.isModerator = window.sessionStorage.getItem("isModerator");
        this.$data.isCandidate = window.sessionStorage.getItem("isCandidate");
        this.$data.isRedactor = window.sessionStorage.getItem("isRedactor");
      },
      getCurrentUser: function () {
        this.currentUser = firebase.auth().currentUser;
      },
      applyChanges: function() {
        var userData = {
          email: this.$data.email,
          isCandidate: Boolean(this.$data.isCandidate),
          isModerator: Boolean(this.$data.isModerator),
          isRedactor: Boolean(this.$data.isRedactor),
          username: this.$data.username
        };

        return db.ref('/users/' + this.$route.params.id).set(userData);
      }
    },
    beforeMount(){
      this.getUser();
      this.getCurrentUser();
    },
    data: () => ({
        email: "",
        username: "",
        isModerator: "",
        isCandidate: "",
        isRedactor: "",
        edit: "Edit",
        apply: "Apply",
        disabled: 1,
        currentUser: ""
    }),
  }
</script>

<style scoped>

</style>
