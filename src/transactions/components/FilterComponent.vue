<template>
    <el-dropdown ref="messageDrop" placement="bottom-start" trigger="click" :hide-on-click="false">
        <el-button class="z-depth-button bold-600 el-dropdown-link s-13 open-sans mini-button" type="text">
            <i class="filter icon"></i>
            Filter
            <!-- <span v-if="count != 0" class="border-left pl-6">{{filterCount}}</span> -->
        </el-button>
        <el-dropdown-menu class="filter-dropdown" slot="dropdown">
            <div class="dropdown-header flex justify-content-between align-items-center">
              <el-button size="mini" @click="resetFilters" class="s-13 open-sans filter-button b-0">Clear</el-button>
              <p class="p-0 m-0 blue-text">Filters</p>
              <el-button size="mini" @click="createFilters" type="primary" class="s-13 open-sans filter-button b-0">Done</el-button>
            </div>

            <el-dropdown-item>
              <el-checkbox class="mr-10" v-model="date"></el-checkbox> Date
            </el-dropdown-item>
            <el-collapse-transition>
                <div id="filter-from" class="filter-bg" v-show="date">
                    <div class="flex align-items-center">
                        <el-date-picker class="filter-input blue-text mr-10" ref="filterFrom"
                            v-model="filters.from"
                            type="date"
                            placeholder="From.."
                            @change="keepVisible"
                            @focus="showAyt"
                            @blur="keepVisible"
                            value-format="yyyy-MM-dd"
                            format="MMM dd, yyyy">
                        </el-date-picker>
                        <el-date-picker class="filter-input"
                            v-model="filters.to"
                            type="date"
                            @change="keepVisible"
                            @focus="keepVisible"
                            @blur="keepVisible"
                            placeholder="To.."
                            value-format="yyyy-MM-dd"
                            format="MMM dd, yyyy">
                        </el-date-picker>
                    </div>
                </div>
            </el-collapse-transition>

            <el-dropdown-item v-if="showDispute" divided>
                <el-checkbox class="mr-10" v-model="reason"></el-checkbox> Reason
            </el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="reason">
                    <el-select filterable size="mini" v-model="filters.reasons" @remove-tag="removeAllTypes" @change="reasonClick" multiple collapse-tags placeholder="Select A Reason">
                        <el-option
                        v-for="item in reasons"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-transition>

            <el-dropdown-item v-if="showStatus || showDispute || showStocks || showUssd" divided>
                <el-checkbox class="mr-10" v-model="status"></el-checkbox> Status
            </el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="status">
                    <el-select size="mini" v-model="filters.statuses" @remove-tag="removeAll" @change="statusClick" multiple collapse-tags placeholder="Select Status">
                        <el-option
                          v-for="item in stati"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-transition>

            <el-dropdown-item v-if="showFoneStatus" divided>
                <el-checkbox class="mr-10" v-model="state"></el-checkbox> Status
            </el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="state">
                    <el-select size="mini" v-model="filters.state" @remove-tag="removeAll" @change="FonStatusClick" multiple collapse-tags placeholder="SMS Status">
                        <el-option
                        v-for="item in FonStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-transition>

            <el-dropdown-item v-if="showFoneStatus" divided>
                <el-checkbox class="mr-10" v-model="provider"></el-checkbox> Network
            </el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="provider">
                    <el-select size="mini" v-model="filters.providers" @remove-tag="removeAll" @change="FonProvidersClick" multiple collapse-tags placeholder="Select Network">
                        <el-option
                        v-for="item in Provider"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-transition>

            <el-dropdown-item v-if="showStatus" divided>
              <el-checkbox class="mr-10" v-model="type"></el-checkbox> Payment Type
            </el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="type">
                    <el-select size="mini" v-model="filters.payment_types" @remove-tag="removeAllTypes" @change="typeClick" multiple collapse-tags placeholder="Select Type">
                        <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-transition>

        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import EventBus from '../../event-bus.js'
