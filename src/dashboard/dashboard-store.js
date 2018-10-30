import { GET_DASHBOARD_GRAPH, SET_DASHBOARD_FILTERS, SET_DASHBOARD_GRAPH, SET_DASHBOARD_GRAPH_STATE, GET_DASHBOARD_URI } from './dashboard-store-constants'
import { apiCall } from '../store/apiCall'
import Utils from '../utils/Utils'
import Dashboard from './models/Dashboard'

// state
const state = {
  dashboard: {
    data: [],
    state: 'LOADING',
    filters: {}
  }
}

// getters
const getters = {
  dashboard: state => state.dashboard.data,
  dashboardState: state => state.dashboard.state,
  dashboardCount: state => state.dashboard.count
}

// mutations
const mutations = {
  [SET_DASHBOARD_GRAPH] (state, payload) {
    state.dashboard.state = 'DATA'
    var dash = Dashboard.getEditView(payload, state.dashboard.filters.time_interval)
    state.dashboard.data = dash
  },
  [SET_DASHBOARD_GRAPH_STATE] (state, data) {
    state.dashboard.state = data
  },
  [SET_DASHBOARD_FILTERS] (state, data) {
    state.dashboard.filters = data
  }
}

// actions
const actions = {
  [GET_DASHBOARD_GRAPH] ({ state, commit, rootGetters }, {
    cache = true
  } = {}) {
    var params = state.dashboard.filters
    var query = Utils.createQueryParams(params)
    commit(SET_DASHBOARD_GRAPH_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_DASHBOARD_URI}${query}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_DASHBOARD_GRAPH_STATE, 'DATA')
        commit(SET_DASHBOARD_GRAPH, response.data.response.data)
        resolve()
      }).catch((error) => {
        commit(SET_DASHBOARD_GRAPH_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [SET_DASHBOARD_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_DASHBOARD_FILTERS, filters)
    return new Promise((resolve, reject) => {
      dispatch('getDashboardGraph', {cache: false})
        .then(() => {
          resolve()
        }).catch((error) => {
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
