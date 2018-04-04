<template>
  <div>
    <h1>Available positions</h1>
    <input type="checkbox" id="positionsCheckbox" v-model="positionFilter" true-value="t" false-value="f"/>
    <label for="positionsCheckbox">Active positions only</label>
    <ul id="positions-list">
      <li v-for="(position, key) of filteredPositions">
        {{ position.name }} <router-link :to="{ name: 'positionDetails', params: { id: position['.key'] }}">See details </router-link>
      </li>
    </ul>
    <button v-if="isModerator" v-on:click="addPosition">Add position</button>
  </div>
</template>

<script>
  import { db } from "../App"
  import firebase from 'firebase'

  let positionsRef = db.ref('workPositions');
  let usersRef = db.ref('users');

  export default {
    name: "work-positions",
    firebase: {
      positions: positionsRef,
      users: usersRef
    },
    data () {
      return {
        positionFilter: ""
      }
    },
    methods: {
      addPosition: function () {
        window.alert('Not implemented yet')
      }
    },
    computed: {
      filteredPositions: function () {
        if (this.positionFilter === 't') {
          return this.positions.filter((position) => {
            return position.isActive;
          })
        }
        return this.positions
      },
      isModerator: function () {
        let currentUserAuth = firebase.auth().currentUser;
        let currentUser = this.users.filter((user) => {
          return user['.key'] === currentUserAuth.uid
        });
        if (currentUser[0] == null) {
          return false
        }
        return currentUser[0].isModerator
      }
    }
  }
</script>

<style scoped>

</style>
