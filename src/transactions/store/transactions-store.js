import { TRANSACTION_CREATE, SET_TRANSACTIONS_META, SET_TRANSACTIONS_FILTERS, SEARCH_TRANSACTIONS,
  TRANSACTIONS_FETCH, SET_CURRENT_TRANSACTION_STATE, GET_BASE_URI,
  SET_TRANSACTIONS_STATE, GET_QUEUE, SET_QUEUE, SET_QUEUE_STATE, SET_QUEUE_FILTERS, SET_QUEUE_META, SET_CURRENT_TRANSACTION,
  SET_TRANSACTIONS, GET_PENDING, SET_PENDING, SET_PENDING_FILTERS, SET_PENDING_STATE, SET_PENDING_META, GET_CURRENT_TRANSACTION,
  CREATE_TICKET, REFUND_TRANSACTION } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// const url = localStorage.getItem('isAdmin') === true ? 'v2/accounts/transactions' : 'v2/transactions.json'
// var url = ''
// if (Utils.returnBool(localStorage.getItem('isAdmin'))) {
//   url = 'v2/accounts/transactions'
// } else {
//   url = 'v2/transactions.json'
// }

// state
const state = {
  transactions: {
    data: [],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: {},
    sortParams: {param: 'updated_at', order: 'DESC'}
  },
  queues: {
    data: [],
    state: 'LOADING',
    filters: {},
    meta: {}
  },
  currentTransaction: {
    data: {},
    state: 'LOADING'
  },
  pending: {
    data: [],
    state: 'LOADING',
    filters: {},
    meta: {}
  },
  providers: [
    {label: 'MTN', value: 'mtn'},
    {label: 'Vodafone', value: 'vodafone'},
    {label: 'AirtelTigo', value: 'airtelTigo'}
  ]
}

// getters
const getters = {
  transactions: state => state.transactions.data,
  transactionsFilters: state => state.transactions.filters,
  transactionsMeta: state => state.transactions.meta,
  transactionsSortParams: state => state.transactions.sortParams,
  transactionsState: state => state.transactions.state,
  providers: state => state.providers,
  queues: state => state.queues.data,
  queuesState: state => state.queues.state,
  queuesFilters: state => state.queues.state,
  queuesMeta: state => state.queues.meta,
  pending: state => state.pending.data,
  pendingState: state => state.pending.state,
  pendingFilters: state => state.pending.state,
  pendingMeta: state => state.pending.meta,
  currentTransaction: state => state.currentTransaction.data,
  currentTransactionState: state => state.currentTransaction.state,
  
}

// mutations
const mutations = {
  [SET_TRANSACTIONS] (state, payload) {
    state.transactions.state = 'DATA'
    state.transactions.data = payload
  },
  [SET_TRANSACTIONS_STATE] (state, data) {
    state.transactions.state = data
  },
  [SET_TRANSACTIONS_META] (state, data) {
    var meta = {
      totalCount: data.total_transactions,
      limit: data.limit,
      page: data.page,
      trans: data.total_page_transactions
    }
    state.transactions.meta = meta
  },
  [SET_TRANSACTIONS_FILTERS] (state, data) {
    state.transactions.filters = data
  },
  [SET_QUEUE] (state, payload) {
    state.queues.state = 'DATA'
    state.queues.data = payload
  },
  [SET_QUEUE_STATE] (state, data) {
    state.queues.state = data
  },
  [SET_QUEUE_FILTERS] (state, data) {
    state.queues.filters = data
  },
  [SET_QUEUE_META] (state, data) {
    var meta = {
      totalCount: data.total_transactions,
      limit: data.limit,
      page: data.page,
      trans: data.total_page_transactions
    }
    state.queues.meta = meta
  },
  [SET_PENDING] (state, payload) {
    state.pending.state = 'DATA'
    state.pending.data = payload
  },
  [SET_PENDING_STATE] (state, data) {
    state.pending.state = data
  },
  [SET_PENDING_FILTERS] (state, data) {
    state.pending.filters = data
  },
  [SET_PENDING_META] (state, data) {
    var meta = {
      totalCount: data.total_transactions,
      limit: data.limit,
      page: data.page,
      trans: data.total_page_transactions
    }
    state.pending.meta = meta
  },
  [SET_CURRENT_TRANSACTION] (state, data) {
    state.currentTransaction.data = data
  },
  [SET_CURRENT_TRANSACTION_STATE] (state, data) {
    state.currentTransaction.state = data
  }
}

