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
import toastr from 'toastr'

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
    let db = firebase.database();
    let currentUserDb = db.ref('users').child(currentUser.uid);
    toastr.success(currentUserDb.child('isCandidate').valueOf().toString());
  }

  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('home')
  else next()
});

export default router;
