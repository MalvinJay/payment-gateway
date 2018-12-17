<template>
    <div :class="[{'test-data': isTest}]" class="transactions">
        <el-card class="mb-2">
            <div slot="header">
                <div class="flex justify-content-between align-items-center">
                <div class="blue-text bold-600">Endpoints receiving events from your account</div>
                    <el-button :disabled="error" @click="dialogVisible = true" :loading="loading" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Add endpoint </el-button>
                </div>
            </div>
            <div class="flex justify-content-center">
                <div v-if="error" class="center h-80">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="webhooks" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>                
                <div v-else class="callbacks breathe w-100 s-13">
                    <el-table empty-text="You have not defined any webhooks yet" v-loading="loadingPage" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="webhooks">
                        <el-table-column prop="url" label="URL">
                            <template slot-scope="scope">
                                {{scope.row.url || 'N/A'}}
                            </template>
                        </el-table-column>                    
                        <el-table-column prop="version" label="VERSION" width="200">
                            <template slot-scope="scope">
                                {{scope.row.version || 'N/A'}}
                            </template>                            
                        </el-table-column>  
                        <el-table-column label="MODE" width="125">
                            <template slot-scope="scope">
                                <the-tag status="success" title="Test" icon="detail check icon" class="w-50"></the-tag>
                            </template>   
                        </el-table-column>                                                        
                    </el-table>   
                </div>
            </div>
        </el-card>      

        <el-card :class="[{'test-data': isTest}]" class="mb-2">
            <div slot="header">
                <div class="flex justify-content-between align-items-center">
                    <div class="blue-text bold-600">Endpoints receiving events from Connect applications</div>
                    <el-button :disabled="error" @click="filteredLogs" :loading="loading" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Add endpoint </el-button>
                </div>
            </div>
            <div class="flex justify-content-center">
                <div v-if="error" class="center h-80">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="webhooks" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>                
                <div class="callbacks breathe w-100 s-13">
                    <el-table empty-text="You have not defined any webhooks yet" v-loading="loadingPage" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="appsHooks">
                        <el-table-column prop="url" label="URL">
                            <template slot-scope="scope">
                                {{scope.row.test_url || 'N/A'}}
                            </template>
                        </el-table-column>                    
                        <el-table-column prop="version" label="VERSION" width="200">
                            <template slot-scope="scope">
                                {{scope.row.version || 'N/A'}}
                            </template>                            
                        </el-table-column>  
                        <el-table-column label="MODE" width="125">
                            <template slot-scope="scope">
                                <the-tag status="success" title="Test" icon="detail check icon"></the-tag>
                            </template>   
                        </el-table-column>                                                        
                    </el-table>   
                </div>
            </div>
        </el-card>  

        <!-- Add Webhook -->
        <el-dialog custom-class="new-transaction"
            title="Add a webhook endpoint"
            :visible.sync="dialogVisible"
            width="30%">
            <div class="flex justify-content-center new-transaction-bg">
                <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form" :model="form" label-width="120px">
                    <el-form-item label="Test URL">
                        <el-input v-model="form.test_url" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Production URL">
                        <el-input v-model="form.production_url" clearable></el-input>
                    </el-form-item>                    
                    <el-form-item class="h-auto" label="Webhook version" prop="version">
                        <div class="flex align-items-center w-100" v-for="(item, index) in form.webhook_versions" :key="index">
                            <el-radio v-model="form.id" :label="item.id"></el-radio>
                            <div class="flex align-items-center w-100 px-10">
                                <span class="pr-6">{{item.date}}</span>
                                <div class="flex align-items-center">
                                    <the-tag v-if="item.tag === 'default'" status="pending" :title="item.tag" icon="detail check icon"></the-tag>
                                    <the-tag v-if="item.tag === 'latest'" status="success" :title="item.tag" icon="detail check icon"></the-tag>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="Filter events" prop="event">
                        <div class="flex align-items-center" v-for="(item, index) in form.subscribed_event" :key="index">
                            <el-radio v-model="radio" :label="item.id"></el-radio>            
                            <div class="px-10">
                                <span>{{item.type}}</span>
                                <div>
                                    <span>{{item.tag}}</span>
                                </div>
                            </div>
                        </div>                        
                    </el-form-item>
                    <el-form-item label="Events" prop="event" class="filtered-events m-0">
                        <el-checkbox-group @change="handleCheckedPrivilegesChange" v-model="event">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <div class="flex align-items-center events" v-for="(item, index) in services" :key="index">
                                        <!-- <el-radio v-model="event" :label="item"></el-radio> -->
                                        <el-checkbox class="no-margin-checkbox m-0" v-model="event" :label="item">{{item}}</el-checkbox>
                                        <div class="px-10">
                                            <span>{{item}}</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer py-10">
                <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="SaveWebhook('form')">Add endpoint</el-button>
            </span>
        </el-dialog>        
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
import moment from 'moment'

