<template>
    <div>
        <el-tabs v-model="activeName" class="default-tab" :class="[{'test-data': test}, 'position-relative']" stretch type="border-card">
            <!-- <div v-show="test" class="position-absolute bg-orange test">TEST DATA</div> -->
            <el-tab-pane name="1" label="Receipts">
                <payment-table type="payment"></payment-table>
            </el-tab-pane>
            <el-tab-pane name="2" label="Queued">
                <queued-table></queued-table>
            </el-tab-pane>
            <el-tab-pane name="3" label="Failed">
                <failed-table type="cashout"></failed-table>
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
      tabValue: '',
      message: 'blah'
    }
  },
//   channels: {
//         ChatChannel: {
//             connected() {
//                 console.log('I am connected.')
//             },
//             rejected() {
//                 console.log('rejected')
//             },
//             received(data) {
//                 console.log('data', data)
//             },
//             disconnected() {
//                 console.log('I am disconnected.')
//             }
//         }
//   },
  mounted () {
    // this.$cable.subscribe({ channel: 'ChatChannel' })
    EventBus.$emit('sideNavClick', 'payments')
    EventBus.$on('tabNumber', (val) => {
        this.activeName = val
    })

    this.$store.dispatch('getTransactions', {search_value: 'cashout'})
    this.$store.dispatch('getQueues')
    this.$store.dispatch('getFailed')
    this.$store.dispatch('getFields')
  },
  beforeDestroy () {
    EventBus.$off('tabNumber', this.updateTab)
  },
  methods: {
    updateTab (val) {
        this.activeName = val
    },
    sendMessage () {
        this.$cable.perform({
          channel: 'ChatChannel',
          action: 'send_message',
          data: { content: this.message }
        })
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
