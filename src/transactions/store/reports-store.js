import { GET_FIELDS, SET_FIELDS, SET_FIELDS_STATE } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  fields: {
    data: [],
    state: 'DATA'
  }
}

// getters
const getters = {
  fields: state => state.fields.data
}

// mutations
const mutations = {
  [SET_FIELDS] (state, payload) {
    state.fields.data = payload
  },
  [SET_FIELDS_STATE] (state, payload) {
    state.fields.state = payload
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
          url: `https://api.flopay.io/v1/clients/reports/fields`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('payouts', response)
          commit(SET_FIELDS_STATE, 'DATA')
          commit(SET_FIELDS, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_FIELDS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
