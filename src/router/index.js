import Vue from 'vue'
import VueRouter from 'vue-router'
import Redactor from '@/components/Redactor'
import Candidate from '@/components/Candidate'
import Moderator from '@/components/Moderator'
import Home from '@/components/Home'
import Login from '@/components/Login'
import UsersList from '@/components/UsersList'
import UserDetails from '@/components/UserDetails'
import VueMaterial from 'vue-material'
import firebase from 'firebase'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

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
      path: '/redactor',
      name: 'Redactor',
      component: Redactor,
      meta: {
        requiresAuth: true,
        requiresRedactor: true
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
      },
      children: [
        {
          path: 'users',
          component: UsersList
        },
        {
          path: 'users/:id',
          name: 'userDetails',
          component: UserDetails
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  let requiresRedactor = to.matched.some(record => record.meta.requiresRedactor);
  let requiresCandidate = to.matched.some(record => record.meta.requiresCandidate);
  let requiresModerator = to.matched.some(record => record.meta.requiresModerator);


  if (requiresAuth) {
    if (currentUser) {
      if (requiresModerator || requiresCandidate || requiresRedactor) {
        let currentUserDb = firebase.database().ref('/users/' + currentUser.uid);
        currentUserDb.on('value', function (snapshot) {
          let isCandidate = (snapshot.val() && snapshot.val().isCandidate);
          let isRedactor = (snapshot.val() && snapshot.val().isRedactor);
          let isModerator = (snapshot.val() && snapshot.val().isModerator);

          if (requiresRedactor && isRedactor) next();
          else if (requiresCandidate && isCandidate) next();
          else if (requiresModerator && isModerator) next();
          else next('home');
        });
      } else {
        next()
      }
    } else {
      next('login');
    }
  } else {
    //if auth is not required then just pass
    next();
  }

});

export default router;
