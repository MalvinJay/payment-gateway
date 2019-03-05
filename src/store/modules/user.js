import { AUTH_REQUEST, ADMIN_LOGIN, IS_ADMIN, SET_PAGE_LOADING, SET_TEST, SET_TOKEN, SET_CLIENT,
  SET_PERMISSIONS, LOGIN, SEND_EMAIL, UPDATE_PROFILE, LOGOUT, SET_CLIENT_CRED, SET_BALANCE, GET_BALANCE, RESET_PASSWORD } from './store-constants'
import { GET_BASE_URI, CTRL_KEY } from '../../store/constants'
import { apiCall } from '../apiCall'
import axios from 'axios'
import Utils from '../../utils/services'

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
    services: {
      data: []
    },
    banks: [],
    bills: [],
    pageLoading: false,
    isAdmin: Utils.returnBool(localStorage.getItem('isAdmin')),
    pageSize: 12,
    balance: {}
  },

  // getters
  getters: {
    user: state => state.userdata,
    token: state => state.user.token,
    client: state => state.client,
    test: state => state.test,
    permissions: state => state.permissions.data,
    pageLoading: state => state.pageLoading,
    logIn: state => state.logIn,
    isAdmin: state => state.isAdmin,
    pageSize: state => state.pageSize,
    balance: state => state.balance,
    banks: state => state.banks,
    bills: state => state.bills,
    services: state => state.services.data
  },

  // mutations
  mutations: {
    [SET_TOKEN] (state, data) {
      state.logIn = localStorage.getItem('login')
      state.user.token = data
    },
    // client data
    [SET_CLIENT] (state, data) {
      if (!state.isAdmin) {
        state.permissions.data = data.is_sub_user ? data.sub_user.user_group.privileges : data.client.privileges
        state.services.data = data.account_services
        state.banks = data.deposit_accounts[2].providers
        state.bills = data.deposit_accounts[1].providers
      }
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
      localStorage.setItem('isAdmin', false)
    },
    // PERMISSIONs
    [SET_PERMISSIONS] (state, data) {
      state.permissions.data = data
    },
    // page loading
    [SET_PAGE_LOADING] (state, data) {
      state.pageLoading = data
    },
    // is admin
    [IS_ADMIN] (state, data) {
      state.isAdmin = data
    },
    // available balance
    [SET_BALANCE] (state, data) {
      state.balance = data
    }
  },

  // actions
  actions: {
    [LOGIN] ({ state, commit }, {email, password}) {
      return new Promise((resolve, reject) => {
        var url = `${GET_BASE_URI}v1/flopay_client_login.json`
        var loginData = {
          'email': email,
          'password': password
        }

        var Base64 = {_keyStr: CTRL_KEY, encode: function (e) { var t = ''; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ''; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ''); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } }t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, '\n'); var t = ''; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ''; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t }}
        var encodedString = Base64.encode('5b1892ab46d583da4542d5951ccf6d38ec27a6a8a3f1e3d9bbeb730827731314')

        axios.defaults.headers = {
          'Ctl-Key': encodedString
        }
        axios.post(url, loginData)
          .then((response) => {
            console.log('Data after login: ', response.data.response.data)
            if (response.data.response.data != null) {
              localStorage.setItem('login', true)
              // localStorage.setItem('isAdmin', false)
              // commit(SET_CLIENT, response.data.response.data.client)
              // localStorage.setItem('name', response.data.response.data.client.full_name)
              // localStorage.setItem('company', response.data.response.data.client.company_name)
              // localStorage.setItem('email', response.data.response.data.client.email)
              // localStorage.setItem('balance', response.data.response.data.available_balance)
              // commit(SET_CLIENT_CRED, response.data.response.data.access_key)
              localStorage.setItem('client_id', response.data.response.data.access_key.client_id)
              localStorage.setItem('client_secret', response.data.response.data.access_key.client_secret)
              resolve(response)
            } else {
              resolve(response)
            }
          }).catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    [ADMIN_LOGIN] ({ state, commit }, {email, password}) {
      return new Promise((resolve, reject) => {
        var url = `${GET_BASE_URI}v1/flopay_platform/login.json?email=${email}&password=${password}`
        axios.post(url)
          .then((response) => {
            localStorage.setItem('login', true)
            // localStorage.setItem('isAdmin', true)
            // state.isAdmin = true
            // commit(SET_CLIENT, response.data.response.data.client)
            // localStorage.setItem('name', response.data.response.data.client.full_name)
            // localStorage.setItem('company', response.data.response.data.client.company_name)
            // localStorage.setItem('email', response.data.response.data.client.email)
            // localStorage.setItem('balance', response.data.response.data.available_balance)
            // commit(SET_CLIENT_CRED, response.data.response.data.access_key)
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
        var url = `${GET_BASE_URI}v1/login.json`
        var params = {
          grant_type: 'client_credentials'
        }
        localStorage.setItem('login', true)
        params.client_id = localStorage.getItem('client_id')
        params.client_secret = localStorage.getItem('client_secret')
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
        localStorage.removeItem('isAdmin') // clear your user's token from localstorage
        localStorage.removeItem('client_id')
        localStorage.removeItem('client_secret')
        localStorage.removeItem('password')
        localStorage.removeItem('email')
        resolve()
      })
    },
    [GET_BALANCE] ({ state, commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        var url = `${GET_BASE_URI}v1/balance.json`
        apiCall({
          url: url,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_BALANCE, response.data)
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
      })
    },
    // RESET PASSWORD
    [RESET_PASSWORD] ({ state, commit, rootGetters }, form) {
      return new Promise((resolve, reject) => {
        var url = `${GET_BASE_URI}v2/accounts/reset_password?token=${form.token}`
        apiCall({
          url: url,
          method: 'PUT',
          token: rootGetters.token,
          data: form
        }).then((response) => {
          // commit(SET_BALANCE, response.data)
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
      })
    },
    // EMAIL
    [SEND_EMAIL] ({ state, commit }, email) {
      return new Promise((resolve, reject) => {
        var origin = window.location.origin
        var url = `${GET_BASE_URI}v2/accounts/send_password_reset_link.json?email=${email}&origin=${origin}`
        axios.post(url)
          .then((response) => {
            resolve(response)
          }).catch((error) => {
            console.log(error)
            reject(error)
          })
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
    },
    // UPDATE PROFILE
    [UPDATE_PROFILE] ({ rootGetters }, form) {
      return new Promise((resolve, reject) => {
        var url = `${GET_BASE_URI}v1/merchants/update.json`
        apiCall({
          url: url,
          method: 'PUT',
          token: rootGetters.token,
          data: form
        }).then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default user