export default {
    name: "Webhooks",
    data() {
        return {
            isTest: true,
            styleObject: {
                fontSize: '12px'
            },
            loading: false,
            dialogVisible: false,
            radio: 1,
            event: 1,
            form: {
                id: 1,
                test_url: '',
                production_url: '',
                webhook_versions: [
                    {
                        id: 1,
                        name: 'v1',
                        date: '2018-01-01',
                        tag: 'default'
                    },
                    {
                        id: 2,
                        name: 'v2',
                        date: '2018-07-01',
                        tag: 'latest'
                    }                   
                ],
                subscribed_event: [
                    {
                        id: 1,
                        type: 'Send all event types'
                    },
                    {
                        id: 2,
                        type: 'Select types to send',
                    }
                ]
            },  
            services: [
                'account.updated',
                'account.application.authorized',
                'account.application.deauthorized',
                'account.external_account.created',
                'account.external_account.deleted',
                'account.external_account.updated',
                'application_fee.created',
                'application_fee.refunded',
                'application_fee.refund.updated',
                'balance.available',
                'charge.captured',
                'charge.expired',
                'charge.failed',
                'charge.pending',
                'charge.refunded',
                'charge.succeeded',
                'charge.updated',
                'charge.dispute.closed',
                'charge.dispute.created',
                'charge.dispute.funds_reinstated',
                'charge.dispute.funds_withdrawn',
                'charge.dispute.updated',
                'charge.refund.updated',
                'customer.created',
                'customer.deleted',
                'customer.updated',
                'customer.bank_account.deleted',
                'file.created',
                'invoice.created',
                'invoice.deleted',
                'invoice.payment_failed',
                'invoice.payment_succeeded',
                'invoice.sent',
                'invoice.upcoming',
                'invoice.updated',
                'invoiceitem.created',
            ],
            createLoading: false,
            webhooks: [
                {
                    url: "https://flopay-callback.free.beeceptor.com",
                    version: "2018-01-02",
                    status: "success",
                    Retry_history: "2018/11/22 12:08 to https://flopay-callback.free.beeceptor.com",
                    statusCode: 200,
                    request: {
                        id: "evt_1DZGzKA4jBSsp2qWd78MpJ3p",
                        object: "event",
                        api_version: "2018-09-24",
                        created: 1542888534,
                        data: {
                        object: {
                            object: "balance",
                            available: [
                            {
                                currency: "usd",
                                amount: 155830,
                                source_types: {
                                card: 155830
                                }
                            }
                            ],
                            connect_reserved: [
                            {
                                currency: "usd",
                                amount: 0
                            }
                            ],
                            livemode: false,
                            pending: [
                            {
                                currency: "usd",
                                amount: 0,
                                source_types: {
                                card: 0
                                }
                            }
                            ]
                        }
                        },
                        livemode: false,
                        pending_webhooks: 1,
                        request: {
                        id: null,
                        idempotency_key: null
                        },
                        type: "balance.available"
                        }
                },
                {
                    url: "https://flopay-sync.free.beeceptor.com",
                    version: "2018-01-02",
                    status: "success",
                    Retry_history: "2018/11/22 12:08 to https://flopay-sync.free.beeceptor.com",
                    statusCode: 200,
                    request: {
                            id: "evt_1DZGzKA4jBSsp2qWd78MpJ3p",
                            object: "event",
                            api_version: "2018-09-24",
                            created: 1542888534,
                            data: {
                            object: {
                                object: "balance",
                                available: [
                                {
                                    currency: "ghs",
                                    amount: 155830,
                                    source_types: {
                                    card: 155830
                                    }
                                }
                                ],
                                connect_reserved: [
                                {
                                    currency: "ghs",
                                    amount: 0
                                }
                                ],
                                livemode: false,
                                pending: [
                                {
                                    currency: "ghs",
                                    amount: 0,
                                    source_types: {
                                    card: 0
                                    }
                                }
                                ]
                            }
                            },
                            livemode: false,
                            pending_webhooks: 1,
                            request: {
                            id: null,
                            idempotency_key: null
                            },
                            type: "balance.available"
                }       
                },
                {
                    url: "https://flopay-test.free.beeceptor.com",
                    version: "2018-01-02",
                    status: "failed",
                    Retry_history: "2018/11/22 12:08 to https://flopay-test.free.beeceptor.com",
                    statusCode: 401,
                    request: {
                            id: "evt_1DZGzKA4jBSsp2qWd78MpJ3p",
                            object: "event",
                            api_version: "2018-09-24",
                            created: 1542888534,
                            data: {
                            object: {
                                object: "balance",
                                available: [
                                {
                                    currency: "gbp",
                                    amount: 155830,
                                    source_types: {
                                    card: 155830
                                    }
                                }
                                ],
                                connect_reserved: [
                                {
                                    currency: "gbp",
                                    amount: 0
                                }
                                ],
                                livemode: false,
                                pending: [
                                {
                                    currency: "gbp",
                                    amount: 0,
                                    source_types: {
                                    card: 0
                                    }
                                }
                                ]
                            }
                            },
                            livemode: false,
                            pending_webhooks: 1,
                            request: {
                            id: null,
                            idempotency_key: null
                            },
                            type: "balance.available"
                }          
                }             
            ],
            appsHooks: []
        }
    },
    created() {
        this.$store.dispatch('getLogs')
    },
    mounted() {
        EventBus.$emit('sideNavClick', 'webhooks')
        // this.appsHooks.test = this.client().client.callbackurl
        // this.appsHooks.production = this.client().client.test_callbackurl
    },    
    methods: {
        clickRow (row, event, column) {
            if (column.property) {
                // this.$router.push(`/webhooks/${row.id}`)
            }
        },
        SaveWebhook () {
            this.createLoading = true
            console.log('Form to Sent:', this.form)
            var query = []
            query.push(this.form.test_url, this.form.test_url)
            console.log('Query:', query)
            this.$store.dispatch('getCurrentHook', query)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                    // this.fetchBranches()
                    this.createLoading = false
                } else {
                this.$message({
                        type: 'error',
                        message: response.data.response.message.message
                    })
                }
                this.createLoading = false
            }).catch((error) => {
                this.createLoading = false
                const response = error.response
                this.$message({
                    type: 'error',
                    message: response.data.error,
                })
            })          
        },
        handleCheckAllChange (val) {
            this.priv = val ? this.privileges.map(el => el.code) : []
            this.isIndeterminate = false
        },
        handleCheckedPrivilegesChange(value) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.privileges.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.privileges.length
        },        
    },
    computed: {
        ...mapGetters({
            hooks: 'hooks',
            state: 'hooksState',
            meta: 'hooksMeta',
            user: 'user',
        }),    
        filteredLogs () {
            return this.hooks
        },
        error () {
            return this.state === 'ERROR' && this.state !== 'LOADING'
        },  
        total () {
            return this.meta.totalCount
        },
        loadingPage () {
            return this.state === 'LOADING'
        },
        client () {
            return this.user
        }
    }
}
</script>

<style lang="scss" scoped>
.transaction-form {
    width: 100%;
}

.el-dialog__body{

}
</style>
