import {  
    FEES_FETCH,
    SET_FEES,
    SET_FEES_STATE,
    SET_FEES_META, 
    SET_FEES_FILTERS,
    GET_FEES_URI 
} from './fees-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'
  
  // state
  const state = {
    fees: {
      data: [],
      meta: {page: 1},
      errors: [],
      state: 'DATA',
      filters: {},
      sortParams: {param: 'updated_at', order: 'DESC'}
    },
    currentFee: {
      data: {},
      state: 'LOADING'
    }
  }
  
  // getters
  const getters = {
    fees: state => state.fees.data,
    feesFilters: state => state.fees.filters,
    feesMeta: state => state.fees.meta,
    feesSortParams: state => state.fees.sortParams,
    feesState: state => state.fees.state
  }
  
  // mutations
  const mutations = {
    [SET_FEES] (state, payload) {
      state.fees.state = 'DATA'
      state.fees.data = payload
    },
    [SET_FEES_STATE] (state, data) {
      state.fees.state = data
    },
    [SET_FEES_META] (state, data) {
      var meta = {
        totalCount: data.total_transactions,
        limit: data.limit,
        page: data.page,
        trans: data.total_page_transactions
      }
      state.fees.meta = meta
    },
    [SET_FEES_FILTERS] (state, data) {
      state.fees.filters = data
    }
  }
  
  // actions
  const actions = {
    [FEES_FETCH] ({ state, commit, rootGetters }, {
      page = 1,
      cache = true
    } = {}) {
      var filters = state.fees.filters
      var query = ''
      if (Utils.empty(filters)) {
        query = `?all=true&page=${page}&limit=10`
      } else {
        // filters.search_value = 'cashin'
        query = Utils.createQueryParams(filters, page)
      }
      commit(SET_FEES_STATE, 'LOADING')
      commit(SET_FEES_FILTERS, filters)
      if (cache && state.fees.data.length !== 0) {
        commit(SET_FEES_STATE, 'DATA')
      } else {
        return new Promise((resolve, reject) => {
          apiCall({
            url: `${GET_FEES_URI}${query}`,
            method: 'GET',
            token: rootGetters.token
          }).then((response) => {
            console.log('transactions for fees', response)
            commit(SET_FEES_STATE, 'DATA')
            commit(SET_FEES_META, response.data.response.data)
            commit(SET_FEES, response.data.response.data.transactions)
            resolve(response)
          }).catch((error) => {
            commit(SET_FEES_STATE, 'ERROR')
            console.log(error)
            reject(error)
          })
        })
      }
    },
    [SET_FEES_FILTERS] ({ state, commit, rootGetters, dispatch }, filters) {
      commit(SET_FEES_FILTERS, filters)
      dispatch('getfees', {page: 1, cache: false})
    }
  }
  
  export default {
    state,
    getters,
    mutations,
    actions
  }
  