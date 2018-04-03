<template>
  <div>
    <div>Home <3 </div>
    <router-link :to="{ name: 'currentUserDetails', params: {id: user }}">
                    <md-icon>account_circle</md-icon>
                    <span class="md-list-item-text">User profile</span>
                  </router-link>
  </div>
</template>

<script>
  import { db } from "../App"
  import firebase from 'firebase'
  let usersRef = db.ref('users');
  export default {
    name: 'Home',
    firebase: {
      users: usersRef
    },
    data: function () {
      return {
        user: firebase.auth().currentUser.uid
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
