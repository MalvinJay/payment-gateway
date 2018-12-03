import {
  ROLES_FETCH, SET_ROLES, SET_ROLES_STATE, SET_ROLES_META, SET_ROLES_FILTERS,GET_BRANCHES,SET_BRANCHES,SET_BRANCHES_STATE,GET_CURRENT_BRANCH,SET_CURRENT_BRANCH
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
  branches: {
    data: [],
    state: 'DATA',
    errors: [],
    filters: {}
  },
  currentBranch: {
    data: {},
    state: 'LOADING'
  }
}

// getters
const getters = {
  roles: state => state.roles.data,
  rolesFilters: state => state.roles.filters,
  rolesMeta: state => state.roles.meta,
  rolesSortParams: state => state.roles.sortParams,
  rolesState: state => state.roles.state,
  branches: state => state.branches.data,
  branchesState: state => state.branches.state
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
  [SET_BRANCHES] (state, payload) {
    state.branches.state = 'DATA'
    state.branches.data = payload
  },
  [SET_BRANCHES_STATE] (state, data) {
    state.branches.state = data
  },
}

// actions
const actions = {
  [ROLES_FETCH] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
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
          console.log('transactions for roles', response)
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
  [SET_ROLES_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_ROLES_FILTERS, filters)
    dispatch('getroles', {page: 1, cache: false})
  },
  [GET_BRANCHES] ({ state, commit, rootGetters }, {page = 1,cache = true} = {}) {
    var filters = state.branches.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?all=true&page=${page}&limit=12`
    } else {
      query = Utils.createQueryParams(filters, page)
    }
    commit(SET_BRANCHES_STATE, 'LOADING')
    // commit(SET_BRANCHES_FILTERS, filters)
    if (cache && state.branches.data.length !== 0) {
      commit(SET_BRANCHES_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/branch.json${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('branches for roles', response)
          commit(SET_BRANCHES_STATE, 'DATA')
          commit(SET_BRANCHES, response.data.response.data.branches)
          resolve(response)
        }).catch((error) => {
          commit(SET_ROLES_STATE, 'ERROR')
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

