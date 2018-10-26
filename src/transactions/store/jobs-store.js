import { GET_JOBS, SET_JOBS_STATE, GET_JOBS_URI, SET_JOBS, CREATE_JOB } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
// import Utils from '../utils/Utils'

// state
const state = {
  jobs: {
    data: [],
    state: 'LOADING',
    count: 0
  }
}

// getters
const getters = {
  jobs: state => state.jobs.data,
  jobsState: state => state.jobs.state,
  jobsCount: state => state.jobs.count
}

// mutations
const mutations = {
  [SET_JOBS] (state, payload) {
    state.jobs.state = 'DATA'
    state.jobs.data = payload
  },
  [SET_JOBS_STATE] (state, data) {
    state.jobs.state = data
  }
}

// actions
const actions = {
  [GET_JOBS] ({ state, commit, rootGetters }, page = 1) {
    commit(SET_JOBS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_JOBS_URI}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        console.log('jobs', response.data)
        commit(SET_JOBS_STATE, 'DATA')
        commit(SET_JOBS, response.data.response.data.jobs)
        resolve()
      }).catch((error) => {
        commit(SET_JOBS_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [CREATE_JOB] ({ state, commit, rootGetters }, job) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_JOBS_URI}`,
        method: 'POST',
        token: rootGetters.token,
        data: job
      }).then((response) => {
        resolve()
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
