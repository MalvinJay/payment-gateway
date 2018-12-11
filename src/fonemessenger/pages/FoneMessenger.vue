<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div class="flex align-items-baseline">
                    <p class="blue-text bold-600 s-16 m-0 p-0">Fone Messenger</p>
                </div>
                <div class="flex align-items-center">
                    <p class="balance-info gray-text border-right">{{balance.fon_messanger_balance | money }}</p>
                    <el-button @click="topupDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> Topup</el-button>
                    <el-button @click="logDialog = true" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button>
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                        <p class="m-0 p-0">Unable to load this page</p>
                        <el-button @click.prevent="fetchMessages" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-table ref="fone" @row-click="clickRow" empty-text="No fone messengers to display" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="messages">
                        <el-table-column type="expand" width="55">
                            <template slot-scope="props">
                                <div class="pl-15">
                                    <p class="blue-text s-13 bold-600">Message: </p>
                                    <p class="s-12 gray">{{ props.row.message }}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                        <!-- <el-table-column show-overflow-tooltip label="Message text" prop="message"></el-table-column> -->
                        <el-table-column width="80">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <the-tag status="failed" :title="scope.row.post_type"></the-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updated_at" label="Date" width="auto">
                            <template slot-scope="scope">
                                {{scope.row.updated_at | moment("D MMM,YY hh:mm A")}}
                            </template>
                        </el-table-column> -->
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{messages.length}} results
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
        <log-dialog :modalVisible="logDialog"></log-dialog>
        <topup-account :modalVisible="topupDialog"></topup-account>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import LogDialog from '../components/LogDialog'
import TopupAccount from '../components/TopupAccount'

export default {
  name: 'FoneMessenger',
  components: {
    LogDialog,
    TopupAccount
  },
  data () {
    return {
      test: true,
      columns: [
        {label: 'message id', dataField: 'response_id', align: 'center'},
        {label: 'delivery status', dataField: 'response_message', align: 'left'},
        {label: 'recipient', dataField: 'recipient_no', align: 'left'}
      ],
      logDialog: false,
      topupDialog: false,
      styleObject: {
        fontSize: '12px'
      }
    }
  },
  created () {
    this.$store.dispatch('getFoneMessengers')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'fonemessenger')
    EventBus.$on('logModal', () => {
       this.logDialog = false
    })
    EventBus.$on('topupModal', () => {
       this.topupDialog = false
    })
  },
  beforeDestroy () {
    EventBus.$off('logModal', () => {
       this.logDialog = false
    })
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('getFoneMessengers', {page: val, cache: false})
    },
    clickRow (row, event, column) {
        this.$refs.fone.toggleRowExpansion(row)
    },
    fetchMessages () {
      this.$store.dispatch('getFoneMessengers')
    },
    topUpAccount () {
      
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createTransactions', this.form)
            .then((response) => {
                this.$message({
                    message: 'Payment successful',
                    type: 'success'
                })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  },
  computed: {
    ...mapGetters({
      messages: 'messages',
      state: 'messagesState',
      total: 'messagesCount',
      providers: 'providers',
      pageSize: 'pageSize',
      balance: 'balance'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
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
.balance-info{
    margin: 0;
    margin-right: 10px;
    padding-right: 10px;
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
.transactions-table-header{
    background-color: #F7FAFC !important;
    height: 36px !important;

    th{
        background-color: #F7FAFC !important;
        padding: 0 !important;
    }

}
.mr-10{
    margin-right: 10px;
}
.pl-15{
    padding-left: 15px;
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
</style>

