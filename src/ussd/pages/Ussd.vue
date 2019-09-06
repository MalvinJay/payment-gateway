<template>
  <div>
    <el-tabs class="default-tab" :class="[{'test-data': test}, 'position-relative']" stretch type="border-card">
      <!-- <div v-show="test" class="position-absolute bg-orange test">TEST DATA</div> -->
      <el-tab-pane label="PINS">
        <el-card class="card-0">
            <div class="transactions">
                <div class="trans-div flex justify-content-between">
                    <div class="search_n_roles flex justify-content-between w-50">
                      <filter-component dispatch="setUssdFilters" filterType="ussd"></filter-component>
                      <el-input @keyup.enter.native="searchButton" v-model="search" :prefix-icon="icon" class="search-div mr-2" style="width: 70%;" size="mini" placeholder="Search phone number"></el-input>
                    </div>
                    <div class="flex align-items-center">
                        <el-tooltip class="item" effect="dark" content="Refresh" placement="top">
                          <el-button @click.prevent="fetchMessages" icon="undo icon" type="text"></el-button>
                        </el-tooltip>
                        <el-button v-can="'Generate Reports'" @click="generateReport" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text">
                          <i class="download icon"></i>Export
                        </el-button>
                    </div>
                </div>
                <div v-loading="loading">
                    <div class="center h-80" v-if="error">
                      <div class="center flex-column">
                        <p class="m-0 p-0">Unable to load this page</p>
                        <el-button @click.prevent="fetchMessages" icon="sync icon" type="text">Retry</el-button>
                      </div>
                    </div>
                    <div class="ussd_session" v-else>
                        <el-table ref="fone"
                        @row-click="clickRow"
                        empty-text="No ussd session available today"
                        :row-style="styleObject"
                        row-class-name="transactions-table-body"
                        header-row-class-name="transactions-table-header"
                        :data="filteredPins.filter( data => !search || data.receiver_no.toLowerCase().includes(search.toLowerCase()) ).slice((page * 12) - 12, page * 12)">
                            <el-table-column type="index"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="extra_data.sessionId" label="session id"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="receiver_no" label="phone number"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="provider_code" label="network" width="auto" label-class-name="text-uppercase">
                              <template slot-scope="scope" class="text-uppercase">
                                {{scope.row.provider_code}}
                              </template>
                            </el-table-column>
                            <el-table-column prop="transaction" label="Payment status" width="auto">
                              <template slot-scope="scope">
                                <div class="flex">
                                  <the-tag v-if="scope.row.status === 'paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                  <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="updated_at" label="Timestamp" width="200">
                                <template slot-scope="scope">
                                  {{scope.row.updated_at | moment("D MMM,YY hh:mm:ss A")}}
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="flex justify-content-between align-items-center px-10">
                            <div class="s-12">
                              {{this.filteredPins.slice((page * 12) - 12, page * 12).length}} results
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

          <el-dialog
            custom-class="export-dialog"
            title="Export"
            :visible="exportVisible"
            width="25%">
            <div class="flex justify-content-center new-export-bg ">
                <el-form hide-required-asterisk class="transaction-form my-2" size="mini" style="width: 90%" ref="form" :model="form" label-position="top">
                  <el-form-item label="Select Date">
                      <el-date-picker
                      v-model="dateColumns"
                      type="daterange"
                      @change="dateRangeClicked"
                      start-placeholder="Start date"
                      end-placeholder="End date">
                      </el-date-picker>
                  </el-form-item>
                    <el-form-item class="flex justify-content-end">
                        <div class="flex">
                            <el-button @click="close">Cancel</el-button>
                            <a :href="`https://ussd-log-status.nfortics.com/reports/index?${generateQueryParams}`"
                            class="cursor open-sans el-button el-button--primary el-button--mini" target="_blank" @click="close" download>Download</a>
                        </div>
                    </el-form-item>
                </el-form>
              </div>
          </el-dialog>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="SMS Results">
        <el-card class="card-0">
            <div class="transactions">
                <div class="trans-div flex justify-content-between">
                    <div class="search_n_roles flex justify-content-between w-50">
                      <filter-component dispatch="setUssdFilters" filterType="ussd"></filter-component>
                      <el-input @keyup.enter.native="searchButton" v-model="search" :prefix-icon="icon" class="search-div mr-2" style="width: 70%;" size="mini" placeholder="Search phone or index number"></el-input>
                    </div>
                    <div class="flex align-items-center">
                        <el-tooltip class="item" effect="dark" content="Refresh" placement="top">
                          <el-button @click.prevent="fetchMessages" icon="undo icon" type="text"></el-button>
                        </el-tooltip>
                        <el-button v-can="'Generate Reports'" @click="generateReport" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text">
                          <i class="download icon"></i>Export
                        </el-button>
                    </div>
                </div>
                <div v-loading="loading">
                    <div class="center h-80" v-if="error">
                      <div class="center flex-column">
                        <p class="m-0 p-0">Unable to load this page</p>
                        <el-button @click.prevent="fetchMessages" icon="sync icon" type="text">Retry</el-button>
                      </div>
                    </div>
                    <div class="ussd_session" v-else>
                        <el-table ref="fone"
                        @row-click="clickRow"
                        empty-text="No ussd session available today"
                        :row-style="styleObject"
                        row-class-name="transactions-table-body"
                        header-row-class-name="transactions-table-header"
                        :data="filteredSmsLogs.filter(data => !search || data.receiver_no.toLowerCase().includes(search.toLowerCase()) || data.extra_data.index_no.toLowerCase().includes(search.toLowerCase())).slice((page * 12) - 12, page * 12)">
                            <el-table-column type="index"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="extra_data.sessionId" label="session id"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="receiver_no" label="phone number"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="extra_data.type" label="exams type" :filters="[{text: 'BECE', value: 'bece'},{text: 'WASSCE', value: 'wassce'}]" :filter-method="filterHandler">
                              <template slot-scope="scope">
                                {{scope.row.extra_data.type  || 'N/A'}}
                              </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="extra_data.year" label="year" width="100">
                              <template slot-scope="scope">
                                {{scope.row.extra_data.year || 'N/A'}}
                              </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="extra_data.index_no" label="index no" width="auto">
                              <template slot-scope="scope">
                                {{scope.row.extra_data.index_no  || 'N/A'}}
                              </template>
                            </el-table-column>
                            <el-table-column prop="status" label="Payment status" width="auto">
                              <template slot-scope="scope">
                                <div class="flex">
                                  <the-tag v-if="scope.row.status === 'paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                  <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column prop="updated_at" label="Timestamp" width="200">
                                <template slot-scope="scope">
                                  {{scope.row.updated_at | moment("D MMM,YY hh:mm:ss A")}}
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="flex justify-content-between align-items-center px-10">
                            <div class="s-12">
                              {{this.filteredSmsLogs.slice((page * 12) - 12, page * 12).length}} results
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

          <el-dialog custom-class="export-dialog" title="Export" :visible="exportVisible" width="25%">
            <div class="flex justify-content-center new-export-bg ">
                <el-form hide-required-asterisk class="transaction-form my-2" size="mini" style="width: 90%" ref="form" :model="form" label-position="top">
                  <el-form-item label="Select Date">
                      <el-date-picker
                      v-model="dateColumns"
                      type="daterange"
                      @change="dateRangeClicked"
                      start-placeholder="Start date"
                      end-placeholder="End date">
                      </el-date-picker>
                  </el-form-item>
                    <el-form-item class="flex justify-content-end">
                        <div class="flex">
                            <el-button @click="close">Cancel</el-button>
                            <a :href="`https://ussd-log-status.nfortics.com/reports/index?${generateQueryParams}`"
                            class="cursor open-sans el-button el-button--primary el-button--mini" target="_blank" @click="close" download>Download</a>
                        </div>
                    </el-form-item>
                </el-form>
              </div>
          </el-dialog>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Utils from '@/utils/services'
