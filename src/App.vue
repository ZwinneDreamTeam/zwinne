<template>
  <div id="app">
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed">

        <md-app-toolbar class="md-primary">
          <md-button class="md-icon-button" to="/">
            <md-icon>home</md-icon>
          </md-button>
          <h3 class="md-title">Zwinne XD</h3>
        </md-app-toolbar>

        <md-app-drawer v-if="showDrawer" md-permanent="card">
          <app-drawer></app-drawer>
        </md-app-drawer>

        <md-app-content>
          <router-view></router-view>
        </md-app-content>

      </md-app>
    </div>

  </div>
</template>
<script>
  import firebase from 'firebase'
  import AppDrawer from './components/AppDrawer'

  export let config = {
    apiKey: "AIzaSyAduGsOpgqCLn79cI4fzBvMsC0LFfnQhWA",
    authDomain: "zwinnexd.firebaseapp.com",
    databaseURL: "https://zwinnexd.firebaseio.com",
    projectId: "zwinnexd",
    storageBucket: "zwinnexd.appspot.com",
    messagingSenderId: "427115139234"
  };

  export const db = firebase.initializeApp(config).database();

  export default {
    components: {AppDrawer},
    name: 'app',
    data() {
      return {
        showDrawer: this.$route.fullPath !== '/login' && this.$route.fullPath !== '/register',
      }
    },
    updated() {
      this.$data.showDrawer = this.$route.fullPath !== '/login';
      this.$data.showDrawer = this.$route.fullPath !== '/register';
    },
  };


</script>

<style scoped>
  .md-app-toolbar {
    background: dodgerblue !important;
    color: white !important;
  }

  .md-drawer {
    width: 230px !important;
    max-width: calc(100vw - 125px) !important;
  }

  .md-app {
    position: absolute !important;
    min-height: 100% !important;
    min-width: 100% !important;
  }
</style>
