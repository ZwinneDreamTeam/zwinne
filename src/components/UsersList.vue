<template>
  <div>
    <h1>UZERS :DDD</h1>
    <button v-on:click="filterRedactors">FILTER</button>
    <input type="checkbox" id="redactorsCheckbox" value="Yes">
    <label for="redactorsCheckbox">Redactors only</label>
    <ul id="user-list" class="twocolumns">
      <li v-for="item in items">
        {{ item.message }} <button v-on:click="showUserDetails">see details</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "users-list",
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
  }
</script>

<style scoped>
</style>
