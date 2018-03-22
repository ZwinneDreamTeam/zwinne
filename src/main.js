// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import VueFire from 'vuefire'

Vue.use(VueFire);

Vue.config.productionTip = false;

let auth;

firebase.auth().onAuthStateChanged(function (user) {
  if (!auth) {
    /* eslint-disable no-new */
    auth = new Vue({
      el: '#app',
      router,
      components: {App},
      template: '<App/>'
    })
  }
});
