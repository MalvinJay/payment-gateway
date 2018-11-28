<template>
    <div :class="[{'test-data': isTest}]" class="transactions">
        <el-card class="mb-2">
            <div slot="header">
                <div class="flex justify-content-between align-items-center">
                <div class="blue-text bold-600">Endpoints receiving events from your account</div>
                    <el-button :disabled="error" @click="addWebhook" :loading="loading" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Add endpoint </el-button>
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
                    <el-button :disabled="error" @click="addWebhook" :loading="loading" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Add endpoint </el-button>
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
                                <the-tag status="success" title="Test" icon="detail check icon"></the-tag>
                            </template>   
                        </el-table-column>                                                        
                    </el-table>   
                </div>
            </div>
        </el-card>  
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
            webhooks: [
                {
                    url: "https://flopay-callback.free.beeceptor.com",
                    version: "2017/2018",
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
                    version: "2017/2018",
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
                    version: "2017/2018",
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
                },                
            ],
            appsHooks: []
        }
    },
    created() {
        this.$store.dispatch('getLogs')
    },
    mounted() {
        EventBus.$emit('sideNavClick', 'webhooks')
    },    
    methods: {
        clickRow (row, event, column) {
            if (column.property) {
                this.$router.push(`/webhooks/${row.id}`)
            }
        },    
        addWebhook () {
            
        }
    },
    computed: {
        ...mapGetters({
            logs: 'logs',
            state: 'logsState',
            meta: 'logsMeta',
        }),    
        filteredLogs () {
            return this.logs
        },
        error () {
            return this.state === 'ERROR' && this.state !== 'LOADING'
        },  
        total () {
            return this.meta.totalCount
        },
        loadingPage () {
            return this.state === 'LOADING'
        }
    }
}
</script>
