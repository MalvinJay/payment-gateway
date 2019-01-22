<template>
    <div>
        <!-- ERROR -->
        <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">Unable to load this page</p>
                <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <!-- LOADING AND NOT ERROR -->
        <div v-else v-loading="loadingPage">
            <!-- Name Card -->
            <el-card :class="{'test-data': test}" class="card-0">
                <div class="flex flex-column p-20">
                    <div class="flex justify-content-between align-items-baseline mb-1">
                    <div class="flex align-items-baseline">
                        <p class="blue-text s-24 m-0 p-0 bold-600">{{form.name}}</p>
                        <!-- <p class="text-uppercase blue-text s-14 m-0 p-0 ml-1">{{form.currency}}</p> -->
                    </div>
                    <div>
                        <p class="text-uppercase s-12 bold-600 m-0 p-0">{{header}}</p>
                    </div>
                    </div>
                    <!-- <div>
                        <el-button v-if="status === 'failed'" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="undo icon"></i> Refund</el-button>
                        <el-button size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Note</el-button>
                    </div> -->
                </div>
                <!-- :class="[{success ? 'green': 'gray' }]" -->
                <div class="border-top px-20 py-10">
                    <div class="flex">
                        <div>
                            <i class="user s-12 icon green" ></i>
                        </div>
                        <div class="flex flex-column ml-1">
                            <p class="light mb-1 s-13">{{header}} was created</p>
                            <p class="light mb-1 s-12 gray">{{form.created_at | moment("MMM Do, hh:mm A")}}</p>
                        </div>
                    </div>
                </div>
            </el-card>
            <!-- Customer Detail Card -->
            <el-card class="my-2">
                <div slot="header">
                    <div class="flex">
                        <span class="blue-text bold-600 s-16">{{header}} details</span>
                        <!-- <el-button @click="toggleReadonly" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" plain icon="pencil alternate icon">Update Details</el-button> -->
                    </div>
                </div>
                <div>
                    <!-- If there's no data hasNoData => computed property -->
                    <div v-if="hasNoData" class="center h-80">
                        {{noData}}
                    </div>
                    <!-- If there's data -->
                    <div v-if="!hasNoData">
                        <div class="flex">
                            <!-- first half -->
                            <div class="w-50">
                                <el-row class="mb-2">
                                    <el-col :span="8">
                                        <p style="color: #2b2d50" class="s-12 bold-600 text-uppercase">ACCOUNT INFORMATION</p>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" align="middle" v-for="(value, key, index) in data" :key="index" class="mb-1">
                                    <el-col :span="8">
                                        <p class="m-0 text-capitalize lightgray s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="16">
                                        <div v-if="readonly">
                                            <p v-if="key === 'time'" class="s-13 mono">{{value | moment("hh:mm a")}}</p>
                                            <p v-else-if="key === 'date'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
                                            <p v-else class="s-13 mono">{{value}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="key === 'date' || key === 'time'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
                                            <el-input v-else style="width: 80%" size="mini" v-model="data[key]"></el-input>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <!-- second half -->
                            <div class="w-50">
                                <el-row class="mb-2">
                                    <el-col :span="8">
                                        <p style="color: #2b2d50" class="s-12 bold-600 text-uppercase">Billing INFORMATION</p>
                                    </el-col>
                                </el-row>
                                <el-row  v-for="(value, key, index) in data2" :key="index" class="mb-1">
                                    <el-col :span="8">
                                        <p class="m-0 text-capitalize lightgray s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="6">
                                        <!-- <div v-if="readonly"> -->
                                            <p v-if="key === 'date'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
                                            <p v-else class="s-13 mono">{{value}}</p>
                                        <!-- </div>
                                        <div v-else>
                                            <el-input size="mini" v-model="data[value]"></el-input>
                                        </div> -->
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!readonly" class="flex justify-content-end">
                    <el-button @click="cancel" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" plain>Cancel</el-button>
                    <el-button @click="update" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" type="primary">Save</el-button>
                </div>
            </el-card>
            <!-- SCHEDULES -->
            <el-card class="my-2 card-0">
                <div slot="header">
                    <div class="flex">
                        <span class="blue-text bold-600 s-16">{{header}} schedules</span>
                    </div>
                </div>
                
                <el-table empty-text="No schedules" v-loading="loadingPage" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="schedules">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="service_code" label="Type">
                            <template slot-scope="scope">
                                <p v-if="scope.row.service_code === 'cashin'">payout</p>
                                <p v-else>payment</p>
                                
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="amount">
                            <template slot-scope="scope">
                                {{scope.row.amount | money}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="provider_code" label="provider"></el-table-column>
                        <el-table-column prop="updated_at" label="date">
                            <template slot-scope="scope">
                                {{scope.row.created_at | moment("MMM Do, YYYY")}}
                            </template>
                        </el-table-column>
                </el-table>
                <div class="flex justify-content-between align-items-center px-10">
                    <div class="s-12">
                        {{schedules.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end"
                        @current-change="handleScheduleChange"
                        :page-size="pageSize"
                        layout="prev, pager, next"
                        :total="schedulesTotal">
                    </el-pagination>
                </div>
            </el-card>
            <!-- TRANSACTIONS -->
            <el-card class="my-2 card-0">
                <div slot="header">
                    <div class="flex">
                        <span class="blue-text bold-600 s-16">{{header}} transactions</span>
                    </div>
                </div>
                <el-table empty-text="No transactions" v-loading="loadingPage" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="transactions">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="service_code" label="Type" width="100">
                        <template slot-scope="scope">
                            <p v-if="scope.row.service_code === 'cashin'">payout</p>
                            <p v-else>payment</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="" width="">
                        <template slot-scope="scope">
                            <div class="flex">
                                <the-tag v-if="scope.row.status === 'Paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                <the-tag v-else-if="scope.row.status === 'Failed'" status="failed" :title="scope.row.status" icon="close icon"></the-tag>
                                <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gross_amount" label="gross" min-width="80">
                        <template slot-scope="scope">
                            {{scope.row.gross_amount | money}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="charged_amount" label="fee" min-width="80">
                        <template slot-scope="scope">
                            {{scope.row.charged_amount | money}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="net_amount" label="net" min-width="80">
                        <template slot-scope="scope">
                            {{scope.row.net_amount | money}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="reference" label="reference"></el-table-column>
                    <el-table-column prop="updated_at" label="date">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("MMM Do, YYYY")}}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex justify-content-between align-items-center px-10">
                    <div class="s-12">
                        {{transactions.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end"
                        @current-change="handleTransactionsChange"
                        :page-size="pageSize"
                        layout="prev, pager, next"
                        :total="transactionsTotal">
                    </el-pagination>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
export default {
    name: 'ContactDetails',
    data () {
        return {
            test: true,
            status: 'failed',
            edit: false,
            readonly: true,
            remarks: '',
            page: this.$route.path
        }
    },
    methods: {
        toggleReadonly () {
            this.readonly = !this.readonly
        },
        handleScheduleChange (val) {
            this.$store.dispatch('setCurrentContactSchedules', {page: val})
        },
        handleTransactionsChange (val) {
            this.$store.dispatch('setCurrentContactTransactions', {page: val})
        },
        cancel () {
            this.readonly = true
        },
        update() {
        
        },
        fetchTransactions () {
           this.$store.dispatch('getCurrentContact', this.$route.params.id)
        }
    },
    created () {
        // EventBus.$emit('sideNavClick', 'jobs')
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'jobs')
        this.$store.dispatch('getCurrentContact', this.$route.params.id)
    },
    computed: {
        ...mapGetters({
            form: 'currentContact',
            state: 'currentContactState',
            schedules: 'currentContactSchedules',
            transactions: 'currentContactTransactions',
            pageSize: 'pageSize'
        }),
        loadingPage () {
            return this.state === 'LOADING'
        },
        success () {
            return this.status === 'paid'
        },
        schedulesTotal () {
           return this.form.schedules.length 
        },
        transactionsTotal () {
           return this.form.executed_transactions.length 
        },
        error () {
            return this.state === 'ERROR'
        },
        data () {
            var symbol = '\u20B5'
            if (this.form.currency === 'GHs') {
               symbol = '\u20B5'
            }
            var nForm = {
                name: this.form.name,
                'phone number': this.form.msisdn,
                email: this.form.email ? this.form.email : '-',
                type: this.form.type ? this.form.type : '-',
                provider: this.form.bank ? this.form.bank : '-',
                description: this.form.description ? this.form.description : '-'
            }
            return nForm
        },
        data2 () {
            var nForm = {
                'Send emails to': this.form.email ? this.form.email : 'Not Provided',
                'Address': this.form.address ? this.form.address : 'Not Provided',
                'Send messages to': this.form.number ? this.form.number : 'Not Provided'
            }
            return nForm
        },
        hasNoData () {
            return typeof this.form === 'undefined'
        },
        header () {
            return 'Customer'
        }
    }
}
</script>

<style lang="scss" scoped>
.payment-div{
    height: 80px;
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
