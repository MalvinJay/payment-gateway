<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div class="flex align-items-baseline">
                    <p class="blue-text bold-600 s-16 m-0 p-0">Fone Messenger</p>
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
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                        <p class="m-0 p-0">Unable to load this page</p>
                        <el-button @click.prevent="fetchMessages" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-table
                      ref="fone"
                      @row-click="clickRow"
                      empty-text="No fone messengers to display"
                      v-loading="loading"
                      :row-style="styleObject"
                      row-class-name="transactions-table-body"
                      header-row-class-name="transactions-table-header"
                      :data="messages">
                        <el-table-column v-loading="loading" type="expand" width="55">
                            <template slot-scope="props">
                                <div class="pl-15">
                                    <p class="blue-text s-13 bold-600">Message: </p>
                                    <p class="s-12 gray">{{ props.row.message }}</p>
                                </div>
                            </template>
                        </el-table-column>
                      <el-table-column prop="delivery_status" label="delivery status">
                          <template slot-scope="scope">
                            <div class="flex justify-content-between">
                              <the-tag v-if="scope.row.status === 'sent'" status="success" :title="scope.row.status"></the-tag>
                              <the-tag v-else status="failed" :title="scope.row.status"></the-tag>

                              <div v-if="scope.row.status !== 'sent'">
                                <el-tooltip class="item" effect="dark" content="Resend SMS" placement="top">
                                  <el-button @click="createLog(scope.row)" type="text" icon="undo icon" :loading="loadingRx" class="p-0"></el-button>
                                </el-tooltip>
                              </div>
                            </div>
                          </template>
                      </el-table-column>
                        <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                        <el-table-column width="80">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <the-tag status="failed" :title="scope.row.post_type"></the-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updated_at" label="Date" width="auto">
                            <template slot-scope="scope">
                                {{scope.row.updated_at | moment("D MMM,YY hh:mm A")}}
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{messages.length}} results
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
        {label: 'message id', dataField: 'response_id', align: 'center'},
        {label: 'status message', dataField: 'response_message', align: 'left'},
        {label: 'recipient', dataField: 'recipient_no', align: 'left'}
      ],
      logDialog: false,
      topupDialog: false,
      styleObject: {
        fontSize: '12px'
      },
      loadingRx: false,
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
      this.$store.dispatch('getFoneMessengers')
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
    }
  },
  computed: {
    ...mapGetters({
      messages: 'messages',
      state: 'messagesState',
      total: 'messagesCount',
      providers: 'providers',
      pageSize: 'pageSize',
      balance: 'balance'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    loading () {
      return this.state === 'LOADING'
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
