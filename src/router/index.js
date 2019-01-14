import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import Client from '@/pages/Client'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Dashboard from '@/dashboard/pages/Dashboard'
import ViewTransactions from '../transactions/pages/ViewTransactions'
import PaymentDetail from '../transactions/pages/PaymentDetail'
import ContactDetails from '../contacts/pages/ContactDetails'
import Settings from '@/pages/client/transactions/Settings'
import NewProduct from '@/pages/client/transactions/NewProduct'
import BsSettings from '@/business/pages/BsSettings'
import Taxation from '@/business/pages/Taxation'
import Teams from '@/business/pages/Teams'
import Roles from '@/business/pages/Roles'
import Branches from '@/business/pages/Branches'
import Reports from '@/business/pages/Reports'
import JobDetails from '../transactions/pages/JobDetails'

const Customers = () => import('../contacts/pages/Customers')
const Payouts = () => import('../transactions/pages/Payouts')
const NewJob = () => import('../transactions/pages/NewJob')
const Disputes = () => import('../transactions/pages/Disputes')
// const JobDetails = () => import('../transactions/pages/JobDetails')
const RunDetails = () => import('../transactions/pages/RunDetails')

const FirstTimeLogin = () => import('../pages/FirstTimeLogin')
const ResetPassword = () => import('../pages/ResetPassword')
const Profile = () => import('../pages/client/Profile')

const FoneMessenger = () => import('../fonemessenger/pages/FoneMessenger')
const Fees = () => import('../accounts/pages/Fees')
const FeesDetail = () => import('../accounts/pages/FeesDetail')
const TopUps = () => import('../accounts/pages/TopUps')
const Settlements = () => import('../accounts/pages/Settlements')
const Account = () => import('../connect/pages/Account')
const AccountDetail = () => import('../connect/pages/AccountDetail')
const AccountSettlements = () => import('../connect/pages/AccountSettlements')
const AccountFees = () => import('../connect/pages/AccountFees')

const Logs = () => import('../developers/pages/Logs')
const LogsDetails = () => import('../developers/pages/LogsDetails')
const Events = () => import('../developers/pages/events')
const EventsDetails = () => import('../developers/pages/EventsDetails')
const Webhooks = () => import('../developers/pages/Webhooks')
const WebhookDetails = () => import('../developers/pages/WebhookDetails')
const APIKeys = () => import('../developers/pages/APIKeys')
const Sandbox = () => import('../developers/pages/Sandbox')

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
          path: '/profile',
          name: 'Profile',
          component: Profile
        },
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
        // Developers
        {
          path: '/logs',
          name: 'Logs',
          component: Logs
        },
        {
          path: '/logs/:id',
          name: 'LogsDetails',
          component: LogsDetails
        },
        {
          path: '/keys',
          name: 'APIKeys',
          component: APIKeys
        },
        {
          path: '/sandbox',
          name: 'Sandbox',
          component: Sandbox
        },
        {
          path: '/events',
          name: 'Events',
          component: Events
        },
        {
          path: '/events/:id',
          name: 'EventsDetails',
          component: EventsDetails
        },
        {
          path: '/webhooks',
          name: 'Webhooks',
          component: Webhooks
        },
        {
          path: '/webhooks/:id',
          name: 'WebhookDetails',
          component: WebhookDetails
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
        // Business Settings
        {
          path: '/account',
          name: 'BsSettings',
          component: BsSettings
        },
        {
          path: '/taxation',
          name: 'Taxation',
          component: Taxation
        },
        {
          path: '/teams',
          name: 'Teams',
          component: Teams
        },
        {
          path: '/roles',
          name: 'Roles',
          component: Roles
        },
        {
          path: '/branches',
          name: 'Branches',
          component: Branches
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
        },
        // connect
        {
          path: '/accounts',
          name: 'Account',
          component: Account
        },
        {
          path: '/accounts/:id',
          name: 'AccountDetail',
          component: AccountDetail
        },
        // connect settlements
        {
          path: '/account-settlements',
          name: 'AccountSettlements',
          component: AccountSettlements
        },
        // connect settlements
        {
          path: '/account-fees',
          name: 'AccountFees',
          component: AccountFees
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
    {
      path: '/change_password',
      name: 'FirstTimeLogin',
      component: FirstTimeLogin
    },
    {
      path: '/forgot-password',
      name: 'ResetPassword',
      component: ResetPassword
    },
    { path: '/404', component: NotFound },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('to route', to)
  console.log('app', store.state.user)
  console.log('login', localStorage.getItem('login'))
  console.log('store', store)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      store.dispatch('getToken')
      next()
    //   if (localStorage.getItem('login')) {
    //     store.dispatch('getToken')
    //     next()
    //   } else {
    //     store.client = {}
    //     store.user = {
    //       data: {},
    //       client_id: '',
    //       client_secret: ''
    //     }
    //     store.userdata = {}
    //     store.permissions = {
    //       data: []
    //     }
    //     store.logIn = false
    //     store.user.token = null
    //     localStorage.removeItem('token')
    //     localStorage.setItem('login', false) // clear your user's token from localstorage
    //     localStorage.removeItem('client_id')
    //     localStorage.removeItem('client_secret')
    //     next({
    //       path: '/login',
    //       params: { nextUrl: to.fullPath }
    //     })
    //   }
    //   console.log('app stat', this.a.app.$session.exists())
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
