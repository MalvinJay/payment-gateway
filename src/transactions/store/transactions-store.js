import { TRANSACTION_CREATE, CREATE_CHECKOUT, TRANSACTION_COMPLETER, SET_TRANSACTIONS_META, SET_TRANSACTIONS_FILTERS, SEARCH_TRANSACTIONS, TRANSACTIONS_FETCH,
  SET_CURRENT_TRANSACTION_STATE, SET_TRANSACTIONS_STATE, GET_QUEUE, SET_QUEUE, SET_QUEUE_STATE, SET_QUEUE_FILTERS,
  SET_QUEUE_META, SET_CURRENT_TRANSACTION, GET_FAILED, SET_FAILED,SET_FAILED_STATE, SET_FAILED_FILTERS, SET_FAILED_META,
  SET_TRANSACTIONS, GET_PENDING, SET_PENDING, SET_PENDING_FILTERS, ADD_TRANSACTION, SET_PENDING_STATE, SET_PENDING_META,
  APPROVE_TRANSACTIONS, GET_CURRENT_TRANSACTION, CREATE_TICKET, REFUND_TRANSACTION, REQUEST_SMS
} from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import { ctrlCall } from '../../store/ctrlCall'
import { GET_BASE_URI } from '../../store/constants'
import Utils from '../../utils/services'
import moment from 'moment'

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
    filters: {
      from: moment().startOf('month').format('YYYY-MM-DD'),
      to: moment().endOf('month').format('YYYY-MM-DD')
    },
    meta: {}
  },
  failed: {
    data: [],
    state: 'LOADING',
    filters: {
      from: moment().startOf('month').format('YYYY-MM-DD'),
      to: moment().endOf('month').format('YYYY-MM-DD')
    },
    meta: {

    }
  },
  providers: [
    {label: 'MTN', value: 'mtn'},
    {label: 'Vodafone', value: 'vodafone'},
    {label: 'Tigo', value: 'tigo'},
    {label: 'Airtel', value: 'airtel'}
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

  // Failed
  failed: state => state.failed.data,
  failedState: state => state.failed.state,
  failedFilters: state => state.failed.state,
  failedMeta: state => state.failed.meta,

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
      page: data.total_pages,
      trans: data.total_transactions,
      // total: data.total_transactions
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
      trans: data.total_transactions
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
  [SET_FAILED] (state, payload) {
    state.failed.state = 'DATA'
    state.failed.data = payload
  },
  [SET_FAILED_STATE] (state, data) {
    state.failed.state = data
  },
  [SET_FAILED_FILTERS] (state, data) {
    state.failed.filters = data
  },
  [SET_FAILED_META] (state, data) {
    var meta = {
      totalCount: data.total_transactions,
      limit: data.limit,
      page: data.page,
      trans: data.total_transactions
    }
    state.failed.meta = meta
  },
  [SET_CURRENT_TRANSACTION] (state, data) {
    state.currentTransaction.data = data
  },
  [SET_CURRENT_TRANSACTION_STATE] (state, data) {
    state.currentTransaction.state = data
  },
  //   channels
  [ADD_TRANSACTION] (state, data) {
    state.transactions.data.push(data)
  }
}

