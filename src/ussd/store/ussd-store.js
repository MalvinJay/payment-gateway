import { GET_BASE_URI } from '../../store/constants'
import { GET_USSD_SESSIONS, SET_USSD_SESSIONS, SET_USSD_SESSIONS_STATE, CREATE_USSD_REPORT,
  SET_CURRENT_USSD_SESSION, SET_CURRENT_USSD_SESSION_STATE, GET_CURRENT_USSD_SESSION } from './ussd-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'
import axios from 'axios'

// state
const state = {
  ussds: {
    data: [],
    state: 'LOADING',
    count: 0
  },
  currentUssd: {
    data: {},
    state: 'LOADING'
  }
}

// getters
const getters = {
  ussdSessions: state => state.ussds.data,
  ussdSessionsState: state => state.ussds.state,
  ussdSessionsCount: state => state.ussds.count,
  currentUssdSession: state => state.currentUssd.data
}

// mutations
const mutations = {
  [SET_USSD_SESSIONS] (state, payload) {
    if (payload) {
      var exams = ['BECE', 'WASSCE']
      var status = ['paid', 'failed']
      var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
      var ussd = payload.map(ussd => {
        var rand = Math.floor(Math.random() * 2)
        var yRand = Math.floor(Math.random() * 10)
        var sRand = Math.floor(Math.random() * 2)
        ussd.exam_type = exams[rand]
        ussd.year = years[yRand]
        ussd.index_no = Math.floor(Math.random() * 9999999999)
        ussd.status = status[sRand]
        return ussd
      })
    }
    state.ussds.data = ussd
    state.ussds.count = payload.length
  },
  [SET_USSD_SESSIONS_STATE] (state, payload) {
    state.ussds.state = payload
  },
  [SET_CURRENT_USSD_SESSION] (state, payload) {
    state.currentUssd.data = payload
  },
  [SET_CURRENT_USSD_SESSION_STATE] (state, data) {
    state.currentUssd.state = data
  }
}

// actions
const actions = {
  [GET_USSD_SESSIONS] ({ state, commit, rootGetters }, { cache = true, page = 1 } = {}) {
    commit(SET_USSD_SESSIONS_STATE, 'LOADING')
    if (cache && state.ussds.data.length !== 0) {
      commit(SET_USSD_SESSIONS_STATE, 'DATA')
    } else {
      var filters = {}
      // var query = Utils.createQueryParams(filters, page)
      return new Promise((resolve, reject) => {
        axios.get(
          // `https://3faa62d9.ngrok.io/v1/query/ussd-logs-status`,
          `https://ussd-log-status.nfortics.com/v1/query/ussd-logs-status`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*/*'
            }
          }
        ).then((response) => {
          commit(SET_USSD_SESSIONS_STATE, 'DATA')
          commit(SET_USSD_SESSIONS, response.data.filtered_records)
          resolve(response)
        }).catch((error) => {
          commit(SET_USSD_SESSIONS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [CREATE_USSD_REPORT] ({ rootGetters }, log) {
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
  [GET_CURRENT_USSD_SESSION] ({ state, commit, rootGetters }, sessionId) {
    var query = ''
    commit(SET_USSD_SESSIONS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      axios.get(
        // `https://3faa62d9.ngrok.io/v1/query/ussd-logs-status?session_id=${sessionId}`,
        `https://ussd-log-status.nfortics.com/v1/query/ussd-logs-status?session_id=${sessionId}`
      ).then((response) => {
        let arrayData = []
        response.data.map((el) => {
          arrayData.push(el)
        })
        if (response.data) { commit(SET_CURRENT_USSD_SESSION, arrayData) }

        state.currentUssd.data = arrayData

        commit(SET_USSD_SESSIONS_STATE, 'DATA')
        resolve(response)
      }).catch((error) => {
        commit(SET_USSD_SESSIONS_STATE, 'ERROR')
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
