import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { GET_FONE_MESSENGERS, CREATE_LOG, SET_FONE_MESSENGERS,
  SET_FONE_MESSENGERS_STATE, TOPUP_OVA } from './fonemessenger-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  messages: {
    data: [],
    state: 'LOADING',
    count: 0
  }
}

// getters
const getters = {
  messages: state => state.messages.data,
  messagesState: state => state.messages.state,
  messagesCount: state => state.messages.count
}

// mutations
const mutations = {
  [SET_FONE_MESSENGERS] (state, payload) {
    state.messages.count = payload.total_page_logs
    state.messages.data = payload.logs
  },
  [SET_FONE_MESSENGERS_STATE] (state, payload) {
    state.messages.state = payload
  }
}

// actions
const actions = {
  [GET_FONE_MESSENGERS] ({ state, commit, rootGetters }, { cache = true, page = 1 } = {}) {
    commit(SET_FONE_MESSENGERS_STATE, 'LOADING')
    if (cache && state.messages.data.length !== 0) {
      commit(SET_FONE_MESSENGERS_STATE, 'DATA')
    } else {
      var filters = {}
      var query = Utils.createQueryParams(filters, page)
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/sms/logs${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_FONE_MESSENGERS_STATE, 'DATA')
          commit(SET_FONE_MESSENGERS, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_FONE_MESSENGERS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [CREATE_LOG] ({ rootGetters }, log) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/sms/sender`,
        method: 'POST',
        token: rootGetters.token,
        data: log
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [TOPUP_OVA] ({ rootGetters }, { url, ova }) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}${url}`,
        method: 'POST',
        token: rootGetters.token,
        data: ova
      }).then((response) => {
        resolve(response)
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
