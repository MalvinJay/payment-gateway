import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import Client from '@/pages/Client'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Dashboard from '@/dashboard/pages/Dashboard'
import ViewTransactions from '../transactions/pages/ViewTransactions'
import Fees from '../accounts/pages/Fees'
import FeesDetail from '../accounts/pages/FeesDetail'
// import Payouts from '../transactions/pages/Payouts'
import PaymentDetail from '../transactions/pages/PaymentDetail'
// import Customers from '../contacts/pages/Customers'
import ContactDetails from '../contacts/pages/ContactDetails'
// import NewJob from '../transactions/pages/NewJob'
import Logs from '@/pages/client/transactions/Logs'
import Settings from '@/pages/client/transactions/Settings'
import NewProduct from '@/pages/client/transactions/NewProduct'
const Customers = () => import('../contacts/pages/Customers')
const Payouts = () => import('../transactions/pages/Payouts')
const NewJob = () => import('../transactions/pages/NewJob')
const JobDetails = () => import('../transactions/pages/JobDetails')
const RunDetails = () => import('../transactions/pages/RunDetails')

import Account from '../settings/pages/bs_settings'
import Tax from '../settings/pages/taxation'
import Team from '../settings/pages/team'
import Roles from '../settings/pages/roles'
import Reports from '../settings/pages/roles'

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
          path: '/view',
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
          path: '/view/:id',
          name: 'ViewTransactionsDetails',
          component: PaymentDetail
        },
        {
          path: '/fees',
          name: 'Fees',
          component: Fees
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
          component: Account,
          meta: {
            requiresAuth: true
          }
          // children: [
            // {
            //   path: '/account/taxation',
            //   name: 'Taxation',
            //   component: Tax
            // },
            // {
            //   path: '/account/team',
            //   name: 'Team',
            //   component: Team
            // },         
            // {
            //   path: '/account/roles',
            //   name: 'Roles',
            //   component: Roles
            // },
            // {
            //   path: '/account/reports',
            //   name: 'Reports',
            //   component: Reports
            // }
          // ]
        },
        {
          path: '/account/taxation',
          name: 'Taxation',
          component: Tax
        },
        {
          path: '/account/team',
          name: 'Team',
          component: Team
        },         
        {
          path: '/account/roles',
          name: 'Roles',
          component: Roles
        },
        {
          path: '/account/reports',
          name: 'Reports',
          component: Reports
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
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
    //   console.log('app stat', !this.a.app.$session.exists())
      store.dispatch('getToken')
      next()
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
