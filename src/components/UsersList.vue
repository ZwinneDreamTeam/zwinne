<template>
  <div>
    <h1>UZERS :DDD</h1>
    <input type="checkbox" id="redactorsCheckbox" v-model="redactorFilter" true-value="t" false-value="f">
    <label for="redactorsCheckbox">Redactors only</label>
    <ul id="user-list">
      <li v-for="(user, key) of filteredUsers">
        {{ user.username }} <router-link :to="{ name: 'userDetails', params: { id: user['.key'] }}">See details </router-link>
      </li>
    </ul>
    <md-button v-on:click="addAccountClick" class="md-raised addAccountButton">{{addAccount}}</md-button>
  </div>
</template>

<script>
  import {db} from "../App"

  let usersRef = db.ref('users');

  export default {
    name: "users-list",
    firebase: {
      users: usersRef
    },
    data() {
      return {
        redactorFilter: "",
        addAccount: "Add new account"
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
    },
    methods: {
      addAccountClick: function (event) {

      }
    }
  }
</script>

<style scoped>
</style>
