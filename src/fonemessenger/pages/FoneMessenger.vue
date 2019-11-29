<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div class="flex align-items-baseline">
                    <filter-component dispatch="setFoneFilters" filterType="fone"></filter-component>
                </div>

                <div class="search_n_roles flex w-50">
                  <el-input @keyup.enter.native="searchButton" :prefix-icon="icon" v-model="search" clearable @clear="reset" class="search-div mr-2" size="mini" placeholder="Search phone number"></el-input>
                </div>

                <div class="flex align-items-center relative">
                  <p class="balance-info gray-text border-right">{{balance.fon_messanger_balance | money }}</p>

                  <el-tooltip class="item" effect="dark" content="Refresh" placement="top">
                    <el-button @click.prevent="fetchMessages" icon="undo icon" type="text"></el-button>
                  </el-tooltip>

                  <el-button @click="exportVisible = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text">
                    <i class="file alternate outline icon"></i>
                    Export SMS
                  </el-button>
                  <!-- <el-button @click.prevent="fetchMessages" icon="undo icon" type="text"></el-button> -->

                  <div class="relative">
                    <el-dropdown class="" @command="command => handleTableCommand(command)" trigger="click">
                        <el-button class="mr-0 ml-2 cursor z-depth-button bold-600 s-13 open-sans mini-button b-0" type="text" size="mini" plain icon="ellipsis horizontal icon"></el-button>
                        <el-dropdown-menu class="w-auto p-10" slot="dropdown">
                          <!-- <el-dropdown-item command="topup" class="s-12"><i class="plus icon"></i> Topup</el-dropdown-item>
                          <el-dropdown-item command="new" class="s-12"><i class="plus icon"></i> New</el-dropdown-item> -->
                          <el-button @click="topupDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> Topup</el-button>
                          <el-button @click="logDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </div>

                  <!--
                    <div>
                      <el-button @click="topupDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> Topup</el-button>
                      <el-button @click="logDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button>
                    </div>
                  -->
                </div>
            </div>
            <div v-loading="loading">
                <div class="center h-80" v-if="error">
                  <div class="center flex-column">
                      <p class="m-0 p-0">Unable to load this page</p>
                      <el-button @click.prevent="fetchMessages" icon="sync icon" type="text">Retry</el-button>
                  </div>
                </div>
                <div v-loading="loadingRetry" v-else>
                    <el-table
                      ref="fone"
                      @row-click="clickRow"
                      empty-text="No fone messengers to display"
                      :row-style="styleObject"
                      row-class-name="transactions-table-body"
                      header-row-class-name="transactions-table-header"
                      :data="messages">
                        <el-table-column type="expand" width="55">
                            <template slot-scope="props">
                                <div class="pl-15 mb-2">
                                  <p class="blue-text s-13 bold-600">Message: </p>
                                  <p class="s-12 gray">{{ props.row.message }}</p>
                                </div>

                                <el-card v-if="props.row.reposted_logs.length > 0" class="pb-5">
                                  <el-table
                                    ref="reposted"
                                    empty-text="No reposted message logs"
                                    :row-style="styleObject"
                                    row-class-name="transactions-table-body"
                                    header-row-class-name="transactions-table-header"
                                    :data="props.row.reposted_logs">
                                      <el-table-column type="expand" width="55">
                                          <template slot-scope="props">
                                              <div class="pl-15">
                                                <p class="blue-text s-13 bold-600">Message: </p>
                                                <p class="s-12 gray">{{ props.row.message }}</p>
                                              </div>
                                          </template>
                                      </el-table-column>
                                    <el-table-column prop="delivery_status" label="delivery status" width="auto">
                                        <template slot-scope="scope">
                                          <div class="flex justify-content-between">
                                            <the-tag v-if="scope.row.delivery_status === 'DELIVERED' || scope.row.delivery_status === 'Message delivered to handset'" status="success" title="DELIVERED"></the-tag>
                                            <the-tag v-else-if="scope.row.delivery_status == 'REPOSTED'" status="success" title="REPOSTED"></the-tag>
                                            <the-tag v-else-if="scope.row.delivery_status === null" status="failed" title="pending"></the-tag>
                                            <the-tag v-else status="failed" :title="scope.row.delivery_status"></the-tag>

                                            <div v-if="scope.row.delivery_status === 'pending' || scope.row.delivery_status === 'UNDELIV'">
                                              <el-tooltip class="item" effect="dark" content="Resend SMS" placement="top">
                                                <el-button @click="repostLog(scope.row)" type="text" icon="undo icon" :loading="loadingRx" class="p-0"></el-button>
                                              </el-tooltip>
                                            </div>
                                          </div>
                                        </template>
                                    </el-table-column>
                                      <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label" :width="column.width"></el-table-column>
                                      <el-table-column prop="created_at" label="Sent At" width="auto">
                                          <template slot-scope="scope">
                                              {{scope.row.created_at | moment("D MMM,YY hh:mm A")}}
                                          </template>
                                      </el-table-column>
                                      <el-table-column prop="" label="Delivered At" width="auto">
                                          <template slot-scope="scope">
                                            <div v-if="scope.row.callback_data">
                                              <span class="bold-600">{{scope.row.callback_data.createdAt | moment("D MMM,YY hh:mm A")}}</span>
                                            </div>
                                            <div v-else>
                                              N/A
                                            </div>
                                          </template>
                                      </el-table-column>
                                  </el-table>
                                </el-card>
                            </template>
                        </el-table-column>
                      <el-table-column prop="delivery_status" label="delivery status" width="auto">
                          <template slot-scope="scope">
                            <div class="flex justify-content-between">
                              <the-tag v-if="scope.row.delivery_status === 'DELIVERED' || scope.row.delivery_status === 'Message delivered to handset'" status="success" title="DELIVERED"></the-tag>
                              <the-tag v-else-if="scope.row.delivery_status === 'REPOSTED'" status="success" title="REPOSTED"></the-tag>
                              <the-tag v-else-if="scope.row.delivery_status === null" status="failed" title="pending"></the-tag>
                              <the-tag v-else status="failed" :title="scope.row.delivery_status"></the-tag>

                              <div v-if="scope.row.delivery_status === 'pending' || scope.row.delivery_status === 'UNDELIV'">
                                <el-tooltip class="item" effect="dark" content="Resend SMS" placement="top">
                                  <el-button @click="repostLog(scope.row)" type="text" icon="undo icon" :loading="loadingRx" class="p-0"></el-button>
                                </el-tooltip>
                              </div>
                            </div>
                          </template>
                      </el-table-column>
                        <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label" :width="column.width"></el-table-column>
                        <el-table-column width="80">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <the-tag status="failed" :title="scope.row.post_type"></the-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="created_at" label="Sent At" width="auto">
                            <template slot-scope="scope">
                                {{scope.row.created_at | moment("D MMM,YY hh:mm A")}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="Delivered At" width="auto">
                            <template slot-scope="scope">
                              <div v-if="scope.row.callback_data">
                                <span class="bold-600">{{scope.row.callback_data.createdAt | moment("D MMM,YY hh:mm A")}}</span>
                              </div>
                              <div v-else>
                                N/A
                              </div>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            <span class="bold-600">{{messages.length}}</span> results of <span class="bold-600">{{total}}</span>
                        </div>
                        <el-pagination class="my-2 flex justify-content-end"

                            @current-change="handleCurrentChange"
                            :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <log-dialog :modalVisible="logDialog"></log-dialog>
        <topup-account :modalVisible="topupDialog"></topup-account>

        <!-- Fon Messeges Report -->
      <el-dialog custom-class="export-dialog" title="Export SMS" :visible="exportVisible" width="25%">
        <div class="flex justify-content-center new-export-bg ">
            <el-form hide-required-asterisk class="transaction-form my-2" size="mini" style="width: 90%" ref="form" :model="form" label-position="top">
              <el-form-item label="Select Date">
                  <el-date-picker
                  v-model="dateColumns"
                  type="daterange"
                  @change="dateRangeClicked"
                  start-placeholder="Start date"
                  end-placeholder="End date">
                  </el-date-picker>
              </el-form-item>
              <el-form-item class="flex justify-content-end">
                <div class="flex">
                    <el-button @click="close">Cancel</el-button>
                    <a :href="`${GET_BASE_URI}v1/sms_delivery/${letsEcrypt}/download_file?${generateQueryParams}`"
                    class="cursor open-sans el-button el-button--primary el-button--mini" target="_blank" @click="close" download>Download</a>
                </div>
              </el-form-item>
            </el-form>
          </div>
      </el-dialog>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import Utils from '../../utils/services'
import { mapGetters } from 'vuex'
import LogDialog from '../components/LogDialog'
import TopupAccount from '../components/TopupAccount'
import { GET_BASE_URI } from '../../store/constants'
import moment from 'moment'

export default {
  name: 'Sms',
  props: ['type'],
  components: {
    LogDialog,
    TopupAccount
  },
  data () {
    return {
      dummyDate: '11/24/2019 04:29:36',
      test: true,
      columns: [
        {label: 'message id', dataField: 'response_id', align: 'center', width: '270'},
        {label: 'network', dataField: 'network_provider', align: 'center', width: '100'},
        {label: 'recipient', dataField: 'recipient_no', align: 'left', width: 'auto'},
      ],
      logDialog: false,
      topupDialog: false,
      styleObject: {
        fontSize: '12px'
      },
      loadingRx: false,
      loadingRetry: false,
      search: '',
      icon: 'el-icon-search',
      form: {
        is_batch: false,
        contacts: []
      },
      reportForm: {
        from: '',
        to: ''
      },
      exportVisible: false,
      GET_BASE_URI: GET_BASE_URI,
    }
  },
  created () {
    this.$store.dispatch('getFoneMessengers')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'fonemessenger')
    EventBus.$on('logModal', () => {
       this.logDialog = false
    })
    EventBus.$on('topupModal', () => {
       this.topupDialog = false
    })
  },
  beforeDestroy () {
    EventBus.$off('logModal', () => {
      this.logDialog = false
    })
  },
  methods: {
    handleTableCommand (command) {
      switch (command) {
        case 'topup':
          this.topupDialog = true
        break
        case 'new':
          this.logDialog = true
        break
        default:

        break
      }
    },
    dateRangeClicked () {

    },
    reset() {
      EventBus.$emit('resetFilters')
    },
    close () {
      this.exportVisible = false
      this.ready = false
    },
    handleCurrentChange (val) {
      this.$store.dispatch('getFoneMessengers', {page: val, cache: false})
    },
    clickRow (row, event, column) {
      this.$refs.fone.toggleRowExpansion(row)
    },
    fetchMessages () {
      this.$store.dispatch('getFoneMessengers', {cache: false})
    },
    topUpAccount () {

    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createTransactions', this.form)
            .then((response) => {
                this.$message({
                    message: 'Payment successful',
                    type: 'success'
                })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    searchButton () {
      this.icon = 'el-icon-loading'
      this.$store.dispatch('getFoneMessengers', {cache: false, search_value: this.search })
      .then(() => {
          this.icon = 'el-icon-search'
      })
    },
    createLog (row) {
      this.loadingRx = true
      if (row.post_type !== 'single') {
        this.form.file_url = ''
        this.form.is_batch = true
      } else {
        this.form.message = row.message
        this.form.contacts.push(row.recipient_no)
        this.form.title = 'Message'
        this.form.is_batch = false
      }
      this.$store.dispatch('createLog', this.form)
      .then((response) => {
          if (response.data.success) {
              this.$message({
                type: 'success',
                message: 'Message Sent'
              })
              this.$store.dispatch('getFoneMessengers', { cache: false })
              this.$store.dispatch('getBalance')
              this.loadingRx = false
          } else {
            this.$message({
              type: 'error',
              message: response.data.response.message
            })
          }
      }).catch((error) => {
        this.loadingRx = false
        const response = error.response
        this.$message({
          message: 'Failed to send message. Please try again',
          type: 'error'
        })
      })
    },
    repostLog (row) {
      this.loadingRetry = true
      console.log('Report SMS body:', row)

      this.form.sms_id = row.response_id
      this.form.is_repost = true

      if (row.post_type !== 'single') {
        this.form.file_url = ''
        this.form.is_batch = true
      } else {
        this.form.message = row.message
        this.form.contacts.push(row.recipient_no)
        this.form.title = 'Message'
        this.form.is_batch = false
      }

      this.$store.dispatch('createLog', this.form)
      .then((response) => {
          if (response.data.success) {
              this.$message({
                type: 'success',
                message: 'Message reposted successfully'
              })
              this.$store.dispatch('getFoneMessengers', { cache: false })
              this.$store.dispatch('getBalance')
              this.loadingRetry = false
          } else {
            this.$message({
              type: 'error',
              message: response.data.response.message
            })
            this.loadingRetry = false
          }
      }).catch((error) => {
        this.loadingRetry = false
        const response = error.response
        this.$message({
          message: 'Failed to repost message. Please try again',
          type: 'error'
        })
      })
    },
  },
  computed: {
    ...mapGetters({
      messages: 'messages',
      state: 'messagesState',
      meta: 'messagesMeta',
      providers: 'providers',
      pageSize: 'pageSize',
      balance: 'balance',
      user: 'user',
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    loading () {
      return this.state === 'LOADING'
    },
    total() {
      return this.meta.total
    },
    letsEcrypt() {
      const CTRL_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      var Base64 = {_keyStr: CTRL_KEY, encode: function (e) { var t = ''; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ''; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ''); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } }t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, '\n'); var t = ''; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ''; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t }}
      var encodedString = Base64.encode('5b1892ab46d583da4542d5951ccf6d38ec27a6a8a3f1e3d9bbeb730827731314')

      return encodedString
    },
    dateColumns: {
      get () {
        var from = this.reportForm.from
        var to = this.reportForm.to
        var arr = [from, to]
        return arr
      },
      set (value) {
        this.reportForm.from = moment(value[0]).format('YYYY-MM-DD')
        this.reportForm.to = moment(value[1]).format('YYYY-MM-DD')
      }
    },
    generateQueryParams() {
      var query = `till_number=${this.user.client.code}`

      if (Utils.present(this.reportForm.from)) {
        query = query += `&from=${this.reportForm.from}`
      }
      if (Utils.present(this.reportForm.to)) {
        query = query += `&to=${this.reportForm.to}`
      }

      // if (Utils.present(this.form.fields)) {
      //   if (this.form.fields.length === 1) {
      //     query = query += `&fields[]=${this.form.fields}`
      //   } else {
      //     var q = this.form.fields.split(',')
      //     q.forEach(element => {
      //       query = query += `&fields[]=${element}`
      //     })
      //   }
      // }

      console.log('Query:', query)
      return query
    },
  }
}
</script>


<style lang="scss" scoped>
  .relative {
    position: relative;
  }
  .mini-menu{
      position: absolute;
      top: 8px;
      padding: 2px 7px;
      border-radius: 4px;
      transition: all ease;
      line-height: normal;
      right: 20px;

      &:hover{
          // background: red;
      }
      .first-icon{
          opacity: 0;
      }
      i{
          // &:first-child{
          //     opacity: 0;
          // }
          font-size: 12px;
      }
  }
  .balance-info{
      margin: 0;
      margin-right: 10px;
      padding-right: 10px;
  }
  .new-transaction{
      .el-dialog__header{
          color: #2b2d50;
      }
      .el-dialog__body{
          padding: 20px
      }
  }
  .new-transaction-bg{
      background: #F7FAFC;
  }
  .transactions-table-header{
      background-color: #F7FAFC !important;
      height: 36px !important;

      th{
          background-color: #F7FAFC !important;
          padding: 0 !important;
      }

  }
  .mr-10{
      margin-right: 10px;
  }
  .pl-15{
      padding-left: 15px;
  }
  .mini-button{
      line-height: 1em;
      padding: 7px 10px !important;
      color: rgba(0,0,0,.6);

      &:hover{
          color: rgba(0,0,0,.8);
      }

      span{
          font-weight: 600
      }
      i{
          margin-right: 5px;
      }
  }
</style>
