<template>
<div>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div>
                    <filter-component dispatch="setDisputesFilters" filterType="dispute"></filter-component>
                </div>
                <div>
                    <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button> -->
                    <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="exportVisible = true" type="text"><i class="file alternate outline icon"></i> Export</el-button> -->
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                        <p class="m-0 p-0">Unable to load this page</p>
                        <el-button @click.prevent="fetchDisputes" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-table
                    ref="dispute"
                    @row-click="clickRow"
                    empty-text="No disputes"
                    v-loading="loading"
                    :row-style="styleObject"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="disputes">
                        <!-- <el-table-column type="expand" width="55">
                            <template slot-scope="props">
                                <div class="flex justify-content-start">
                                    <div class="p-10">
                                        <p class="blue-text s-13 bold-600">Subject: </p>
                                        <p class="s-12 gray">{{ props.row.subject }}</p>
                                    </div>
                                    <div class="p-10">
                                        <p class="blue-text s-13 bold-600">Message: </p>
                                        <p class="s-12 gray">{{ props.row.message }}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column> -->
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="amount" label="Amount" width="100">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 bold-500 s-13">{{scope.row.amount | money}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="" width="auto">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <the-tag v-if="scope.row.status === 'resolved'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                    <the-tag v-else-if="scope.row.status === 'failed'" status="failed" :title="scope.row.status" icon="close icon"></the-tag>
                                    <the-tag v-else status="pending" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                        <el-table-column prop="created_at" label="Date" width="auto">
                            <template slot-scope="scope">
                                {{scope.row.created_at | moment("D MMM,YY hh:mm A")}}
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{disputes.length}} results
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
    </el-card>
</div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'DisputesTable',
  data () {
    return {
      columns: [
        {label: 'Customer', dataField: 'name', width: 'auto'},
        {label: 'Dispute Ref.', dataField: 'ref', width: 'auto'},
        {label: 'Transaction Ref.', dataField: 'trans_ref', width: 'auto'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      exportVisible: false,
      date: false
    }
  },
  created () {
    this.$store.dispatch('getDisputes')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'disputes')
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('getDisputes', {page: val, cache: false})
    },
    clickRow (row, event, column) {
      this.$router.push(`/payments/${row.trans_ref}`)
        // if (column.property) {
        // }
        // this.$refs.dispute.toggleRowExpansion(row)
    },
    fetchDisputes () {
      this.$store.dispatch('getDisputes', {cache: false})
    },
    handleTableCommand (command, row) {
        switch (command) {
            case 'edit':
                this.$router.push(`disputes/${row.id}`)
                break
            case 'open':
                break
            default:
                break
        }
    }
  },
  computed: {
    ...mapGetters({
      disputes: 'disputes',
      state: 'disputesState',
      pageSize: 'pageSize'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
      return this.disputes.length
    },
    count () {
        // return this.transactions.length
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
