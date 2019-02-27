<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div class="flex align-items-baseline">
                    <p class="blue-text bold-600 s-16 m-0 p-0">Ussd Sessions</p>
                    <!-- <filter-component dispatch="setUssdFilters" filterType="payouts"></filter-component> -->
                </div>
                <div class="flex align-items-center">

                    <el-button v-can="'Generate Reports'" @click="generateReport" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text">
                        <i class="download icon"></i> Export
                    </el-button>
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                        <p class="m-0 p-0">Unable to load this page</p>
                        <el-button @click.prevent="fetchMessages" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div class="ussd_session" v-else>
                    <el-table ref="fone" @row-click="clickRow" empty-text="No ussd session available to display" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="ussd">
                        <el-table-column type="expand" width="55">
                            <template slot-scope="scope">
                                <el-table
                                    empty-text="No ussd session available for this session_Id" 
                                    tooltip-effect="light" 
                                    header-row-class-name="transactions-table-header" 
                                    row-class-name="transactions-table-body ussd_session"
                                    :data="currentUssdSession">
                                        <el-table-column prop="message" label="Message"></el-table-column>
                                        <el-table-column prop="response" label="Response">
                                            <template slot-scope="scope">
                                                {{ scope.row.charged_amount}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="timestamp" label="Timestamp">
                                            <template slot-scope="scope">
                                                {{ scope.row.timestamp}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label" :width="column.width"></el-table-column>                            
                                    </el-table>
                            </template>
                        </el-table-column>

                        <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label" :width="column.width"></el-table-column>
                        
                        <el-table-column prop="timestamp" label="Timestamp" width="auto">
                            <template slot-scope="scope">
                                {{scope.row.timestamp | moment("D MMM,YY hh:mm A")}}
                            </template>
                        </el-table-column>
                        <el-table-column label="ussd code" prop="ussdcode" width="auto">
                            <template slot-scope="scope">
                                {{scope.row.ussdcode}}
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{ussd.length}} results
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
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import LogDialog from '../components/LogDialog'
import TopupAccount from '../components/TopupAccount'

export default {
  name: 'Sms',
  props: ['type'],
  components: {
    LogDialog,
    TopupAccount
  },
  data () {
    return {
      test: true,
      columns: [
        {label: 'session id', dataField: 'sessionid', align: 'center', width: 'auto'},
        {label: 'msisdn', dataField: 'msisdn', align: 'left', width: 'auto'},
        {label: 'network', dataField: 'network', align: 'left', width: 'auto'},
        
      ],
      logDialog: false,
      topupDialog: false,
      exportVisible: false,
      styleObject: {
        fontSize: '12px'
      },
      ready: false
    }
  },
  created () {
    this.$store.dispatch('getUssdSessions')
  },
  mounted () {
    this.$store.dispatch('getUssdSessions')
    EventBus.$on('exportModal', (val) => {
        this.exportVisible = false
    })    
  },
  beforeDestroy () {
    EventBus.$off('logModal', () => {
       this.logDialog = false
    })
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('getUssdSessions', {page: val, cache: false})
    },
    clickRow (row, event, column) {
        // make a single ussd call

        // this.$refs.fone.toggleRowExpansion(row)
    },
    fetchMessages () {
      this.$store.dispatch('getUssdSessions')
    },
    topUpAccount () {
      
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createUssdReport', this.form)
            .then((response) => {
                this.$message({
                    message: 'Report Generation succeeded',
                    type: 'success'
                })
            })
          } else {
            console.log('Error generating report')
            return false
          }
        })
    },
    resetForm(formName) {
        this.$refs[formName].resetFields()
    },
    generateReport() {
        this.$message({
            message: 'Generating link in background',
            type: 'info'
        })        
    }
  },
  computed: {
    ...mapGetters({
      ussd: 'ussdSessions',
      state: 'ussdSessionsState',
      total: 'ussdSessionsCount',
      pageSize: 'ussdSessionsCount',
      currentUssdSession: 'currentUssdSession'
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
