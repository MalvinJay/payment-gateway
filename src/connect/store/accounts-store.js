import { GET_BASE_URI } from '../../store/constants'
import { GET_ACCOUNTS, SET_ACCOUNTS, SET_CURRENT_ACCOUNTS, GET_CURRENT_ACCOUNTS, CREATE_ACCOUNT, SET_ACCOUNTS_STATE,
  GET_SINGLE_ACCOUNT, SET_SINGLE_ACCOUNT, SET_SINGLE_ACCOUNT_STATE,
  GET_SINGLE_ACCOUNT_USERS, SET_SINGLE_ACCOUNT_USERS, SET_SINGLE_ACCOUNT_USERS_STATE,
  GET_SINGLE_ACCOUNT_BRANCHES, SET_SINGLE_ACCOUNT_BRANCHES, SET_SINGLE_ACCOUNT_BRANCHES_STATE,
  DELETE_SINGLE_ACCOUNT_BRANCH, EDIT_SINGLE_ACCOUNT_BRANCH,
  CREATE_SINGLE_ACCOUNT_BRANCH, CREATE_SINGLE_ACCOUNT_USER, SET_PRIVILEGES, GET_PRIVILEGES, CREATE_SINGLE_ACCOUNT_GROUP,
  EDIT_SINGLE_ACCOUNT_USER, DELETE_SINGLE_ACCOUNT_USER, DELETE_SINGLE_ACCOUNT_GROUP, EDIT_SINGLE_ACCOUNT_GROUP} from './store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'

// state
const state = {
  accounts: {
    data: [],
    state: 'LOADING',
    count: 0
  },
  currentAccounts: {
    data: []
  },
  currentAccount: {
    data: {},
    branches: [],
    users: [],
    settings: [],
    usersState: 'LOADING',
    branchesState: 'LOADING',
    state: 'LOADING',
    privileges: []
  }
}

// getters
const getters = {
  accounts: state => state.accounts.data,
  currentAccounts: state => state.currentAccounts.data,
  accountsState: state => state.accounts.state,
  accountsCount: state => state.accounts.count,
  currentAccount: state => state.currentAccount.data,
  currentAccountState: state => state.currentAccount.state,
  currentAccountUsers: state => state.currentAccount.users,
  currentAccountUsersState: state => state.currentAccount.usersState,
  currentAccountBranches: state => state.currentAccount.branches,
  currentAccountSettings: state => state.currentAccount.settings,
  currentAccountBranchesState: state => state.currentAccount.branchesState,
  currentAccountPrivileges: state => state.currentAccount.privileges
}

// mutations
const mutations = {
  [SET_ACCOUNTS] (state, payload) {
    state.accounts.state = 'DATA'
    state.accounts.count = payload.length
    state.accounts.data = payload
  },
  [SET_ACCOUNTS_STATE] (state, data) {
    state.accounts.state = data
  },
  [SET_SINGLE_ACCOUNT] (state, data) {
    state.currentAccount.state = 'DATA'
    state.currentAccount.data = data
  },
  [SET_SINGLE_ACCOUNT_STATE] (state, data) {
    state.currentAccount.state = data
  },
  [SET_SINGLE_ACCOUNT_BRANCHES] (state, data) {
    state.currentAccount.branches = data
  },
  [SET_SINGLE_ACCOUNT_BRANCHES_STATE] (state, data) {
    state.currentAccount.branchesState = data
  },
  [SET_SINGLE_ACCOUNT_USERS] (state, data) {
    state.currentAccount.settings = data.general_settings
    state.currentAccount.users = data.user_groups
  },
  [SET_SINGLE_ACCOUNT_USERS_STATE] (state, data) {
    state.currentAccount.usersState = data
  },
  [SET_CURRENT_ACCOUNTS] (state, {
    page = 1,
    payload
  } = {}) {
    var items = payload.slice((page * 12) - 12, page * 12).map(i => {
      return i
    })
    state.currentAccounts.data = items
  },
  // GET ALL FLOPAY PRIVILEGES
  [SET_PRIVILEGES] (state, data) {
    state.currentAccount.privileges = data
  }
}

