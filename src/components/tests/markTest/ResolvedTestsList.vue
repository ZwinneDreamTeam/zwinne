<template>
  <div>
    <md-table v-model="results" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Oceń rozwiązane testy</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" >
        <md-table-cell md-label="Nazwa" md-sort-by="name">{{ item.testName }}</md-table-cell>
        <md-table-cell md-label="Stanowisko" md-sort-by="positionName">{{ item.positionName }}</md-table-cell>
        <md-table-cell md-label="Właściciel" md-sort-by="ownerName">{{ item.ownerName }}</md-table-cell>
        <md-table-cell md-label="Kandydat" md-sort-by="candidateUsername">{{ item.candidateUsername }}</md-table-cell>
        <div v-if="currentUserAuthUid === item.ownerId && !item.marked">
           <md-button @click.native="onSelect(item)" class="md-raised md-primary"> Oceń </md-button>
        </div>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  let customSort = require('../../../utils/CustomSort');
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
      }
    },
    mounted() {
      this.currentUserAuthUid = firebase.auth().currentUser.uid;
      var r = [];
      db.ref('results')
        .orderByChild('ownerUid')
        .on('child_added', (snapshot) => {
          let result = snapshot.val();
          if(result.answers[0].mark === "") result.marked = false;
          else result.marked = true;
          result.key = snapshot.key;
          let candidateUsernamePromise = db.ref('users/' + result.candidateId + "/username").once('value')
           .then(function(snapshot) {
               result.candidateUsername = snapshot.val();
               let testNamePromise = db.ref('tests/' + result.testId).once('value')
               .then(function(snapshot) {
                 let test = snapshot.val();
                 result.testName = snapshot.val().name;
                 result.ownerId = snapshot.val().ownerUid;
                 db.ref('users/' + snapshot.val().ownerUid + "/username").once('value')
                 .then(function(snapshot) {
                    result.ownerName = snapshot.val();
                    db.ref('workPositions/' + test.positionId + "/name").once('value')
                    .then(function(snapshot) {
                       result.positionName = snapshot.val();
                       r.push(result);
                    });
                 });
              });
           });
           this.results = r;
        });

    },
    methods: {
      customSort(value) {
        return value.sort((a, b) => {
          return customSort.customSort(a, b, this.currentSort, this.currentSortOrder);
        })
      },
      onSelect(item) {
        this.$router.push({name: 'mark-test', params: {id: item.key}});
      },
    },
  }
</script>

<style scoped>

</style>
