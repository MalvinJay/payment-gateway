import { GET_BASE_URI, GET_DISPUTES, SET_DISPUTES, CREATE_DISPUTE, SET_DISPUTES_STATE } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  disputes: {
    data: [],
    state: 'LOADING',
    count: 0
  }
}

// getters
const getters = {
  disputes: state => state.disputes.data,
  disputesState: state => state.disputes.state,
  disputesCount: state => state.disputes.count
}

// mutations
const mutations = {
  [SET_DISPUTES] (state, payload) {
    state.disputes.state = 'DATA'
    state.disputes.data = payload
  },
  [SET_DISPUTES_STATE] (state, data) {
    state.disputes.state = data
  }
}

// actions
const actions = {
  [GET_DISPUTES] ({ state, commit, rootGetters }, { page = 1, cache = true } = {}) {
    // filters
    // var filters = state.transactions.filters
    var query = `?page=${page}&limit=12`

    // if (Utils.empty(filters)) {
    //   query = `?all=true&search_value=cashout&page=${page}&limit=12`
    // } else {
    //   filters.search_value = 'cashout'
    //   query = Utils.createQueryParams(filters, page)
    // }  

    // state
    commit(SET_DISPUTES_STATE, 'LOADING')

    if (cache && Utils.present(state.disputes.data)) {
      commit(SET_DISPUTES_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/clients/tickets.json${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('Disputes:', response.data)
          commit(SET_DISPUTES_STATE, 'DATA')
          commit(SET_DISPUTES, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_DISPUTES_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [CREATE_DISPUTE] ({ state, commit, rootGetters }, job) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/jobs/files.json`,
        method: 'POST',
        token: rootGetters.token,
        data: job
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
  actions,
  mutations
}
