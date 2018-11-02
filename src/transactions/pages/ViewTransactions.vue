<template>
    <div>
        <el-tabs v-model="activeName" class="default-tab" :class="[{'test-data': test}, 'position-relative']" stretch type="border-card">
            <!-- <div v-show="test" class="position-absolute bg-orange test">TEST DATA</div> -->
            <el-tab-pane name="1" label="Payments">
                <!-- FOUND IN TRANSACTIONS/COMPONENTS -->
                <payment-table type="payment"></payment-table>
            </el-tab-pane>
            <el-tab-pane name="2" label="Queued">
                <queued-table></queued-table>
            </el-tab-pane>
            <el-tab-pane name="3" label="Jobs">
                <job-table type="cashout"></job-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'ViewTransactions',
  data () {
    return {
      test: true,
      activeName: '1',
      columns: [
        {label: 'Trans Type', dataField: 'type'},
        {label: 'Beneficiary', dataField: 'customer'},
        {label: 'Reference', dataField: 'ref'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      tabValue: ''
    }
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'view')
    EventBus.$on('tabNumber', (val) => {
        console.log('valtab', val)
        this.activeName = val
    })
    this.$store.dispatch('getTransactions')
    this.$store.dispatch('getJobs')
    this.$store.dispatch('getQueues')
  },
  beforeDestroy () {
    EventBus.$off('tabNumber', this.updateTab)
  },
  methods: {
    updateTab (val) {
        this.activeName = val
    }  
  },
  computed: {
    ...mapGetters({
      transactions: 'transactions',
      state: 'transactionsState'
    }),
    total () {
      return this.transactions.length
    },
    loading () {
      return this.state === 'LOADING'
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