// actions
const actions = {
  [TRANSACTIONS_FETCH] ({ state, commit, rootGetters }, {
    cache = true,
    page = 1
  } = {}) {
    //   url for admin or client
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'

    // filters
    var filters = state.transactions.filters
    var query = ''
    if (Utils.empty(filters)) {
      query = `?all=true&search_value=cashout&page=${page}&limit=12`
    } else {
      filters.search_value = 'cashout'
      query = Utils.createQueryParams(filters, page)
    }
    // state
    commit(SET_TRANSACTIONS_STATE, 'LOADING')
    commit(SET_TRANSACTIONS_FILTERS, filters)

    if (cache && state.transactions.data.length !== 0) {
      commit(SET_TRANSACTIONS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_TRANSACTIONS_STATE, 'DATA')
          commit(SET_TRANSACTIONS_META, response.data.response.data)
          commit(SET_TRANSACTIONS, response.data.response.data.transactions)
          resolve()
        }).catch((error) => {
          commit(SET_TRANSACTIONS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_TRANSACTIONS_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_TRANSACTIONS_FILTERS, filters)
    dispatch('getTransactions', {page: 1, cache: false})
  },
  [TRANSACTION_CREATE] ({commit, state, rootGetters}, transaction) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/receive.json`,
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
  },
  [GET_QUEUE] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'
    // var filters = state.queues.filters
    var filters = {...state.queues.filters, search_value: 'queued'}
    // var fill = Utils.createQueryParams(filters)
    var query = Utils.createQueryParams(filters, page)
    // query += '&all=true'
    commit(SET_QUEUE_STATE, 'LOADING')
    commit(SET_QUEUE_FILTERS, filters)
    if (cache && state.queues.data.length !== 0) {
      commit(SET_QUEUE_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}${query}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_QUEUE_STATE, 'DATA')
          commit(SET_QUEUE_META, response.data.response.data)
          commit(SET_QUEUE, response.data.response.data.transactions)
          resolve()
        }).catch((error) => {
          commit(SET_QUEUE_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_QUEUE_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_QUEUE_FILTERS, filters)
    dispatch('getQueues', {page: 1, cache: false})
  },
  [GET_PENDING] ({ state, commit, rootGetters }, {
    page = 1,
    cache = true
  } = {}) {
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'
    var filters = state.pending.filters
    var query = Utils.createPendingParams(filters, page)
    commit(SET_PENDING_STATE, 'LOADING')
    commit(SET_PENDING_FILTERS, filters)
    if (cache && state.pending.data.length !== 0) {
      commit(SET_PENDING_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}${query}&statuses[]=pending`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_PENDING_STATE, 'DATA')
          commit(SET_PENDING_META, response.data.response.data)
          commit(SET_PENDING, response.data.response.data.transactions)
          resolve()
        }).catch((error) => {
          commit(SET_PENDING_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_PENDING_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_PENDING_FILTERS, filters)
    dispatch('getPending', {page: 1, cache: false})
  },
  [GET_CURRENT_TRANSACTION] ({ state, commit, rootGetters }, id) {
    // var trans = state.transactions.data.find(el => el.reference === id)
    // commit(SET_CURRENT_TRANSACTION, trans)
    commit(SET_CURRENT_TRANSACTION_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `https://api.flopay.io/v1/rekt_transacts/${id}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_CURRENT_TRANSACTION_STATE, 'DATA')
        commit(SET_CURRENT_TRANSACTION, response.data.response.data)
        resolve()
      }).catch((error) => {
        commit(SET_CURRENT_TRANSACTION_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [SEARCH_TRANSACTIONS] ({ state, commit, rootGetters }, {search}) {
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'
    // var query = ''
    // // if (type) {
    // //   query = query + `statuses[]=${type}`
    // // }
    // query = query + `search_value=${search}`
    var filters = {...state.transactions.filters, search_value: search}
    var fill = Utils.createQueryParams(filters)
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}${url}${fill}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_TRANSACTIONS_STATE, 'DATA')
        commit(SET_TRANSACTIONS_META, response.data.response.data)
        commit(SET_TRANSACTIONS, response.data.response.data.transactions)
        resolve()
      }).catch((error) => {
        commit(SET_TRANSACTIONS_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [CREATE_TICKET] ({ commit, rootGetters }, ticket) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/tickets/via/support`,
        method: 'POST',
        token: rootGetters.token,
        data: ticket
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [REFUND_TRANSACTION] ({ state, commit, rootGetters }, reference) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_REFUND_TRANSACTION_URI}?transaction_ref=${reference}`,
        method: 'POST',
        token: rootGetters.token
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
