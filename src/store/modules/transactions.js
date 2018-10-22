import { TRANSACTION_CREATE, TRANSACTIONS_FETCH, SET_TRANSACTIONS_STATE, SET_TRANSACTIONS, GET_TRANSACTIONS_URI } from './store-constants'
import { apiCall } from '../apiCall'

// state
const state = {
  transactions: {
    data: [
      {
        amount: 'GHc1000.00',
        currency: 'GHc',
        status: 'success',
        description: 'oi',
        customer: 'Him',
        type: 'CashIn',
        ref: '5fhdrvhsfd',
        date: Date.now()
      },
      {
        amount: 'GHc1000.00',
        currency: 'GHc',
        status: 'failed',
        description: 'oi',
        customer: 'Him',
        type: 'CashOut',
        ref: '5fhdrvhsfdz',
        date: Date.now()
      }
    ],
    meta: {page: 1},
    errors: [],
    state: 'DATA',
    filters: [],
    sortParams: {param: 'updated_at', order: 'DESC'}
  }
}

// getters
const getters = {
  transactions: state => state.transactions.data,
  transactionsFilters: state => state.transactions.filters,
  transactionsSortParams: state => state.transactions.sortParams,
  transactionsState: state => state.transactions.state
}

// mutations
const mutations = {
  [SET_TRANSACTIONS] (state, payload) {
    state.transactions.state = 'DATA'
    state.transactions.data = payload
  },
  [SET_TRANSACTIONS_STATE] (state, data) {
    state.transactions.data.state = data
  }
}

// actions
const actions = {
  [TRANSACTIONS_FETCH] ({ state, commit, rootGetters }, cache = true) {
    commit(SET_TRANSACTIONS_STATE, 'LOADING')
    if (cache && state.transactions.data.length !== 0) {
      commit(SET_TRANSACTIONS_STATE, 'DATA')
    } else {
      state.transactions.state = 'LOADING'
      commit(SET_TRANSACTIONS_STATE, 'LOADING')
      return new Promise((resolve, reject) => {
        apiCall({
          url: GET_TRANSACTIONS_URI,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(TRANSACTIONS_FETCH, response.data)
          resolve()
        }).catch((error) => {
          commit(SET_TRANSACTIONS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [TRANSACTION_CREATE] ({commit, state, rootGetters}, task) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: GET_TRANSACTIONS_URI,
        method: 'POST',
        data: task,
        token: rootGetters.token
      }).then((response) => {
        resolve(response.data)
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
