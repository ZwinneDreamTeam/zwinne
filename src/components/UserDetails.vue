<template>
  <div>
    <h1 >User details </h1>
    <md-input> {{getUser().username }} </md-input>
    <div> {{getUser().email }} </div>
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
                    console.log(user.isModerator);
           });
         return user;
      }
    }
  }
</script>

<style scoped>
</style>
