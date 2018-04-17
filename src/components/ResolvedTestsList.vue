<template>
  <div>
    <md-table v-model="tests" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Testy do sprawdzenia</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Nazwa" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Wynik" md-sort-by="isActive">
          <md-icon class="iconCheck" v-if="item.isActive">check</md-icon>
          <md-icon class="iconClose" v-if="!item.isActive">close</md-icon>
        </md-table-cell>
        <div v-if="isRedactor">
          <md-table-cell md-label="Oceń">
            <md-button class="md-raised md-primary">Oceń test</md-button>
          </md-table-cell>
        </div>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import firebase from 'firebase';

  let db = firebase.database();

  export default {
    name: "user_tests",
    firebase: {
      tests: db.ref('results')
    },
    data() {
      return {
        isCandidate: false,
        isRedactor: false,
        currentSort: 'name',
        currentSortOrder: 'asc',
        currentUserAuthUid: '',
        results: "",
      }
    },
    mounted() {
      this.currentUserAuthUid = firebase.auth().currentUser.uid;
      db.ref('users/' + this.currentUserAuthUid).on('value', (snapshot) => {
        this.isRedactor = (snapshot.val() && snapshot.val().isRedactor);
      });

     // let currentUserAuth = firebase.auth().currentUser;
     // db.ref('resalts').child('testId')
      db.ref('results').on('value', snapshot => {
            this.results = snapshot.val();
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
    /*  onSelect(item) {
        this.$router.push({name: 'positionDetails', params: {id: item['.key']}});
      }, */
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
