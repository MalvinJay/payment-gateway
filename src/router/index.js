import Vue from 'vue'
import Router from 'vue-router'
import Client from '@/pages/Client'
import Login from '@/pages/Login'
import Dashboard from '@/pages/client/Dashboard'
import ViewTransactions from '@/pages/client/transactions/ViewTransactions'
import Logs from '@/pages/client/transactions/Logs'
import Settings from '@/pages/client/transactions/Settings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Client',
      component: Client,
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
          path: '/logs',
          name: 'Logs',
          component: Logs
        },
        {
          path: '/settings',
          name: 'Settings',
          component: Settings
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
