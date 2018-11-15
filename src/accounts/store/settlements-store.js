import {
  SET_SETTLEMENTS,
  SET_SETTLEMENTS_STATE,
  GET_SETTLEMENTS
} from './store-constants'
import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  settlements: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {}
  }
}

// getters
const getters = {
  settlements: state => state.settlements.data,
  settlementsState: state => state.settlements.state
}

// mutations
const mutations = {
  [SET_SETTLEMENTS] (state, payload) {
    state.settlements.state = 'DATA'
    state.settlements.data = payload
  },
  [SET_SETTLEMENTS_STATE] (state, data) {
    state.settlements.state = data
  }
}

// actions
const actions = {
  [GET_SETTLEMENTS] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    var query = 'search_value=cash_transfer'
    commit(SET_SETTLEMENTS_STATE, 'LOADING')
    if (cache && state.settlements.data.length !== 0) {
      commit(SET_SETTLEMENTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/transactions.json?${query}`,
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}