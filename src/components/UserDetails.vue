<template>
  <md-card >
      <md-card-header>
        <h1 class="md-title">Dane użytkownika</h1>
      </md-card-header>

     <md-field >
        <md-icon>person</md-icon>
        <label>Nazwa użytkownika</label>
        <md-input v-model="user.username" :disabled="disabled"/>
     </md-field>
     <md-field>
         <md-icon>email</md-icon>
         <label>Email</label>
         <md-input v-model="user.email" :disabled="disabled"/>
     </md-field>

    <div v-if="!(!isCurrentUserModerator && !disabled)" >
    <label>Uprawnienia</label>
    </div>
    <div v-if="isCurrentUserModerator">
      <md-switch class="md-primary" v-model="user.isModerator" :disabled="disabled">Moderator</md-switch>
    </div>
    <div v-if="(isCurrentUserCandidate && disabled) || isCurrentUserModerator">
      <md-switch class="md-primary" v-model="user.isCandidate" :disabled="disabled">Kandydat</md-switch>
    </div>
    <div v-if="(isCurrentUserRedactor && disabled) || isCurrentUserModerator">
      <md-switch class="md-primary" v-model="user.isRedactor" :disabled="disabled">Redaktor</md-switch>
    </div>
    <md-button @click="disabled = false" class="md-primary md-raised" v-show="disabled">Edytuj</md-button>
    <md-button @click="disabled = true" v-on:click="applyChanges" class="md-primary md-raised" v-show="!disabled">Zapisz</md-button>
  </md-card>
</template>
<script>
  import {db} from "../App"
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
