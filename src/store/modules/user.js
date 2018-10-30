import { AUTH_REQUEST, SET_TOKEN, SET_CLIENT, LOGIN, LOGOUT, SET_CLIENT_CRED } from './store-constants'
import { apiCall } from '../apiCall'
import axios from 'axios'

// state
const state = {
  user: {
    data: {},
    token: localStorage.getItem('token'),
    client_id: '',
    client_secret: ''
  },
  userdata: {},
  client: {},
  logIn: true
}

// getters
const getters = {
  user: state => state.userdata,
  token: state => state.user.token,
  client: state => state.client
}

// mutations
const mutations = {
  [SET_TOKEN] (state) {
    state.logIn = true
    state.user.token = localStorage.getItem('token')
  },
  [SET_CLIENT] (state, data) {
    console.log('user')
    state.userdata = data
  },
  [SET_CLIENT_CRED] (state, data) {
    state.client = data
  },
  [LOGOUT] (state) {
    state.logIn = false
    state.user.token = null
  }
}

// actions
const actions = {
  [LOGIN] ({ state, commit }, {email, password}) {
    return new Promise((resolve, reject) => {
      var url = `https://api.flopay.io/v1/flopay_client_login.json?email=${email}&password=${password}`
      axios.post(url)
        .then((response) => {
          console.log('response', response)
          commit(SET_CLIENT, response.data.response.data.client)
          commit(SET_CLIENT_CRED, response.data.response.data.access_key)
          localStorage.setItem('client_id', response.data.response.data.access_key.client_id)
          localStorage.setItem('client_secret', response.data.response.data.access_key.client_secret)
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  [AUTH_REQUEST] ({ state, commit }) {
    return new Promise((resolve, reject) => {
      var url = `https://api.flopay.io/v1/login.json`
      var params = {}
      params.client_id = localStorage.getItem('client_id')
      params.client_secret = localStorage.getItem('client_secret')
      params.grant_type = 'client_credentials'
      axios.post(url, params)
        .then((response) => {
          console.log('user token', response)
          localStorage.setItem('token', response.data.access_token)
          commit(SET_TOKEN, response.data.access_token)
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  [LOGOUT] ({ state, commit }) {
    return new Promise((resolve, reject) => {
      commit(LOGOUT)
      localStorage.removeItem('token') // clear your user's token from localstorage
      resolve()
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
