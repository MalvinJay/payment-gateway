import { GET_JOBS, SET_JOBS_STATE, AWS_BUCKET, ACCESS_KEY_ID, SET_FILE_UPLOAD_DETAILS, GET_JOB_RUNS, SET_JOB_RUNS, SET_JOB_RUNS_STATE,
  CREATE_JOB_CONTACT, DELETE_JOB, UPDATE_JOB, GET_SINGLE_JOB, SET_SINGLE_JOB, SET_SINGLE_JOB_STATE, RUN_JOB, SET_FILE_STATE, GET_CURRENT_RUN, SET_CURRENT_RUN, SET_CURRENT_RUN_STATE,
  SECRET_ACCESS_KEY, SEND_TO_BUCKET, DELETE_JOB_CONTACT, GET_BASE_URI, SET_JOBS, CREATE_JOB,
  SET_CURRENT_JOB_RUNS, GET_CURRENT_JOB_RUNS } from './transactions-store-constants'
import { apiCall } from '../../store/apiCall'
import Utils from '../../utils/services'
var S3 = require('aws-sdk/clients/s3')

// state
const state = {
  jobs: {
    data: [],
    state: 'LOADING',
    count: 0
  },
  currentJob: {
    data: {},
    state: 'LOADING',
    runs: [],
    currentRuns: [],
    runState: 'DATA',
    currentRun: {},
    currentRunState: 'LOADING'
  },
  file: {},
  fileState: 'DATA'
}

// getters
const getters = {
  jobs: state => state.jobs.data,
  jobsState: state => state.jobs.state,
  jobsCount: state => state.jobs.count,
  file: state => state.file,
  fileState: state => state.fileState,
  currentJob: state => state.currentJob.data,
  currentJobState: state => state.currentJob.state,
  currentJobRuns: state => state.currentJob.runs,
  currentRuns: state => state.currentJob.currentRuns,
  currentJobRunsState: state => state.currentJob.runState,
  currentRun: state => state.currentJob.currentRun,
  currentRunState: state => state.currentJob.currentRunState
}

// mutations
const mutations = {
  [SET_JOBS] (state, payload) {
    state.jobs.state = 'DATA'
    state.jobs.data = payload
  },
  [SET_JOBS_STATE] (state, data) {
    state.jobs.state = data
  },
  [SET_JOB_RUNS] (state, payload) {
    state.currentJob.runState = 'DATA'
    state.currentJob.runs = payload
  },
  [SET_CURRENT_JOB_RUNS] (state, payload) {
    state.currentJob.currentRuns = payload
  },
  [SET_JOB_RUNS_STATE] (state, data) {
    state.currentJob.runState = data
  },
  [SET_CURRENT_RUN] (state, payload) {
    state.currentJob.currentRunState = 'DATA'
    state.currentJob.currentRun = payload
  },
  [SET_CURRENT_RUN_STATE] (state, data) {
    state.currentJob.currentRun = data
  },
  [SET_FILE_UPLOAD_DETAILS] (state, data) {
    state.file = data
  },
  [SET_FILE_STATE] (state, data) {
    state.fileState = data
  },
  [SET_SINGLE_JOB] (state, data) {
    state.currentJob.data = data
  },
  [SET_SINGLE_JOB_STATE] (state, data) {
    state.currentJob.state = data
  }
}

