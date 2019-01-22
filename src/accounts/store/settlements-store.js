import {
  SET_SETTLEMENTS,
  SET_SETTLEMENTS_STATE,
  GET_SETTLEMENTS,
  SET_SETTLEMENTS_FILTERS,
  GET_ACCOUNTS,
  SET_ACCOUNTS,
  CREATE_SETTLEMENT
} from './store-constants'
import { GET_BASE_URI } from '../../store/constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'
import moment from 'moment'

// state
const state = {
  settlements: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {
      from: moment().startOf('month').format('YYYY-MM-DD'),
      to: moment().endOf('month').format('YYYY-MM-DD')
    }
  },
  clientAccounts: {
    data: []
  }
}

// getters
const getters = {
  settlements: state => state.settlements.data,
  settlementsState: state => state.settlements.state,
  clientAccounts: state => state.clientAccounts.data
}

// mutations
const mutations = {
  [SET_SETTLEMENTS] (state, payload) {
    state.settlements.state = 'DATA'
    state.settlements.data = payload
  },
  [SET_SETTLEMENTS_STATE] (state, data) {
    state.settlements.state = data
  },
  [SET_SETTLEMENTS_FILTERS] (state, data) {
    state.settlements.filters = data
  },
  [SET_ACCOUNTS] (state, data) {
    state.clientAccounts.data = data
  }
}

// actions
const actions = {
  [GET_SETTLEMENTS] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    // var query = 'search_value=cash_transfer'
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'
    var filters = state.settlements.filters
    var query = Utils.createQueryParams(filters, page)
    query = `search_value=cash_transfer&${query}`

    commit(SET_SETTLEMENTS_STATE, 'LOADING')
    if (cache && state.settlements.data.length !== 0) {
      commit(SET_SETTLEMENTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}?${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_SETTLEMENTS_STATE, 'DATA')
          commit(SET_SETTLEMENTS, response.data.response.data.transactions)
          resolve(response)
        }).catch((error) => {
          commit(SET_SETTLEMENTS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_SETTLEMENTS_FILTERS] ({ commit, dispatch }, filters) {
    commit(SET_SETTLEMENTS_FILTERS, filters)
    dispatch('getSettlements', {page: 1, cache: false})
  },
  [CREATE_SETTLEMENT] ({ rootGetters }, data) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/cash_transfers`,
        method: 'POST',
        token: rootGetters.token,
        data: data
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
