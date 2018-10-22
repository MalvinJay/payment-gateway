<template>
    <div>
        <el-card class="transactions" :class="{'test-data': test}">
            <div class="trans-div flex justify-content-between">
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="filter icon"></i> Filter</el-button>
                </div>
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="file alternate outline icon"></i> Export</el-button>
                </div>
            </div>
            <div>
                <el-table v-loading="loading" :row-style="styleObject" header-row-class-name="transactions-table-header" :data="transactions">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="amount" label="Amount" width="250">
                        <template slot-scope="scope">
                            <div class="flex align-items-center">
                                <p class="m-0 p-0 mr-10">{{scope.row.amount}}</p>
                                <p class="m-0 p-0 mr-10">{{scope.row.currency}}</p>
                                <div>
                                    <the-tag v-if="scope.row.status === 'success'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                    <the-tag v-else-if="scope.row.status === 'failed'" status="failed" :title="scope.row.status" icon="close icon"></the-tag>
                                    <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="date" label="Date">
                        <template slot-scope="scope">
                            {{scope.row.date | moment("MMM Do, YYYY")}}
                        </template>
                    </el-table-column>
                    <el-table-column width="100px">
                        <template slot-scope="scope">
                            <div class="mini-menu">

                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="my-2 flex justify-content-end"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import EventBus from '../../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'ViewTransactions',
  data () {
    return {
      test: true,
      columns: [
        {label: 'Trans Type', dataField: 'type'},
        {label: 'Beneficiary', dataField: 'customer'},
        {label: 'Reference', dataField: 'ref'}
      ],
      styleObject: {
        fontSize: '12px'
      }
    }
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'view')
  },
  computed: {
    ...mapGetters({
      transactions: 'transactions',
      state: 'transactionsState'
    }),
    total () {
      return this.transactions.length
    },
    loading () {
      return this.state === 'LOADING'
    }
  }
}
</script>

<style lang="scss" scoped>
.trans-div{
    height: 80px;
    padding: 20px 20px 0 20px
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
