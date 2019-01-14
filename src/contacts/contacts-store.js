import { GET_CONTACTS, SET_CONTACTS_STATE, GET_CURRENT_CONTACT, SET_CURRENT_CONTACT, SET_CURRENT_CONTACT_STATE,
  CREATE_CONTACT, SET_CURRENT_CONTACTS, SET_CURRENT_CONTACT_SCHEDULES, SET_CURRENT_CONTACT_TRANSACTIONS, GET_CONTACTS_URI, SET_CONTACTS } from './contacts-store-constants'
import { GET_BASE_URI } from '../store/constants'
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
  },
  currentContact: {
    data: {},
    schedules: [],
    transactions: [],
    state: 'LOADING'
  }
}

// getters
const getters = {
  contacts: state => state.contacts.data,
  contactsState: state => state.contacts.state,
  contactsCount: state => state.contacts.count,
  currentContacts: state => state.currentContacts.data,
  currentContact: state => state.currentContact.data,
  currentContactSchedules: state => state.currentContact.schedules,
  currentContactTransactions: state => state.currentContact.transactions,
  currentContactState: state => state.currentContact.state
}

// mutations
const mutations = {
  [SET_CONTACTS] (state, payload) {
    state.contacts.state = 'DATA'
    // var contacts = []
    // payload.forEach(element => {
    //   element.accounts.forEach(el => {
    //     el.type = element.name
    //     contacts.push(el)
    //   })
    // })
    // var contacts = Object.values(payload.reduce((acc, cur) => Object.assign(acc, {[cur.name]: cur}), {}))
    state.contacts.count = payload.length
    state.contacts.data = payload
  },
  [SET_CURRENT_CONTACTS] (state, {
    page = 1,
    payload
  } = {}) {
    var items = payload.slice((page * 12) - 12, page * 12).map(i => {
      return i
    })
    state.currentContacts.data = items
  },
  [SET_CONTACTS_STATE] (state, data) {
    state.contacts.state = data
  },
  [SET_CURRENT_CONTACT] (state, data) {
    state.currentContact.data = data
  },
  [SET_CURRENT_CONTACT_SCHEDULES] (state, data) {
    state.currentContact.schedules = data
  },
  [SET_CURRENT_CONTACT_TRANSACTIONS] (state, data) {
    state.currentContact.transactions = data
  },
  [SET_CURRENT_CONTACT_STATE] (state, data) {
    state.currentContact.state = data
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
          url: `${GET_BASE_URI}/v1/clients/contacts/all`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_CONTACTS_STATE, 'DATA')
          commit(SET_CONTACTS, response.data.response.data.contacts)
          //   state.contacts.count = response.data.response.data.contacts_total
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
    commit(SET_CURRENT_CONTACTS, {payload: state.contacts.data, page: page})
  },
  [CREATE_CONTACT] ({ state, commit, rootGetters, dispatch }, form) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/contacts/all`,
        method: 'POST',
        data: form,
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
  },
  [GET_CURRENT_CONTACT] ({ state, commit, rootGetters, dispatch }, id) {
    commit(SET_CURRENT_CONTACT_STATE, 'LOADING')
    // var contact = state.contacts.data.find(el => el.code === id)
    // commit(SET_CURRENT_CONTACT, contact)
    // commit(SET_CURRENT_CONTACT_STATE, 'DATA')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/contacts/${id}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_CURRENT_CONTACT_STATE, 'DATA')
        commit(SET_CURRENT_CONTACT, response.data.response.data)
        dispatch(SET_CURRENT_CONTACT_SCHEDULES, {contacts: response.data.response.data.schedules})
        dispatch(SET_CURRENT_CONTACT_TRANSACTIONS, {contacts: response.data.response.data.executed_transactions})
        resolve()
      }).catch((error) => {
        commit(SET_CURRENT_CONTACT_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [SET_CURRENT_CONTACT_SCHEDULES] ({ state, commit }, { page = 1, contacts = state.currentContact.data.schedules } = {}) {
    var items = contacts.slice((page * 12) - 12, page * 12).map(i => {
      return i
    })
    commit(SET_CURRENT_CONTACT_SCHEDULES, items)
  },
  [SET_CURRENT_CONTACT_TRANSACTIONS] ({ state, commit }, { page = 1, contacts = state.currentContact.data.executed_transactions } = {}) {
    var items = contacts.slice((page * 12) - 12, page * 12).map(i => {
      return i
    })
    commit(SET_CURRENT_CONTACT_TRANSACTIONS, items)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
