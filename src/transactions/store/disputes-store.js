import { GET_DISPUTES, SET_DISPUTES, CREATE_DISPUTE, SET_DISPUTES_STATE, SET_DISPUTES_FILTERS } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import { GET_BASE_URI } from '../../store/constants'
import Utils from '../../utils/services'

// state
const state = {
  disputes: {
    data: [],
    state: 'LOADING',
    count: 0,
    filters: {}
  }
}

// getters
const getters = {
  disputes: state => state.disputes.data,
  disputesState: state => state.disputes.state,
  disputesCount: state => state.disputes.count,
  disputesFilters: state => state.disputes.filters
}

// mutations
const mutations = {
  [SET_DISPUTES] (state, payload) {
    state.disputes.state = 'DATA'
    state.disputes.data = payload
    state.disputes.count = payload.total_page_tickets
  },
  [SET_DISPUTES_STATE] (state, data) {
    state.disputes.state = data
  },
  [SET_DISPUTES_FILTERS] (state, data) {
    state.disputes.filters = data
  }
}

// actions
const actions = {
  [GET_DISPUTES] ({ state, commit, rootGetters }, { page = 1, cache = true } = {}) {
    // filters
    var filters = state.disputes.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?page=${page}&limit=12`
    } else {
      query = Utils.createQueryParams(filters, page)
    }

    // state
    commit(SET_DISPUTES_STATE, 'LOADING')
    commit(SET_DISPUTES_FILTERS, filters)

    if (cache && Utils.present(state.disputes.data)) {
      commit(SET_DISPUTES_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          // url: `${GET_BASE_URI}v1/clients/tickets/via/support`,
          url: `${GET_BASE_URI}v1/clients/tickets.json${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_DISPUTES_STATE, 'DATA')
          commit(SET_DISPUTES, response.data.response.data.tickets)
          resolve(response)
        }).catch((error) => {
          commit(SET_DISPUTES_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [CREATE_DISPUTE] ({ state, commit, rootGetters }, ticket) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/tickets/via/support.json`,
        method: 'POST',
        token: rootGetters.token,
        data: ticket
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [SET_DISPUTES_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_DISPUTES_FILTERS, filters)
    dispatch('getDisputes', {page: 1, cache: false})
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
