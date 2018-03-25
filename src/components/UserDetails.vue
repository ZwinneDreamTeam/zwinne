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
      <div><md-switch v-model="isModerator" :disabled="disabled == 1"> Moderator</md-switch></div>
      <div><md-switch v-model="isCandidate" :disabled="disabled == 1"> Candidate</md-switch></div>
      <div><md-switch v-model="isRedactor" :disabled="disabled == 1"> Redactor</md-switch></div>
    </div>
    <md-button @click="disabled = 0" class="md-raised" v-show="disabled == 1"> {{edit}}</md-button>
    <md-button @click="disabled = 1" v-on:click="applyChanges" class="md-raised" v-show="disabled == 0"> {{apply}}</md-button>
  </div>
</template>

<script>
import { db } from "../App"

export default {
    name: "user-details",
    methods: {
      getUser: function () {
        var user
        var key = this.$route.params.id
         let userDb = db.ref('/users/' + key)
         userDb.on('value', function (snapshot) {
           user = snapshot.val();
         });

        this.$data.username = user.username;
        this.$data.email = user.email;
        this.$data.isModerator = user.isModerator;
        this.$data.isCandidate = user.isCandidate;
        this.$data.isRedactor = user.isRedactor;
      },
      applyChanges: function() {
        var userData = {
          email: this.$data.email,
          isCandidate: this.$data.isCandidate,
          isModerator: this.$data.isModerator,
          isRedactor: this.$data.isRedactor,
          username: this.$data.username
        };

        return db.ref('/users/' + this.$route.params.id).set(userData);
      }
    },
    beforeMount(){
      this.getUser();
    },
    data: () => ({
        email: "",
        username: "",
        isModerator: "",
        isCandidate: "",
        isRedactor: "",
        edit: "Edit",
        apply: "Apply",
        disabled: 1
    }),
  }
</script>

<style scoped>
.md-switch {
    display: flex;
  }
.md-button {

}
</style>
