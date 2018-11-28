<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div>
                    <p class="blue-text bold-600 s-16 m-0 p-0">Account</p>
                </div>
                <div>
                    <el-button @click="accountVisible = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button>
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                        <p class="m-0 p-0">Unable to load this page</p>
                        <el-button @click.prevent="fetchAccounts" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-table @row-click="clickRow" empty-text="No Accounts" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="accounts">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label">
                            <template slot-scope="scope">
                                {{ scope.row[column.dataField] | capitalize }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="balance" label="Balance">
                            <template slot-scope="scope">
                                {{scope.row.balance | money}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="created_at" label="On-board Date">
                            <template slot-scope="scope">
                                {{scope.row.created_at | moment("Do MMM, YYYY HH:mm A")}}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column>
                            <template slot-scope="scope">
                                <div class="mini-menu">
                                    <i v-if="scope.row.status.toLowerCase() ==='failed'" class="reply icon cursor first-icon"></i>
                                    <el-dropdown @command="command => handleTableCommand(command, scope.row)" trigger="click">
                                        <i class="ellipsis horizontal icon mr-0 cursor"></i>
                                        <el-dropdown-menu class="w-200" slot="dropdown">
                                            <el-dropdown-item v-if="scope.row.status.toLowerCase() ==='failed'" disabled>
                                                <div class="table-dropdown-header bold-600 text-uppercase">
                                                    action
                                                </div>
                                            </el-dropdown-item>
                                            <el-dropdown-item command="open" v-if="scope.row.status.toLowerCase() ==='failed'" class="s-12">Open Ticket</el-dropdown-item>
                                            <el-dropdown-item v-if="scope.row.status.toLowerCase() ==='failed'" class="s-12">Retry</el-dropdown-item>
                                            <el-dropdown-item :divided="scope.row.status.toLowerCase() ==='failed'" disabled>
                                                <div class="table-dropdown-header bold-600 text-uppercase">
                                                    connection
                                                </div></el-dropdown-item>
                                            <el-dropdown-item command="edit" class="s-12">View Payment Details</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </template>
                        </el-table-column> -->
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{accounts.length}} results
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
        <new-account :accountVisible.sync="accountVisible"></new-account>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import NewAccount from './NewAccount'

export default {
  name: 'AccountsTable',
  components: {
    NewAccount
  },
  data () {
    return {
      accountVisible: false,  
      columns: [
        {label: 'code', dataField: 'account_code'},
        {label: 'Client', dataField: 'company'},
        {label: 'till number', dataField: 'code'},
        {label: 'account number', dataField: 'bank_account_no'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      date: false
    }
  },
  created () {
    this.$store.dispatch('getAccounts', {cache: false})
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'accounts')
    EventBus.$on('accountModal', () => { this.accountVisible = false })
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('getCurrentAccounts', val)
    },
    fetchAccounts () {
      this.$store.dispatch('getAccounts', {cache: false})
    },
    handleTableCommand (command, row) {
        switch (command) {
            case 'edit':
                this.$router.push(`accounts/${row.id}`)
                break
            case 'open':
                break
            default:
                break
        }
    },
    clickRow (row, event, column) {
        if (column.property) {
            this.$router.push(`/accounts/${row.code}`)
        }
    }
  },
  computed: {
    ...mapGetters({
    // 1. what you want to call the getter here : 2. the name of the getter from the vuex store
      accounts: 'currentAccounts',
      state: 'accountsState',
      totalAccount: 'accounts',
      pageSize: 'pageSize'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
      return this.totalAccount.length
    },
    count () {
        // return this.transactions.length
    },
    loading () {
      return this.state === 'LOADING'
    }
  },
  filters: {
    capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
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
