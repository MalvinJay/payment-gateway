<template>
    <div v-loading="loadingPage">
        <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">
                  Unable to load this page
                </p>
                <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <div v-else>
            <el-card class="card-0 position-relative">
                <div class="flex flex-column p-20">
                    <div class="flex justify-content-between align-items-baseline mb-1">
                    <div class="flex align-items-baseline">
                        <p class="blue-text s-24 m-0 p-0 bold-600">{{form.amount | money}}</p>
                        <!-- <p class="text-uppercase blue-text s-14 m-0 p-0 ml-1">{{form.currency}}</p> -->
                    </div>
                    <div>
                      <!-- <p class="text-uppercase s-12 bold-600 m-0 p-0">{{header}}</p> -->
                    </div>
                    </div>
                    <div>
                        <!-- <el-button :disabled="error" @click="refund" :loading="loading" v-if="status === 'failed' &&  form.trans_type === 'cashout'" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="undo icon"></i> Refund</el-button> -->
                        <el-button @click="ticketVisible = true" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Open Ticket</el-button>
                        <!-- <el-dropdown class="ml-10" @command="command => handleTableCommand(command, form)" trigger="click">
                            <el-button size="mini" class="mr-0 cursor z-depth-button bold-600 s-13 open-sans mini-button b-0" plain icon="ellipsis horizontal icon"></el-button>
                            <el-dropdown-menu class="w-200" slot="dropdown">
                                <el-dropdown-item disabled>
                                    <div class="table-dropdown-header bold-600 text-uppercase">
                                        action
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item class="s-12">Retry</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </div>
                </div>
                <!-- :class="[{success ? 'green': 'gray' }]" -->
                <div class="border-top px-20 py-10">
                    <div class="flex">
                        <div>
                          <i v-if="form.payment_status == 'paid'" class="check circle s-12 icon green" ></i>
                          <i v-else class="exclamation circle s-12 icon gray"></i>
                        </div>
                        <div class="flex flex-column ml-1">
                          <p v-if="form.payment_status == 'paid'" class="light mb-1 s-13">Payment succeeded</p>
                          <p v-else class="light mb-1 s-13">Payment failed</p>

                          <p class="light mb-1 s-12 gray">{{form.date}}</p>
                        </div>
                    </div>
                </div>
            </el-card>
            <!-- details -->
            <el-card class="my-2">
                <div slot="header">
                    <div class="blue-text bold-600 s-16 flex">
                        <div class="w-50">Payments Details</div>
                        <div class="w-50">Customer Details</div>
                    </div>
                </div>
                <div>
                    <div v-if="hasNoData" class="center h-80">
                        {{noData}}
                    </div>
                    <div v-if="!hasNoData">
                        <div class="flex">
                            <div class="w-50">
                                <el-row v-for="(value, key, index) in data" :key="index" class="mb-1">
                                    <el-col :span="8">
                                        <p class="m-0 text-capitalize menu-gray-text s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="16">
                                        <p v-if="key === 'date'" class="">{{value | moment("MMM Do, YYYY")}}</p>
                                        <div v-else-if="key === 'message'">
                                            <div v-if="!edit" class="flex align-items-center">
                                                <p class=" m-0 mr-6">{{value}}</p>
                                                <!-- <el-button @click="edit = true" class="blue-text p-0" type="text" icon="pencil alternate icon">Edit</el-button> -->
                                            </div>
                                            <div class="flex" v-else>
                                                <el-input size="mini" class="mr-2 no-padding-input" v-model="form.remarks"></el-input>
                                                <el-button @click="edit = false" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain>Cancel</el-button>
                                                <el-button size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain>Save</el-button>
                                            </div>
                                        </div>
                                        <p v-else class="">{{value}}</p>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="w-50">
                                <el-row v-for="(value, key, index) in data2" :key="index" class="mb-1">
                                    <el-col :span="8">
                                        <p class="m-0 text-capitalize menu-gray-text s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="6">
                                    <p v-if="key === 'date'" class="">{{value | moment("MMM Do, YYYY")}}</p>
                                    <p v-else class="">{{value}}</p>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>

            <!-- sms -->
            <el-card class="my-2 card-0">
              <div slot="header">
                  <span class="blue-text bold-600 s-16">SMS Log</span>
              </div>
              <div class="flex justify-content-between">
                <el-table
                  ref="fone"
                  empty-text="No messages to display"
                  v-loading="loading"
                  row-class-name="transactions-table-body"
                  header-row-class-name="transactions-table-header"
                  :default-expand-all="true"
                  :data="tableMessages">
                    <el-table-column type="expand" width="55">
                        <template slot="label">
                          <el-botton icon="el-icon-caret-bottom"></el-botton>
                        </template>
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
                            <the-tag :status="scope.row.delivery_status" :title="scope.row.delivery_status"></the-tag>
                            <div v-if="scope.row.delivery_status != success">
                              <el-tooltip class="item" effect="dark" content="Resend SMS" placement="top">
                                <el-button @click="resendSMS" type="text" icon="undo icon" :loading="loading" class="p-0"></el-button>
                              </el-tooltip>
                            </div>
                          </div>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in fonecolumns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column width="80">
                        <template slot-scope="scope">
                          <div class="flex">
                            <the-tag status="failed" :title="scope.row.post_type"></the-tag>
                          </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updated_at" label="Date" width="200">
                        <template slot-scope="scope">
                          {{scope.row.updated_at | moment("D MMM,YY hh:mm A")}}
                        </template>
                    </el-table-column>
                </el-table>
              </div>
            </el-card>

            <!-- Ussd Sessions -->
            <el-card class="my-2 card-0">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">Session Details</span>
                </div>
                <div>
                    <el-table
                        empty-text="No ussd session available for this session_Id"
                        tooltip-effect="light"
                        header-row-class-name="transactions-table-header"
                        row-class-name="transactions-table-body ussd_session"
                        :data="currentUssdSession">
                            <el-table-column prop="message" label="Input" width="120"></el-table-column>
                            <el-table-column prop="response" label="Response" width="auto">
                                <template slot-scope="scope">
                                  {{ scope.row.response}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="timestamp" label="Timestamp" width="180">
                                <template slot-scope="scope">
                                  {{ scope.row.timestamp  | moment("D MMM,YY hh:mm:ss A")}}
                                </template>
                            </el-table-column>
                    </el-table>
                    </div>
            </el-card>

            <!-- logs -->
            <el-card class="my-2 card-0">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">Payment Logs</span>
                </div>
                <div>
                    <el-table
                    @row-click="clickLogs"
                    empty-text="No logs found"
                    :row-style="styleObject"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="logs"
                    >
                      <el-table-column label="status" prop="status" width="150">
                              <template >
                                  <p class="status bold-600">201 OK</p>
                              </template>
                      </el-table-column>
                      <el-table-column label="description" prop="method" width="auto">
                              <template slot-scope="scope">
                                  <div class="flex justify-content-start">
                                  <p class="m-0 p-0 mr-10 bold-500 s-12 text-uppercase">{{scope.row.method || 'N/A'}}</p>
                                  <p class="m-0 p-0 mr-10 bold-500 s-12 text-lowercase">{{scope.row.url || 'n/a'}}</p>
                                  </div>
                              </template>
                      </el-table-column>
                      <el-table-column label="date" prop="created_at" width="200">
                              <template slot-scope="scope">
                                <p class="m-0 p-0 bold-500 s-12">{{scope.row.created_at | moment("D MMM,YY hh:mm A")}}</p>
                              </template>
                      </el-table-column>
                    </el-table>
                </div>
            </el-card>

            <!-- events -->
            <el-card class="my-2 card-0">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">Payment Events</span>
                </div>
                <div>
                    <el-table
                    @row-click="clickRow"
                    empty-text="No events found"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="events">
                        <el-table-column label="id" prop="id" width="150">
                                <template slot-scope="scope">
                                    <p class="m-0 p-0 mr-10 bold-500 s-12 text-uppercase">{{scope.row.id || 'N/A'}}</p>
                                </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="event" prop="request" >
                                <template slot-scope="scope">
                                    <p class="m-0 p-0 bold-500 s-12">
                                      <span v-if="scope.row.request.transaction.status === 'paid'">payment.succeeded</span>
                                      <span v-else-if="scope.row.request.transaction.status === 'pending'">payment.pending</span>
                                      <span v-else-if="scope.row.request.transaction.status === 'failed'"> payment.failed</span>
                                      <span v-else> payment.unknown</span>
                                    </p>
                                </template>
                        </el-table-column>
                        <el-table-column label="date" prop="created_at" width="200">
                                <template slot-scope="scope">
                                    <p class="m-0 p-0 bold-500 s-12">{{scope.row.created_at | moment("D MMM,YY hh:mm A")}}</p>
                                </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>

            <!-- disputes -->
            <el-card v-if="form.has_dispute" class="my-2 card-0">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">disputes</span>
                </div>
                <div>
                    <el-table
                    @row-click="clickRow"
                    empty-text="No disputes found"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="disputes">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="amount" label="Amount">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 bold-500 s-13">{{scope.row.amount | money}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="" width="auto">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <the-tag v-if="scope.row.status === 'resolved'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                    <the-tag v-else-if="scope.row.status === 'failed'" status="failed" :title="scope.row.status" icon="close icon"></the-tag>
                                    <the-tag v-else status="pending" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>

        <!-- Tickets -->
        <ticket-modal :transaction="currentUssdSessionPayment" :ticketVisible.sync="ticketVisible"></ticket-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
import moment from 'moment'

export default {
    name: 'UssdDetail',
    data () {
        return {
          icon: '',
          status: 'failed',
          edit: false,
          remarks: '',
          page: this.$route.path,
          loading: false,
          ticketVisible: false,
          columns: [
            {label: 'Customer', dataField: 'name', width: 'auto'},
            {label: 'Dispute Ref.', dataField: 'ref', width: 'auto'},
            {label: 'Transaction Ref.', dataField: 'trans_ref', width: 'auto'},
            {label: 'Date', dataField: 'date', width: 'auto'}
          ],
          fonecolumns: [
            // {label: 'message id', dataField: 'id', align: 'center'},
            {label: 'recipient', dataField: 'recipient_no', align: 'left'},
            {label: 'network', dataField: 'network_provider', align: 'left'},
          ],
          styleObject: {

          },
          log: {
            message: '',
            contacts: [],
            is_batch: false,
            transaction_id: ''
          }
        }
    },
    created () {
      EventBus.$emit('sideNavClick', 'ussd')
    },

    mounted() {
      this.$store.dispatch('getCurrentUssdSession', this.$route.params.id)
      .then((response) => {
        this.$store.dispatch('getCurrentUssdSessionPayment', this.currentUssdSession[0].sessionid)
      })

      EventBus.$on('ticketModal', (val) => {
        this.ticketVisible = val
      })
    },

    methods: {
        handleTableCommand (command, row) {
            switch (command) {
                case 'edit':
                    this.$router.push(`payments/${row.id}`)
                    break
                case 'open':
                    this.ticketVisible = true
                    this.transaction = row
                    break
                default:
                    break
            }
        },
        fetchTransactions () {
          this.$store.dispatch('getUssdSessions')
        },
        refund () {
            this.loading = true
            this.$store.dispatch('createRefund', this.form.reference)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        type: 'success',
                        message: 'Payment Refunded',
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                }
                this.loading = false
            }).catch((error) => {
                this.loading = false
                const response = error.response
                this.$message({
                    message: response.data.response.error_message,
                    type: 'error'
                })
            })
        },
        clickRow (row, event, column) {
          this.$router.push(`/events/${row.id}`)
            // if (column.property) {
            // }
        },
        clickLogs (row, event, column) {
          this.$router.push(`/logs/${row.id}`)
            // if (column.property) {
            // }
        },
        resendSMS() {
          this.loading = true
          this.log.contacts.push(this.form.customer_no)
          this.log.message = this.form.extra_data.message
          this.log.transaction_id = this.form.email_logs[0].transaction_id

          console.log('SMS Log:', this.log)

          this.$store.dispatch('createLog', this.log)
          .then((response) => {
            if (response.data.success) {
              this.$message({
                type: 'success',
                message: 'Message sent successfully'
              })
            } else {
              this.$message({
                type: 'success',
                message: 'Message being processed'
              })
            }
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
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
        currentUssdSession: 'currentUssdSession',
        form: 'currentUssdSessionPayment',
        state: 'ussdSessionsState',
        currentUssdSessionPayment: 'currentUssdSessionPayment'
      }),
      events () {
        return this.form.events
      },
      logs () {
        return this.form.logs
      },
      disputes () {
        return this.form.disputes.map(el => {
          el.date = moment(el.created_at).format('D MMM,YY hh:mm A')
          return el
        })
      },
      messages () {
        return this.form.extra_data.message || 'N/A'
      },
      tableMessages() {
        return this.form.sms_logs
      },
      loadingPage () {
        return this.state === 'LOADING'
        // return true
      },
      error () {
        return this.state === 'ERROR'
      },
      success () {
        return this.status === 'paid'
      },
      data () {
        var symbol = 'GHs'
        if (this.form.currency === 'GHs') {
          symbol = 'GHs'
        }
        var nForm = {
          name: this.form.company? this.form.company: 'N/A',
          'phone number': this.form.customer_no,
          // reference: this.form.reference,
          reference: this.form.reference,
          amount: `${symbol} ${this.form.amount}`,
          fee: `${symbol} ${this.form.charged_amount}`,
          date: this.form.date,
          time: this.form.time,
          remarks: this.form.remarks ? this.form.remarks : '-'
        }
        return nForm
      },
      data2 () {
        let ExamsType;
        if(this.form.extra_data.type === 'BECE') {
          ExamsType = 'BECE(School)';
        }
        else {
          if(this.form.extra_data.type === 'PBEC') {
            ExamsType = 'BECE(Private)';
          } else {
            ExamsType = this.form.extra_data.type
          }
        }

        var nForm = {
          'Exams Type':  ExamsType || 'N/A',
          'Customer Name': this.form.extra_data.name || 'NA',
          'Index Number': this.form.extra_data.index_no,
          'Year': this.form.extra_data.year,
        }
        return nForm
      },
      hasNoData () {
        return typeof this.form === 'undefined'
      },
      header () {
        // if (this.form.trans_type === 'cashin') {
        //     EventBus.$emit('sideNavClick', 'payouts')
        // } else {
        //     EventBus.$emit('sideNavClick', 'ussd')
        // }
        EventBus.$emit('sideNavClick', 'ussd')
        // var header = this.form.trans_type === 'cashout' ? 'Receipt' : 'Payment'
        var header = 'Ussd'

        return header
      }
    }
}
</script>

<style lang="scss" scoped>
.payment-div{
    height: 80px;
}
.ml-10{
    margin-left: 10px;
}
.green{
    color: #1ea672;
}
.lightgray{
    color: #697386
}
.gray{
    color: #8792a2
}
.w-100{
    width: 100px;
}
.mb-2{
    margin-bottom: 1em
}
.h-80{
    min-height: 100px
}
</style>
