<template>
  <div id="app">
    <div v-bind:class="getPageStyle()" v-on:keyup.44="overridePrint()" tabindex="0">
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
    created() {
      window.onblur = () => this.$data.pageNotFocused = true;

      window.onfocus = () => this.$data.pageNotFocused = false;
    },
    data() {
      return {
        showDrawer: this.$route.fullPath !== '/login' && this.$route.fullPath !== '/register',
        pageNotFocused: false,
      }
    },
    updated() {
      this.$data.showDrawer = this.$route.fullPath !== '/login' && this.$route.fullPath !== '/register'
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
      }, getPageStyle() {
        return this.$data.pageNotFocused ? 'page-container overlay' : 'page-container'
      }, overridePrint() {
        let aux = document.createElement("input");
        // Assign it the value of the specified element
        aux.setAttribute("value", "Print screen disabled.Print screen disabled.Print screen disabled.Print screen disabled.Print screen disabled.Print screen disabled.");
        // Append it to the body
        document.body.appendChild(aux);
        // Highlight its content
        aux.select();
        // Copy the highlighted text
        document.execCommand("copy");
        // Remove it from the body
        document.body.removeChild(aux);
        alert("Print screen disabled.");
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

  .overlay {
    -webkit-filter: blur(5px);
    -moz-filter: blur(5px);
    -ms-filter: blur(5px);
    -o-filter: blur(5px);
    filter: blur(5px);
  }

</style>
