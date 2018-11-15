import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import Utils from '../utils/services'
import Client from '@/pages/Client'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Dashboard from '@/dashboard/pages/Dashboard'
import ViewTransactions from '../transactions/pages/ViewTransactions'

// import Payouts from '../transactions/pages/Payouts'
import PaymentDetail from '../transactions/pages/PaymentDetail'
// import Customers from '../contacts/pages/Customers'
import ContactDetails from '../contacts/pages/ContactDetails'
// import NewJob from '../transactions/pages/NewJob'
import Logs from '@/pages/client/transactions/Logs'
import Settings from '@/pages/client/transactions/Settings'
import NewProduct from '@/pages/client/transactions/NewProduct'

import Account from '@/settings/pages/BsSettings'
import Tax from '@/settings/pages/Taxation'
import Team from '@/settings/pages/Team'
import Roles from '@/settings/pages/Roles'
import Reports from '@/settings/pages/Reports'
const Customers = () => import('../contacts/pages/Customers')
const Payouts = () => import('../transactions/pages/Payouts')
const NewJob = () => import('../transactions/pages/NewJob')
const Disputes = () => import('../transactions/pages/Disputes')
const JobDetails = () => import('../transactions/pages/JobDetails')
const RunDetails = () => import('../transactions/pages/RunDetails')
const FoneMessenger = () => import('../fonemessenger/pages/FoneMessenger')
const Fees = () => import('../accounts/pages/Fees')
const FeesDetail = () => import('../accounts/pages/FeesDetail')
const TopUps = () => import('../accounts/pages/TopUps')
const Settlements = () => import('../accounts/pages/Settlements')

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Client',
      component: Client,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/payments',
          name: 'ViewTransactions',
          component: ViewTransactions
        },
        {
          path: '/job/:id',
          name: 'JobDetails',
          component: JobDetails
        },
        {
          path: '/run/:id',
          name: 'RunDetails',
          component: RunDetails
        },
        {
          path: '/new-job',
          name: 'NewJob',
          component: NewJob
        },
        {
          path: '/payouts',
          name: 'Payouts',
          component: Payouts
        },
        {
          path: '/payments/:id',
          name: 'ViewTransactionsDetails',
          component: PaymentDetail
        },
        {
          path: '/fees',
          name: 'Fees',
          component: Fees
        },
        {
          path: '/topups',
          name: 'TopUps',
          component: TopUps
        },
        {
          path: '/settlements',
          name: 'Settlements',
          component: Settlements
        },
        {
          path: '/logs',
          name: 'Logs',
          component: Logs
        },
        {
          path: '/fees/:id',
          name: 'FeesDetails',
          component: FeesDetail
        },
        {
          path: '/settings',
          name: 'Settings',
          component: Settings
        },
        {
          path: '/product',
          name: 'NewProduct',
          component: NewProduct
        },
        {
          path: '/contacts',
          name: 'Customers',
          component: Customers
        },
        {
          path: '/contacts/:id',
          name: 'ContactDetails',
          component: ContactDetails
        },
        {
          path: '/account',
          name: 'Account',
          component: Account
        },
        {
          path: '/taxation',
          name: 'Taxation',
          component: Tax
        },
        {
          path: '/team',
          name: 'Team',
          component: Team
        },
        {
          path: '/roles',
          name: 'Roles',
          component: Roles
        },
        {
          path: '/reports',
          name: 'Reports',
          component: Reports
        },
        // disputes
        {
          path: '/disputes',
          name: 'Disputes',
          component: Disputes
        },
        // fone messenger
        {
          path: '/fonemessenger',
          name: 'FoneMessenger',
          component: FoneMessenger
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guest: true
      }
    },
    { path: '/404', component: NotFound },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('app', store)
  console.log('app', store.state.user)
  console.log('app', store.state.user.logIn)
  console.log('store', store)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      if (store.state.user.logIn) {
        store.dispatch('getToken')
        next()
      } else {
        store.client = {}
        store.user = {
          data: {},
          client_id: '',
          client_secret: ''
        }
        store.userdata = {}
        store.permissions = {
          data: []
        }
        store.logIn = false
        store.user.token = null
        localStorage.removeItem('token')
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        })
      }
      console.log('app stat', this.a.app.$session.exists())
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
    //   next({
    //     path: '/login',
    //     params: { nextUrl: to.fullPath }
    //   })
      next()
    } else {
      next({ name: 'Dashboard' })
    }
  } else {
    next()
  }
})

export default router
