<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div>
                    <filter-component dispatch="setFeesFilters" filterType="payment"></filter-component>
                </div>
                <div>
                    <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New</el-button> -->
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="exportVisible = true" type="text"><i class="file alternate outline icon"></i> Export</el-button>
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="fetchFees" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else class="breathe">
                    <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredFees">
                        <el-table-column prop="type" label="Type">
                            <template slot-scope="scope">
                                <p>Fee</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Net">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 s-13">{{scope.row.net_amount | money}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Amount">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 s-13">{{scope.row.receiver_amount | money}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Fee">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 s-13">{{scope.row.charged_amount | money}}</p>
                            </template>
                        </el-table-column>                                                                                               
                        <el-table-column prop="created_at" label="Date">
                            <template slot-scope="scope">
                                {{scope.row.created_at | moment("Do MMM, YYYY hh:mm A")}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            <span class="bold-600">{{fees.length}}</span> results
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
            <export-modal :modalVisible.sync="exportVisible"></export-modal>
        </div>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
    name: 'Fees',
    data () {
        return {
            test: true,
            columns: [
                {label: 'Net', dataField: 'type'},
                {label: 'Amount', dataField: 'customer'},
                {label: 'Fee', dataField: 'ref'}
            ],
            styleObject: {
                fontSize: '12px'
            }
        }
    },
    created () {
        this.$store.dispatch('getFees')
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'fees')
        EventBus.$on('exportModal', (val) => {
            this.exportVisible = false
        })
    },
    methods: {
        clickRow (row, event, column) {
            if (column.property) {
                this.$router.push(`/fees/${row.reference}`)
            }        
        },   
        handleCurrentChange (val) {
            this.$store.dispatch('getFees', {page: val, cache: false })
        },             
        fetchFees () {
            this.$store.dispatch('getFees', {cache: false})
        }
    }, 
    computed: {
        ...mapGetters({
            fees: 'fees',
            meta: 'feesMeta',
            state: 'feesState',
            pageSize: 'pageSize'
        }),  
        error () {
            return this.state === 'ERROR' && this.state !== 'LOADING'
        },              
        total () {
            return this.meta.trans
        },    
        loading () {
            return this.state === 'LOADING'
        },
        filteredFees () {
            return this.fees.map(el => {
                el.net_amount = el.receiver_amount - el.charged_amount
                return el
            })
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

