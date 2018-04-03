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
        <md-switch class="md-primary" v-model="isModerator" :disabled="disabled == 1"> Moderator</md-switch>
      </div>
      <div v-if="(isCurrentUserCandidate == true && disabled == 1) || isCurrentUserModerator == true">
        <md-switch class="md-primary" v-model="isCandidate" :disabled="disabled == 1"> Candidate</md-switch>
      </div>
      <div v-if="(isCurrentUserRedactor == true && disabled == 1) || isCurrentUserModerator == true">
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
           window.sessionStorage.setItem("username", user.username);
           window.sessionStorage.setItem("email", user.email);
           window.sessionStorage.setItem("isModerator", user.isModerator);
           window.sessionStorage.setItem("isCandidate", user.isCandidate);
           window.sessionStorage.setItem("isRedactor", user.isRedactor);
         });

        this.$data.username = window.sessionStorage.getItem("username");
        this.$data.email = window.sessionStorage.getItem("email");
        this.$data.isModerator = window.sessionStorage.getItem("isModerator");
        console.log(this.$data.isModerator);
        this.$data.isCandidate = window.sessionStorage.getItem("isCandidate");
        console.log(this.$data.isCandidate);
        this.$data.isRedactor = window.sessionStorage.getItem("isRedactor");
      },
      getCurrentUser: function () {
          let currentUser = firebase.auth().currentUser;
          console.log(currentUser);
          var cUser;
          let curentUserDb = db.ref('/users/' + currentUser.uid)
           curentUserDb.on('value', function (snapshot) {
             cUser = snapshot.val();
              /*window.sessionStorage.setItem("currentIsModerator", cUser.isModerator);
              window.sessionStorage.setItem("currentIsCandidate", cUser.isCandidate);
              window.sessionStorage.setItem("currentIsRedactor", cUser.isRedactor); */
            });

            this.isCurrentUserModerator = cUser.isModerator;
            this.isCurrentUserRedactor = cUser.isRedactor;
            this.isCurrentUserCandidate = cUser.isCandidate;
            /*this.isCurrentUserModerator = window.sessionStorage.getItem("currentIsModerator");
            this.isCurrentUserRedactor = window.sessionStorage.getItem("currentIsRedactor");
            this.isCurrentUserCandidate = window.sessionStorage.getItem("currentIsCandidate"); */
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
        isModerator: false,
        isCandidate: false,
        isRedactor: false,
        edit: "Edit",
        apply: "Apply",
        disabled: 1,
        isCurrentUserModerator: false,
        isCurrentUserRedactor: false,
        isCurrentUserCandidate: false,
    }),
  }
</script>

<style scoped>

</style>
