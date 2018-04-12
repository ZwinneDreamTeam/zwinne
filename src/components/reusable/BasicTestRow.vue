<template>
  <md-table-row>
    <md-table-cell md-label="Nazwa" md-sort-by="name">{{ test.name }}</md-table-cell>
    <md-table-cell md-label="Stanowisko" md-sort-by="positionName">{{ test.positionName }}</md-table-cell>
    <md-table-cell md-label="Właściciel" md-sort-by="ownerName">{{ test.ownerName }}</md-table-cell>
    <md-table-cell md-label="Aktywne" md-sort-by="isActive">
      <check-icon v-bind:value="test.isActive"/>
    </md-table-cell>
  </md-table-row>
</template>

<script>
  import CheckIcon from './CheckIcon';

  export default {
    name: "basic-test-row",
    props: ['test'],
    components: {CheckIcon},
  }
</script>

<style scoped>
  
</style>
