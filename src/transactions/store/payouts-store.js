import { PAYOUT_CREATE, SET_PAYOUTS_META, SET_PAYOUTS_FILTERS,
  PAYOUTS_FETCH,
  SET_PAYOUTS_STATE,
  SET_PAYOUTS,
  GET_TRANSACTIONS_URI } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  payouts: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {},
    sortParams: {param: 'updated_at', order: 'DESC'}
  },
  currentTransaction: {
    data: {},
    state: 'LOADING'
  }
}

// getters
const getters = {
  payouts: state => state.payouts.data,
  payoutsFilters: state => state.payouts.filters,
  payoutsMeta: state => state.payouts.meta,
  payoutsSortParams: state => state.payouts.sortParams,
  payoutsState: state => state.payouts.state
//   currentTransaction: state => state.currentTransaction.data
}

// mutations
const mutations = {
  [SET_PAYOUTS] (state, payload) {
    state.payouts.state = 'DATA'
    state.payouts.data = payload
  },
  [SET_PAYOUTS_STATE] (state, data) {
    state.payouts.state = data
  },
  [SET_PAYOUTS_META] (state, data) {
    var meta = {
      totalCount: data.total_transactions,
      limit: data.limit,
      page: data.page,
      trans: data.total_page_transactions
    }
    state.payouts.meta = meta
  },
  [SET_PAYOUTS_FILTERS] (state, data) {
    state.payouts.filters = data
  }
}

// actions
const actions = {
  [PAYOUTS_FETCH] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    var filters = state.payouts.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?all=true&search_value=cashin&page=${page}&limit=10`
    } else {
      filters.search_value = 'cashin'
      query = Utils.createQueryParams(filters, page)
    }
    commit(SET_PAYOUTS_STATE, 'LOADING')
    commit(SET_PAYOUTS_FILTERS, filters)
    if (cache && state.payouts.data.length !== 0) {
      commit(SET_PAYOUTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_TRANSACTIONS_URI}${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('payouts', response)
          commit(SET_PAYOUTS_STATE, 'DATA')
          commit(SET_PAYOUTS_META, response.data.response.data)
          commit(SET_PAYOUTS, response.data.response.data.transactions)
          resolve()
        }).catch((error) => {
          commit(SET_PAYOUTS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_PAYOUTS_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_PAYOUTS_FILTERS, filters)
    dispatch('getPayouts', {page: 1, cache: false})
  },
  [PAYOUT_CREATE] ({commit, state, rootGetters}, transaction) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `https://api.flopay.io/v1/transfer.json`,
        method: 'POST',
        data: transaction,
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log('ERROR', error)
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
