<template>
    <div class="transactions">
        <div class="trans-div flex justify-content-between">
            <div>
                <filter-component dispatch="setPayoutsFilters" filterType="payouts"></filter-component>
            </div>
            <div>
                <el-tooltip class="item" effect="dark" content="Refresh" placement="top">
                    <el-button @click.prevent="fetchTransactions" icon="undo icon" type="text"></el-button>
                </el-tooltip>
                <el-button v-can="'Make Payout'" class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> Make Payment</el-button>
                <el-button v-can="'Generate Reports'" @click="exportVisible = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="file alternate outline icon"></i> Export</el-button>
            </div>
        </div>
        <div>
            <div class="center h-80" v-if="error">
                <div class="center flex-column">
                    <p class="m-0 p-0">Unable to load this page</p>
                    <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
                </div>
            </div>
            <div v-else>
                <el-table
                @row-click="clickRow"
                empty-text="No match found, filter desired period range"
                v-loading="loading"
                :row-style="styleObject"
                :row-class-name="tableRowClassName"
                header-row-class-name="transactions-table-header"
                :data="filteredTransactions">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="amount" label="Amount" width="150">
                        <template slot-scope="scope">
                            <div class="flex align-items-center cursor">
                                <p style="color: #2b2d50;" class="m-0 p-0 mr-10 bold-500 s-13">GHS {{scope.row.receiver_amount}}</p>
                                <!-- <p class="m-0 p-0 mr-10">{{scope.row.receiver_currency}}</p>
                                <div>
                                    <the-tag v-if="scope.row.status === 'Paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                    <the-tag v-else-if="scope.row.status === 'Failed'" status="failed" :title="scope.row.status" icon="close icon"></the-tag>
                                    <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div> -->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="" width="auto">
                        <template slot-scope="scope">
                            <div class="flex">
                                <the-tag v-if="scope.row.status === 'Paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                <the-tag v-else-if="scope.row.status.toLowerCase() === 'failed'" status="success" :title="scope.row.status" icon="close icon"></the-tag>
                                <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="created_at" label="Date" width="170">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("D MMM,YY hh:mm A")}}
                        </template>
                    </el-table-column>
                    <el-table-column width="80px">
                        <template slot-scope="scope">
                            <i v-if="scope.row.has_dispute" class="exclamation icon red-text"></i>
                            <div>
                                <!-- <i v-if="scope.row.status.toLowerCase() ==='failed'" class="reply icon blue-text cursor first-icon"></i> -->
                                <el-dropdown class="mini-menu" @command="command => handleTableCommand(command, scope.row)" trigger="click">
                                    <!-- <i class="ellipsis horizontal icon m-0 mr-0 blue-text cursor"></i> -->
                                    <el-button class="trans-icon-only-button" type="text" size="mini" plain icon="ellipsis horizontal icon"></el-button>
                                    <el-dropdown-menu class="w-200" slot="dropdown">
                                        <el-dropdown-item disabled>
                                            <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                action
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item command="open" class="s-12">Open Ticket</el-dropdown-item>
                                        <el-dropdown-item command="retry" class="s-12">Retry</el-dropdown-item>
                                        <el-dropdown-item divided disabled>
                                            <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                connection
                                            </div></el-dropdown-item>
                                        <el-dropdown-item command="edit" class="s-12">View Payment Details</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-10">
                    <div class="s-12">
                        {{transactions.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- New Payout -->
        <el-dialog custom-class="new-transaction"
            title="Create New Payment - Mobile Money"
            :visible.sync="dialogVisible"
            width="30%">
            <div class="flex justify-content-center new-transaction-bg">
                <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form" :rules="rules" :model="form" label-width="120px">
                    <el-form-item label="Type of transaction">
                        <el-select v-model="form.service_code">
                            <el-option label="Make Payment" value="cashin"></el-option>
                            <el-option v-service="'Airtime'" label="Airtime" value="airtime"></el-option>
                            <el-option v-service="'Billpay'" label="Bill Payment" value="bill"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="form.service_code === 'bill'">
                        <el-form-item label="Provider">
                            <el-select v-model="form.provider" placeholder="Select Provider">
                                <el-option
                                    v-for="(item, index) in banks" :key="index"
                                    :label="item.name"
                                    :value="item.code"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="h-auto" label="Account Number">
                            <el-input v-model="form.account_number"></el-input>
                        </el-form-item>
                        <el-form-item label="Recipient Amount" prop="recipient_amount">
                            <el-input class="little-padding-input" v-model="form.recipient_amount"><span slot="prefix">&#8373</span></el-input>
                        </el-form-item>

                    </div>
                    <div v-else>
                        <el-form-item label="Recipient Name">
                            <el-input v-model="form.recipient_name"></el-input>
                        </el-form-item>
                        <el-form-item class="h-auto" label="Recipient Number" prop="recipient_no">
                            <el-input v-model="form.recipient_no"></el-input>
                        </el-form-item>
                        <el-form-item label="Provider">
                            <el-select v-model="form.provider" placeholder="Select Provider">
                                <el-option
                                    v-for="(item, index) in providers" :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Sender Amount" prop="sender_amount">
                            <el-input class="little-padding-input" v-model="form.sender_amount"><span slot="prefix">&#8373</span></el-input>
                        </el-form-item>
                        <el-form-item label="Recipient Amount" prop="recipient_amount">
                            <el-input class="little-padding-input" v-model="recipient_amount"><span slot="prefix">&#8373</span></el-input>
                        </el-form-item>
                        <div v-if="form.service_code === 'airtime'">
                            <el-form-item label="Opt Token">
                                <el-tooltip content="Default: false - 'true' would allow the system to send a token when a transfer fails" placement="top">
                                    <el-switch
                                        v-model="form.token">
                                    </el-switch>
                                </el-tooltip>
                            </el-form-item>
                        </div>
                        <el-form-item label="Remarks">
                            <el-input type="textarea" v-model="form.remarks"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="close">Cancel</el-button>
                <el-button v-if="form.service_code === 'bill'" size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="billPayment('form')">Initiate Bill Payment</el-button>
                <el-button v-else size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="submitForm('form')">Initiate Payment</el-button>
            </span>
        </el-dialog>
        <export-modal type="withdrawal" :modalVisible.sync="exportVisible"></export-modal>
        <ticket-modal :transaction="transaction" :ticketVisible.sync="ticketVisible"></ticket-modal>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Utils from '../../utils/services'

export default {
  name: 'PayoutsTable',
  props: ['type'],
  data () {
    return {
    //   test: true,
      createLoading: false,
      columns: [
        // {label: 'Method', dataField: 'method', width: '100px'},
        {label: 'Customer', dataField: 'customer', width: 'auto'},
        {label: 'Reference', dataField: 'reference', width: 'auto'},
        {label: 'type', dataField: 'transaction_type', width: '100px'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      activeName: '1',
      date: false,
      dialogVisible: false,
      ticketVisible: false,
      exportVisible: false,
      transaction: {},
      form: {
        sender_amount: '',
        sender_currency: 'GHS',
        recipient_amount: '',
        recipient_currency: 'GHS',
        recipient_no: '',
        recipient_name: '',
        provider: '',
        country_code: 'GH',
        service_code: 'cashin',
        live: false
      },
      rules: {
        recipient_no: [
            { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
        ],
        sender_amount: [
            { required: true, message: 'This field is required', trigger: 'blur' }
        ],
        recipient_amount: [
            { required: true, message: 'This field is required', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$store.dispatch('getPayouts')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'payouts')
    EventBus.$on('ticketModal', (val) => {
        this.ticketVisible = false
    })
    EventBus.$on('exportModal', (val) => {
        this.exportVisible = false
    })
  },
  beforeDestroy () {
    EventBus.$off('ticketModal', (val) => {
        this.ticketVisible = false
    })
    EventBus.$off('exportModal', (val) => {
        this.exportVisible = false
    })
  },
  methods: {
    clickRow (row, event, column) {
        if (column.property || !column.status === 'error') {
            this.$router.push(`/payments/${row.reference}`)
        }
    },
    tableRowClassName ({row, rowIndex}) {
        if (row.has_dispute) {
            return 'transactions-table-body warning-row'
        } else {
            return 'transactions-table-body'
        }
    },
    handleCurrentChange (val) {
        this.$store.dispatch('getPayouts', {page: val, cache: false})
    },
    fetchTransactions () {
      this.$store.dispatch('getPayouts', {cache: false})
    },
    close () {
        this.form = {
            sender_amount: '',
            sender_currency: 'GHS',
            recipient_amount: '',
            recipient_currency: 'GHS',
            recipient_no: '',
            recipient_name: '',
            provider: '',
            country_code: 'GH',
            service_code: 'cashin',
            live: false
        }
        this.dialogVisible = false
    },
    handleTableCommand (command, row) {
        switch (command) {
            case 'edit':
                this.$router.push(`payments/${row.id}`)
                break
            case 'open':
                this.ticketVisible = true
                this.transaction = row
                break
            case 'retry':
                this.retry(row)
                break
            default:
                break
        }
    },
    retry (row) {
        var form = Utils.retryTransactions(row, 'payout')
        form.live = !this.test
        form.dummy = this.test

        this.$store.dispatch('createPayouts', form)
        .then((response) => {
            if (response.data.success) {
                this.$message({
                    message: 'Retry successful',
                    type: 'success'
                })
                this.fetchTransactions()
                this.dialogVisible = false
                this.$store.dispatch('getBalance')
            } else {
                this.$message({
                    type: 'error',
                    message: response.data.response.error_message
                })
            }
        }).catch((error) => {
            const response = error.response
            this.$message({
                message: response.data.error,
                type: 'error'
            })
        })
    },
    submitForm (formName) {
        this.createLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.live = !this.test
            this.form.dummy = this.test
            // this.form.service_code = 'cashin'
            // this.form.reference = 'FLPCI' + Math.floor(Math.random() * 99999999999)
            var ref = 'FLPCI' + Math.floor(Math.random() * 99999999999)
            if (this.form.service_code === 'airtime') {
                // this.form.client_ref = ref
                // this.form.reference = ref
                this.form.integration_type = 'FLOPAY_WEB_AIR'
                this.form.live= true
                this.dummy= false
            } else {
                this.form.reference = ref
            }

            this.$store.dispatch('createPayouts', this.form)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        message: 'Payout successful',
                        type: 'success'
                    })
                    this.fetchTransactions()
                    this.dialogVisible = false
                    this.$store.dispatch('getBalance')
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.error_message
                    })
                }
                this.createLoading = false
            }).catch((error) => {
                this.createLoading = false
                this.$message({
                    type: 'error',
                    message: 'Error. Please check your connection and try again'
                })
            })
          } else {
            this.createLoading = false
            return false
          }
        })
    },
    billPayment (formName) {
        this.createLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var form = {}
            form.live = !this.test
            form.dummy = this.test
            form.bill_reference = 'FLPCI' + Math.floor(Math.random() * 99999999999)
            form.recipient_currency = 'Ghs'
            form.country_code = 'gh'
            form.recipient_amount = this.form.recipient_amount
            form.provider = this.form.provider
            form.account_number = this.form.account_number

            this.$store.dispatch('createBillPayment', form)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        message: 'Bill Payment successful',
                        type: 'success'
                    })
                    this.fetchTransactions()
                    this.dialogVisible = false
                    this.$store.dispatch('getBalance')
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                }
                this.createLoading = false
            }).catch((error) => {
                this.createLoading = false
                this.$message({
                    type: 'error',
                    message: error.response.error_message
                })
            })
          } else {
            this.createLoading = false
            return false
          }
        })
    },
    resetForm (formName) {
        this.$refs[formName].resetFields();
    }
  },
  computed: {
    ...mapGetters({
      transactions: 'payouts',
      state: 'payoutsState',
      meta: 'payoutsMeta',
      providers: 'providers',
      test: 'test',
      permissions: 'permissions',
      pageSize: 'pageSize',
      banks: 'bills'
    }),
    total () {
      return this.meta.trans
    },
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    filteredTransactions () {
        return this.transactions.map(el => {
            el.method = 'Wallet'
            el.customer = `${el.receiver_no} - ${el.receiver_name}`
            el.date = Date.now()
            return el
        })
    },
    loading () {
      return this.state === 'LOADING'
    },
    canMakePayouts () {
        return this.permissions.some(el => el.code === 'make_payout')
    },
    recipient_amount: {
        get () {
            return this.form.sender_amount
        },
        set (val) {
            this.form.sender_amount = val
            this.form.recipient_amount = val
        }
    }
  }
}
</script>


<style lang="scss" scoped>

.mini-menu{
    position: absolute;
    top: 8px;
    // padding: 2px 7px;
    padding: 0;
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

.transactions-table-header{
    background-color: #F7FAFC !important;
    height: 36px !important;

    th{
        background-color: #F7FAFC !important;
        padding: 0 !important;
    }

}
.white-text{
    color: white
}
.mr-10{
    margin-right: 10px;
}
</style>

