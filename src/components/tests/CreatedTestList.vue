<template>
  <div>
    <md-table v-model="tests" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Stworzone testy</h1>
        <!--<router-link :to="{name: 'addTest'}">-->
        <md-button class="md-raised md-primary">Dodaj test</md-button>
        <!--</router-link>-->
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Stanowisko" md-sort-by="positionName">{{ item.positionName }}</md-table-cell>
        <md-table-cell md-label="Właściciel" md-sort-by="ownerName">{{ item.ownerName }}</md-table-cell>
        <md-table-cell md-label="Aktywne" md-sort-by="isActive">
          <md-icon class="iconCheck" v-if="item.isActive">check</md-icon>
          <md-icon class="iconClose" v-if="!item.isActive">close</md-icon>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import firebase from 'firebase';

  let db = firebase.database();

  export default {
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
      db.ref('tests')
        .orderByChild('ownerUid').equalTo(currentUserAuth.uid)
        .on('child_added', (snapshot) => {
          let test = snapshot.val();
          test.key = snapshot.key;

          let usernamePromise = db.ref('users/' + test.ownerUid + "/username").once('value');
          let positionNamePromise = db.ref('workPositions/' + test.positionUid + "/name").once('value');

          Promise.all([usernamePromise, positionNamePromise]).then((values) => {
            test.ownerName = values[0].val();
            test.positionName = values[1].val();
            this.tests.push(test);
          });
        });
    },
    methods: {
      compareBooleans(a, b, sortBy) {
        if (a[sortBy] === b[sortBy])
          return 0;
        else if (a[sortBy] && !b[sortBy]) {
          return this.currentSortOrder === 'desc' ? 1 : -1;
        } else {
          return this.currentSortOrder === 'desc' ? -1 : 1;
        }

      },
      compareStrings(a, b, sortBy) {
        if (this.currentSortOrder === 'desc') {
          return a[sortBy].localeCompare(b[sortBy])
        } else {
          return b[sortBy].localeCompare(a[sortBy])
        }
      },
      customSort(value) {
        return value.sort((a, b) => {
          const sortBy = this.currentSort;

          if (typeof(a[sortBy]) === "boolean") {
            return this.compareBooleans(a, b, sortBy);
          } else {
            return this.compareStrings(a, b, sortBy);
          }
        })
      },
      onSelect(item) {
        alert("NOT IMPLEMTED YET");
        // this.$router.push({name: 'positionDetails', params: {id: item['.key']}});
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
