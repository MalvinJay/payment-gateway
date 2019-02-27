<template>
    <div>
        <el-tabs class="default-tab" :class="[{'test-data': test}, 'position-relative']" stretch type="border-card">
            <el-tab-pane label="SMS">
                <Sms type="payout"></Sms>
            </el-tab-pane>
            <el-tab-pane label="USSD">
                <Ussd type="payout"></Ussd>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Sms from '../components/Sms'
import Ussd from '../components/Ussd'

export default {
  name: 'FoneMessenger',
  components: {Sms, Ussd},
  data () {
    return {
      test: true,
    }
  },
  created () {
    this.$store.dispatch('getFoneMessengers')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'fonemessenger')
  },
  beforeDestroy () {

  },
  methods: {

  },
  computed: {

  }
}
</script>


<style lang="scss" scoped>

</style>