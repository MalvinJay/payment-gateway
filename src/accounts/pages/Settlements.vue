<template>
    <el-card class="transactions">
        <div class="trans-div">
            <div class="flex align-items-baseline">
                <!-- <p class="header-text">Settlements</p> -->
                <filter-component dispatch="setSettlementsFilters" filterType="payment"></filter-component>
            </div>
        </div>
        <div>
            <div class="center h-80" v-if="error">
                <div class="center flex-column">
                    <p class="m-0 p-0">Unable to load this page</p>
                    <el-button @click.prevent="fetchSettlements" icon="sync icon" type="text">Retry</el-button>
                </div>
            </div>
            <div v-else>
                <el-table empty-text="No Settlements" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredSettlements">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="amount" label="Amount" width="150">
                        <template slot-scope="scope">
                            <p class="m-0 p-0 mr-10 bold-500 s-13">{{scope.row.receiver_amount | money}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="">
                        <template slot-scope="scope">
                            <div class="flex">
                                <the-tag v-if="scope.row.status === 'Paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                <the-tag v-else-if="scope.row.status.toLowerCase() === 'failed'" status="success" :title="scope.row.status" icon="close icon"></the-tag>
                                <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="created_at" label="Date">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("D MMM,YY hh:mm A")}}
                        </template>
                    </el-table-column>
                    <el-table-column width="80px">
                        <template slot-scope="scope">
                            <div class="mini-menu">
                                <i v-if="scope.row.status.toLowerCase() ==='failed'" class="reply icon cursor first-icon"></i>
                                <el-dropdown @command="command => handleTableCommand(command, scope.row)" trigger="click">
                                    <i class="ellipsis horizontal icon mr-0 cursor"></i>
                                    <el-dropdown-menu class="w-200" slot="dropdown">
                                        <el-dropdown-item disabled>
                                            <div class="table-dropdown-header bold-600 text-uppercase">
                                                action
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item command="open" class="s-12">Open Ticket</el-dropdown-item>
                                        <el-dropdown-item class="s-12">Retry</el-dropdown-item>
                                        <el-dropdown-item class="s-12">Reverse</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-10">
                    <div class="s-12">
                        {{settlements.length}} results
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
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Settlements',
  data () {
    return {
      test: true,
      columns: [
        {label: 'Customer', dataField: 'customer', width: '250'},
        {label: 'Reference', dataField: 'reference', width: 'auto'}
      ],
      styleObject: {
        fontSize: '12px'
      }
    }
  },
  created () {
    this.$store.dispatch('getSettlements')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'settlements')
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('getSettlements', {page: val, cache: false})
    },
    clickRow (row, event, column) {
        // if (column.property) {
        //     this.$router.push(`/job/${row.id}`)
        // }
    },
    fetchSettlements () {
      this.$store.dispatch('getSettlements')
    },
    handleCommand (command, row) {
        switch (command) {
            case 'edit':
                this.editJob(row.id)
                break
            case 'delete':
                this.deleteJob(row.id)
                break
            default:
                break
        }
    }
  },
  computed: {
    ...mapGetters({
      settlements: 'settlements',
      state: 'settlementsState',
      pageSize: 'pageSize'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
      return this.settlements.length
    },
    loading () {
      return this.state === 'LOADING'
    },
    filteredSettlements () {
        return this.settlements.map(el => {
            el.customer = `${el.receiver_no} - ${el.receiver_name}`
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

