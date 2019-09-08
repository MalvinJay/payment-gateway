<template>
    <div>
        <el-tabs class="default-tab" :class="[{'test-data': test}, 'position-relative']" stretch type="border-card">
            <!-- <div v-show="test" class="position-absolute bg-orange test">TEST DATA</div> -->
            <el-tab-pane label="Payments">
                <!-- FOUND IN TRANSACTIONS/COMPONENTS -->
                <payouts-table type="payout"></payouts-table>
            </el-tab-pane>
            <el-tab-pane label="Queued">
                <queued-table></queued-table>
            </el-tab-pane>
            <el-tab-pane label="Pending Approval">
                <pending-table></pending-table>
            </el-tab-pane>
            <!--
            <el-tab-pane name="3" label="Failed">
                <failed-table type="cashout"></failed-table>
            </el-tab-pane>
            -->
        </el-tabs>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Payouts',
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
    // this.$cable.subscribe({ channel: 'ChatChannel' })
    EventBus.$emit('sideNavClick', 'payouts')
    
    this.$store.dispatch('getPayouts')
    this.$store.dispatch('getQueues')
    this.$store.dispatch('getPending')
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
