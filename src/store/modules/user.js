import { AUTH_REQUEST } from './store-constants'
import { apiCall } from '../apiCall'

// state
const state = {
  user: {
    data: [],
    token: ''
  }
}

// getters
const getters = {
  user: state => state.user.data,
  userFilters: state => state.user.filters,
  userSortParams: state => state.user.sortParams,
  userState: state => state.user.state
}

// mutations
const mutations = {

}

// actions
const actions = {
  [AUTH_REQUEST] ({ state, commit, rootGetters }, {user, password}) {
    // if (user === 'user' && password === 'password') {
    //     return true
    // } else {
    //     return false
    // }
    // if (cache && state.transactions.data.length !== 0) {
    //   commit(SET_TRANSACTIONS_STATE, 'DATA')
    // } else {
    //   state.transactions.state = 'LOADING'
    //   commit(SET_TRANSACTIONS_STATE, 'LOADING')
    //   return new Promise((resolve, reject) => {
    //     apiCall({
    //       url: GET_TRANSACTIONS_URI,
    //       method: 'GET',
    //       token: rootGetters.token
    //     }).then((response) => {
    //       commit(TRANSACTIONS_FETCH, response.data)
    //       resolve()
    //     }).catch((error) => {
    //       commit(SET_TRANSACTIONS_STATE, 'ERROR')
    //       console.log(error)
    //       reject(error)
    //     })
    //   })
    // }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
