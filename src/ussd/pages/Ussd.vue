<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div class="search_n_roles flex justify-content-between w-50">
                    <el-input @keyup.enter.native="searchButton" v-model="search" class="search-div mr-2 w-50" size="mini" placeholder="Filter by year or exam type..."></el-input>
                    
                    <!-- <div class="roles">
                        <el-select 
                            v-model="value" 
                            size="mini"
                            filterable
                            @change="filterByName"
                            placeholder="Select an exams type">
                            <el-option v-model="all" label="all"></el-option>
                            <el-option v-for="item in filteredExamsTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>                    
                    </div> -->
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
                    :data="filteredUSSD.filter(data => !search || data.exam_type.toLowerCase().includes(search.toLowerCase()) ||  data.year.toLowerCase().includes(search.toLowerCase())).slice((page * 12) - 12, page * 12)">
                        <el-table-column type="index"></el-table-column>

                        <el-table-column
                         show-overflow-tooltip
                         prop="sessionid"
                         label="session id"></el-table-column>
                        <el-table-column
                         show-overflow-tooltip
                         prop="msisdn"
                         label="phone number"></el-table-column>
                        <el-table-column
                         show-overflow-tooltip
                         prop="exam_type"
                         label="exams type"
                         :filters="[{text: 'BECE', value: 'bece'},{text: 'WASSCE', value: 'wassce'}]"
                         :filter-method="filterHandler"></el-table-column>
                        <el-table-column
                         show-overflow-tooltip
                         :key="index"
                         v-for="(column, index) in columns"
                         :prop="column.dataField"
                         :label="column.label"
                         :width="column.width"
                         ></el-table-column>
                        <el-table-column prop="status" label="Payment status" width="auto">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <the-tag v-if="scope.row.status === 'paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                    <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="timestamp" label="Timestamp" width="200">
                            <template slot-scope="scope">
                                {{scope.row.timestamp | moment("D MMM,YY hh:mm:ss A")}}
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{this.filteredUSSD.slice((page * 12) - 12, page * 12).length}} results
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
// import LogDialog from '../components/LogDialog'
// import TopupAccount from '../components/TopupAccount'

export default {
  name: 'USSD',
  props: ['type'],
  data () {
    return {
      test: true,
      columns: [
        {label: 'year', dataField: 'year', align: 'left', width: 'auto'},
        {label: 'index no', dataField: 'index_no', align: 'left', width: 'auto'},
        // {label: 'paid?', dataField: 'index_no', align: 'left', width: 'auto'},
      ],
      page: 1,
      logDialog: false,
      topupDialog: false,
      exportVisible: false,
      styleObject: {
        fontSize: '12px'
      },
      ready: false,
      expanded: false,
      search: '',
      value: 'all',
      all: 'all exams types',
      filter: {
        name: ''
      },
      filteredExamsTypes: [
        {
          name: 'B.E.C.E',
          code: '01'
        },
        {
          name: 'W.A.S.C.E',
          code: '02'
        }
      ]
    }
  },
  created () {
    this.$store.dispatch('getUssdSessions')
  },
  mounted () {
    this.$store.dispatch('getUssdSessions')
    EventBus.$emit('sideNavClick', 'ussd')
    EventBus.$on('exportModal', (val) => {
        this.exportVisible = false
    })    
  },
  methods: {
    // handleCurrentChange (val) {
    //     this.$store.dispatch('getUssdSessions', {page: val, cache: false})
    // },
    filterHandler (value, row, column) {
        const property = column['property']
        // console.log('filtered', this.filteredUSSD.filter(ussd => ussd[property].toLowerCase() === value.toLowerCase()))
        return row[property].toLowerCase() === value.toLowerCase()
    },
    handleCurrentChange (page) {
        this.page = page
    },
    clickRow (row, event, column) {
        this.$store.dispatch('getCurrentUssdSession', row.sessionid)
        .then((response) => {
            // this.$refs.fone.toggleRowExpansion(row)
        })
        if (column.property || !column.status === 'error') {
            this.$router.push(`/ussd/${row.sessionid}`)
        }        
    },
    fetchMessages () {
      this.$store.dispatch('getUssdSessions', {cache: false})
    },
    searchButton () {

    },  
    filterByName (val) {
        this.filter.name = val
        // this.$store.dispatch('setTeamsFilters', this.filter)
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
      ussds: 'ussdSessions',
      state: 'ussdSessionsState',
      total: 'ussdSessionsCount',
      pageSize: 'pageSize',
      currentUssdSession: 'currentUssdSession'
    }),
    filteredUSSD () {
        // var exams = ['BECE', 'WASSCE']
        // var years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
        // var ussd = this.ussds.map(ussd => {
        //     var rand = Math.floor(Math.random() * 2)
        //     var yRand = Math.floor(Math.random() * 10)
        //     ussd.exam_type = exams[rand]
        //     ussd.year = years[yRand]
        //     return ussd
        // })
      return this.ussds
    },
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
