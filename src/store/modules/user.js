import { AUTH_REQUEST, SET_PAGE_LOADING, SET_TEST, SET_TOKEN, SET_CLIENT, SET_PERMISSIONS, LOGIN, LOGOUT, SET_CLIENT_CRED } from './store-constants'
import { GET_BASE_URI } from '../../transactions/store/transactions-store-constants'
import { apiCall } from '../apiCall'
import axios from 'axios'

const user = {
// state
  state: {
    user: {
      data: {},
      token: localStorage.getItem('token'),
      client_id: '',
      client_secret: ''
    },
    userdata: {},
    client: {},
    logIn: localStorage.getItem('login'),
    test: false,
    permissions: {
      data: []
    },
    pageLoading: false
  },

  // getters
  getters: {
    user: state => state.userdata,
    token: state => state.user.token,
    client: state => state.client,
    test: state => state.test,
    permissions: state => state.permissions.data,
    pageLoading: state => state.pageLoading,
    logIn: state => state.logIn
  },

  // mutations
  mutations: {
    [SET_TOKEN] (state, data) {
      state.logIn = localStorage.getItem('login')
      state.user.token = data
    },
    // client data
    [SET_CLIENT] (state, data) {
      state.permissions.data = data.client.privileges
      state.user.data = data
      state.userdata = data
    },
    //   test
    [SET_TEST] (state, data) {
      state.test = data
    },
    [SET_CLIENT_CRED] (state, data) {
      state.client = data
    },
    [LOGOUT] (state) {
      state.client = {}
      state.user = {
        data: {},
        token: localStorage.getItem('token'),
        client_id: '',
        client_secret: ''
      }
      state.userdata = {}
      state.permissions = {
        data: []
      }
      state.logIn = false
      state.user.token = null
    },
    // PERMISSIONs
    [SET_PERMISSIONS] (state, data) {
      state.permissions.data = data
    },
    // page loading
    [SET_PAGE_LOADING] (state, data) {
      state.pageLoading = data
    }
  },

  // actions
  actions: {
    [LOGIN] ({ state, commit }, {email, password}) {
      return new Promise((resolve, reject) => {
        var url = `${GET_BASE_URI}/v1/flopay_client_login.json?email=${email}&password=${password}`
        localStorage.setItem('password', password)
        axios.post(url)
          .then((response) => {
            localStorage.setItem('login', true)
            resolve(response)
            // commit(SET_CLIENT, response.data.response.data.client)
            // localStorage.setItem('name', response.data.response.data.client.full_name)
            // localStorage.setItem('company', response.data.response.data.client.company_name)
            // localStorage.setItem('email', response.data.response.data.client.email)
            // localStorage.setItem('balance', response.data.response.data.available_balance)
            // commit(SET_CLIENT_CRED, response.data.response.data.access_key)
            localStorage.setItem('client_id', response.data.response.data.access_key.client_id)
            localStorage.setItem('client_secret', response.data.response.data.access_key.client_secret)
          }).catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    [AUTH_REQUEST] ({ state, commit }) {
      return new Promise((resolve, reject) => {
        var url = `${GET_BASE_URI}/v1/login.json`
        var params = {
        //   ...state.client,
          grant_type: 'client_credentials'
        }
        localStorage.setItem('login', true)
        console.log('params', state.client.client_id)
        params.client_id = localStorage.getItem('client_id')
        params.client_secret = localStorage.getItem('client_secret')
        // params.grant_type = 'client_credentials'
        axios.post(url, params)
          .then((response) => {
            localStorage.setItem('token', response.data.access_token)
            resolve(response)
            commit(SET_TOKEN, response.data.access_token)
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
        localStorage.setItem('login', false) // clear your user's token from localstorage
        localStorage.removeItem('client_id')
        localStorage.removeItem('client_secret')
        resolve()
      })
    },
    [SET_TEST] ({ commit }, data) {
      commit(SET_TEST, data)
    },
    [SET_CLIENT] ({ commit }, data) {
      commit(SET_CLIENT, data)
      commit(SET_CLIENT_CRED, data.access_key)
    },
    [SET_TOKEN] ({ commit }, data) {
      commit(SET_TOKEN, data)
    }
  }
}
export default user
