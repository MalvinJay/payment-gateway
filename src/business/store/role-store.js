import {
  ROLES_FETCH, SET_ROLES, SET_ROLES_STATE, SET_ROLES_META, SET_ROLES_FILTERS,FETCH_PRIVILEGES,SET_PRIVILEGES, SET_PRIVILEGES_STATE
} from './role-store-constants'
import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  roles: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {},
    sortParams: {param: 'updated_at', order: 'DESC'}
  },
  currentRole: {
    data: {},
    state: 'LOADING'
  },
  privileges: {
    data: [],
    state: 'LOADING',
  }
}

// getters
const getters = {
  roles: state => state.roles.data,
  rolesFilters: state => state.roles.filters,
  rolesMeta: state => state.roles.meta,
  rolesSortParams: state => state.roles.sortParams,
  rolesState: state => state.roles.state,
  privileges: state => state.privileges.data
}

// mutations
const mutations = {
  [SET_ROLES] (state, payload) {
    state.roles.state = 'DATA'
    state.roles.data = payload
  },
  [SET_ROLES_STATE] (state, data) {
    state.roles.state = data
  },
  [SET_ROLES_META] (state, data) {
    var meta = {
      totalCount: data.total_transactions,
      limit: data.limit,
      page: data.page,
      roles: data.total_page_transactions
    }
    state.roles.meta = meta
  },
  [SET_ROLES_FILTERS] (state, data) {
    state.roles.filters = data
  },
  [SET_PRIVILEGES] (state, payload) {
    state.privileges.state = 'DATA'
    state.privileges.data = payload
  },  
  [SET_PRIVILEGES_STATE] (state, data) {
    state.privileges.state = data
  },  
}

// actions
const actions = {
  [ROLES_FETCH] ({ state, commit, rootGetters }, {page = 1,cache = true} = {}) {
    var filters = state.roles.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?all=true&page=${page}&limit=12`
    } else {
      query = Utils.createQueryParams(filters, page)
    }
    commit(SET_ROLES_STATE, 'LOADING')
    commit(SET_ROLES_FILTERS, filters)
    if (cache && state.roles.data.length !== 0) {
      commit(SET_ROLES_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/user_groups/all.json${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('Roles', response)
          commit(SET_ROLES_STATE, 'DATA')
          commit(SET_ROLES_META, response.data.response.data)
          commit(SET_ROLES, response.data.response.data.user_groups)
          resolve(response)
        }).catch((error) => {
          commit(SET_ROLES_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [FETCH_PRIVILEGES] ({ state, commit, rootGetters }, {page = 1, cache = true} = {}) {
    commit(SET_PRIVILEGES_STATE, 'LOADING')
    if (cache && state.privileges.data.length !== 0) {
      commit(SET_PRIVILEGES_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/privileges`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('privileges for roles', response)
          commit(SET_PRIVILEGES_STATE, 'DATA')
          commit(SET_PRIVILEGES, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_PRIVILEGES_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_ROLES_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_ROLES_FILTERS, filters)
    dispatch('getroles', {page: 1, cache: false})
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}

