import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import transactions from './modules/transactions'
import user from './modules/user'

axios.defaults.baseURL = 'https://smartstore.cwbyminsait.com/smartstore/develop/shift/'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    user,
    transactions
  }
})
