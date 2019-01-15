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
                                <the-tag v-if="scope.row.type == 'test'" status="success" title="Test" icon="detail check icon" class="w-50"></the-tag>
                                <the-tag v-else status="success" title="Live" icon="detail check icon" class="w-50"></the-tag>
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
                            <el-radio @change="handleEventSelection" v-model="radio" :label="item.id"></el-radio>            
                            <div class="px-10">
                                <span>{{item.type}}</span>
                                <div>
                                    <span>{{item.tag}}</span>
                                </div>
                            </div>
                        </div>                        
                    </el-form-item>
                    <el-form-item v-if="custom" label="Events" prop="event" class="filtered-events m-0">
                        <el-checkbox-group @change="handleCheckedPrivilegesChange" v-model="event">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <div class="flex align-items-center events" v-for="(item, index) in services" :key="index">
                                        <el-checkbox-group v-model="checkList">
                                            <el-checkbox class="no-margin-checkbox m-0" v-model="event" :label="item.name"></el-checkbox>
                                        </el-checkbox-group>
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
            checkList: [],
            custom: false,
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
                {id: 1, name:'account.updated'},
                {id: 2, name:'account.application.authorized'},
                {id: 3, name:'account.application.deauthorized'},
                {id: 4, name:'account.external_account.created'},
                {id: 5, name:'account.external_account.deleted'},
                {id: 6, name:'account.external_account.updated'},
                {id: 7, name:'application_fee.created'},
                {id: 8, name:'application_fee.refunded'},
                {id: 9, name:'application_fee.refund.updated'},
                {id: 10, name:'balance.available'},
                {id: 11, name:'charge.captured'},
                {id: 12, name:'charge.expired'},
                {id: 13, name:'charge.failed'},
                {id: 14, name:'charge.pending'},
                {id: 15, name:'charge.refunded'},
                {id: 16, name:'charge.succeeded'},
                {id: 17, name:'charge.updated'},
                {id: 18, name:'charge.dispute.closed'},
                {id: 19, name:'charge.dispute.created'},
                {id: 20, name:'charge.dispute.funds_reinstated'},
                {id: 21, name:'charge.dispute.funds_withdrawn'},
                {id: 22, name:'charge.dispute.updated'},
                {id: 23, name:'charge.refund.updated'},
                {id: 24, name:'customer.created'},
                {id: 25, name:'customer.deleted'},
                {id: 26, name:'customer.updated'},
                {id: 27, name:'customer.bank_account.deleted'},
                {id: 28, name:'file.created'},
                {id: 29, name:'invoice.created'},
                {id: 30, name:'invoice.deleted'},
                {id: 31, name:'invoice.payment_failed'},
                {id: 33, name:'invoice.payment_succeeded'},
                {id: 33, name:'invoice.sent'},
                {id: 34, name:'invoice.upcoming'},
                {id: 35, name:'invoice.updated'},
                {id: 36, name:'invoiceitem.created'},
            ],
            createLoading: false,
            webhooks: [
                {
                    type: 'test',
                    url: '',
                    version: "2018-01-01",
                    mode: 'TEST'
                },
                {
                    type: 'production',
                    url: '',
                    version: "2018-01-01",
                    mode: 'TEST'
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
        for (let i = 0; i < this.webhooks.length; i++) {
            if (this.webhooks[i].type == 'test'){
                this.webhooks[i].url = this.user.client.test_callbackurl
            } else 
                this.webhooks[i].url = this.user.client.callbackurl
        }
    },    
    methods: {
        clickRow (row, event, column) {
            if (column.property) {
                // this.$router.push(`/webhooks/${row.id}`)
            }
        },
        SaveWebhook () {
            this.createLoading = true
            var query = []
            query.push(this.form.test_url, this.form.test_url)
            this.$store.dispatch('getCurrentHook', query)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
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
        handleCheckedPrivilegesChange (value) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.privileges.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.privileges.length
        },      
        handleEventSelection (val) {
            if(val == 2) this.custom = true
            else this.custom = false
        }  
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
