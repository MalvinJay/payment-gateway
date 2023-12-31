import { GET_DASHBOARD_GRAPH, GET_TODAY_GRAPH, SET_TODAY_GRAPH, SET_TODAY_FILTERS, SET_TODAY_GRAPH_STATE, SET_DASHBOARD_FILTERS, SET_DASHBOARD_GRAPH, SET_DASHBOARD_GRAPH_STATE, GET_DASHBOARD_URI } from './dashboard-store-constants'
import { GET_BASE_URI } from '../store/constants'
import { apiCall } from '../store/apiCall'
import Utils from '../utils/services'
import Dashboard from './models/Dashboard'

// const url = Utils.returnBool(localStorage.getItem('isAdmin')) ? 'v2/accounts/dashboard/graph.json' : 'v1/clients/dashboard/graph'
// console.log('admin steeze', Utils.returnBool(localStorage.getItem('isAdmin')))

// state
const state = {
  dashboard: {
    data: [],
    state: 'LOADING',
    filters: {}
  },
  today: {
    data: [],
    state: 'LOADING',
    sum: 0,
    filters: {}
  }
}

// getters
const getters = {
  dashboard: state => state.dashboard.data,
  dashboardState: state => state.dashboard.state,
  today: state => state.today.data,
  todayState: state => state.today.state,
  todaySum: state => state.today.sum,
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
  [SET_TODAY_GRAPH] (state, payload) {
    state.today.state = 'DATA'
    state.today.sum = Utils.sum(payload.map(el => el.count))
    var dash = Dashboard.getEditView(payload, 'day')
    state.today.data = dash
  },
  [SET_TODAY_GRAPH_STATE] (state, data) {
    state.today.state = data
  },
  [SET_TODAY_FILTERS] (state, data) {
    state.today.filters = data
  },
  [SET_DASHBOARD_FILTERS] (state, data) {
    state.dashboard.filters = data
  }
}

// actions
const actions = {
  [GET_DASHBOARD_GRAPH] ({ state, commit, rootGetters, rootState }, {
    cache = true
  } = {}) {
    var url = rootGetters.isAdmin ? 'v2/accounts/dashboard/graph.json' : 'v1/clients/dashboard/graph'
    var params = state.dashboard.filters
    var query = Utils.createQueryParams(params)
    commit(SET_DASHBOARD_GRAPH_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}${url}${query}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_DASHBOARD_GRAPH_STATE, 'DATA')
        rootState.user.pageLoading = false
        commit(SET_DASHBOARD_GRAPH, response.data.response.data)
        resolve(response)
      }).catch((error) => {
        commit(SET_DASHBOARD_GRAPH_STATE, 'ERROR')
        rootState.user.pageLoading = false
        console.log(error)
        console.log(error.headers)
        // fix this
        // if (error.status === 401) {
        //   this.$router.push('/login')
        // }
        reject(error)
      })
    })
  },
  [GET_TODAY_GRAPH] ({ state, commit, rootGetters, rootState }, {
    cache = true
  } = {}) {
    var url = rootGetters.isAdmin ? 'v2/accounts/dashboard/graph.json' : 'v1/clients/dashboard/graph'
    var params = state.today.filters
    var query = Utils.createDashboardDateQuery(params)
    commit(SET_TODAY_GRAPH_STATE, 'LOADING')
    if (cache && state.today.data.length !== 0) {
      commit(SET_TODAY_GRAPH_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_TODAY_GRAPH_STATE, 'DATA')
          rootState.user.pageLoading = false
          commit(SET_TODAY_GRAPH, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_TODAY_GRAPH_STATE, 'ERROR')
          console.log(error)
          console.log(error.headers)
          rootState.user.pageLoading = false
          // fix this
          // if (error.status === 401) {
          //   this.$router.push('/login')
          // }
          reject(error)
        })
      })
    }
  },
  [SET_TODAY_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_TODAY_FILTERS, filters)
    return new Promise((resolve, reject) => {
      dispatch('getTodayGraph', {cache: false})
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  [SET_DASHBOARD_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_DASHBOARD_FILTERS, filters)
    return new Promise((resolve, reject) => {
      dispatch('getDashboardGraph', {cache: false})
        .then((response) => {
          resolve(response)
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
