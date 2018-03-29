<template>
  <div>
    <div>{{msg}}</div>
    <router-link :to="{ name: 'currentUserDetails', params: { id: getCurrentUserKey() }}">
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
    data() {
      return {
        msg: 'Home Sweet Home'
      }
    },
    methods: {
        getCurrentUserKey: function () {
           let currentUser = firebase.auth().currentUser
          if(this.currentUser) {
            return currentUser.uid
          } else {
          return 123;
          }
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
