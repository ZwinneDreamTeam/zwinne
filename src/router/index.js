import Vue from 'vue'
import VueRouter from 'vue-router'
import Redactor from '@/components/Redactor'
import Candidate from '@/components/Candidate'
import Moderator from '@/components/Moderator'
import Home from '@/components/Home'
import Login from '@/components/login/Login'
import UsersList from '@/components/UsersList'
import UserDetails from '@/components/UserDetails'
import WorkPositions from '@/components/WorkPositions'
import WorkPositionDetails from '@/components/WorkPositionDetails'
import WorkPositionAdd from '@/components/WorkPositionAdd'
import CreateUser from '@/components/CreateUser'
import UserTests from '@/components/tests/UserTests'
import CreatedTestsList from '@/components/tests/CreatedTestsList'
import AllTestsList from '@/components/tests/AllTestsList'
import AddTest from '@/components/tests/AddTest'
import TestDetails from '@/components/tests/TestDetails'
import ResolvedTestsList from '@/components/tests/markTest/ResolvedTestsList'
import MarkTest from '@/components/tests/markTest/MarkTest'
import SolveTest from '@/components/tests/solveTest/SolveTest'
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
      path: '/register',
      name: 'Register',
      component: CreateUser
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    //=============== ROLES ===============
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
    //=============== USERS ==============
    {
      path: '/redactor/resolved',
      name: 'resolvedTests',
      component: ResolvedTestsList,
      meta: {
        requiresAuth: true,
        requiresRedactor: true
      },
    },
        {
          path: '/candidate/resolved',
          name: 'userTests',
          component: UserTests,
          meta: {
            requiresAuth: true,
            requiresCandidate: true
          },
        },
     {
        path: '/redactor/resolved/test/:id',
        name: 'mark-test',
        component: MarkTest,
        meta: {
          requiresAuth: true,
          requiresRedactor: true
        },
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
          name: 'users',
          component: UsersList
        },
        {
          path: 'users/:id',
          name: 'userDetails',
          component: UserDetails
        },
        {
          path: 'users/account/create',
          name: 'createAccount',
          component: CreateUser
        }
      ]
    },
    {
      path: '/user/:id',
      name: 'currentUserDetails',
      component: UserDetails,
      meta: {
        requiresAuth: true
      }
    },
    //========= WORK POSITIONS ==========
    {
      path: '/positions',
      name: 'Work positions',
      component: WorkPositions,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/positions/create',
      name: 'addPosition',
      component: WorkPositionAdd,
      meta: {
        requiresAuth: true,
        requiresModerator: true
      }
    },
    {
      path: '/positions/:id',
      name: 'positionDetails',
      component: WorkPositionDetails
    },
    //============= TESTS =============
    {
      path: '/createdTests',
      name: 'created-tests',
      component: CreatedTestsList,
      meta: {
        requiresAuth: true,
        requiresRedactor: true
      }
    },
    {
      path: '/tests',
      name: 'all-tests',
      component: AllTestsList,
      meta: {
        requiresAuth: true,
        requiresModerator: true
      }
    },
    {
      path: '/tests/add',
      name: 'add-test',
      component: AddTest,
      meta: {
        requiresAuth: true,
        requiresRedactor: true,
      }
    },
    {
      path: '/tests/:id',
      name: 'test-details',
      component: TestDetails,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/tests/solve/:id',
      name: 'solve-test',
      component: SolveTest,
      meta: {
        requiresAuth: true,
        requiresCandidate: true
      }
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
