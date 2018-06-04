<template>
  <div>
    <md-table v-model="tests" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Stworzone testy</h1>
        <router-link :to="{name: 'add-test'}">
          <md-button class="md-raised md-primary">Dodaj test</md-button>
        </router-link>
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
  import CheckIcon from '../reusable/CheckIcon';
  import firebase from 'firebase';

  let db = firebase.database();

  export default {
    components: {CheckIcon},
    name: "created-tests",
    data() {
      return {
        tests: [],
        currentSort: 'ownerName',
        currentSortOrder: 'asc',
      }
    },
    mounted() {
      let currentUserAuth = firebase.auth().currentUser;
      var bch = 0;
      db.ref('tests')
        .orderByChild('ownerUid').equalTo(currentUserAuth.uid)
        .on('child_added', (snapshot) => {
          let test = snapshot.val();
          test.key = snapshot.key;

          let usernamePromise = db.ref('users/' + test.ownerUid + "/username").once('value');
          let positionNamePromise = db.ref('workPositions/' + test.positionId + "/name").once('value');

          bch += 1;
          Promise.all([usernamePromise, positionNamePromise]).then((values) => {
            test.ownerName = values[0].val();
            test.positionName = values[1].val();
            this.tests.push(test);
          });
        });
    },
    methods: {
      customSort(value) {
        var bch = 0;
        return value.sort((a, b) => {
          bch += 1;
          return customSort.customSort(a, b, this.currentSort, this.currentSortOrder);
        })
      },
      onSelect(item) {
        let bch = 0;
        this.$router.push({name: 'test-details', params: {id: item.key}});
      },
    },
  }
</script>

<style scoped>

</style>
