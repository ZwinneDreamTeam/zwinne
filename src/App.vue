<template>
  <div id="app">
    <div class="page-container" @contextmenu.prevent="$refs.ctxMenu.open">
      <md-app md-waterfall md-mode="fixed">

        <md-app-toolbar class="md-primary">
          <md-button class="md-icon-button" to="/">
            <md-icon>home</md-icon>
          </md-button>
          <h3 class="md-title">Zwinne XD</h3>

          <div class="md-toolbar-section-end">
            <md-button @click="logout" class="md-icon-button" v-show="isUserLoggedIn()">
              <md-icon>power_settings_new</md-icon>
            </md-button>
          </div>
        </md-app-toolbar>
        <md-app-drawer v-if="showDrawer" md-permanent="card">
          <app-drawer></app-drawer>
        </md-app-drawer>

        <md-app-content>
          <router-view></router-view>
        </md-app-content>

      </md-app>
    </div>

    <context-menu id="context-menu" ref="ctxMenu">
      <li @click="doSomething()" >option 1</li>
      <li class="disabled">option 2</li>
      <li>option 3</li>
    </context-menu>

  </div>
</template>
<script>
  import firebase from 'firebase'
  import AppDrawer from './components/AppDrawer'
  import contextMenu from 'vue-context-menu'

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
    components: {AppDrawer, contextMenu},
    name: 'app',
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (firebase.auth().currentUser == null) {
          this.contextMenuEnable = false;
        } else {
          db.ref('users/' + firebase.auth().currentUser.uid).on('value', snapshot => {
            this.contextMenuEnable = snapshot != null && (!snapshot.val().isCandidate || snapshot.val().isModerator || snapshot.val().isRedactor);
          });
        }
      });
    },
    data() {
      return {
        showDrawer: this.$route.fullPath !== '/login' && this.$route.fullPath !== '/register',
        contextMenuEnable: false,
      }
    },
    updated() {
      this.$data.showDrawer = this.$route.fullPath !== '/login' && this.$route.fullPath !== '/register';
    },
    methods: {
      isUserLoggedIn(event) {
        return firebase.auth().currentUser != null
      },
      logout(event) {
        firebase.auth().signOut().then(
          (data) => {
            this.$router.replace({name: 'Login'});
          }
        )
      }, doSomething() {

      }
    }
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
