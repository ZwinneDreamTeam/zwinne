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

      <basic-test-row v-bind:test="item" slot="md-table-row" slot-scope="{item}" md-selectable="single"
                      @click.native="onSelect(item)"/>

    </md-table>
  </div>
</template>

<script>
  import CheckIcon from "../reusable/CheckIcon";
  import firebase from 'firebase';
  import BasicTestRow from "../reusable/BasicTestRow";

  let customSortInCreatedTests = require('../../utils/CustomSort');

  export default {
    components: {
      BasicTestRow,
      CheckIcon
    },
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
      firebase.database().ref('tests')
        .orderByChild('ownerUid').equalTo(currentUserAuth.uid)
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
          return customSortInCreatedTests.customSort(a, b, this.currentSort, this.currentSortOrder);
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