// actions
const actions = {
  [TRANSACTIONS_FETCH] ({ state, commit, rootGetters, dispatch }, {cache = true, page = 1, search_value = ''} = {}) {
    //   url for admin or client
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'

    // filters
    var filters = state.transactions.filters
    var query = ''

    console.log('search_value:', search_value)

    if (Utils.empty(filters)) {
      query = `?search_value=${search_value}&page=${page}&limit=12&statuses[]=succeeded`
    } else {
      // filters.search_value = 'cashout'
      query = Utils.createQueryParams(filters, page)
      query = query + `&statuses[]=succeeded`
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
          if (response.data.response.data.transactions.length > 0) {
            dispatch(GET_CURRENT_TRANSACTION, response.data.response.data.transactions[0].reference)
          }
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
    console.log('Filters for Filter', filters)
    dispatch('getTransactions', {page: 1, cache: false})
  },
  [TRANSACTION_CREATE] ({commit, state, rootGetters}, transaction) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/receive.json`,
        method: 'POST',
        data: transaction,
        token: rootGetters.token || transaction.token
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log('ERROR', error)
        reject(error)
      })
    })
  },
  [CREATE_CHECKOUT] ({commit, state, rootGetters}, transaction) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/default_checkout`,
        method: 'POST',
        data: transaction,
        token: transaction.token
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
  //   pending
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

  // failed
  [GET_FAILED] ({ state, commit, rootGetters }, { page = 1, cache = true } = {}) {
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'
    var filters = state.failed.filters
    var query = Utils.createPendingParams(filters, page)
    commit(SET_FAILED_STATE, 'LOADING')
    commit(SET_FAILED_FILTERS, filters)
    if (cache && state.failed.data.length !== 0) {
      commit(SET_FAILED_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}${url}${query}&statuses[]=failed`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_FAILED_STATE, 'DATA')
          commit(SET_FAILED_META, response.data.response.data)
          commit(SET_FAILED, response.data.response.data.transactions)
          resolve()
        }).catch((error) => {
          commit(SET_FAILED_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_FAILED_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
    commit(SET_FAILED_FILTERS, filters)
    dispatch('getFailed', {page: 1, cache: false})
  },

  [APPROVE_TRANSACTIONS] ({ state, commit, rootGetters }, transactions) {
    console.log('transactions pending', transactions)
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/transactions/approve.json`,
        method: 'POST',
        token: rootGetters.token,
        data: transactions
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        commit(SET_CURRENT_TRANSACTION_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [GET_CURRENT_TRANSACTION] ({ state, commit, rootGetters }, id) {
    // var trans = state.transactions.data.find(el => el.reference === id)
    // commit(SET_CURRENT_TRANSACTION, trans)
    commit(SET_CURRENT_TRANSACTION_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      ctrlCall({
        url: `${GET_BASE_URI}v1/rekt_transacts/${id}`,
        method: 'GET',
      }).then((response) => {
        commit(SET_CURRENT_TRANSACTION_STATE, 'DATA')
        commit(SET_CURRENT_TRANSACTION, response.data.response.data)
        resolve(response.data.response.data)
      }).catch((error) => {
        commit(SET_CURRENT_TRANSACTION_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [TRANSACTION_COMPLETER] ({ state, commit, rootGetters }, ref) {
    commit(SET_CURRENT_TRANSACTION_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      ctrlCall({
        url: `${GET_BASE_URI}v1/rekt_transacts/tickets/completer`,
        method: 'POST',
        data: {
          transact_ref: ref
        }
      }).then((response) => {
        // commit(SET_CURRENT_TRANSACTION_STATE, 'DATA')
        // commit(SET_CURRENT_TRANSACTION, response.data.response.data)
        console.log('response.data :>> ', response.data);
        resolve(response.data)
      }).catch((error) => {
        // commit(SET_CURRENT_TRANSACTION_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [SEARCH_TRANSACTIONS] ({ state, commit, rootGetters }, { search }) {
    var url = rootGetters.isAdmin ? 'v2/accounts/transactions' : 'v2/transactions.json'
    // var query = ''
    // // if (type) {
    // //   query = query + `statuses[]=${type}`
    // // }
    // query = query + `search_value=${search}`
    console.log('Final Query:', ...state.transactions.filters)
    var filters = {
      ...state.transactions.filters,
      search_value: search
    }
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
        // Trigger event to refresh transaction table


        resolve(response)
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
        // url: `${GET_BASE_URI}v1/clients/tickets/via/support`,
        url: `${GET_BASE_URI}v1/clients/tickets.json`,
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
        url: `${GET_BASE_URI}v1/reverse.json?transaction_ref=${reference}`,
        method: 'POST',
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [REQUEST_SMS] ({ state, commit, rootGetters }, reference) {
    commit(SET_CURRENT_TRANSACTION_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/sms/waec-resend?reference=${reference}`,
        method: 'POST',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_CURRENT_TRANSACTION_STATE, 'DATA')
        resolve(response)
      }).catch((error) => {
        commit(SET_CURRENT_TRANSACTION_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
