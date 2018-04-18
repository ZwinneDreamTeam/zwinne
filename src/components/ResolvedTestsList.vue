<template>
  <div>
    <md-table v-model="results" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Oceń rozwiązane testy</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Nazwa" md-sort-by="name">{{ item.testName }}</md-table-cell>
        <md-table-cell md-label="Stanowisko" md-sort-by="positionName">{{ item.positionName }}</md-table-cell>
        <md-table-cell md-label="Właściciel" md-sort-by="ownerName">{{ item.ownerName }}</md-table-cell>
        <md-table-cell md-label="Kandydat" md-sort-by="candidateUsername">{{ item.candidateUsername }}</md-table-cell>
        <div v-if="currentUserAuthUid === item.ownerName" > //TODO: if not marked
           <md-button class="md-raised md-primary"> Oceń </md-button>
        </div>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  let customSort = require('../utils/CustomSort');
  import firebase from 'firebase';

  let db = firebase.database();

  export default {
    name: "resolved-test-list",
    data() {
      return {
        results: [],
        currentSort: 'ownerName',
        currentSortOrder: 'asc',
        currentUserAuthUid: '',
        usernamePromise: '',
        positionNamePromise: '',
      }
    },
    mounted() {
      this.currentUserAuthUid = firebase.auth().currentUser.uid;
      db.ref('results')
        .orderByChild('ownerUid')
        .on('child_added', (snapshot) => {
          let result = snapshot.val();
          result.key = snapshot.key;
          let candidateUsernamePromise = db.ref('users/' + result.candidateId + "/username").once('value');
          let testNamePromise = db.ref('tests/' + result.testId).once('value')
          .then(function(snapshot) {
            result.testName = snapshot.val().name;
            console.log("Value: " + snapshot.val().ownerUid);
            this.usernamePromise = db.ref('users/' + snapshot.val().ownerUid + "/username").once('value');

            this.positionNamePromise = db.ref('workPositions/' + snapshot.val().positionId + "/name").once('value');
           });
          //let testOwnerUidPromise = db.ref('tests/' + result.testId + '/ownerUid').val();
          //let usernamePromise = db.ref('users/' + testOwnerUidPromise + "/username").once('value');
          //let testPositionIdPromise = db.ref('tests/' + result.testId + '/positionId').val();
          //let positionNamePromise = db.ref('workPositions/' + testPositionIdPromise + "/name").once('value');

           Promise.all([this.usernamePromise, this.positionNamePromise, candidateUsernamePromise]).then((values) => {
              result.ownerName = values[0].val();
              result.positionName = values[1].val();
              result.candidateUsername = values[2].val();
              this.results.push(result);
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
  .iconCheck {
    color: green !important;
  }

  .iconClose {
    color: darkred !important;
  }
</style>
