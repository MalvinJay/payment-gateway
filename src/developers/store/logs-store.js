import {
    LOGS_FETCH,
    SET_LOGS,
    SET_LOGS_STATE,
    SET_LOGS_META,
    SET_LOGS_FILTERS,
    GET_CURRENT_LOG,
    SET_CURRENT_LOG,
    SET_CURRENT_LOGS_STATE,
    GET_LOGS_URI
  } from './logs-store-constants'
  import { apiCall } from '../../store/apiCall'
  import Utils from '../../utils/services'
  
  // state
  const state = {
    logs: {
      data: [],
      meta: {page: 1},
      errors: [],
      state: 'DATA',
      filters: {},
      sortParams: { param: 'updated_at', order: 'DESC' }
    },
    currentLog: {
      data: {},
      state: 'LOADING'
    }
  }
  
  // getters
  const getters = {
    logs: state => state.logs.data,
    logsFilters: state => state.logs.filters,
    logsMeta: state => state.logs.meta,
    logsSortParams: state => state.logs.sortParams,
    logsState: state => state.logs.state,
    currentLog: state => state.currentLog.data,
    currentLogState: state => state.currentLog.state,    
  }
  
  // mutations
  const mutations = {
    [SET_LOGS] (state, payload) {
      state.logs.state = 'DATA'
      state.logs.data = payload
    },
    [SET_LOGS_STATE] (state, data) {
      state.logs.state = data
    },
    [SET_LOGS_META] (state, data) {
      var meta = {
        totalCount: data.length,
        limit: data.limit,
        page: data.page,
        logs: data
      }
      state.logs.meta = meta
    },
    [SET_LOGS_FILTERS] (state, data) {
      state.logs.filters = data
    },
    [SET_CURRENT_LOG] (state, data) {
      state.currentLog.data = data
    },
    [SET_CURRENT_LOGS_STATE] (state, data) {
      state.currentLog.state = data
    }    
  }
  
  // actions
  const actions = {
    [LOGS_FETCH] ({ state, commit, rootGetters }, {
      page = 1,
      cache = true
    } = {}) {
      var filters = state.logs.filters
      var query = ''
      
      if (Utils.empty(filters)) {
        query = `?page=${page}&limit=20`
      } else {
        query = Utils.createQueryParams(filters, page)
      }
      commit(SET_LOGS_STATE, 'LOADING')
      commit(SET_LOGS_FILTERS, filters)
      if (cache && state.logs.data.length !== 0) {
        commit(SET_LOGS_STATE, 'DATA')
      } else {
        return new Promise((resolve, reject) => {
          apiCall({
            url: `${GET_LOGS_URI}${query}`,
            method: 'GET',
            token: rootGetters.token
          }).then((response) => {
            // console.log('logs', response)
            commit(SET_LOGS_STATE, 'DATA')
            commit(SET_LOGS_META, response.data)
            commit(SET_LOGS, response.data)
            resolve(response)
          }).catch((error) => {
            commit(SET_LOGS_STATE, 'ERROR')
            console.log(error)
            reject(error)
          })
        })
      }
    },
    [SET_LOGS_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
      commit(SET_LOGS_FILTERS, filters)
      dispatch('getlogs', {page: 1, cache: false})
    },
    [GET_CURRENT_LOG] ({ state, commit, rootGetters }, id) {
      var query = ''
      query = `?id=${id}`
      commit(SET_CURRENT_LOGS_STATE, 'LOADING')
      return new Promise((resolve, reject) => {
        apiCall({
          url: `https://api.flopay.io/v1/accounts/logs${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          // console.log('Single Log', response)
          commit(SET_CURRENT_LOGS_STATE, 'DATA')
          commit(SET_CURRENT_LOG, response.data)
          resolve()
        }).catch((error) => {
          commit(SET_CURRENT_LOGS_STATE, 'ERROR')
          console.log('Single Log', error)
          reject(error)
        })
      })
    },    
  }
  
  export default {
    state,
    getters,
    mutations,
    actions
  }
  