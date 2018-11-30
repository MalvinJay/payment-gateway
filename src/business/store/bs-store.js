import {
    SAVE_SETTINGS,
    SAVE_BS_URI
  } from './bs-store-constants'
  import { apiCall } from '../../store/apiCall'
  import Utils from '../../utils/services'

// state
const state = {
    client: {
      data: [],
      meta: {page: 1},
      errors: [],
      state: 'DATA',
      filters: {},
      sortParams: {param: 'updated_at', order: 'DESC'}
    },
    currentRole: {
      data: {},
      state: 'LOADING'
    }
  }

  // getters
const getters = {
    client: state => state.client.data,
  }
  
  
