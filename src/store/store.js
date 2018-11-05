import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
import transactions from '../transactions/store/transactions-store'
import dashboard from '../dashboard/dashboard-store'
import jobs from '../transactions/store/jobs-store'
import payouts from '../transactions/store/payouts-store'
import reports from '../transactions/store/reports-store'
import fees from '../accounts/store/fees-store'
import contacts from '../contacts/contacts-store'
import user from './modules/user'

// axios.defaults.baseURL = 'https://api.flopay.io/'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    user,
    transactions,
    jobs,
    dashboard,
    contacts,
    fees,
    payouts,
    reports
  }
})
