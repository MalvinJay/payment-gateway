import {
  SET_TOPUPS,
  SET_TOPUPS_STATE,
  GET_TOPUPS
} from './store-constants'
import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  topups: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {}
  }
}

// getters
const getters = {
  topups: state => state.topups.data,
  topupsState: state => state.topups.state
}

// mutations
const mutations = {
  [SET_TOPUPS] (state, payload) {
    state.topups.state = 'DATA'
    state.topups.data = payload
  },
  [SET_TOPUPS_STATE] (state, data) {
    state.topups.state = data
  }
}

// actions
const actions = {
  [GET_TOPUPS] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    var query = 'search_value=topup'
    commit(SET_TOPUPS_STATE, 'LOADING')
    if (cache && state.topups.data.length !== 0) {
      commit(SET_TOPUPS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/transactions.json?${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_TOPUPS_STATE, 'DATA')
          commit(SET_TOPUPS, response.data.response.data.transactions)
          resolve(response)
        }).catch((error) => {
          commit(SET_TOPUPS_STATE, 'ERROR')
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
