import { GET_BASE_URI } from '../../store/constants'
import { GET_FONE_MESSENGERS, CREATE_LOG, SET_FONE_MESSENGERS,
  SET_FONE_MESSENGERS_META,
  SET_FONE_FILTERS, SET_FONE_MESSENGERS_STATE, TOPUP_OVA
} from './fonemessenger-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'
import axios from 'axios'

// state
const state = {
  messages: {
    data: [],
    state: 'DATA',
    filters: {},
    count: 0,
    meta: {}
  }
}

// getters
const getters = {
  messages: state => state.messages.data,
  messagesState: state => state.messages.state,
  messagesCount: state => state.messages.count,
  messagesMeta: state => state.messages.meta,
}

// mutations
const mutations = {
  [SET_FONE_MESSENGERS] (state, payload) {
    state.messages.count = payload.total_page_logs
    state.messages.data = payload.logs
  },
  [SET_FONE_MESSENGERS_STATE] (state, payload) {
    state.messages.state = payload
  },
  [SET_FONE_FILTERS] (state, data) {
    state.messages.filters = data
  },
  [SET_FONE_MESSENGERS_META] (state, data) {
    var meta = {
      totalFiltered: data.total_filtered,
      limit: data.limit,
      page: data.page,
      total: data.total_records,
      messages: data.logs
    }
    state.messages.meta = meta
  },
}

// actions
const actions = {
  [GET_FONE_MESSENGERS] ({ state, commit, rootGetters }, { cache = true, page = 1, search_value = '' } = {}) {
    // filters
    var filters = state.messages.filters
    if(search_value) filters = { ...state.messages.filters, search_value: search_value}

    var query = ''

    if (Utils.empty(filters)) {
      query = `?page=${page}&limit=12`
    } else {
      query = Utils.createQueryParams(filters, page)
    }

    // state
    commit(SET_FONE_MESSENGERS_STATE, 'LOADING')
    commit(SET_FONE_FILTERS, filters)

    if (cache && state.messages.data.length !== 0) {
      commit(SET_FONE_MESSENGERS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/sms/logs${query}`,
          method: 'GET',
          token: rootGetters.token
        })
        .then((response) => {
          commit(SET_FONE_MESSENGERS_STATE, 'DATA')
          commit(SET_FONE_MESSENGERS, response.data.response.data)

          var meta = {
            total_filtered: response.data.response.data.total_filtered,
            limit: response.data.response.data.limit,
            page: response.data.response.data.page,
            total_records: response.data.response.data.total_records,
            logs: response.data.response.data.logs
          }

          commit(SET_FONE_MESSENGERS_META, meta)
          resolve(response)
        })
        .catch((error) => {
          commit(SET_FONE_MESSENGERS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_FONE_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    console.log('Filters:', filters)
    commit(SET_FONE_FILTERS, filters)
    dispatch('getFoneMessengers', {page: 1, cache: false})
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
