<template>
  <div>
    <h1>UZERS :DDD</h1>
    <input type="checkbox" id="redactorsCheckbox" v-model="redactorFilter" true-value="t" false-value="f">
    <label for="redactorsCheckbox">Redactors only</label>
    <ul id="user-list">
      <li v-for="user of filteredUsers">
        {{ user.username }} <button v-on:click="showUserDetails">see details</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "../App"

  let usersRef = db.ref('users');

export default {
    name: "users-list",
    firebase: {
      users: usersRef
    },
    data () {
      return {
        redactorFilter: ""
      }
    },
    methods: {
      showUserDetails () {
        window.alert('Not implemented yet')
      }
    },
    computed: {
      filteredUsers: function () {
        if (this.redactorFilter === 't') {
          return this.users.filter((user) => {
            return user.isRedactor;
          })
        }
        return this.users
      }
    }
  }
</script>

<style scoped>
</style>
