import {GET_BASE_URI} from '../../store/constants'
// transactions
export const TRANSACTIONS_FETCH = 'getTransactions'
export const TRANSACTION_CREATE = 'createTransactions'
export const CREATE_CHECKOUT = 'createCheckout'
export const TRANSACTION_COMPLETER = 'transactionCompleter'
export const SET_TRANSACTIONS_STATE = 'setTransactionsState'
export const SET_TRANSACTIONS = 'setTransactions'
export const SET_TRANSACTIONS_META = 'setTransactionsMeta'
export const SET_TRANSACTIONS_FILTERS = 'setTransactionsFilters'
export const GET_CURRENT_TRANSACTION = 'getCurrentTransaction'
export const SET_CURRENT_TRANSACTION = 'setCurrentTransaction'
export const SET_CURRENT_TRANSACTION_STATE = 'setCurrentTransactionState'
export const REFUND_TRANSACTION = 'createRefund'
export const ADD_TRANSACTION = 'addTransaction'

// export const GET_BASE_URI = 'https://api.flopay.io/'
// export const GET_BASE_URI = 'https://645a4161.ngrok.io/api/'

export const GET_TRANSACTIONS_URI = `${GET_BASE_URI}v2/transactions.json`
export const GET_REFUND_TRANSACTION_URI = `${GET_BASE_URI}v1/reverse.json`

// reports
export const GET_FIELDS = 'getFields'
export const SET_FIELDS = 'setFields'
export const SET_FIELDS_STATE = 'setFieldsState'
export const SET_DOWNLOAD_LINK = 'setDownloadLink'
export const SUBMIT_REPORT = 'submitReport'
export const SUBMIT_JOB_REPORT = 'submitJobReport'
export const GET_REPORT = 'getReport'
export const DOWNLOAD_REPORT = 'downloadReport'

// disputes
export const GET_DISPUTES = 'getDisputes'
export const SET_DISPUTES = 'setDisputes'
export const SET_DISPUTES_STATE = 'setDisputesState'
export const CREATE_DISPUTE = 'createDisputes'
export const SET_DISPUTES_FILTERS = 'setDisputesFilters'

// payouts
export const PAYOUTS_FETCH = 'getPayouts'
export const PAYOUT_CREATE = 'createPayouts'
export const BILL_PAYOUT = 'createBillPayment'
export const SET_PAYOUTS_STATE = 'setPayoutsState'
export const SET_PAYOUTS = 'setPayouts'
export const SET_PAYOUTS_META = 'setPayoutsMeta'
export const SET_PAYOUTS_FILTERS = 'setPayoutsFilters'
export const GET_CURRENT_PAYOUT = 'getCurrentPayout'
export const SET_CURRENT_PAYOUT = 'setCurrentPayout'

// JOBS
export const GET_JOBS = 'getJobs'
export const SET_JOBS = 'setJobs'
export const RUN_JOB = 'runJob'
export const SET_JOBS_STATE = 'setJobsState'
export const GET_JOB_RUNS = 'getJobRuns'
export const GET_CURRENT_JOB_RUNS = 'getCurrentJobRuns'
export const SET_JOB_RUNS = 'setJobRuns'
export const SET_CURRENT_JOB_RUNS = 'setCurrentJobRuns'
export const SET_JOB_RUNS_STATE = 'setJobRunsState'
export const SET_JOBS_META = 'setJobsMeta'
export const CREATE_JOB = 'createJob'
export const DELETE_JOB = 'deleteJob'
export const UPDATE_JOB = 'updateJob'
export const CREATE_JOB_CONTACT = 'createJobContact'
export const DELETE_JOB_CONTACT = 'deleteJobContact'
export const GET_SINGLE_JOB = 'getCurrentJob'
export const SET_SINGLE_JOB = 'setSingleJob'
export const SET_SINGLE_JOB_STATE = 'setSingleJobState'
export const SET_FILE_UPLOAD_DETAILS = 'setFileUploadDetails'
export const SET_FILE_STATE = 'setFileState'
export const AWS_BUCKET = 'flopay-batchstore'
export const SEND_TO_BUCKET = 'sendToBucket'
export const SET_CURRENT_RUN = 'setCurrentRun'
export const GET_CURRENT_RUN = 'getCurrentRun'
export const SET_CURRENT_RUN_STATE = 'setCurrentRunState'

export const GET_JOBS_URI = `${GET_BASE_URI}v1/clients/jobs`

//  QUEUED
export const GET_QUEUE = 'getQueues'
export const SET_QUEUE = 'setQueue'
export const SET_QUEUE_STATE = 'setQueueState'
export const SET_QUEUE_FILTERS = 'setQueueFilters'
export const SET_QUEUE_META = 'setQueueMeta'

//  PENDING
export const GET_PENDING = 'getPending'
export const SET_PENDING = 'setPending'
export const SET_PENDING_STATE = 'setPendingState'
export const SET_PENDING_FILTERS = 'setPendingFilters'
export const SET_PENDING_META = 'setPendingMeta'
export const APPROVE_TRANSACTIONS = 'approveTransactions'

// FAILED
export const GET_FAILED = 'getFailed'
export const SET_FAILED = 'setFailed'
export const SET_FAILED_STATE = 'setFailedState'
export const SET_FAILED_FILTERS = 'setFailedFilters'
export const SET_FAILED_META = 'setFailedMeta'

// SEARCH
export const SEARCH_TRANSACTIONS = 'searchTransactions'

// TICKET
export const CREATE_TICKET = 'createTicket'

// TICKET
export const REQUEST_SMS = 'requestSMS'
