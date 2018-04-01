<template>
  <div>
    <input type="checkbox" id="redactorsCheckbox" v-model="redactorFilter">
    <label for="redactorsCheckbox">Redactors only</label>

    <md-table v-model="filteredUsers" md-card md-sort="username" md-sort-order="asc">
      <md-table-toolbar>
        <h1 class="md-title">Użytkownicy</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{item}">
        <md-table-cell md-label="Nazwa" md-sort-by="username">{{ item.username }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Kandydat" md-sort-by="candidate">{{ item.isCandidate }}</md-table-cell>
        <md-table-cell md-label="Redaktor" md-sort-by="redactor">{{ item.isRedactor}}</md-table-cell>
        <md-table-cell md-label="Moderator" md-sort-by="moderator">{{ item.isModerator }}</md-table-cell>
        <!--<md-table-cell><router-link :to="{ name: 'userDetails', params: { id: user['.key'] }}">See details</router-link></md-table-cell>-->

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
      }
    },
    computed: {
      filteredUsers: function () {
        if (this.redactorFilter) {
          return this.users.filter((user) => {
            return user.isRedactor;
          })
        }
        console.log(this.users);
        return this.users
      }
    }
  }
</script>

<style scoped>
</style>
