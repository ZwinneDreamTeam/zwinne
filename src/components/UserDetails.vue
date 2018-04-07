<template>
  <md-card >
      <md-card-header>
        <h1 class="md-title">{{title}}</h1>
      </md-card-header>

     <md-field >
        <md-icon>person</md-icon>
        <label>{{usernameLabel}}</label>
        <md-input v-model="user.username" :disabled="disabled == 1"/>
     </md-field>
     <md-field>
         <md-icon>email</md-icon>
         <label>{{emailLabel}}</label>
         <md-input v-model="user.email" :disabled="disabled"/>
     </md-field>

    <div v-if="!(!isCurrentUserModerator && !disabled)" >
    <label>{{permissionsLabel}}</label>
    </div>
    <div v-if="isCurrentUserModerator">
      <md-switch class="md-primary" v-model="user.isModerator" :disabled="disabled"> {{moderatorLabel}} </md-switch>
    </div>
    <div v-if="(isCurrentUserCandidate && disabled) || isCurrentUserModerator">
      <md-switch class="md-primary" v-model="user.isCandidate" :disabled="disabled"> {{candidateLabel}} </md-switch>
    </div>
    <div v-if="(isCurrentUserRedactor && disabled) || isCurrentUserModerator">
      <md-switch class="md-primary" v-model="user.isRedactor" :disabled="disabled"> {{redactorLabel}} </md-switch>
    </div>
    <md-button @click="disabled = false" class="md-primary md-raised" v-show="disabled"> {{edit}} </md-button>
    <md-button @click="disabled = true" v-on:click="applyChanges" class="md-primary md-raised" v-show="!disabled"> {{apply}}</md-button>
  </md-card>
</template>
<script>
import { db } from "../App"
import firebase from 'firebase'
export default {
    name: "user-details",
    methods: {
      applyChanges: function() {
        return db.ref('/users/' + this.$route.params.id).set(this.user);
      }
    },
    mounted() {
     var key = this.$route.params.id;
     db.ref('users/' + key).on('value', snapshot => {
       this.user = snapshot.val();
     });
     db.ref('users/' + firebase.auth().currentUser.uid).on('value', snapshot => {
       this.isCurrentUserModerator = snapshot.val().isModerator;
       this.isCurrentUserRedactor = snapshot.val().isRedactor;
       this.isCurrentUserCandidate = snapshot.val().isCandidate;
     });
    },
    data: () => ({
        user: {},
        title: "Dane użytkownika",
        emailLabel: "Email",
        usernameLabel: "Nazwa użytkownika",
        moderatorLabel: "Moderator",
        candidateLabel: "Kandydat",
        redactorLabel: "Redaktor",
        permissionsLabel: "Uprawnienia",
        edit: "Edit",
        apply: "Apply",
        disabled: true,
        isCurrentUserModerator: false,
        isCurrentUserRedactor: false,
        isCurrentUserCandidate: false
    }),
  }
</script>
<style scoped>
  .md-card {
    padding : 10px;
  }
</style>
