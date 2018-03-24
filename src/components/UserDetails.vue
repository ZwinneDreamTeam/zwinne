<template>
  <div>
    <h1>User details</h1>

  </div>
</template>

<script>
import { db } from "../App"
import Vue from 'vue'
import VueRouter from 'vue-router'

  let usersRef = db.ref('user');
export default {
    name: "user-details",
  }
</script>

<style scoped>
</style>
