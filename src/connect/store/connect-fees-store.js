import { GET_BASE_URI } from '../../store/constants'
import { GET_ACCOUNT_FEES, SET_ACCOUNT_FEES, SET_ACCOUNT_FEES_STATE,
  SET_CURRENT_ACCOUNT_FEES, GET_CURRENT_ACCOUNT_FEES, SET_ACCOUNT_FEES_FILTERS } from './store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  accountFees: {
    data: [],
    state: 'LOADING',
    count: 0
  },
  currentAccountFees: {
    data: []
  }
}

// getters
const getters = {
  accountFees: state => state.accountFees.data,
  currentAccountFees: state => state.currentAccountFees.data,
  accountsFeesState: state => state.accountFees.state,
  accountsFeesCount: state => state.accountFees.count
}

// mutations
const mutations = {
  [SET_ACCOUNT_FEES] (state, payload) {
    state.accountFees.state = 'DATA'
    state.accountFees.count = payload.length
    state.accountFees.data = payload
  },
  [SET_ACCOUNT_FEES_STATE] (state, data) {
    state.accountFees.state = data
  },
  [SET_CURRENT_ACCOUNT_FEES] (state, {
    page = 1,
    payload
  } = {}) {
    var items = payload.slice((page * 12) - 12, page * 12).map(i => {
      return i
    })
    state.currentAccountFees.data = items
  },
  [SET_ACCOUNT_FEES_FILTERS] (state, data) {
    state.accountFees.filters = data
  }
}

// actions
const actions = {
//   GET ALL ACCOUNTS
  [GET_ACCOUNT_FEES] ({ state, commit, rootGetters }, { page = 1, cache = true } = {}) {
    //   url for admin or client
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'
    var filters = state.fees.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?all=true&page=${page}&limit=12`
    } else {
      // filters.search_value = 'cashin'
      query = Utils.createQueryParams(filters, page)
    }
    commit(SET_ACCOUNT_FEES_STATE, 'LOADING')
    commit(SET_ACCOUNT_FEES_FILTERS, filters)

    if (cache && state.fees.data.length !== 0) {
      commit(SET_ACCOUNT_FEES_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_ACCOUNT_FEES_STATE, 'DATA')
          commit(SET_ACCOUNT_FEES, response.data.response.data.transactions)
          resolve(response)
        }).catch((error) => {
          commit(SET_ACCOUNT_FEES_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_ACCOUNT_FEES_FILTERS] ({ commit, dispatch }, filters) {
    commit(SET_ACCOUNT_FEES_FILTERS, filters)
    dispatch('getAccountFees', {page: 1, cache: false})
  },
  [GET_CURRENT_ACCOUNT_FEES] ({commit, state}, page = 1) {
    commit(SET_CURRENT_ACCOUNT_FEES, {payload: state.accountFees.data, page: page})
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
