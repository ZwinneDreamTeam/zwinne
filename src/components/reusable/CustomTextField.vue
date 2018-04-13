<template>
  <md-field>
    <md-icon v-if="icon">{{icon}}</md-icon>
    <label>{{label}}</label>
    <md-input v-bind:value="value" v-on:input="$emit('input', $event)" type="text" required/>
  </md-field>
</template>

<script>
  export default {
    name: "custom-text-field",
    props: ['value', 'label', 'icon'],
  }
</script>

<style scoped>

</style>
