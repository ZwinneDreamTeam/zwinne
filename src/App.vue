<template>
  <div id="app">
    <div v-bind:class="getPageStyle()" @contextmenu.prevent="$refs.ctxMenu.open" v-on:keyup.44="overridePrint()"
         tabindex="0" @keyup="keyUp" @keydown="keyDown">
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

    <context-menu id="context-menu" ref="ctxMenu" v-if="contextMenuEnable" @ctx-open="saveSelectedText()">
      <md-list>
        <md-list-item @click="findInWiki()">
          <md-icon>find_in_page</md-icon>
          <span class="md-list-item-text">{{label_wiki}}</span>
        </md-list-item>
        <md-list-item @click="findSynonym()">
          <md-icon>search</md-icon>
          <span class="md-list-item-text">{{label_synonym}}</span>
        </md-list-item>
      </md-list>
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
      window.onblur = () => {
        this.$data.shiftPressed = false;
        this.$data.commandPressed = false;
        this.$data.pageNotFocused = true;
      };

      window.onfocus = () => this.$data.pageNotFocused = false;

      firebase.auth().onAuthStateChanged((user) => {
        if (firebase.auth().currentUser == null) {
          this.contextMenuEnable = false;
        } else {
          db.ref('users/' + firebase.auth().currentUser.uid).on('value', snapshot => {
            this.contextMenuEnable = this.shouldEnableContextMenu(snapshot);
          });
        }
      });
    },
    data() {
      return {
        showDrawer: this.$route.fullPath !== '/login' && this.$route.fullPath !== '/register',
        pageNotFocused: false,
        contextMenuEnable: false,
        label_wiki: "Znajdź w wikipedii",
        label_synonym: "Znajdź synonim",
        selectedText: "",
        shiftPressed: false,
        commandPressed: false,
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
      }, getPageStyle() {
        return (this.$data.pageNotFocused || (this.$data.shiftPressed && this.$data.commandPressed)) ? 'page-container overlay' : 'page-container'
      }, overridePrint() {
        let aux = document.createElement("input");
        // Assign it the value of the specified element
        aux.setAttribute("value", "Print screen disabled.");
        // Append it to the body
        document.body.appendChild(aux);
        // Highlight its content
        aux.select();
        // Copy the highlighted text
        document.execCommand("copy");
        // Remove it from the body
        document.body.removeChild(aux);
        alert("Print screen disabled.");
      }, findInWiki() {
        window.open("https://pl.wikipedia.org/wiki/" + this.$data.selectedText, '_blank');
      }, findSynonym() {
        window.open("https://www.synonimy.pl/synonim/" + this.$data.selectedText, '_blank');
      }, saveSelectedText() {
        this.$data.selectedText = window.getSelection().toString();
      }, keyDown: function (event) {
        if (event.keyCode === 16) {
          this.shiftPressed = true;
        } else if (event.keyCode === 91) {
          this.commandPressed = true
        }
      },
      keyUp: function (event) {
        if (event.keyCode === 16) {
          this.shiftPressed = false
        } else if (event.keyCode === 91) {
          this.commandPressed = false
        }
      }, shouldEnableContextMenu(userData) {
        if (userData == null) return false;
        let userDataVal = userData.val();
        if (userDataVal.isModerator !== null && userDataVal.isModerator === true) return true;
        if (userDataVal.isRedactor !== null && userDataVal.isRedactor === true) return true;
        return false;
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
