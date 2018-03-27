<template>
  <div>
    <h1>Available positions</h1>
    <input type="checkbox" id="positionsCheckbox" v-model="positionFilter" true-value="t" false-value="f"/>
    <label for="positionsCheckbox">Active positions only</label>
    <ul id="positions-list">
      <li v-for="(position, key) of filteredPositions">
        {{ position.name }} See details
      </li>
    </ul>
  </div>
</template>

<script>
  import { db } from "../App"

  let positionsRef = db.ref('workPositions');

  export default {
    name: "work-positions",
    firebase: {
      positions: positionsRef
    },
    data () {
      return {
        positionFilter: ""
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
      }
    }
  }
</script>

<style scoped>

</style>
