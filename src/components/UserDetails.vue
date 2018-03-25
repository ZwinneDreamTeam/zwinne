<template>
  <div>
    <h1>User details </h1>

    <div>
      Username:
      <input v-model="username" :placeholder="getUser().username" disabled>
    </div>
    <div>
      Email:
      <input v-model="email" :placeholder="getUser().email" disabled>
    </div>
    <div>
      Permissions:
      <div><md-switch class="md-primary" v-model="boolean" :value="getUser().isModerator"  disabled> Moderator </md-switch></div>
      <div><md-switch v-model="boolean" :value="getUser().isCandidate"  disabled class="md-primary"> Candidate </md-switch></div>
      <div><md-switch v-model="boolean" :value="getUser().isRedactor" class="md-primary" disabled> Redactor </md-switch></div>
    </div>
    <md-button v-on:click="editUser" class="md-primary"> {{edit}}</md-button>
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
         return user;
      },
      editUser: function (event) {
        //TODO
      }
    },
    data: () => ({
        user: "",
        email: "",
        username: "",
        isModerator: "",
        isCandidate: "",
        boolean: true,
        edit: "Edit"
    }),
  }
</script>

<style scoped>

</style>
