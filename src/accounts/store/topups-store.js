import {
  SET_TOPUPS,
  SET_TOPUPS_STATE,
  GET_TOPUPS,
  SET_TOPUPS_FILTERS,
  TOPUP_EVA
} from './store-constants'
import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'
import moment from 'moment'

// state
const state = {
  topups: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {
      from: moment().startOf('month').format('YYYY-MM-DD'),
      to: moment().endOf('month').format('YYYY-MM-DD')
    }
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
  },
  [SET_TOPUPS_FILTERS] (state, data) {
    state.topups.filters = data
  }
}

// actions
const actions = {
  [GET_TOPUPS] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'

    var filters = state.topups.filters
    var query = Utils.createQueryParams(filters, page)
    query = `search_value=topup&${query}`

    commit(SET_TOPUPS_STATE, 'LOADING')
    if (cache && state.topups.data.length !== 0) {
      commit(SET_TOPUPS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}?${query}`,
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
  },
  [SET_TOPUPS_FILTERS] ({ commit, dispatch }, filters) {
    commit(SET_TOPUPS_FILTERS, filters)
    dispatch('getTopUps', {page: 1, cache: false})
  },
  [TOPUP_EVA] ({ rootGetters }, { url, ova }) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}${url}`,
        method: 'POST',
        token: rootGetters.token,
        data: ova
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
