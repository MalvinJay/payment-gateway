import { GET_CONTACTS, SET_CONTACTS_STATE, GET_CURRENT_CONTACT, SET_CURRENT_CONTACT, SET_CURRENT_CONTACT_STATE,
  CREATE_CONTACT, SET_CURRENT_CONTACTS, GET_CONTACTS_URI, SET_CONTACTS } from './contacts-store-constants'
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
  currentContactState: state => state.currentContact.state
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
    var items = payload.slice((page * 10) - 10, page * 10).map(i => {
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
    // var items = state.contacts.data.slice((page * 10) - 10, page * 10).map(i => {
    //   return i
    // })
    commit(SET_CURRENT_CONTACTS, {payload: state.contacts.data, page: page})
  },
  [CREATE_CONTACT] ({ state, commit, rootGetters, dispatch }, form) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_CONTACTS_URI}`,
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
        url: `https://api.flopay.io/v1/clients/contacts/${id}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_CURRENT_CONTACT_STATE, 'DATA')
        commit(SET_CURRENT_CONTACT, response.data)
        resolve()
      }).catch((error) => {
        commit(SET_CURRENT_CONTACT_STATE, 'ERROR')
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
