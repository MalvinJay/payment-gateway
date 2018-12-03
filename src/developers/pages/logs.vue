<template>
    <div>
      <div :class="[{'test-data': isTest}]" class="transactions bg-white border-right border-left">
          <div class="flex justify-content-between px-20 py-16">
              <div>
                  <filter-component dispatch="setLogsFilters" filterType="logs"></filter-component>
              </div>
          </div>
          <div>
            <div class="center h-80" v-if="error">
                <div class="center flex-column">
                    <p class="m-0 p-0">Unable to load this page</p>
                    <el-button @click.prevent="fetchLogs" icon="sync icon" type="text">Retry</el-button>
                </div>
            </div>
            <div v-else class="breathe logs_custom_headers">
                <el-table @row-click="clickRow" empty-text="No logs found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredLogs">
                  <el-table-column label="status" prop="status" width="100">
                        <template slot-scope="scope">
                            <p class="status bold-600 s-12">201 OK</p>
                        </template>                    
                  </el-table-column>
                  <el-table-column label="description" prop="method">
                        <template slot-scope="scope">
                            <div class="trans-div flex justify-content-start">
                              <p class="m-0 p-0 mr-10 bold-500 s-12 text-uppercase">{{scope.row.method || 'N/A'}}</p>
                              <p class="m-0 p-0 mr-10 bold-500 s-12 text-lowercase">{{scope.row.url || 'n/a'}}</p>
                            </div>
                        </template>
                  </el-table-column>
                  <el-table-column label="date" prop="created_at" width="200">
                        <template slot-scope="scope">
                            <p class="m-0 p-0 bold-500 s-12">{{scope.row.created_at | moment("MMM Do, YYYY hh:mm A")}}</p>
                        </template>      
                  </el-table-column>                                    
                </el-table>

                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-20">
                    <div class="s-12">
                        {{logs.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end" 
                      @current-change="handleCurrentChange" 
                      layout="prev, pager, next"
                      :total="total">
                    </el-pagination>
                </div>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Logs',
  data () {
    return {
      isTest: true,
      styleObject: {
        fontSize: '12px'
      },
      log: {},
    }
  },
  created() {
    this.$store.dispatch('getLogs')
  },
  mounted() {
    EventBus.$emit('sideNavClick', 'logs')
  },
  methods: {
    clickRow (row, event, column) {
      if (column.property) {
        this.$router.push(`/logs/${row.id}`)
      }
    },   
    handleCurrentChange (val) {
        this.$store.dispatch('getLogs', {page: val, cache: false})
    },     
    fetchLogs (){
      this.$store.dispatch('getLogs', {cache: false})
    }
  },
  computed: {
    ...mapGetters({
      logs: 'logs',
      state: 'logsState',
      meta: 'logsMeta',
    }),    
    filteredLogs () {
        return this.logs
    },  
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },  
    total () {
      return this.meta.totalCount
    },        
    loading () {
      return this.state === 'LOADING'
    }    
  }
}
</script>

<style lang="scss" scoped>
  .status {
    background: #e3e8ee;
    text-align: center;
    border-radius: 20px;
    padding: 2px;
    width: 80%;
    float: right;    
  }

  .transactions-table-header {
    background-color: #F7FAFC !important;
    height: 36px !important;

    th {
      background-color: #F7FAFC !important;
      padding: 0 !important;
    }
  }
  .mr-10{
    margin-right: 10px;
  }
</style>
