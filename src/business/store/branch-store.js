import {
  GET_BRANCHES, CREATE_BRANCH, SET_BRANCHES, SET_BRANCHES_STATE, DELETE_BRANCH, GET_CURRENT_BRANCH, SET_CURRENT_BRANCH
} from './branch-store-constants'
import { GET_BASE_URI } from '../../store/constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
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
  branches: state => state.branches.data,
  branchesState: state => state.branches.state
}

// mutations
const mutations = {
  [SET_BRANCHES] (state, payload) {
    state.branches.state = 'DATA'
    state.branches.data = payload
  },
  [SET_BRANCHES_STATE] (state, data) {
    state.branches.state = data
  }
}

// actions
const actions = {
  [GET_BRANCHES] ({ state, commit, rootGetters }, {page = 1, cache = true} = {}) {
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
          commit(SET_BRANCHES_STATE, 'DATA')
          commit(SET_BRANCHES, response.data.response.data.branches)
          resolve(response)
        }).catch((error) => {
          commit(SET_BRANCHES_STATE, 'ERROR')
          reject(error)
        })
      })
    }
  },
  [CREATE_BRANCH] ({ state, commit, rootGetters }, branch) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/branch.json`,
        method: 'POST',
        token: rootGetters.token,
        data: branch
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [DELETE_BRANCH] ({ rootGetters }, code) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/branch.json?branch_code=${code}`,
        method: 'DELETE',
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch(error => {
        reject(error)
        return error
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
