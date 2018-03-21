import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from '@/components/Admin'
import Candidate from '@/components/Candidate'
import Moderator from '@/components/Moderator'
import Home from '@/components/Home'
import Login from '@/components/Login'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import firebase from 'firebase'

Vue.use(VueMaterial);
Vue.use(VueRouter);

let router = new VueRouter({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/candidate',
      name: 'Candidate',
      component: Candidate,
      meta: {
        requiresAuth: true,
        requiresCandidate: true
      }
    },
    {
      path: '/moderator',
      name: 'Moderator',
      component: Moderator,
      meta: {
        requiresAuth: true,
        requiresModerator: true
      }
    }
  ]
});


router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;

  if (currentUser) {
    let currentUserDb = firebase.database().ref('/users/' + currentUser.uid);
    currentUserDb.on('value', function (snapshot) {
      let isCandidate = (snapshot.val() && snapshot.val().isCandidate);
      let isAdmin = (snapshot.val() && snapshot.val().isRedactor);
      let isModerator = (snapshot.val() && snapshot.val().isModerator);

      let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
      let requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
      let requiresCandidate = to.matched.some(record => record.meta.requiresCandidate);
      let requiresModerator = to.matched.some(record => record.meta.requiresModerator);

      if (requiresAuth && currentUser && requiresAdmin && isAdmin) next();
      else if (requiresAuth && currentUser && requiresCandidate && isCandidate) next();
      else if (requiresAuth && currentUser && requiresModerator && isModerator) next();
      else if (requiresAuth && currentUser && !requiresAdmin && !requiresCandidate && !requiresModerator) next();
      else next('home');
    });
  } else {
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) next('login')
    else if (!requiresAuth && currentUser) next('home')
    else next()
  }
});

export default router;