// actions
const actions = {
//   GET ALL ACCOUNTS
  [GET_ACCOUNTS] ({ state, commit, rootGetters }, { page = 1, cache = true } = {}) {
    commit(SET_ACCOUNTS_STATE, 'LOADING')
    if (cache && Utils.present(state.accounts.data)) {
      commit(SET_ACCOUNTS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/accounts/platform/clients.json`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_ACCOUNTS_STATE, 'DATA')
          commit(SET_ACCOUNTS, response.data.response.data.clients)
          commit(SET_CURRENT_ACCOUNTS, {payload: response.data.response.data.clients, page: 1})
          resolve(response)
        }).catch((error) => {
          commit(SET_ACCOUNTS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [GET_CURRENT_ACCOUNTS] ({commit, state}, page = 1) {
    commit(SET_CURRENT_ACCOUNTS, {payload: state.accounts.data, page: page})
  },
  //   SINGLE ACCOUNT
  [GET_SINGLE_ACCOUNT] ({ state, commit, rootGetters }, id) {
    commit(SET_SINGLE_ACCOUNT_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/clients.json?client_till=${id}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_SINGLE_ACCOUNT_STATE, 'DATA')
        commit(SET_SINGLE_ACCOUNT, response.data.clients[0])
        resolve(response)
      }).catch((error) => {
        commit(SET_SINGLE_ACCOUNT_STATE, 'ERROR')
        console.log('error client', error)
        reject(error)
      })
    })
  },
  [CREATE_ACCOUNT] ({ state, commit, rootGetters }, account) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/create_client.json`,
        method: 'POST',
        token: rootGetters.token,
        data: account
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  //  SINGLE ACCOUNT BRANCHES
  [GET_SINGLE_ACCOUNT_BRANCHES] ({ state, commit, rootGetters }, id) {
    commit(SET_SINGLE_ACCOUNT_BRANCHES_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/branches?client_till=${id}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_SINGLE_ACCOUNT_BRANCHES_STATE, 'DATA')
        commit(SET_SINGLE_ACCOUNT_BRANCHES, response.data.response.data.branches)
        resolve(response)
      }).catch((error) => {
        commit(SET_SINGLE_ACCOUNT_BRANCHES_STATE, 'ERROR')
        console.log('error client', error)
        reject(error)
      })
    })
  },
  [CREATE_SINGLE_ACCOUNT_BRANCH] ({ state, commit, rootGetters }, branch) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/branches.json`,
        method: 'POST',
        token: rootGetters.token,
        data: branch
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [EDIT_SINGLE_ACCOUNT_BRANCH] ({ state, commit, rootGetters }, branch) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/branches.json`,
        method: 'PUT',
        token: rootGetters.token,
        data: branch
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [DELETE_SINGLE_ACCOUNT_BRANCH] ({ state, commit, rootGetters }, branch) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/branches.json`,
        method: 'DELETE',
        token: rootGetters.token,
        data: branch
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  //  SINGLE ACCOUNT USERS
  [GET_SINGLE_ACCOUNT_USERS] ({ state, commit, rootGetters }, id) {
    commit(SET_SINGLE_ACCOUNT_USERS_STATE, 'LOADING')
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/customizations/user_groups?client_till=${id}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        commit(SET_SINGLE_ACCOUNT_USERS_STATE, 'DATA')
        commit(SET_SINGLE_ACCOUNT_USERS, response.data.response.data)
        resolve(response)
      }).catch((error) => {
        commit(SET_SINGLE_ACCOUNT_USERS_STATE, 'ERROR')
        console.log('error client', error)
        reject(error)
      })
    })
  },
  [CREATE_SINGLE_ACCOUNT_USER] ({ state, commit, rootGetters }, user) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/users/new.json`,
        method: 'POST',
        token: rootGetters.token,
        data: user
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [EDIT_SINGLE_ACCOUNT_USER] ({ state, commit, rootGetters }, { user, id }) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/users/${id}`,
        method: 'PUT',
        token: rootGetters.token,
        data: user
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [DELETE_SINGLE_ACCOUNT_USER] ({ state, commit, rootGetters }, user) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/platform/users`,
        method: 'DELETE',
        token: rootGetters.token,
        data: user
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  //   SINGLE ACCOUNT GROUP
  [CREATE_SINGLE_ACCOUNT_GROUP] ({ state, commit, rootGetters }, group) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/customizations/user_groups/create.json`,
        method: 'POST',
        token: rootGetters.token,
        data: group
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [EDIT_SINGLE_ACCOUNT_GROUP] ({ state, commit, rootGetters }, { group, id }) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/customizations/user_groups/${id}.json`,
        method: 'PUT',
        token: rootGetters.token,
        data: group
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [DELETE_SINGLE_ACCOUNT_GROUP] ({ state, commit, rootGetters }, group) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v2/accounts/customizations/user_groups`,
        method: 'DELETE',
        token: rootGetters.token,
        data: group
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  //   PRIVILEGES OF ACCOUNT
  [GET_PRIVILEGES] ({ state, commit, rootGetters }, id) {
    if (state.currentAccount.privileges.length === 0) {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/accounts/customizations/privileges.json?client_till=${id}`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          console.log('privileges', response.data.response.data)
          commit(SET_PRIVILEGES, response.data.response.data)
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
      })
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
