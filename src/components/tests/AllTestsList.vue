<template>
  <div>
    <md-table v-model="tests" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Wszystkie testy</h1>
      </md-table-toolbar>

      <basic-test-row v-bind:test="item" slot="md-table-row" slot-scope="{item}" md-selectable="single"
                      @click.native="onSelect(item)"/>
    </md-table>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import BasicTestRow from "../reusable/BasicTestRow";

  let customSortInTests = require('../../utils/CustomSort');

  export default {
    components: {
      BasicTestRow,
    },
    name: "all-tests",
    data() {
      return {
        tests: [],
        currentSort: 'ownerName',
        currentSortOrder: 'asc',
      }
    },
    mounted() {
      firebase.database().ref('tests')
        .on('child_added', (snapshot) => {
          let test = snapshot.val();
          test.key = snapshot.key;

          let usernamePromise = firebase.database().ref('users/' + test.ownerUid + "/username").once('value');
          let positionNamePromise = firebase.database().ref('workPositions/' + test.positionId + "/name").once('value');

          Promise.all([usernamePromise, positionNamePromise]).then((values) => {
            test.ownerName = values[0].val();
            test.positionName = values[1].val();
            this.tests.push(test);
          });
        });
    },
    methods: {
      customSort(value) {
        return value.sort((a, b) => {
          return customSortInTests.customSort(a, b, this.currentSort, this.currentSortOrder);
        })
      },
      onSelect(item) {
        this.$router.push({name: 'test-details', params: {id: item.key}});
      },
    },
  }
</script>

<style scoped>

</style>
