import { GET_FIELDS, SET_FIELDS, SET_DOWNLOAD_LINK, SET_FIELDS_STATE,
  GET_BASE_URI, SUBMIT_REPORT, DOWNLOAD_REPORT, GET_REPORT } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'

// state
const state = {
  fields: {
    data: [],
    state: 'DATA'
  },
  link: '',
  job_id: null
}

// getters
const getters = {
  fields: state => state.fields.data,
  downloadLink: state => state.link
}

// mutations
const mutations = {
  [SET_FIELDS] (state, payload) {
    state.fields.data = payload
  },
  [SET_FIELDS_STATE] (state, payload) {
    state.fields.state = payload
  },
  [SET_DOWNLOAD_LINK] (state, payload) {
    state.link = payload
  }
}

// actions
const actions = {
  [GET_FIELDS] ({ state, commit, rootGetters }, cache = true) {
    commit(SET_FIELDS_STATE, 'LOADING')
    if (cache && state.fields.data.length !== 0) {
      commit(SET_FIELDS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v1/clients/reports/fields`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_FIELDS_STATE, 'DATA')
          commit(SET_FIELDS, response.data.response.data.fields)
          resolve(response)
        }).catch((error) => {
          commit(SET_FIELDS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SUBMIT_REPORT] ({ state, commit, rootGetters, dispatch }, report) {
    commit(SET_FIELDS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/reports/custom?${report}`,
        method: 'POST',
        token: rootGetters.token
      }).then((response) => {
        if (response.data.success) {
          state.job_id = response.data.response.data.job_id
          dispatch(GET_REPORT, state.job_id)
            .then((response) => {
              console.log('resolved', response)
              resolve(response)
            }).catch((error) => {
              reject(error)
            })
        }
      }).catch((error) => {
        commit(SET_FIELDS_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [GET_REPORT] ({ state, commit, rootGetters, dispatch }, jobId = state.job_id) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/reports/${jobId}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        if (response.data.response.data.done) {
          commit(SET_DOWNLOAD_LINK, response.data.response.data.file_name)
          resolve(response)
        } else {
          reject(response)
          setTimeout(() => {
            dispatch(GET_REPORT, jobId)
          }, 5000)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  [DOWNLOAD_REPORT] ({ state, commit, rootGetters }, report = state.link) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/reports/download?file_name=${report}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        // state.link =
        resolve(response)
      }).catch((error) => {
        commit(SET_FIELDS_STATE, 'ERROR')
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
