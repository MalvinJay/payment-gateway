<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div class="flex align-items-baseline">
                    <p class="blue-text bold-600 s-16 m-0 p-0">Ussd Sessions</p>
                    <!-- <filter-component dispatch="setUssdFilters" filterType="payouts"></filter-component> -->
                </div>
                <div class="flex align-items-center">
                    <el-tooltip class="item" effect="dark" content="Refresh" placement="top">
                        <el-button @click.prevent="fetchMessages" icon="undo icon" type="text"></el-button>
                    </el-tooltip>
                    <!-- <el-button v-can="'Generate Reports'" @click="generateReport" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text">
                        <i class="download icon"></i> Export
                    </el-button> -->
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
                    <el-table ref="fone"
                    @row-click="clickRow"
                    empty-text="No ussd session available to display"
                    v-loading="loading" :row-style="styleObject"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="ussd.slice((page * 12) - 12, page * 12)">
                        <el-table-column type="expand" width="55" @click="clickRow">
                            <template slot-scope="props">
                                <el-card>                                
                                    <el-table
                                        empty-text="No ussd session available for this session_Id" 
                                        tooltip-effect="light" 
                                        header-row-class-name="transactions-table-header" 
                                        row-class-name="transactions-table-body ussd_session"
                                        :data="currentUssd">
                                            <el-table-column prop="message" label="Input" width="200"></el-table-column>
                                            <el-table-column prop="response" label="Response" width="auto">
                                                <template slot-scope="scope">
                                                    {{ scope.row.response}}
                                                </template>
                                            </el-table-column>   
                                            <!-- <el-table-column prop="messagetype" label="Message Type" width="200">
                                                <template slot-scope="scope">
                                                    {{ scope.row.messagetype}}
                                                </template>
                                            </el-table-column>                                                                                 -->
                                            <el-table-column prop="timestamp" label="Timestamp" width="300">
                                                <template slot-scope="scope">
                                                    {{ scope.row.timestamp  | moment("D MMM,YY hh:mm:ss A")}}
                                                </template>
                                            </el-table-column>
                                        <!-- <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label" :width="column.width"></el-table-column>                             -->
                                    </el-table>
                                </el-card>
                            </template>
                        </el-table-column>

                        <el-table-column show-overflow-tooltip :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label" :width="column.width"></el-table-column>
                        
                        <el-table-column prop="timestamp" label="Timestamp" width="200">
                            <template slot-scope="scope">
                                {{scope.row.timestamp | moment("D MMM,YY hh:mm:ss A")}}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="ussd code" prop="ussdcode" width="auto">
                            <template slot-scope="scope">
                                {{scope.row.ussdcode}}
                            </template>
                        </el-table-column> -->
                    </el-table>

                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{ussd.slice((page * 12) - 12, page * 12).length}} results
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
  name: 'USSD',
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
        {label: 'phone number', dataField: 'msisdn', align: 'left', width: 'auto'},
        {label: 'network', dataField: 'network', align: 'left', width: 'auto'},
        
      ],
      page: 1,
      logDialog: false,
      topupDialog: false,
      exportVisible: false,
      styleObject: {
        fontSize: '12px'
      },
      ready: false,
      expanded: false
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
    // handleCurrentChange (val) {
    //     this.$store.dispatch('getUssdSessions', {page: val, cache: false})
    // },
    handleCurrentChange (page) {
        this.page = page
    },
    clickRow (row, event, column, expanded) {
        // if(!this.expanded) {
            console.log('expanded:', expanded)
            this.$store.dispatch('getCurrentUssdSession', row.sessionid)
            .then((response) => {
                this.$refs.fone.toggleRowExpansion(row)
                this.expanded = true
            })
        // }
    },
    fetchMessages () {
      this.$store.dispatch('getUssdSessions', {cache: false})
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
      pageSize: 'pageSize',
      currentUssdSession: 'currentUssdSession'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    loading () {
      return this.state === 'LOADING'
    },
    currentUssd() {
        return this.currentUssdSession
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
