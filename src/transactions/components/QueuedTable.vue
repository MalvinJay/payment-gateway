<template>
    <div class="transactions">
        <div class="trans-div flex">
            <div>
                <filter-component dispatch="setQueueFilters" filterType="queue"></filter-component>
            </div>
            <div>
                <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New</el-button> -->
                <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="file alternate outline icon"></i> Export</el-button> -->
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
                <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredTransactions">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="amount" label="Amount">
                        <template slot-scope="scope">
                            <div class="flex align-items-center cursor">
                                <p style="color: #2b2d50" class="m-0 p-0 mr-10 bold-500 s-13">GHc{{scope.row.receiver_amount}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="" width="100">
                        <template slot-scope="scope">
                            <div class="flex">
                                <the-tag v-if="scope.row.status === 'Paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                <the-tag v-else-if="scope.row.status === 'Failed'" status="failed" :title="scope.row.status" icon="close icon"></the-tag>
                                <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="created_at" label="Date">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("Do MMM, YYYY hh:mm A")}}
                        </template>
                    </el-table-column>
                    <el-table-column width="80">
                        <template slot-scope="scope">
                            <div class="mini-menu">
                                <i v-if="scope.row.status.toLowerCase() ==='failed'" class="reply icon blue-text cursor first-icon"></i>
                                <el-dropdown trigger="click">
                                    <i class="ellipsis horizontal icon m-0 blue-text cursor"></i>
                                    <el-dropdown-menu class="w-200" slot="dropdown">
                                        <el-dropdown-item disabled>
                                            <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                action
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item class="s-12">Retry</el-dropdown-item>
                                        <el-dropdown-item class="s-12">Cancel</el-dropdown-item>
                                        <el-dropdown-item class="s-12">Open Ticket</el-dropdown-item>
                                        <el-dropdown-item divided disabled>
                                            <div class="table-dropdown-header blue-text bold-600 text-uppercase">
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
                        {{transactions.length}} results
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
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'QueuedTable',
  data () {
    return {
      test: true,
      columns: [
        // {label: 'Method', dataField: 'method', width: '100px'},
        {label: 'Customer', dataField: 'customer', width: 'auto'},
        {label: 'Reference', dataField: 'reference', width: 'auto'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      activeName: '1',
      date: false,
      dialogVisible: false
    }
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'payments')
  },
  methods: {
    clickRow (row, event, column) {
        if (column.property) {
            this.$router.push(`/payments/${row.reference}`)
        }
    },
    handleCurrentChange (val) {
        this.$store.dispatch('getQueues', {page: val})
    },
    fetchTransactions () {
      this.$store.dispatch('getQueues')
    }
  },
  computed: {
    ...mapGetters({
      transactions: 'queues',
      meta: 'queuesMeta',
      state: 'queuesState',
      pageSize: 'pageSize'
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

