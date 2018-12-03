import { PAYOUT_CREATE, SET_PAYOUTS_META, SET_PAYOUTS_FILTERS,
  PAYOUTS_FETCH,
  SET_PAYOUTS_STATE,
  SET_PAYOUTS,
  GET_BASE_URI } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// const url = localStorage.getItem('isAdmin') === true ? 'v2/accounts/transactions' : 'v2/transactions.json'

// var url = ''
// if (localStorage.getItem('isAdmin') === true) {
//   url = 'v2/accounts/transactions'
// } else {
//   url = 'v2/transactions.json'
// }

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
    //   url
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'

    // filters
    var filters = state.payouts.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?all=true&search_value=cashin&page=${page}&limit=12`
    } else {
      filters.search_value = 'cashin'
      query = Utils.createQueryParams(filters, page)
    }
    console.log('is admin', rootGetters.isAdmin)
    console.log('url', url)
    commit(SET_PAYOUTS_STATE, 'LOADING')
    commit(SET_PAYOUTS_FILTERS, filters)
    if (cache && state.payouts.data.length !== 0) {
      commit(SET_PAYOUTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
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
        url: `${GET_BASE_URI}/v1/transfer.json`,
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
