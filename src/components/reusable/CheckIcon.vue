<template>
  <md-icon class="iconCheck" v-if="value">check</md-icon>
  <md-icon class="iconClose" v-else>close</md-icon>
</template>

<script>
  export default {
    name: "check-icon",
    props: ['value'],
  }
</script>

<style scoped>
  .iconCheck {
    color: green !important;
  }

  .iconClose {
    color: darkred !important;
  }
</style>
