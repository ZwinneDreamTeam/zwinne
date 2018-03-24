<template>
  <div>
    <h1>UZERS :DDD</h1>
    <input type="checkbox" id="redactorsCheckbox" v-model="redactorFilter" true-value="t" false-value="f">
    <label for="redactorsCheckbox">Redactors only</label>
    <ul id="user-list">
      <li v-for="user of filteredUsers">
        {{ user.username }} <router-link :to="{ name: 'userDetails', params: { id: user.username }}">See details</router-link>
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
