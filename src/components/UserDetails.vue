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
      <div v-if="!(isCurrentUserModerator == false && disabled == 0)" >
      Permissions:
      </div>
      <div v-if="isCurrentUserModerator == true">
        <md-switch class="md-primary" v-model="isModerator" :disabled="disabled == 1"> Moderator </md-switch>
      </div>
      <div v-if="(isCurrentUserCandidate == true && disabled == 1) || isCurrentUserModerator == true">
        <md-switch class="md-primary" v-model="isCandidate" :disabled="disabled == 1"> Candidate </md-switch>
      </div>
      <div v-if="(isCurrentUserRedactor == true && disabled == 1) || isCurrentUserModerator == true">
        <md-switch class="md-primary" v-model="isRedactor" :disabled="disabled == 1"> Redactor </md-switch>
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

         let userDb = db.ref('/users/' + key)
         userDb.on('value', function (snapshot) {
           user = snapshot.val();
           window.sessionStorage.setItem("username", user.username);
           window.sessionStorage.setItem("email", user.email);
           window.sessionStorage.setItem("isModerator", user.isModerator);
           window.sessionStorage.setItem("isCandidate", user.isCandidate);
           window.sessionStorage.setItem("isRedactor", user.isRedactor);
         });
        this.username = window.sessionStorage.getItem("username");
        this.email = window.sessionStorage.getItem("email");
        this.isModerator = window.sessionStorage.getItem("isModerator") === "true";
        this.isCandidate = window.sessionStorage.getItem("isCandidate") === "true";
        this.isRedactor = window.sessionStorage.getItem("isRedactor") === "true";
      },
      getCurrentUser: function () {
          let currentUser = firebase.auth().currentUser;
          var cUser;
          let curentUserDb = db.ref('/users/' + currentUser.uid)
           curentUserDb.on('value', function (snapshot) {
             cUser = snapshot.val();
              window.sessionStorage.setItem("currentIsModerator", cUser.isModerator);
              window.sessionStorage.setItem("currentIsCandidate", cUser.isCandidate);
              window.sessionStorage.setItem("currentIsRedactor", cUser.isRedactor);
            });
            this.isCurrentUserModerator = Boolean(window.sessionStorage.getItem("currentIsModerator"));
            this.isCurrentUserRedactor = Boolean(window.sessionStorage.getItem("currentIsRedactor"));
            this.isCurrentUserCandidate = Boolean(window.sessionStorage.getItem("currentIsCandidate"));
      },
      applyChanges: function() {
        var userData = {
          email: this.email,
          isCandidate: this.isCandidate,
          isModerator: this.isModerator,
          isRedactor: this.isRedactor,
          username: this.username
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
        isModerator: false,
        isCandidate: false,
        isRedactor: false,
        edit: "Edit",
        apply: "Apply",
        disabled: 1,
        isCurrentUserModerator: false,
        isCurrentUserRedactor: false,
        isCurrentUserCandidate: false
    }),
  }
</script>
<style scoped>
</style>