import Utils from '../../utils/services'
export default {
    name: 'FilterComponent',
    props: ['filterType', 'dispatch'],
    data () {
      return {
        count: 0,
        date: false,
        status: false,
        state: false,
        provider: false,
        type: false,
        reason: false,
        amount: false,
        stati: [
            // {label: 'All', value: 'all'},
            {label: 'Success', value: 'succeeded'},
            {label: 'Pending', value: 'pending'},
            {label: 'Failed', value: 'failed'}
        ],
        FonStatus: [
          {label: 'Sent', value: 'sent'},
          {label: 'Pending', value: 'pending'},
          {label: 'Failed', value: 'failed'}
        ],
        Provider: [
          {label: 'Mtn', value: 'mtn'},
          {label: 'Vodafone', value: 'vodafone'},
          {label: 'Airtel', value: 'airtel'},
          {label: 'Tigo', value: 'tigo'}
        ],
        all: ['success', 'pending', 'failed'],
        types: [
            // {label: 'All', value: 'all'},
            {label: 'Card', value: 'card'},
            {label: 'Wallet', value: 'wallet'},
            {label: 'Bank', value: 'bank'}
        ],
        filters: {
            to: '',
            from: '',
            statuses: [],
            payment_types: [],
            reasons: []
        },
        reasons: [
            {label: 'Duplicate', value: 'duplicate'},
            {label: 'Fraudulent', value: 'fraudulent'},
            {label: 'Subscription canceled', value: 'subscription_canceled'},
            {label: 'Product unacceptable', value: 'product_unacceptable'},
            {label: 'Product not received', value: 'product_not_received'},
            {label: 'Unrecognized', value: 'unrecognized'},
            {label: 'Credit not processed', value: 'credit_not_processed'},
            {label: 'Incorrect account details', value: 'incorrect_account_details'},
            {label: 'Insufficient funds', value: 'insufficient_funds'},
            {label: 'Bank cannot process', value: 'bank_cannot_process'},
            {label: 'Debit not authorized', value: 'debit_not_authorized'}
        ]
      }
    },
    methods: {
      createFilters() {
        this.$refs.messageDrop.hide()
        this.count = this.size(this.filters)
        console.log('Route:', this.$route.name)
        if(this.$route.name === 'ViewTransactions') this.filters.search_value = 'cashout'
        if(this.$route.name === 'Payouts') this.filters.search_value = 'cashin'
        
        this.$store.dispatch(this.dispatch, this.filters)
      },
      size (obj) {
          var size = 0, key
          for (key in obj) {
              if (obj.hasOwnProperty(key)) size++
          }
          return size
      },
      resetFilters () {
          this.count = 0
          this.filters = {
              to: '',
              from: '',
              statuses: [],
              payment_types: [],
              reasons: []
          }
          this.date = false
          this.status = false
          this.type = false
          this.reason = false
          this.createFilters()
      },
      keepVisible () {
          this.$refs.messageDrop.show()
      },
      showAyt () {
          console.log('hoy')
          console.log('hoy', this.$refs.filterFrom)
      },
      statusClick (val) {
          this.keepVisible()
          if (val[0] === 'all') {
              var all = ['succeeded', 'pending', 'failed']
              all.forEach(element => {
                this.filters.statuses.push(element)
              })
          }
      },
      FonStatusClick (val) {
        this.keepVisible()
        if (val[0] === 'all') {
            var all = ['sent', 'pending', 'failed']
            all.forEach(element => {
              this.filters.state.push(element)
            })
        }
      },
      FonProvidersClick (val) {
        this.keepVisible()
        if (val[0] === 'all') {
            var all = ['sent', 'pending', 'failed']
            all.forEach(element => {
              this.filters.state.push(element)
            })
        }
      },
      removeAll (val) {
          // if (val === 'all') {
          //     this.filters.statuses = []
          // }
      },
      typeClick (val) {
          this.$refs.messageDrop.show()
          if (val[0] === 'all') {
              var all = ['card', 'wallet', 'bank']
              all.forEach(element => {
                  this.filters.payment_types.push(element)
              })
          }
      },
      removeAllTypes (val) {
          // if (val === 'all') {
          //     this.filters.payment_types = []
          // }
      },
      reasonClick (val) {
          this.$refs.messageDrop.show()
          if (val[0] === 'all') {
              var all = ['Duplicate','Fraudulent', 'Subscription', 'Product','Product','Unrecognized','Credit','Incorrect','Insufficient','Bank','Debit']
              all.forEach(element => {
                  this.filters.reasons.push(element)
              })
          }
      }
    },
    mounted () {
        EventBus.$on('blur', this.keepVisible)
        EventBus.$on('focus', this.keepVisible)
        this.$on('blur', this.keepVisible)
        this.$on('focus', this.keepVisible)

        console.log('focus here', this.$refs.messageDrop)

        // if (this.$refs.messageDrop.$refs.input.focus()) {

        // }
        // let ref = this.$refs
        // let button = document.querySelectorAll('button')
        // button.forEach((elem) => {
        //     elem.addEventListener('click', () => {
        //         console.log('root', event)
        //         ref.messageDrop.show()
        //     })
        // })
        // button.addEventListener('click', event => {
        //     console.log('root', event)
        //     this.keepVisible()
        // })
    },
    computed: {
        showStatus () {
          return this.filterType === 'payment' || this.filterType === 'payouts'
        },
        showFoneStatus() {
          return this.filterType === 'fone'
        },
        showDispute () {
          return this.filterType === 'dispute'
        },
        showStocks () {
          return this.filterType === 'stocks'
        },
        showUssd () {
          return this.filterType === 'ussd'
        },
        filterCount () {
          var count = 0
          if (Utils.present(this.filters.from) || Utils.present(this.filters.to)) {
              count++
          }
          if (Utils.present(this.filters.payment_types)) {
              count++
          }
          if (Utils.present(this.filters.statuses)) {
              count++
          }
          return count
        }
    }
}
</script>

<style lang="scss" scoped>
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
.filter-bg{
    background: #F7FAFC;
    padding: 12px;
}
.dropdown-header{
    background: #F7FAFC;
    height: 37px;
    padding: 0 6px;
    border-bottom: 1px solid #e3e8ee;

    .filter-button{
        // height: 24px;
        padding: 4px 8px;
        display: flex;
        justify-content: center;
        font-size: 13px;
        box-shadow: 0 0 0 1px rgba(43,45,80,.1), 0 2px 5px 0 rgba(43,45,80,.08), 0 1px 1.5px 0 rgba(0,0,0,.07), 0 1px 2px 0 rgba(0,0,0,.08)
    }
}
.mr-10{
    margin-right: 10px
}

.reveal-enter-active, .reveal-leave-active {
  transition: max-height .5s;
}
.reveal-enter, .reveal-leave-to /* .reveal-leave-active below version 2.1.8 */ {
  max-height: 0;
}
</style>

