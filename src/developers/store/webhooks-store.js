import {
  HOOKS_FETCH, SET_HOOKS, SET_HOOKS_STATE, SET_HOOKS_META, SET_HOOKS_FILTERS, GET_CURRENT_HOOK, SET_CURRENT_HOOK, SET_CURRENT_HOOKS_STATE
} from './webhooks-store-constants'
import { GET_BASE_URI } from '../../store/constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  hooks: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {},
    sortParams: { param: 'updated_at', order: 'DESC' }
  },
  currentHook: {
    data: {},
    state: 'LOADING'
  }
}

// getters
const getters = {
  hooks: state => state.hooks.data,
  hooksFilters: state => state.hooks.filters,
  hooksMeta: state => state.hooks.meta,
  hooksSortParams: state => state.hooks.sortParams,
  hooksState: state => state.hooks.state
  // currenthook: state => state.currenthook.data,
  // currenthookState: state => state.currenthook.state,
}

// mutations
const mutations = {
  [SET_HOOKS] (state, payload) {
    state.hooks.state = 'DATA'
    state.hooks.data = payload
  },
  [SET_HOOKS_STATE] (state, data) {
    state.hooks.state = data
  },
  [SET_HOOKS_META] (state, data) {
    var meta = {
      totalCount: data.length,
      limit: data.limit,
      page: data.page,
      hooks: data
    }
    state.hooks.meta = meta
  },
  [SET_HOOKS_FILTERS] (state, data) {
    state.hooks.filters = data
  },
  [SET_CURRENT_HOOK] (state, data) {
    state.currentHook.data = data
  },
  [SET_CURRENT_HOOKS_STATE] (state, data) {
    state.currentHook.state = data
  }
}

// actions
const actions = {
  [HOOKS_FETCH] ({ state, commit, rootGetters }, {page = 1, cache = true} = {}) {
    var filters = state.hooks.filters
    var query = ''

    if (Utils.empty(filters)) {
      query = `?page=${page}&limit=20`
    } else {
      query = Utils.createQueryParams(filters, page)
    }
    commit(SET_HOOKS_STATE, 'LOADING')
    commit(SET_HOOKS_FILTERS, filters)
    if (cache && state.hooks.data.length !== 0) {
      commit(SET_HOOKS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/webhooks${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_HOOKS_STATE, 'DATA')
          commit(SET_HOOKS_META, response.data)
          commit(SET_HOOKS, response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_HOOKS_STATE, 'ERROR')
          reject(error)
        })
      })
    }
  },
  [SET_HOOKS_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_HOOKS_FILTERS, filters)
    dispatch('gethooks', {page: 1, cache: false})
  },
  [GET_CURRENT_HOOK] ({ state, commit, rootGetters }, items) {
    var query = ''
    query = `?test_callbackurl=${items[0]}&production_callbackurl=${items[1]}`
    commit(SET_CURRENT_HOOKS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/profile${query}`,
        method: 'POST',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_CURRENT_HOOK, response.data)
        commit(SET_CURRENT_HOOKS_STATE, 'DATA')
        resolve(response)
      }).catch((error) => {
        commit(SET_CURRENT_HOOKS_STATE, 'ERROR')
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
