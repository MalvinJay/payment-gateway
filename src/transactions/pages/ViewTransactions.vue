<template>
    <div>
        <el-tabs class="default-tab" :class="{'test-data': test}" stretch type="border-card">
            <el-tab-pane label="Payments">
                <!-- FOUND IN TRANSACTIONS/COMPONENTS -->
                <payment-table type="payment"></payment-table>
            </el-tab-pane>
            <el-tab-pane label="Queued">
                <queued-table></queued-table>
            </el-tab-pane>
            <el-tab-pane label="Jobs">
                <job-table></job-table>
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
      columns: [
        {label: 'Trans Type', dataField: 'type'},
        {label: 'Beneficiary', dataField: 'customer'},
        {label: 'Reference', dataField: 'ref'}
      ],
      styleObject: {
        fontSize: '12px'
      }
    }
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'view')
    this.$store.dispatch('getTransactions')
    this.$store.dispatch('getJobs')
    this.$store.dispatch('getQueues')
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
