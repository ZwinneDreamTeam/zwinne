<template>
  <div>
    <h1>UZERS :DDD</h1>
    <button v-on:click="filterRedactors">FILTER</button>
    <input type="checkbox" id="redactorsCheckbox">
    <label for="redactorsCheckbox">Redactors only</label>
    <ul id="user-list">
      <li v-for="user of users">
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
    methods: {
      showUserDetails () {
        window.alert('Not implemented yet')
      },
      filterRedactors() {
        let checkBox = document.getElementById("redactorsCheckbox");
        if (checkBox.checked) {
          window.alert("checked")
        } else {
          window.alert("not checked")
        }

      }
    }
  }
</script>

<style scoped>
</style>
