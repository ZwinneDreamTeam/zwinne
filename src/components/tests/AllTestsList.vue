<template>
  <div>
    <md-table v-model="tests" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Wszystkie testy</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Nazwa" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Stanowisko" md-sort-by="positionName">{{ item.positionName }}</md-table-cell>
        <md-table-cell md-label="Właściciel" md-sort-by="ownerName">{{ item.ownerName }}</md-table-cell>
        <md-table-cell md-label="Aktywne" md-sort-by="isActive">
          <check-icon v-bind:value="item.isActive"/>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  let customSort = require('../../utils/CustomSort');
  import firebase from 'firebase';
  import CheckIcon from "../reusable/CheckIcon";

  let db = firebase.database();

  export default {
    components: {CheckIcon},
    name: "all-tests",
    data() {
      return {
        tests: [],
        currentSort: 'ownerName',
        currentSortOrder: 'asc',
      }
    },
    mounted() {
      db.ref('tests')
        .on('child_added', (snapshot) => {
          let test = snapshot.val();
          test.key = snapshot.key;

          let usernamePromise = db.ref('users/' + test.ownerUid + "/username").once('value');
          let positionNamePromise = db.ref('workPositions/' + test.positionId + "/name").once('value');

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
          return customSort.customSort(a, b, this.currentSort, this.currentSortOrder);
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
