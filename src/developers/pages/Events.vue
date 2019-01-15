<template>
    <div>
      <div :class="[{'test-data': isTest}]" class="transactions bg-white border-right border-left">
          <div class="flex justify-content-between px-20 py-16">
              <div>
                  <filter-component dispatch="setEventsFilters" filterType="events"></filter-component>
              </div>
          </div>
          <div>
            <div class="center h-80" v-if="error">
                <div class="center flex-column">
                    <p class="m-0 p-0">Unable to load this page</p>
                    <el-button @click.prevent="fetchEvents" icon="sync icon" type="text">Retry</el-button>
                </div>
            </div>
            <div v-else class="breathe events_custom_headers">
                <el-table
                @row-click="clickRow"
                empty-text="No events found, filter desired period range"
                v-loading="loading"
                :row-style="styleObject"
                row-class-name="transactions-table-body"
                header-row-class-name="transactions-table-header"
                :data="filteredEvents">
                  <el-table-column show-overflow-tooltip label="event" prop="event">
                        <template slot-scope="scope">
                            <p class="m-0 p-0 bold-500 s-13">                             
                              <span v-if="scope.row.request.transaction.service_code === 'cashout'">
                                <span v-if="scope.row.request.transaction.status === 'paid'">
                                  A successful <strong>payment</strong> was made for <strong>GHS {{scope.row.request.transaction.amount}}</strong>
                                </span>
                                <span v-if="scope.row.request.transaction.status === 'failed'">
                                  A <strong>payment</strong> of <strong>GHS {{scope.row.request.transaction.amount}}</strong> failed
                                </span>
                              </span>
                              <span v-if="scope.row.request.transaction.service_code === 'cashin'">
                                <span v-if="scope.row.request.transaction.status === 'paid'">
                                  A successful <strong>payout</strong> was made for <strong>GHS {{scope.row.request.transaction.amount}}</strong>
                                </span>
                                <span v-if="scope.row.request.transaction.status === 'failed'">
                                  A <strong>payout</strong> of <strong>GHS {{scope.row.request.transaction.amount}}</strong> failed
                                </span>                                
                              </span>
                              <span v-if="scope.row.request.transaction.service_code === 'card_payment'">
                                <span v-if="scope.row.request.transaction.status === 'paid'">
                                  A successful <strong>card payment</strong> was made for <strong>GHS {{scope.row.request.transaction.amount}}</strong>
                                </span>
                                <span v-if="scope.row.request.transaction.status === 'cancelled'">
                                  A <strong>card payment</strong> of <strong>GHS {{scope.row.request.transaction.amount}}</strong> was cancelled
                                </span>
                                <span v-if="scope.row.request.transaction.status === 'failed'">
                                  A <strong>card payment</strong> of <strong>GHS {{scope.row.request.transaction.amount}}</strong> failed
                                </span>                                                                
                              </span>
                              <span v-if="scope.row.request.transaction.service_code === 'direct_payment'">
                                <span v-if="scope.row.request.transaction.status === 'success'">
                                  A successful <strong>direct_payment</strong> was made for <strong>GHS {{scope.row.request.transaction.amount}}</strong>
                                </span>
                                <span v-if="scope.row.request.transaction.status === 'failed'">
                                  A <strong>direct_payment</strong> of <strong>GHS {{scope.row.request.transaction.amount}}</strong> failed
                                </span>                                                                
                              </span>                             
                              <span v-if="scope.row.request.transaction.service_code === 'cash_transfer'">
                                <span v-if="scope.row.request.transaction.status === 'paid'">
                                  A successful <strong>cash_transfer</strong> was made for <strong>GHS {{scope.row.request.transaction.amount}}</strong>
                                </span>
                                <span v-if="scope.row.request.transaction.status === 'failed'">
                                  A <strong>cash_transfer</strong> of <strong>GHS {{scope.row.request.transaction.amount}}</strong> failed
                                </span>                                                                
                              </span>                                                        
                              <span v-if="scope.row.request.transaction.service_code === 'tickets'">
                                <span>
                                  A <strong>ticket event</strong> was raised.
                                </span>                             
                              </span>
                              <!-- <span v-else>
                                <span>
                                  An <strong>event</strong> was made.
                                </span>
                              </span> -->
                            </p>
                        </template>
                  </el-table-column>
                  <el-table-column label="reference" prop="reference" width="200">
                        <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 bold-500 s-12 text-uppercase">{{scope.row.data.REFERENCE || 'N/A'}}</p>
                        </template>
                  </el-table-column>
                  <el-table-column label="date" prop="created_at" width="200">
                        <template slot-scope="scope">
                            <p class="m-0 p-0 bold-500 s-12">{{scope.row.created_at | moment("D MMM,YY hh:mm A")}}</p>
                        </template>      
                  </el-table-column>                                    
                </el-table>

                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-20">
                    <div class="s-12">
                        {{events.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end" @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import Utils from '../../utils/services'
import { mapGetters } from 'vuex'

export default {
  name: 'Events',
  data () {
    return {
      isTest: true,
      styleObject: {
        fontSize: '12px'
      },
      log: {},
      event_description: ''    
    }
  },
  created() {
    this.$store.dispatch('getEvents')
  },
  mounted() {
    EventBus.$emit('sideNavClick', 'events')
  },
  methods: {
    clickRow (row, event, column) {
        if (column.property) {
          this.$router.push(`/events/${row.id}`)
        }
    },   
    handleCurrentChange (val) {
        this.$store.dispatch('getEvents', {page: val, cache: false})
    },     
    fetchEvents (){
      this.$store.dispatch('getEvents', {cache: false})
    }
  },
  computed: {
    ...mapGetters({
      events: 'events',
      state: 'eventsState',
      meta: 'eventsMeta',
    }),    
    filteredEvents () {
      var ev = this.events
      for (let i = 0; i < this.events.length; i++) {
        if (ev[i].request.transaction == undefined) {
          ev[i].request.transaction = []
        }
        if (ev[i].request.transaction.service_code == undefined) {
          ev[i].request.transaction.service_code = 'tickets'
        }
        // if(Object.keys(ev[i].request).length === 0 && ev[i].request.constructor === Object){
        // if (Utils.empty(ev[i].request)){
        //   console.log('Here!!')
        //   ev[i].request[key] = transaction
        //   ev[i].request.transaction[key] = service_code

        //   ev[i].request.transaction.service_code ='tickets'
        //   console.log('View foolish event!!:', ev[i].request.transaction.service_code)
        // }

        console.log(`REQUEST ${ev[i].id}: `, ev[i].request)
        
        // var status = ev[i].request.transaction.status
        // var amount = ev[i].request.transaction.amount

        // switch (ev[i].request.transaction.service_code){
        //   case 'cashout':
        //     if(status == 'paid'){
        //       return this.event_description = `A successful <strong>payment</strong> was made for <strong>GHS ${amount}</strong>`
        //       break;
        //     }
        //     if(status == 'failed'){
        //       return this.event_description = `A <strong>payment</strong> of <strong>GHS ${amount}</strong> failed`
        //       break;
        //     }
    
        //   case 'cashin' || 'direct_payment':
        //     if(status == 'paid'){
        //       return this.event_description = `A successful <strong>payment</strong> was made for <strong>GHS ${amount}</strong>`
        //       break;
        //     }
        //     if(status == 'failed'){
        //       return this.event_description = `A <strong>payment</strong> of <strong>GHS ${amount}</strong> failed`
        //       break;
        //     }

        //   case 'card_payment':
        //     if(status == 'paid'){
        //       return this.event_description = `A successful <strong>card</strong> was made for <strong>GHS ${amount}</strong>`
        //       break;
        //     }
        //     if(status == 'failed'){
        //       return this.event_description = `A <strong>payment</strong> of <strong>GHS ${amount}</strong> failed`
        //       break;
        //     }
        //     if(status == 'cancelled'){
        //       return this.event_description = `A <strong>payment</strong> of <strong>GHS ${amount}</strong> was called`
        //       break;
        //     }

        //   case 'cash_transfer':
        //     if(status == 'paid'){
        //       return this.event_description = `A successful <strong>cash transfer</strong> was made for <strong>GHS ${amount}</strong>`
        //       break;
        //     }
        //     if(status == 'failed'){
        //       return this.event_description = `A <strong>cash transfer</strong> of <strong>GHS ${amount}</strong> failed`
        //       break;
        //     }

        //   case 'tickets':
        //     return this.event_description = `An <strong>event</strong> was made`
        //     break;
        // }
      }

      return ev
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
</style>
