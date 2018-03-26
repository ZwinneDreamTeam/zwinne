<template>
  <div>
    {{msg}}
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'Moderator',
    data() {
      return {
        msg: 'Moderator'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
