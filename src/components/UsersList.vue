<template>
  <div>
    <md-table v-model="users" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder"
              :md-sort-fn="customSort" md-card>
      <md-table-toolbar>
        <h1 class="md-title">Użytkownicy</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single" @click.native="onSelect(item)">
        <md-table-cell md-label="Nazwa" md-sort-by="username">{{ item.username }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Kandydat" md-sort-by="isCandidate">
          <md-icon class="iconCheck" v-if="item.isCandidate">check</md-icon>
          <md-icon class="iconClose" v-if="!item.isCandidate">close</md-icon>
        </md-table-cell>
        <md-table-cell md-label="Redaktor" md-sort-by="isRedactor">
          <md-icon class="iconCheck" v-if="item.isRedactor">check</md-icon>
          <md-icon class="iconClose" v-if="!item.isRedactor">close</md-icon>
        </md-table-cell>
        <md-table-cell md-label="Moderator" md-sort-by="isModerator">
          <md-icon class="iconCheck" v-if="item.isModerator">check</md-icon>
          <md-icon class="iconClose" v-if="!item.isModerator">close</md-icon>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import firebase from 'firebase';

  let db = firebase.database();

  export default {
    name: "users-list",
    firebase: {
      users: db.ref('users')
    },
    data() {
      return {
        redactorFilter: false,
        currentSort: 'username',
        currentSortOrder: 'asc',
      }
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
        this.$router.push({name: 'userDetails', params: {id: item['.key']}});
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
