<template>
    <div class="transactions">
        <div class="trans-div flex justify-content-between">
            <div>
                <filter-component filterType="fees"></filter-component>
            </div>
            <div>
                <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="exportVisible = true" type="text"><i class="file alternate outline icon"></i> Export </el-button>
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
                <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredFees">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="type" label="Type" width="100">
                        <template slot-scope="scope">
                            <p>Charge</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="Amount" width="100">
                        <template slot-scope="scope">
                            <p class="m-0 p-0 mr-10 bold-500 s-13">{{scope.row.receiver_amount | money}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="" width="auto">
                        <template slot-scope="scope">
                            <div class="flex">

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="created_at" label="Date">
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
                        {{fees.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :total="total">
                    </el-pagination>
                </div>
                
            </div>                    
        </div>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
name: 'ChargesTable',
props: ['type'],
data() {
    return {
        columns: [
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
        exportVisible: false,
    }
},   

created() {
    this.$store.dispatch('getFees');
},

mounted() {
    EventBus.$emit('sideNavClick', 'view');
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
        this.$store.dispatch('getFees', {page: val, cached: false })
    },
    fetchTransactions () {
      this.$store.dispatch('getFees', {cache: false})
    },
},

computed: {
    ...mapGetters({
    // 1. what you want to call the getter here on the component : 2. The name of the getter from the vuex store    
        fees: 'fees',
        state: 'feesState',
        meta: 'feesMeta'  
    }),
    error () {
        return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
        return this.meta.trans;
    },
    filteredFees () {
        return this.fees;
    },
    count () {

    },
    loading () {
        return this.state === 'LOADING'
    }
}
}
</script>
