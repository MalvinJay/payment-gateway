import { GET_CONTACTS, SET_CONTACTS_STATE, SET_CURRENT_CONTACTS, GET_CONTACTS_URI, SET_CONTACTS } from './contacts-store-constants'
import { apiCall } from '../store/apiCall'
// import Utils from '../utils/Utils'

// state
const state = {
  contacts: {
    data: [],
    state: 'LOADING',
    count: 0
  },
  currentContacts: {
    data: []
  }
}

// getters
const getters = {
  contacts: state => state.contacts.data,
  contactsState: state => state.contacts.state,
  contactsCount: state => state.contacts.count,
  currentContacts: state => state.currentContacts.data
}

// mutations
const mutations = {
  [SET_CONTACTS] (state, payload) {
    state.contacts.state = 'DATA'
    var contacts = []
    payload.forEach(element => {
      element.accounts.forEach(el => {
        el.type = element.name
        contacts.push(el)
      })
    })
    state.contacts.count = contacts.length
    state.contacts.data = contacts
  },
  [SET_CURRENT_CONTACTS] (state, {
    page = 1,
    payload
  } = {}) {
    console.log('page1', page)
    var items = payload.slice((page * 10) - 10, page * 10).map(i => {
      return i
    })
    console.log('items', items)
    state.currentContacts.data = items
  },
  [SET_CONTACTS_STATE] (state, data) {
    state.contacts.state = data
  }
}

// actions
const actions = {
  [GET_CONTACTS] ({ state, commit, rootGetters, dispatch }, cache = true) {
    commit(SET_CONTACTS_STATE, 'LOADING')
    if (cache && state.contacts.data.length !== 0) {
      commit(SET_CONTACTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_CONTACTS_URI}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_CONTACTS_STATE, 'DATA')
          commit(SET_CONTACTS, response.data.response.data.deposit_accounts)
          commit(SET_CURRENT_CONTACTS, {payload: state.contacts.data, page: 1})
          resolve()
        }).catch((error) => {
          commit(SET_CONTACTS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [SET_CURRENT_CONTACTS] ({commit, state}, page = 1) {
    console.log('page', page)
    // var items = state.contacts.data.slice((page * 10) - 10, page * 10).map(i => {
    //   return i
    // })
    commit(SET_CURRENT_CONTACTS, {payload: state.contacts.data, page: page})
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