import moment from 'moment'

export default {
  name: 'USSD',
  props: ['type'],
  data () {
    return {
      icon: 'el-icon-search',
      test: true,
      columns: [
        {label: 'year', dataField: 'year', align: 'left', width: 'auto'},
        {label: 'index no', dataField: 'index_no', align: 'left', width: 'auto'},
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
      ],
      form: {
        from: '',
        to: ''
      },
      ready: false,
    }
  },
  mounted () {
    this.$store.dispatch('getUssdSessions')
    EventBus.$emit('sideNavClick', 'ussd')
    EventBus.$on('exportModal', (val) => {
      this.exportVisible = false
    })


  },
  methods: {
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property].toLowerCase() === value.toLowerCase()
    },
    handleCurrentChange (page) {
      this.$store.dispatch('getUssdSessions', {page: page, cache: false})
    },
    clickRow (row, event, column) {
      this.$router.push(`/ussd/${row.extra_data.sessionId}`)
    },
    fetchMessages () {
      this.$store.dispatch('getUssdSessions', {cache: false})
    },
    searchButton () {
      this.icon = 'el-icon-loading'
      setTimeout(() => {
        this.$message({
          type: 'success',
          message: 'Server-side search to be completed soon'
        })
        this.icon = 'el-icon-search'
      }, 3000);
    },
    filterByName (val) {
      this.filter.name = val
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
      // this.$message({
      //   message: 'Generating link in background',
      //   type: 'success'
      // })

      this.exportVisible = true;
    },
    close () {
      this.form = {
        from: '',
        to: ''
      },
      this.exportVisible = false
      this.ready = false
    },
    reset () {
      this.exportVisible = false
      // this.loading = false
      this.ready = false
    },
    dateRangeClicked () {
      // this.reset()
    }
  },
  computed: {
    ...mapGetters({
      ussds: 'ussdSessions',
      state: 'ussdSessionsState',
      meta: 'ussdSessionsMeta',
      pageSize: 'pageSize',
      currentUssdSession: 'currentUssdSession',
      fields: 'fields',
      link: 'downloadLink',
      token: 'token',
      user: 'user',
    }),
    filteredSmsLogs () {
      let arr = new Array();
      this.ussds.map(el => {
        let common = el.extra_data.type
        if(common) {
          arr.push(el)
        }
      })
      console.log('arr:', arr)
      return arr
    },
    filteredPins() {
      let arr = new Array();
      this.ussds.map(el => {
        let common = el.extra_data.type
        if(common === "" || common == null || common === 'N/A') {
          arr.push(el)
        }
      })
      return arr
    },
    total() {
      return this.meta.total
    },
    pageSize() {
      return this.meta.limit
    },
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    loading () {
      return this.state === 'LOADING'
    },
    currentUssd() {
      return this.currentUssdSession
    },
    dateColumns: {
      get () {
        var from = this.form.from
        var to = this.form.to
        var arr = [from, to]
        return arr
      },
      set (value) {
        this.form.from = moment(value[0]).format('YYYY-MM-DD')
        this.form.to = moment(value[1]).format('YYYY-MM-DD')
      }
    },
    generateQueryParams() {
      console.log('Query Params:', Utils.createExportQuery(this.form))
      return Utils.createExportQuery(this.form)
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

// report
.export-dialog {
  .el-dialog__header {
    color: #2b2d50;
  }
  .el-dialog__body {
    padding: 0px !important
  }
}
.new-export-bg {
  background: #F7FAFC;
}
.m-0{
  margin: 0 !important;
}
</style>
