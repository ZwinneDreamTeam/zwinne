<template>
  <div>
    <md-table v-model="users" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title toolbarTitle">Użytkownicy</h1>
        <router-link :to="{name: 'createAccount'}">
          <md-button class="md-raised md-primary">{{addAccount}}</md-button>
        </router-link>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Nazwa" md-sort-by="username">{{ item.username }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Kandydat" md-sort-by="isCandidate">
          <check-icon v-bind:value="item.isCandidate"/>
        </md-table-cell>
        <md-table-cell md-label="Redaktor" md-sort-by="isRedactor">
          <check-icon v-bind:value="item.isRedactor"/>
        </md-table-cell>
        <md-table-cell md-label="Moderator" md-sort-by="isModerator">
          <check-icon v-bind:value="item.isModerator"/>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import { db } from "../App"
  import firebase from 'firebase';
  import CheckIcon from './reusable/CheckIcon'

  let customSort = require('../utils/CustomSort');


  export default {
    components: {CheckIcon},
    name: "users-list",
    firebase: {
      users: db.ref('users')
    },
    data() {
      return {
        redactorFilter: false,
        currentSort: 'username',
        currentSortOrder: 'asc',
        addAccount: "Add new account"
      }
    },
    methods: {
      customSort(value) {
        return value.sort((a, b) => {
          return customSort.customSort(a, b, this.currentSort, this.currentSortOrder);
        });
      },
      onSelect(item) {
        this.$router.push({name: 'userDetails', params: {id: item['.key']}});
      },
    },
  }
</script>

<style scoped>
</style>
