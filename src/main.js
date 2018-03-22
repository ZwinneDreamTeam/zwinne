// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

let app;

var config = {
  apiKey: "AIzaSyAduGsOpgqCLn79cI4fzBvMsC0LFfnQhWA",
  authDomain: "zwinnexd.firebaseapp.com",
  databaseURL: "https://zwinnexd.firebaseio.com",
  projectId: "zwinnexd",
  storageBucket: "zwinnexd.appspot.com",
  messagingSenderId: "427115139234"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      components: {App},
      template: '<App/>'
    })
  }
});
