<template>
  <div>
    <md-table v-model="positions" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Stanowiska</h1>
        <!--TODO: Odkomentować kiedy będzie widok dodawania stanowiska-->
        <!--<router-link :to="{name: 'createWorkPosition'}">-->
        <md-button class="md-raised md-primary" v-if="isModerator">Dodaj stanowisko</md-button>
        <!--</router-link>-->
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Nazwa" md-sort-by="name">{{ item.name }}</md-table-cell>
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
    name: "work-positions",
    firebase: {
      positions: db.ref('workPositions')
    },
    data() {
      return {
        isModerator: false,
        currentSort: 'name',
        currentSortOrder: 'asc',
      }
    },
    mounted() {
      let currentUserAuth = firebase.auth().currentUser;
      db.ref('users/' + currentUserAuth.uid).on('value', (snapshot) => {
        this.isModerator = (snapshot.val() && snapshot.val().isModerator);
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
        this.$router.push({name: 'positionDetails', params: {id: item['.key']}});
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
