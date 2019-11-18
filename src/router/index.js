import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import Client from '@/pages/Client'
import Login from '@/pages/Login'
import LoginHelp from '@/pages/LoginHelp'
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
const Events = () => import(/* webpackChunkName: "developer" */ '../developers/pages/Events')
const EventsDetails = () => import(/* webpackChunkName: "developer" */ '../developers/pages/EventsDetails')
const Webhooks = () => import(/* webpackChunkName: "developer" */ '../developers/pages/Webhooks')
const WebhookDetails = () => import(/* webpackChunkName: "developer" */ '../developers/pages/WebhookDetails')
const APIKeys = () => import(/* webpackChunkName: "developer" */ '../developers/pages/APIKeys')
const Sandbox = () => import(/* webpackChunkName: "developer" */ '../developers/pages/Sandbox')

const stockDashboard = () => import(/* webpackChunkName: "stocks" */'../stocks/pages/Dashboard')
const Products = () => import(/* webpackChunkName: "stocks" */'../stocks/pages/Products')
const Purchases = () => import(/* webpackChunkName: "stocks" */'../stocks/pages/Purchases')
const Agents = () => import(/* webpackChunkName: "stocks" */'../stocks/pages/Agents')

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
          component: ViewTransactions,
          meta: {
            permissions: 'View Transactions'
          }
        },
        {
          path: '/jobs',
          name: 'Jobs',
          component: Jobs,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/job/:id',
          name: 'JobDetails',
          component: JobDetails,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/run/:id',
          name: 'RunDetails',
          component: RunDetails
        },
        {
          path: '/new-job',
          name: 'NewJob',
          component: NewJob,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/payments',
          name: 'Payouts',
          component: Payouts,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/payments/:id',
          name: 'ViewTransactionsDetails',
          component: PaymentDetail,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/stock/dashboard',
          name: 'stockDashboard',
          component: stockDashboard
        },
        {
          path: '/stock/products',
          name: 'Products',
          component: Products
        },
        {
          path: '/stock/purchases',
          name: 'Purchases',
          component: Purchases
        },
        {
          path: '/stock/agents',
          name: 'Agents',
          component: Agents
        },
        {
          path: '/fees',
          name: 'Fees',
          component: Fees,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/topups',
          name: 'TopUps',
          component: TopUps,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/settlements',
          name: 'Settlements',
          component: Settlements,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/logs',
          name: 'Logs',
          component: Logs,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/logs/:id',
          name: 'LogsDetails',
          component: LogsDetails,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/keys',
          name: 'APIKeys',
          component: APIKeys,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/sandbox',
          name: 'Sandbox',
          component: Sandbox
        },
        {
          path: '/events',
          name: 'Events',
          component: Events,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/events/:id',
          name: 'EventsDetails',
          component: EventsDetails,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/webhooks',
          name: 'Webhooks',
          component: Webhooks,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/webhooks/:id',
          name: 'WebhookDetails',
          component: WebhookDetails,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/fees/:id',
          name: 'FeesDetails',
          component: FeesDetail
        },
        {
          path: '/contacts',
          name: 'Customers',
          component: Customers,
          meta: {
            permission: 'permission'
          }
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
        {
          path: '/account',
          name: 'BsSettings',
          component: BsSettings,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/teams',
          name: 'Teams',
          component: Teams,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/roles',
          name: 'Roles',
          component: Roles,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/branches',
          name: 'Branches',
          component: Branches,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/disputes',
          name: 'Disputes',
          component: Disputes
        },
        {
          path: '/fonemessenger',
          name: 'FoneMessenger',
          component: FoneMessenger,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/ussd',
          name: 'Ussd',
          component: Ussd,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/ussd/:id',
          name: 'UssdDetails',
          component: UssdDetails,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/accounts',
          name: 'Account',
          component: Account,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/accounts/:id',
          name: 'AccountDetail',
          component: AccountDetail,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/account-settlements',
          name: 'AccountSettlements',
          component: AccountSettlements,
          meta: {
            permission: 'permission'
          }
        },
        {
          path: '/account-fees',
          name: 'AccountFees',
          component: AccountFees,
          meta: {
            permission: 'permission'
          }
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
      path: '/help',
      name: 'Help',
      component: LoginHelp
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
    {
      path: '/404',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('to route', to)
  console.log('app', store.state.user)
  console.log('permissions:', store.getters.permissions)

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      store.dispatch('getToken')
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') === '' || localStorage.getItem('token') === null) {
      next()
    } else {
      next({ name: 'Dashboard' })
    }
  } else {
    next()
  }
})

export default router
