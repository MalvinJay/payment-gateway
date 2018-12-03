import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { GET_ACCOUNT_SETTLEMENTS, SET_ACCOUNT_SETTLEMENTS, SET_ACCOUNT_SETTLEMENTS_STATE,
  SET_CURRENT_ACCOUNT_SETTLEMENTS, GET_CURRENT_ACCOUNT_SETTLEMENTS } from './store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  accountSettlements: {
    data: [],
    state: 'LOADING',
    count: 0
  },
  currentAccountSettlements: {
    data: []
  }
}

// getters
const getters = {
  accountsSettlements: state => state.accountSettlements.data,
  currentAccountSettlements: state => state.currentAccountSettlements.data,
  accountsSettlementsState: state => state.accountSettlements.state,
  accountsSettlementsCount: state => state.accountSettlements.count
}

// mutations
const mutations = {
  [SET_ACCOUNT_SETTLEMENTS] (state, payload) {
    state.accountSettlements.state = 'DATA'
    state.accountSettlements.count = payload.length
    state.accountSettlements.data = payload
  },
  [SET_ACCOUNT_SETTLEMENTS_STATE] (state, data) {
    state.accountSettlements.state = data
  },
  [SET_CURRENT_ACCOUNT_SETTLEMENTS] (state, {
    page = 1,
    payload
  } = {}) {
    var items = payload.slice((page * 12) - 12, page * 12).map(i => {
      return i
    })
    state.currentAccountSettlements.data = items
  }
}

// actions
const actions = {
//   GET ALL ACCOUNTS
  [GET_ACCOUNT_SETTLEMENTS] ({ state, commit, rootGetters }, { page = 1, cache = true } = {}) {
    commit(SET_ACCOUNT_SETTLEMENTS_STATE, 'DATA')
    // if (cache && Utils.present(state.accounts.data)) {
    //   commit(SET_ACCOUNT_SETTLEMENTS_STATE, 'DATA')
    // } else {
    //   return new Promise((resolve, reject) => {
    //     apiCall({
    //       url: `${GET_BASE_URI}v2/accounts/platform/clients.json`,
    //       method: 'GET',
    //       token: rootGetters.token
    //     }).then((response) => {
    //       commit(SET_ACCOUNT_SETTLEMENTS_STATE, 'DATA')
    //       commit(SET_ACCOUNT_SETTLEMENTS, response.data.response.data.clients)
    //       commit(SET_CURRENT_ACCOUNT_SETTLEMENTS, {payload: response.data.response.data.clients, page: 1})
    //       resolve(response)
    //     }).catch((error) => {
    //       commit(SET_ACCOUNT_SETTLEMENTS_STATE, 'ERROR')
    //       console.log(error)
    //       reject(error)
    //     })
    //   })
    // }
  },
  [GET_CURRENT_ACCOUNT_SETTLEMENTS] ({commit, state}, page = 1) {
    commit(SET_CURRENT_ACCOUNT_SETTLEMENTS, {payload: state.accountSettlements.data, page: page})
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
