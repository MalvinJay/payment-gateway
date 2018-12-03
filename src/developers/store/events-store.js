import {
    EVENTS_FETCH, SET_EVENTS, SET_EVENTS_STATE, SET_EVENTS_META, SET_EVENTS_FILTERS, GET_CURRENT_EVENT, SET_CURRENT_EVENT, SET_CURRENT_EVENTS_STATE 
} from './events-store-constants'
import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
    events: {
        data: [],
        meta: {page: 1},
        error: [],
        state: 'DATA',
        filters: {},
        sortParams: { param: 'updated_at', order: 'DESC' }
    },
    currentEvent: {
        data: {},
        state: 'LOADING'
    }
}

// getters
const getters = {
    events: state => state.events.data,
    eventsFilters: state => state.events.filters,
    eventsMeta: state => state.events.meta,
    eventsSortParams: state => state.events.sortParams,
    eventsState: state => state.events.state,
    currentEvent: state => state.currentEvent.data,
    currentEventState: state => state.currentEvent.state
}

// mutations
const mutations = {
    [SET_EVENTS] (state, payload) {
        state.events.state = 'DATA'
        state.events.data = payload
    },
    [SET_EVENTS_STATE] (state, data) {
        state.events.state = data
    },
    [SET_EVENTS_META] (state, data) {
        var meta = {
            totalCount: data.length,
            limit: data.limit,
            page: data.page,
            events: data
        }
        state.events.meta = meta
    },
    [SET_EVENTS_FILTERS] (state, data) {
        state.events.filters = data
    },
    [SET_CURRENT_EVENT] (state, data) {
        state.currentEvent.data = data
    },
    [SET_CURRENT_EVENTS_STATE] (state, data) {
        state.currentEvent.state = data
    }
}

// actions
const actions = {
    [EVENTS_FETCH] ({state, commit, rootGetters}, {
        page = 1,
        cache = true
    } = {}) {
        var filters = state.events.filters
        var query = ''

        if(Utils.empty(filters)) {
            query = `?page=${page}&limit=20`
        } else {
            query = Utils.createQueryParams(filters, page)
        }
        commit(SET_EVENTS_STATE, 'LOADING')
        commit(SET_EVENTS_FILTERS, filters)
        if(cache && state.events.data.length != 0) {
            commit(SET_EVENTS_STATE, 'DATA')
        } else {
            return new Promise((resolve, reject) => {
                apiCall({
                    url: `${GET_BASE_URI}v1/accounts/logs.json${query}`,
                    method: 'GET',
                    token: rootGetters.token
                }).then((response) => {
                    commit(SET_EVENTS_STATE, 'DATA')
                    commit(SET_EVENTS_META, response.data)
                    commit(SET_EVENTS, response.data)
                resolve(response)
                }).catch((error) => {
                    commit(SET_EVENTS_STATE, 'ERROR')
                    reject(error)
                })
            })
        }
    },
    [SET_EVENTS_FILTERS] ({state, dispatch}, filters) {
        commit(SET_EVENTS_FILTERS, filters)
        dispatch('getEvents', {page: 1, cache: false})
    },
    [GET_CURRENT_EVENT] ({ commit, rootGetters }, id) {
        var query = ''
        query = `?id=${id}`
        commit(SET_CURRENT_EVENTS_STATE, 'LOADING')
        return new Promise((resolve, reject) => {
          apiCall({
            url: `${GET_BASE_URI}v1/accounts/logs.json${query}`,
            method: 'GET',
            token: rootGetters.token
          }).then((response) => {
            console.log('Single Event', response.data)
            commit(SET_CURRENT_EVENTS_STATE, 'DATA')
            commit(SET_CURRENT_EVENT, response.data)
            resolve()
          }).catch((error) => {
            commit(SET_CURRENT_EVENTS_STATE, 'ERROR')
            console.log('Single Event Error', error)
            reject(error)
          })
        })
    },
}

export default {
    state, 
    getters, 
    mutations,
    actions
}
