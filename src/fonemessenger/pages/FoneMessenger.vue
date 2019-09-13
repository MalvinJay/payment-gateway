<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div class="flex align-items-baseline">
                    <filter-component dispatch="setFoneFilters" filterType="fone"></filter-component>
                </div>

                <div class="search_n_roles flex w-50">
                  <el-input @keyup.enter.native="searchButton" :prefix-icon="icon" v-model="search" clearable class="search-div mr-2" size="mini" placeholder="Search phone number"></el-input>
                </div>

                <div class="flex align-items-center">
                    <p class="balance-info gray-text border-right">{{balance.fon_messanger_balance | money }}</p>
                    <el-tooltip class="item" effect="dark" content="Refresh" placement="top">
                        <el-button @click.prevent="fetchMessages" icon="undo icon" type="text"></el-button>
                    </el-tooltip>
                    <el-button @click="topupDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> Topup</el-button>
                    <el-button @click="logDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button>
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
                                            <the-tag v-else-if="scope.row.delivery_status == 'REPOSETED'" status="success" title="REPOSETED"></the-tag>
                                            <the-tag v-else-if="scope.row.delivery_status === null" status="failed" title="pending"></the-tag>
                                            <the-tag v-else status="failed" :title="scope.row.delivery_status"></the-tag>


                                            <div v-if="scope.row.delivery_status == 'DELIVERED' || scope.row.delivery_status == 'Message delivered to handset' || scope.row.delivery_status == 'REPOSETED'">
                                            </div>
                                            <div v-else>
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
                              <the-tag v-else-if="scope.row.delivery_status == 'REPOSETED'" status="success" title="REPOSETED"></the-tag>
                              <the-tag v-else-if="scope.row.delivery_status === null" status="failed" title="pending"></the-tag>
                              <the-tag v-else status="failed" :title="scope.row.delivery_status"></the-tag>

                              <div v-if="scope.row.delivery_status == 'DELIVERED' || scope.row.delivery_status == 'Message delivered to handset' || scope.row.delivery_status == 'REPOSETED'">
                              </div>
                              <div v-else>
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
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { Utils } from '../../utils/services'
import { mapGetters } from 'vuex'
import LogDialog from '../components/LogDialog'
import TopupAccount from '../components/TopupAccount'

export default {
  name: 'Sms',
  props: ['type'],
  components: {
    LogDialog,
    TopupAccount
  },
  data () {
    return {
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
      balance: 'balance'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    loading () {
      return this.state === 'LOADING'
    },
    total() {
      return this.meta.total
    }
  }
}
</script>


<style lang="scss" scoped>
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
      // height: 30px;
      line-height: 1em;
      // padding: 0 10px;
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
