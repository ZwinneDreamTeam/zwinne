<template>
  <div id="app">
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed">

        <md-app-toolbar class="md-primary">
          <span class="md-title">Zwinne xD</span>
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

  let config = {
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
        showDrawer: this.$route.fullPath !== '/login',
      }
    },
    updated() {
      this.$data.showDrawer = this.$route.fullPath !== '/login';
    },
  };


</script>

<style>
  .md-app-toolbar {
    background: dodgerblue;
    color: white;
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-app {
    position: absolute;
    min-height: 100% !important;
    min-width: 100% !important;
  }
</style>
