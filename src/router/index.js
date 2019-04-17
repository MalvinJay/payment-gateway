import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import Client from '@/pages/Client'
import Login from '@/pages/Login'
import Dashboard from '@/dashboard/pages/Dashboard'
import ViewTransactions from '../transactions/pages/ViewTransactions'

const PaymentDetail = () => import(/* webpackChunkName: "payment" */ '../transactions/pages/PaymentDetail')
const ContactDetails = () => import(/* webpackChunkName: "payment" */ '../contacts/pages/ContactDetails')
const NotFound = () => import(/* webpackChunkName: "payment" */ '../pages/NotFound')
const BsSettings = () => import(/* webpackChunkName: "payment" */ '../business/pages/BsSettings')
const Teams = () => import(/* webpackChunkName: "payment" */ '../business/pages/Teams')
const Roles = () => import(/* webpackChunkName: "payment" */ '../business/pages/Roles')
const Branches = () => import(/* webpackChunkName: "payment" */ '../business/pages/Branches')
const Jobs = () => import(/* webpackChunkName: "payment" */ '../transactions/pages/Jobs')
// import PaymentDetail from '../transactions/pages/PaymentDetail'
// import ContactDetails from '../contacts/pages/ContactDetails'

// import NotFound from '@/pages/NotFound'

// import Settings from '@/pages/client/transactions/Settings'
// import NewProduct from '@/pages/client/transactions/NewProduct'
// import BsSettings from '@/business/pages/BsSettings'
// import Taxation from '@/business/pages/Taxation'
// import Teams from '@/business/pages/Teams'
// import Roles from '@/business/pages/Roles'
// import Branches from '@/business/pages/Branches'
// import Reports from '@/business/pages/Reports'
// import JobDetails from '../transactions/pages/JobDetails'
// import Jobs from '../transactions/pages/Jobs'

const Customers = () => import(/* webpackChunkName: "customer" */ '../contacts/pages/Customers')
const Payouts = () => import(/* webpackChunkName: "customer" */ '../transactions/pages/Payouts')
const NewJob = () => import(/* webpackChunkName: "customer" */ '../transactions/pages/NewJob')
const Disputes = () => import(/* webpackChunkName: "customer" */ '../transactions/pages/Disputes')
const JobDetails = () => import(/* webpackChunkName: "customer" */ '../transactions/pages/JobDetails')
const JobContactDetails = () => import(/* webpackChunkName: "customer" */ '../contacts/pages/JobContactDetails')
const RunDetails = () => import(/* webpackChunkName: "customer" */ '../transactions/pages/RunDetails')

const FirstTimeLogin = () => import(/* webpackChunkName: "fone" */ '../pages/FirstTimeLogin')
const ResetPassword = () => import(/* webpackChunkName: "fone" */ '../pages/ResetPassword')
const Profile = () => import(/* webpackChunkName: "fone" */ '../pages/client/Profile')

const FoneMessenger = () => import(/* webpackChunkName: "fone" */ '../fonemessenger/pages/FoneMessenger')
const Ussd = () => import(/* webpackChunkName: "fone" */ '../ussd/pages/Ussd')
const UssdDetails = () => import(/* webpackChunkName: "fone" */ '../ussd/components/UssdDetail')
const Fees = () => import(/* webpackChunkName: "fone" */ '../accounts/pages/Fees')
const FeesDetail = () => import(/* webpackChunkName: "fone" */ '../accounts/pages/FeesDetail')
const TopUps = () => import(/* webpackChunkName: "account" */ '../accounts/pages/TopUps')
const Settlements = () => import(/* webpackChunkName: "account" */ '../accounts/pages/Settlements')
const Account = () => import(/* webpackChunkName: "connect" */ '../connect/pages/Account')
const AccountDetail = () => import(/* webpackChunkName: "connect" */ '../connect/pages/AccountDetail')
const AccountSettlements = () => import(/* webpackChunkName: "connect" */ '../connect/pages/AccountSettlements')
const AccountFees = () => import(/* webpackChunkName: "connect" */ '../connect/pages/AccountFees')

const Logs = () => import(/* webpackChunkName: "developer" */ '../developers/pages/Logs')
const LogsDetails = () => import(/* webpackChunkName: "developer" */ '../developers/pages/LogsDetails')
const Events = () => import(/* webpackChunkName: "developer" */ '../developers/pages/events')
const EventsDetails = () => import(/* webpackChunkName: "developer" */ '../developers/pages/EventsDetails')
const Webhooks = () => import(/* webpackChunkName: "developer" */ '../developers/pages/Webhooks')
const WebhookDetails = () => import(/* webpackChunkName: "developer" */ '../developers/pages/WebhookDetails')
const APIKeys = () => import(/* webpackChunkName: "developer" */ '../developers/pages/APIKeys')
const Sandbox = () => import(/* webpackChunkName: "developer" */ '../developers/pages/Sandbox')

const Products = () => import(/* webpackChunkName: "stocks" */'../stocks/pages/Products')
const Purchases = () => import(/* webpackChunkName: "stocks" */'../stocks/pages/Purchases')
const Agent = () => import(/* webpackChunkName: "stocks" */'../stocks/pages/Agents')

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
          path: '/receipts',
          name: 'ViewTransactions',
          component: ViewTransactions
        },
        {
          path: '/jobs',
          name: 'Jobs',
          component: Jobs
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
          path: '/payments',
          name: 'Payouts',
          component: Payouts
        },
        {
          path: '/payments/:id',
          name: 'ViewTransactionsDetails',
          component: PaymentDetail
        },
        {
          path: '/stock/products',
          name: 'Products',
          component: Products
        },
        {
          path: '/stock/purchases',
          name: 'Purchase',
          component: Purchases
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
          path: '/job-contacts/:id',
          name: 'JobContactDetails',
          component: JobContactDetails
        },
        // Business Settings
        {
          path: '/account',
          name: 'BsSettings',
          component: BsSettings
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
        // ussd sessiond & transactions
        {
          path: '/ussd',
          name: 'Ussd',
          component: Ussd
        },
        {
          path: '/ussd/:id',
          name: 'UssdDetails',
          component: UssdDetails
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
      path: '/reset_password',
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
