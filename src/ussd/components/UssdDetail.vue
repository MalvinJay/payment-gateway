<template>
    <div v-loading="loadingPage">
        <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">Unable to load this page</p>
                <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <div v-else >
            <el-card class="card-0 position-relative">
                <div class="flex flex-column p-20">
                    <div class="flex justify-content-between align-items-baseline mb-1">
                    <div class="flex align-items-baseline">
                        <p class="blue-text s-24 m-0 p-0 bold-600">{{form.amount | money}}</p>
                        <p class="text-uppercase blue-text s-14 m-0 p-0 ml-1">{{form.currency}}</p>
                    </div>
                    <div>
                        <p class="text-uppercase s-12 bold-600 m-0 p-0">{{header}}</p>
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
                          <p v-if="form.payment_status == 'paid'" class="light mb-1 s-13">{{header}} payment succeeded</p>
                          <p v-else class="light mb-1 s-13">{{header}} payment failed</p>
                          
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
                    <span class="blue-text bold-600 s-16">SMS</span>
                </div>
                <div>
                  <!-- <el-table ref="fone" empty-text="No messages to display" v-loading="loading" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="messages">
                      <el-table-column type="expand" width="55">
                          <template slot-scope="props">
                              <div class="pl-15">
                                  <p class="blue-text s-13 bold-600">Message: </p>
                                  <p class="s-12 gray">{{ props.row.message }}</p>
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
                  </el-table> -->
                  <div class="flex pl-15 px-10 py-20">
                    <p class="blue-text s-13 pr-10 m-0">Message: </p>
                    <p class="s-12 blue-text bold-600">{{messages}}</p>
                  </div>                  
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
                            <el-table-column prop="message" label="Input" width="200"></el-table-column>
                            <el-table-column prop="response" label="Response" width="auto">
                                <template slot-scope="scope">
                                    {{ scope.row.response}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="timestamp" label="Timestamp" width="300">
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
                    <el-table @row-click="clickLogs" empty-text="No logs found" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="logs">
                        <el-table-column label="status" prop="status" width="100">
                                <template slot-scope="scope">
                                    <p class="status bold-600">201 OK</p>
                                </template>
                        </el-table-column>
                        <el-table-column label="description" prop="method">
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
                        <el-table-column show-overflow-tooltip label="event" prop="event">
                                <template slot-scope="scope">
                                    <p class="m-0 p-0 bold-500 s-12">{{scope.row.code || 'N/A'}}</p>
                                </template>
                        </el-table-column>
                        <el-table-column label="id" prop="id" width="200">
                                <template slot-scope="scope">
                                    <p class="m-0 p-0 mr-10 bold-500 s-12 text-uppercase">{{scope.row.id || 'N/A'}}</p>
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
                {label: 'message id', dataField: 'response_id', align: 'center'},
                {label: 'delivery status', dataField: 'response_message', align: 'left'},
                {label: 'recipient', dataField: 'recipient_no', align: 'left'}
            ],
            styleObject: {

            }
        }
    },
    created () {
        EventBus.$emit('sideNavClick', 'ussd')
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
        //    this.$store.dispatch('getCurrentTransaction', this.$route.params.id)
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
            if (column.property) {
            this.$router.push(`/events/${row.id}`)
            }
        },
        clickLogs (row, event, column) {
            if (column.property) {
                this.$router.push(`/logs/${row.id}`)
            }
        },
    },
    mounted () {
        this.$store.dispatch('getCurrentUssdSession', this.$route.params.id)
        .then((response) => {
            console.log('CurrentSession: ', this.currentUssdSession)
            this.$store.dispatch('getCurrentUssdSessionPayment', this.currentUssdSession[0].sessionid)
            .then((response) => {
              console.log('currentUssdSessionPayment:', this.currentUssdSessionPayment)
            })
        })

        console.log('Form!!: ', this.form)

        EventBus.$on('ticketModal', (val) => {
          this.ticketVisible = val
        })
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
          return this.form.extra_data.messages || 'N/A'
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
          var nForm = {
            'Candidate Name': this.form.extra_data.name? this.form.extra_data.name: 'N/A',
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
