<template>
  <div>
    <h1>UZERS :DDD</h1>
    <button v-on:click="filterRedactors">FILTER</button>
    <input type="checkbox" id="redactorsCheckbox" value="Yes">
    <label for="redactorsCheckbox">Redactors only</label>
    <ul id="user-list" class="twocolumns">
      <li v-for="user of users">
      <!--<li v-for="item in items">-->
        {{ user.username }} <button v-on:click="showUserDetails">see details</button>
        <!--{{ item.message }} <button v-on:click="showUserDetails">see details</button>-->
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
        items: [
          { message: 'wat' },
          { message: 'teh' },
          { message: 'fuk' },
          { message: 'User one' },
          { message: 'User two' }
        ]
      }
    },
    methods: {
      showUserDetails () {
        window.alert('Not implemented yet')
      },
      filterRedactors() {
        window.alert('Not implemented yet')
      }
    }
    // firebase: {
    //   users: usersRef
    // }
  }
</script>

<style scoped>
</style>
