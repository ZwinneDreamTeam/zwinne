<template>
  <div>
    <md-table v-model="results" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Wyniki rozwiązanych testów</h1>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" >
        <md-table-cell md-label="Stanowisko" md-sort-by="positionName">{{ item.positionName }}</md-table-cell>
        <md-table-cell md-label="Właściciel" md-sort-by="ownerName">{{ item.ownerName }}</md-table-cell>
        <md-table-cell md-label="Język" md-sort-by="language">{{ item.language }}</md-table-cell>
        <md-table-cell md-label="Wynik" md-sort-by="mark">{{ item.mark }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  let customSort = require('../../utils/CustomSort');
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
        .orderByChild('candidateId')
        .on('child_added', (snapshot) => {
          let result = snapshot.val();
          if(result.answers[0].mark === "") result.marked = false;
          else result.marked = true;
          result.key = snapshot.key;
          if(result.candidateId === this.currentUserAuthUid)
          {
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
                     if(result.marked) {
                       var total = 0;
                       var candidateMark = 0;
                       for (let i in result.answers)
                       {
                         candidateMark += result.answers[i].mark;
                         total++;
                       }
                       result.mark = ((candidateMark/total)*100).toFixed(2) + " %";
                     } else result.mark = "Nieoceniony";
                     r.push(result);
                  });
               });
            });
          }
          this.results = r;
        });

    },
    methods: {
      customSort(value) {
        return value.sort((a, b) => {
          return customSort.customSort(a, b, this.currentSort, this.currentSortOrder);
        })
      },
    }
  }
</script>

<style scoped>

</style>
