<template>
    <div>
        <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">Unable to load this page</p>
                <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <div v-else v-loading="loadingPage">
            <el-card :class="{'test-data': test}" class="card-0 position-relative">
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
                        <el-button :disabled="error" @click="refund" :loading="loading" v-if="status === 'failed'" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="undo icon"></i> Refund</el-button>
                        <el-button @click="ticketVisible = true" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Open Ticket</el-button>
                        <el-dropdown class="ml-10" @command="command => handleTableCommand(command, form)" trigger="click">
                            <el-button size="mini" class="mr-0 cursor z-depth-button bold-600 s-13 open-sans mini-button b-0 icon-only-button" plain icon="ellipsis horizontal icon"></el-button>
                            <el-dropdown-menu class="w-200" slot="dropdown">
                                <el-dropdown-item disabled>
                                    <div class="table-dropdown-header bold-600 text-uppercase">
                                        action
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item class="s-12">Retry</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <!-- :class="[{success ? 'green': 'gray' }]" -->
                <div class="border-top px-20 py-10">
                    <div class="flex">
                        <div>
                            <i v-if="form.payment_status == 'paid'" class="check circle s-12 icon green" ></i>
                            <i v-else class="exclamation circle s-12 icon gray" ></i>
                        </div>
                        <div class="flex flex-column ml-1">
                            <p v-if="form.payment_status == 'paid'" class="light mb-1 s-13">{{header}} succeeded</p>
                            <p v-else class="light mb-1 s-13">{{header}} failed</p>
                            <p class="light mb-1 s-12 gray">{{form.date | moment("MMM Do, HH:mm A")}}</p>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="my-2">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">{{header}} details</span>
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
                                                <el-button @click="edit = true" class="blue-text p-0" type="text" icon="pencil alternate icon">Edit</el-button>
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
        </div>
        <ticket-modal :transaction="form" :ticketVisible.sync="ticketVisible"></ticket-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
export default {
    name: 'PaymentDetail',
    data () {
        return {
            test: true,
            status: 'failed',
            edit: false,
            remarks: '',
            page: this.$route.path,
            ticketVisible: false,
            loading: false
        }
    },
    mounted () {
        EventBus.$on('ticketModal', (val) => {
            this.ticketVisible = val
        })
    },
    created () {
        // EventBus.$emit('sideNavClick', 'payments')
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
           this.$store.dispatch('getCurrentTransaction', this.$route.params.id) 
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
                    // EventBus.$emit('tabNumber', '3')
                    // this.$router.push('/payments')
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
        }
    },
    mounted () {
        this.$store.dispatch('getCurrentTransaction', this.$route.params.id)
    },
    computed: {
        ...mapGetters({
            form: 'currentTransaction',
            state: 'currentTransactionState'
        }),
        loadingPage () {
            return this.state === 'LOADING'
        },
        error () {
            return this.state === 'ERROR'
        },
        success () {
            return this.status === 'paid'
        },
        data () {
            var symbol = '\u20B5'
            if (this.form.currency === 'GHs') {
               symbol = '\u20B5'
            }
            var nForm = {
                name: this.form.company,
                'phone number': this.form.customer_no,
                email: this.form.emails[0],
                reference: this.form.reference,
                amount: `${symbol}${this.form.amount}`,
                fee: `${symbol}${this.form.charged_amount}`,
                date: this.form.date,
                time: this.form.time,
                message: this.form.remarks ? this.form.remarks : '-'
            }
            return nForm
        },
        data2 () {
            var nForm = {
                'billing address': this.form.address ? this.form.address : 'Not Provided',
                origin: this.form.currency === 'GHs' ? 'Ghana' : 'Not Provided'
            }
            return nForm
        },
        hasNoData () {
            return typeof this.form === 'undefined'
        },
        header () {
            if (this.form.trans_type === 'cashin') {
                EventBus.$emit('sideNavClick', 'payouts')
            } else {
                EventBus.$emit('sideNavClick', 'payments')
            }
            var header = this.form.trans_type === 'cashout' ? 'Payment' : 'Payout'
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
