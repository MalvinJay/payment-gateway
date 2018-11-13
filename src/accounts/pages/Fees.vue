<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div>
                    <filter-component filterType="all"></filter-component>
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
                <div v-else>
                    <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredFees">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="type" label="Type" width="100">
                            <template slot-scope="scope">
                                <p class="bold-600">Charge</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Net" width="80">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 bold-600 s-13">{{scope.row.net_amount | money}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Amount" width="80">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 bold-500 s-13">{{scope.row.receiver_amount | money}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Fee" width="80">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 bold-500 s-13">({{scope.row.charged_amount | money}})</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="" width="80">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 bold-500 s-13 text-left">GHS</p>
                            </template>
                        </el-table-column>                        
                        <el-table-column label="Description" width="auto">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10">Charge taken</p>
                            </template>
                        </el-table-column>                                                                                                
                        <el-table-column prop="created_at" label="Date" width="150">
                            <template slot-scope="scope">
                                {{scope.row.created_at | moment("MMM Do, YYYY")}}
                            </template>
                        </el-table-column>
                        <el-table-column width="80px">
                            <template slot-scope="scope">
                                <div class="mini-menu">
                                    <i v-if="scope.row.status.toLowerCase() ==='failed'" class="reply icon cursor first-icon"></i>
                                    <el-dropdown trigger="click">
                                        <i class="ellipsis horizontal icon mr-0 cursor"></i>
                                        <el-dropdown-menu class="w-200" slot="dropdown">
                                            <el-dropdown-item disabled>
                                                <div class="table-dropdown-header bold-600 text-uppercase">
                                                    action
                                                </div>
                                            </el-dropdown-item>
                                            <el-dropdown-item class="s-12">Recharge Funds</el-dropdown-item>
                                            <el-dropdown-item divided disabled>
                                                <div class="table-dropdown-header bold-600 text-uppercase">
                                                    connection
                                                </div></el-dropdown-item>
                                            <el-dropdown-item class="s-12">View Payment Details</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
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
            activeName: '1',
            columns: [
                {label: 'Net', dataField: 'type'},
                {label: 'Amount', dataField: 'customer'},
                {label: 'Fee', dataField: 'ref'}
            ],
            styleObject: {
                fontSize: '12px'
            },
            tabValue: '',
            dialogVisible: false,
            exportVisible: false,                 
        }
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'view')
        EventBus.$on('tabNumber', (val) => {
            this.activeName = val
            this.exportVisible = false
        })
        EventBus.$on('exportModal', (val) => {
            this.exportVisible = false
        })
        this.$store.dispatch('getFees')        
    },
    beforeDestroy() {
        EventBus.$off('tabNumber', this.updateTab)
    },
    methods: {
        updateTab(val) {
            this.activeName = val
        },
        clickRow (row, event, column) {
            if (column.property) {
                this.$router.push(`/fees/${row.reference}`)
            }        
        },   
        handleCurrentChange (val) {
            this.$store.dispatch('getFees', {page: val, cached: false })
        },             
        fetchFees () {
            this.$store.dispatch('getFees', {cache: false})
        }
    }, 
    computed: {
        ...mapGetters({
            fees: 'fees',
            state: 'feesState'
        }),  
        error () {
            return this.state === 'ERROR' && this.state !== 'LOADING'
        },              
        total () {
            return this.fees.length
        },    
        loading () {
            return this.state === 'LOADING'
        },
        filteredFees () {
            console.log('datafield:', this.fees)
            return this.fees;
        },                
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
.trans-div{
    height: 60px;
    padding: 20px 20px 0 20px
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

