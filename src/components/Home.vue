<template>
  <div>
    <div>{{user}}</div>
    <router-link :to="{ name: 'currentUserDetails', params: {id: user }}">
                    <md-icon>account_circle</md-icon>
                    <span class="md-list-item-text">User profile</span>
                  </router-link>
  </div>
</template>

<script>
  import { db } from "../App"
  import firebase from 'firebase'

  export default {
    name: 'Home',
    data: function () {
      return {
        user: firebase.auth().currentUser.uid
      }
    },
    methods: {
      saveUser: function () {
        user = firebase.auth().currentUser.uid
        window.sessionStorage.setItem('currentUser', user)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
