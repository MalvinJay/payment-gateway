import {
  TEAMS_FETCH, SET_TEAMS, SET_TEAMS_STATE, SET_TEAMS_META, SET_TEAMS_FILTERS, CREATE_USER, UPDATE_USER, DELETE_USER
} from './team-store-constants'
import { GET_BASE_URI } from '../../store/constants'
import { apiCall } from '../../store/apiCall'
// import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import Utils from '../../utils/services'

// state
const state = {
  teams: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {},
    sortParams: {param: 'updated_at', order: 'DESC'}
  },
  currentTeam: {
    data: {},
    state: 'LOADING'
  }
}

// getters
const getters = {
  teams: state => state.teams.data,
  teamsFilters: state => state.teams.filters,
  teamsMeta: state => state.teams.meta,
  teamsSortParams: state => state.teams.sortParams,
  teamsState: state => state.teams.state
}

// mutations
const mutations = {
  [SET_TEAMS] (state, payload) {
    state.teams.state = 'DATA'
    state.teams.data = payload
  },
  [SET_TEAMS_STATE] (state, data) {
    state.teams.state = data
  },
  [SET_TEAMS_META] (state, data) {
    var meta = {
      totalCount: data.total_transactions,
      limit: data.limit,
      page: data.page,
      teams: data.total_page_transactions
    }
    state.teams.meta = meta
  },
  [SET_TEAMS_FILTERS] (state, data) {
    state.teams.filters = data
  }
}

// actions
const actions = {
  [TEAMS_FETCH] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    var filters = state.teams.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?page=${page}&limit=12`
    } else {
      query = Utils.createQueryParams(filters, page)
    }
    commit(SET_TEAMS_STATE, 'LOADING')
    commit(SET_TEAMS_FILTERS, filters)
    if (cache && state.teams.data.length !== 0) {
      commit(SET_TEAMS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/users.json${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_TEAMS_STATE, 'DATA')
          commit(SET_TEAMS_META, response.data.response.data)

          if(Utils.present(response.data.response.data)){
            commit(SET_TEAMS, response.data.response.data.users)
          }
          resolve(response)
        }).catch((error) => {
          commit(SET_TEAMS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_TEAMS_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_TEAMS_FILTERS, filters)
    dispatch('getTeams', {page: 1, cache: false})
  },
  [CREATE_USER] ({ state, commit, rootGetters }, user) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/users/create_new.json`,
        method: 'POST',
        token: rootGetters.token,
        data: user
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [UPDATE_USER] ({ state, commit, rootGetters }, user) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/users/${user.user_id}.json`,
        method: 'PUT',
        token: rootGetters.token,
        data: user
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [DELETE_USER] ({ rootGetters }, msisdn) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/users.json?msisdn=${msisdn}`,
        method: 'DELETE',
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch(error => {
        reject(error)
        return error
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
