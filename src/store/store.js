import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import transactions from '../transactions/store/transactions-store'
import dashboard from '../dashboard/dashboard-store'
import jobs from '../transactions/store/jobs-store'
import payouts from '../transactions/store/payouts-store'
import reports from '../transactions/store/reports-store'
import fees from '../accounts/store/fees-store'
import topups from '../accounts/store/topups-store'
import settlements from '../accounts/store/settlements-store'
import disputes from '../transactions/store/disputes-store'
import contacts from '../contacts/contacts-store'
import fonemessenger from '../fonemessenger/store/fonemessenger-store'
import teams from '../business/store/team-store'
import roles from '../business/store/role-store'
import logs from '../developers/store/logs-store'
import events from '../developers/store/events-store'

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
    reports,
    teams,
    roles,
    fonemessenger,
    disputes,
    topups,
    settlements,
    logs,
    events
  }
})
