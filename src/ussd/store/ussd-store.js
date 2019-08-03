import { GET_BASE_URI } from '../../store/constants'
import { GET_USSD_SESSIONS, SET_USSD_SESSIONS, SET_USSD_SESSIONS_STATE, SET_USSD_META, CREATE_USSD_REPORT,
  SET_CURRENT_USSD_SESSION, SET_CURRENT_USSD_SESSION_STATE, GET_CURRENT_USSD_SESSION,
  GET_CURRENT_USSD_SESSION_PAYMENT, SET_CURRENT_USSD_SESSION_PAYMENT, SET_USSD_FILTERS } from './ussd-store-constants'
import { apiCall } from '../../store/apiCall'
import { ctrlCall } from '../../store/ctrlCall'
import Utils from '../../utils/services'
import axios from 'axios'

// state
const state = {
  ussds: {
    data: [],
    meta: { page: 1 },
    state: 'LOADING',
    count: 0,
    filters: {}
  },
  currentUssd: {
    data: [],
    payment: [],
    state: 'LOADING'
  }
}

// getters
const getters = {
  ussdSessions: state => state.ussds.data,
  ussdSessionsState: state => state.ussds.state,
  ussdSessionsMeta: state => state.ussds.meta,
  ussdSessionsCount: state => state.ussds.count,
  currentUssdSession: state => state.currentUssd.data,
  currentUssdSessionPayment: state => state.currentUssd.payment,
  ussdSessionsFilters: state => state.ussds.filters,
}

// mutations
const mutations = {
  [SET_USSD_SESSIONS] (state, payload) {

    // if (payload) {
    //   var exams = ['BECE', 'WASSCE']
    //   var status = ['paid', 'failed']
    //   var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
    //   var ussd = payload.map(ussd => {
    //     var rand = Math.floor(Math.random() * 2)
    //     var yRand = Math.floor(Math.random() * 10)
    //     var sRand = Math.floor(Math.random() * 2)
    //     ussd.exam_type = exams[rand]
    //     ussd.year = years[yRand]
    //     ussd.index_no = Math.floor(Math.random() * 9999999999)
    //     ussd.status = status[sRand]
    //     return ussd
    //   })
    // }

    state.ussds.data = payload
    state.ussds.count = payload.length
  },
  [SET_USSD_SESSIONS_STATE] (state, payload) {
    state.ussds.state = payload
  },
  [SET_USSD_META] (state, data) {
    var meta = {
      totalFiltered: data.filtered_total,
      limit: data.page_limit,
      page: data.page,
      total: data.total,
      ussds: data.filtered_records
    }
    state.ussds.meta = meta
  },
  [SET_CURRENT_USSD_SESSION] (state, payload) {
    state.currentUssd.data = payload
  },
  [SET_CURRENT_USSD_SESSION_PAYMENT] (state, payload) {
    state.currentUssd.payment = payload
  },
  [SET_CURRENT_USSD_SESSION_STATE] (state, data) {
    state.currentUssd.state = data
  },
  [SET_USSD_FILTERS] (state, data) {
    state.ussds.filters = data
  },
}

// actions
const actions = {
  [GET_USSD_SESSIONS] ({ state, commit, rootGetters }, { cache = true, page = 1 } = {}) {
    var filters = state.ussds.filters
    var query = ''

    if (Utils.empty(filters)) {
      query = `?page=${page}&limit=25`
    } else {
      if(filters.from && filters.to)
      query = query + `?page=${page}&start_date=${filters.from}&end_date=${filters.to}`
    }

    commit(SET_USSD_SESSIONS_STATE, 'LOADING')
    commit(SET_USSD_FILTERS, filters)

    if (cache && state.ussds.data.length !== 0) {
      commit(SET_USSD_SESSIONS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        axios.get(
          // `https://2dae1380.ngrok.io/v1/query/ussd-logs-status${query}`,
          `https://ussd-log-status.nfortics.com/v1/query/ussd-logs-status${query}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*/*'
            }
          }
        ).then((response) => {
          commit(SET_USSD_SESSIONS_STATE, 'DATA')
          let PreferredArray = []
          response.data.filtered_records.map(ussd => {
            let common = ussd.transaction.response.data
            if(Utils.present(common)) {
              if(rootGetters.user.client.code === common.till) {
                let type = common.extra_data.type

                if(type === 'BECE') {
                  common.extra_data.type = 'BECE(School)';
                }

                if(type === 'PBEC') {
                  common.extra_data.type = 'BECE(Private)';
                }

                PreferredArray.push(ussd)
              }
            }
          })

          commit(SET_USSD_SESSIONS, PreferredArray)

          var meta = {
            filtered_total: PreferredArray.length,
            page_limit: response.data.page_limit,
            page: response.data.page,
            total: response.data.total,
            filtered_records: response.data.filtered_records
          }

          commit(SET_USSD_META, meta)

          resolve(response)
        }).catch((error) => {
          commit(SET_USSD_SESSIONS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_USSD_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_USSD_FILTERS, filters)
    dispatch('getUssdSessions', {page: 1, cache: false})
  },
  [GET_CURRENT_USSD_SESSION_PAYMENT] ({ state, commit, rootGetters }, sessionId) {
    commit(SET_USSD_SESSIONS_STATE, 'LOADING')
      return new Promise((resolve, reject) => {
        ctrlCall({
          url: `${GET_BASE_URI}v1/rekt_transacts/${sessionId}`,
          method: 'GET',
          token: rootGetters.token,
        })
        .then((response) => {
          commit(SET_USSD_SESSIONS_STATE, 'DATA')
          commit(SET_CURRENT_USSD_SESSION_PAYMENT, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          commit(SET_USSD_SESSIONS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
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
          `https://ussd-log-status.nfortics.com/v1/query/ussd-logs-status?session_id=${sessionId}`,
      )
      .then((response) => {
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
