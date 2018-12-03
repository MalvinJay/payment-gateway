# flopay_vue

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

<!-- APIS USED -->
BASE URL => https://api.flopay.io/

<!-- CLIENT -->
login               = /v1/flopay_client_login.json?email=${email}&password=${password}
getToken            = /v1/login.json
getBalance          = /v1/balance.json
resetPassword       = /v1/users/pass_reset.json
GET transactions    = /v2/transactions.json
    filters = {
        page, limit, search_value, all
    }
    payments    = search_value=cash_out
    payouts     = search_value=cash_in
    settlements = search_value=cash_in
    topups      = search_value=cash_in
    queued      = search_value=queued
    pending     = search_value=pending
POST payments       = /v1/receive.json
GET transaction     = /v1/rekt_transacts/${id}
POST ticket         = /v1/clients/tickets/via/support
POST refund         = /v1/reverse.json?transaction_ref=${reference}
GET reportfields    = /v1/clients/reports/fields
POST report         = /v1/clients/reports/custom?${report}
GET report link     = /v1/clients/reports/${job_id}
GET download report = /v1/clients/reports/download?file_name=${report}`
POST payout         = /v1/transfer.json
GET jobs            = /v1/clients/jobs/files/all.json
GET job runs        = /v1/clients/jobs/groups?job_id=${id}&all=true
POST job            = /v1/clients/jobs/files.json
POST job run        = /v1/clients/jobs/files/${id}/run

<!-- ADMIN -->
admin_login         = /v1/flopay_platform/login.json?email=${email}&password=${password}
GET transactions    = /v2/accounts/transactions



