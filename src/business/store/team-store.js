import {
  TEAMS_FETCH,
  SET_TEAMS,
  SET_TEAMS_STATE,
  SET_TEAMS_META,
  SET_TEAMS_FILTERS,
  GET_TEAMS_URI
} from './team-store-constants'
import { apiCall } from '../../store/apiCall'
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
      query = `?all=true&page=${page}&limit=12`
    } else {
      // filters.search_value = 'cashin'
      query = Utils.createQueryParams(filters, page)
    }
    commit(SET_TEAMS_STATE, 'LOADING')
    commit(SET_TEAMS_FILTERS, filters)
    if (cache && state.teams.data.length !== 0) {
      commit(SET_TEAMS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_TEAMS_URI}${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('transactions for teams', response)
          commit(SET_TEAMS_STATE, 'DATA')
          commit(SET_TEAMS_META, response.data.response.data)
          commit(SET_TEAMS, response.data.response.data.users)
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
    dispatch('getteams', {page: 1, cache: false})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
