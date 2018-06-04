<template>
  <div>
    <md-table v-model="positions" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Stanowiska</h1>
        <router-link v-if="isModerator" :to="{name: 'addPosition'}">
          <md-button class="md-raised md-primary">Dodaj stanowisko</md-button>
        </router-link>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Nazwa" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Aktywne" md-sort-by="isActive">
          <check-icon v-bind:value="item.isActive"/>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import CheckIcon from "./reusable/CheckIcon";

  let customSort = require('../utils/CustomSort');


  let db = firebase.database();

  export default {
    components: {CheckIcon},
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
      customSort(value) {
        return value.sort((a, b) => {
          return customSort.customSort(a, b, this.currentSort, this.currentSortOrder);
        });
      },
      onSelect(item) {
        this.$router.push({name: 'positionDetails', params: {id: item['.key']}});
      },
    },
  }
</script>

<style scoped>

</style>
