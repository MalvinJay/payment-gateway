import { GET_BASE_URI } from '../../store/constants'
import { GET_USSD, SET_USSD,
  SET_USSD_STATE} from './ussd-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  ussd: {
    data: [],
    state: 'LOADING',
    count: 0
  }
}

// getters
const getters = {
  ussd: state => state.ussd.data,
  ussdState: state => state.ussd.state,
  ussdCount: state => state.ussd.count
}

// mutations
const mutations = {
  [SET_USSD] (state, payload) {
    state.ussd.count = payload.total_page_logs
    state.ussd.data = payload.logs
  },
  [SET_USSD_STATE] (state, payload) {
    state.ussd.state = payload
  }
}

// actions
const actions = {
  [GET_USSD] ({ state, commit, rootGetters }, { cache = true, page = 1 } = {}) {
    commit(SET_USSD_STATE, 'LOADING')
    if (cache && state.ussd.data.length !== 0) {
      commit(SET_USSD_STATE, 'DATA')
    } else {
      var filters = {}
      var query = Utils.createQueryParams(filters, page)
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/sms/logs${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_USSD_STATE, 'DATA')
          commit(SET_USSD, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_USSD_STATE, 'ERROR')
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
