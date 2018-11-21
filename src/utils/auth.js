import store from '../store/store'

var Auth = {
  loggedIn: false,

  login: function () {
    store.getters.logIn = true
  },

  logout: function () {
    store.getters.logIn = true
  }
}

export default Auth