// actions
const actions = {
  [GET_JOBS] ({ state, commit, rootGetters }, { page = 1, cache = true } = {}) {
    commit(SET_JOBS_STATE, 'LOADING')
    if (cache && Utils.present(state.jobs.data)) {
      commit(SET_JOBS_STATE, 'DATA')
    } else {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}/v1/clients/jobs/files/all.json`,
          method: 'GET',
          token: rootGetters.token
        }).then((response) => {
          commit(SET_JOBS_STATE, 'DATA')
          commit(SET_JOBS, response.data.response.data.jobs)
          resolve(response)
        }).catch((error) => {
          commit(SET_JOBS_STATE, 'ERROR')
          console.log(error)
          reject(error)
        })
      })
    }
  },
  [GET_JOB_RUNS] ({ state, commit, rootGetters, dispatch }, { page = 1, cache = true, id } = {}) {
    commit(SET_JOB_RUNS_STATE, 'LOADING')
    // if (cache && Utils.present(state.jobs.runs)) {
    //   commit(SET_JOB_RUNS_STATE, 'DATA')
    // } else {
    var data = {
      is_sub_user: false
    }
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/jobs/groups?job_id=${id}&all=true`,
        // url: `https://785af3e3.ngrok.io/api/v1/clients/jobs/groups?job_id=55&all=true`,
        method: 'GET',
        token: rootGetters.token,
        data: data
      }).then((response) => {
        commit(SET_JOB_RUNS_STATE, 'DATA')
        commit(SET_JOB_RUNS, response.data.response.data.groups)
        dispatch(GET_CURRENT_JOB_RUNS, response.data.response.data.groups)
        resolve()
      }).catch((error) => {
        commit(SET_JOB_RUNS_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
    // }
  },
  [GET_CURRENT_JOB_RUNS] ({ state, commit }, { page = 1, runs = state.currentJob.runs } = {}) {
    var items = runs.slice((page * 10) - 10, page * 10).map(i => {
      return i
    })
    commit(SET_CURRENT_JOB_RUNS, items)
  },
  [RUN_JOB] ({ state, commit, rootGetters }, id) {
    commit(SET_JOB_RUNS_STATE, 'LOADING')
    var data = {
      is_sub_user: false
    }
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/jobs/files/${id}/run`,
        method: 'POST',
        token: rootGetters.token,
        data: data
      }).then((response) => {
        commit(SET_JOB_RUNS_STATE, 'DATA')
        // commit(SET_JOB_RUNS, response.data.response.data.jobs)
        resolve(response)
      }).catch((error) => {
        commit(SET_JOB_RUNS_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
  },
  [CREATE_JOB] ({ state, commit, rootGetters }, job) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/jobs/files.json`,
        method: 'POST',
        token: rootGetters.token,
        data: job
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [CREATE_JOB_CONTACT] ({ state, commit, rootGetters }, {id, job}) {
    console.log(job)
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/jobs/files/${id}/data?${job}`,
        method: 'POST',
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [DELETE_JOB_CONTACT] ({ state, commit, rootGetters }, {id, job}) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/jobs/files/${job}/contact`,
        method: 'DELETE',
        token: rootGetters.token,
        data: {
          contact_id: id
        }
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [SEND_TO_BUCKET] ({ state, commit, rootGetters }, file) {
    commit(SET_FILE_STATE, 'LOADING')
    function getFileExtension (filename) {
      return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined
    }

    var fileExtension = getFileExtension(file.name)

    var BucketName = AWS_BUCKET
    var accessKeyId = ACCESS_KEY_ID
    var SecretAccessKey = SECRET_ACCESS_KEY

    var s3 = new S3({
      apiVersion: '2006-03-01',
      region: 'eu-central-1',
      accessKeyId: accessKeyId,
      secretAccessKey: SecretAccessKey,
      params: {Bucket: BucketName}
    })
    var albumFileKey = encodeURIComponent('flopay-file-batch') + '/'
    var fileKey = albumFileKey + Utils.randomString2(3) + '_' + file.name
    // batchUploadsChannel.subscribe(fileKey, _this.onFileProcessed)
    var params = {Bucket: BucketName, Key: fileKey, Body: file}
    return new Promise((resolve, reject) => {
      s3.upload(params, function (err, data) {
        if (err) {
          console.log('err', err)
          commit(SET_FILE_STATE, 'ERROR')
          reject(err)
          return
        }
        let admin = {
          s3_object_key: data.key,
          file_type: fileExtension
        }
        resolve(data)
        commit(SET_FILE_UPLOAD_DETAILS, data)
        commit(SET_FILE_STATE, 'DATA')
      })
    })
  },
  [DELETE_JOB] ({ rootGetters }, id) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/jobs/files/${id}`,
        method: 'DELETE',
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch(error => {
        reject(error)
        return error
      })
    })
  },
  [UPDATE_JOB] ({ rootGetters }, {id, data}) {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}v1/clients/jobs/files/${id}?${data}&is_sub_user=false`,
        method: 'PUT',
        token: rootGetters.token
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },
  [GET_SINGLE_JOB] ({ state, commit, rootGetters }, { id, cache = true } = {}) {
    commit(SET_SINGLE_JOB_STATE, 'LOADING')
    // commit(SET_SINGLE_JOB, rootGetters.jobs.find(el => el.name === id))
    // commit(SET_SINGLE_JOB_STATE, 'DATA')
    // if (Utils.present(state.currentJob.data.id === id) && cache) {
    //   commit(SET_SINGLE_JOB_STATE, 'DATA')
    // } else {
    return new Promise((resolve, reject) => {
      apiCall({
        url: `${GET_BASE_URI}/v1/clients/jobs/files/${id}`,
        method: 'GET',
        token: rootGetters.token
      }).then((response) => {
        if (response.data.success) {
          commit(SET_SINGLE_JOB_STATE, 'DATA')
          commit(SET_SINGLE_JOB, response.data.response.data.job)
          // commit(SET_JOB_RUNS, response.data.response.data.executed_transactions)
          resolve()
        } else {
          commit(SET_SINGLE_JOB_STATE, 'ERROR')
        }
      }).catch((error) => {
        commit(SET_SINGLE_JOB_STATE, 'ERROR')
        console.log(error)
        reject(error)
      })
    })
    // }
  }
//   [GET_CURRENT_RUN] ({ state, commit, rootGetters }, { id, jobId, cache = true } = {}) {
//     commit(SET_SINGLE_JOB_STATE, 'LOADING')
//     var par
//     if (Utils.present(state.currentJob.runs) && cache) {
//       commit(SET_SINGLE_JOB_STATE, 'DATA')
//     } else {
//       return new Promise((resolve, reject) => {
//         apiCall({
//           url: `${GET_BASE_URI}/v1/clients/jobs/files/${id}`,
//           method: 'GET',
//           token: rootGetters.token
//         }).then((response) => {
//           commit(SET_SINGLE_JOB_STATE, 'DATA')
//           commit(SET_SINGLE_JOB, response.data.response.data.job)
//           commit(SET_JOB_RUNS, response.data.response.data.executed_transactions)
//           resolve()
//         }).catch((error) => {
//           commit(SET_SINGLE_JOB_STATE, 'ERROR')
//           console.log(error)
//           reject(error)
//         })
//       })
//     }
//   }
}

export default {
  state,
  getters,
  actions,
  mutations
}
