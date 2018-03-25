<template>
  <div id="app">

    <div class="page-container">

      <md-app md-waterfall md-mode="fixed">
        <md-app-toolbar class="md-primary">
          <span class="md-title">Zwinne xD</span>
        </md-app-toolbar>

        <md-app-drawer md-permanent="full" id="navMenu">
          <md-toolbar class="md-transparent" md-elevation="0">
            Navigation
          </md-toolbar>

          <md-list>
            <md-list-item>
              <md-icon>move_to_inbox</md-icon>
              <span class="md-list-item-text">Inbox</span>
            </md-list-item>

            <md-list-item >
              <md-icon>send</md-icon>
              <span class="md-list-item-text">Sent Mail</span>
            </md-list-item>

            <md-list-item>
              <md-icon>delete</md-icon>
              <span class="md-list-item-text">Trash</span>
            </md-list-item>

            <md-list-item>
              <md-icon>error</md-icon>
              <span class="md-list-item-text">Spam</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>

        <md-app-content>

          <router-view></router-view>
        </md-app-content>
      </md-app>
    </div>

  </div>
</template>
<script>
  import Firebase from 'Firebase'
  import Vue from 'vue'

  let config = {
    apiKey: "AIzaSyAduGsOpgqCLn79cI4fzBvMsC0LFfnQhWA",
    authDomain: "zwinnexd.firebaseapp.com",
    databaseURL: "https://zwinnexd.firebaseio.com",
    projectId: "zwinnexd",
    storageBucket: "zwinnexd.appspot.com",
    messagingSenderId: "427115139234"
  };

  export const db = Firebase.initializeApp(config).database();

  export default {
    name: 'app'
  }
</script>

<style >
  .md-app-toolbar {
    background: dodgerblue;
    color: white;
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  #navMenu {
    display: inline;
  }

</style>
