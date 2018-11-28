<template>
    <el-container class="full-height">
        <!-- Side Nav -->
        <el-aside width="260px">
            <side-nav></side-nav>
        </el-aside>
        <!-- Main Container -->
        <el-container>
            <el-header>
                <the-header></the-header>
            </el-header>
            <!-- Main Container -->
            <el-main v-loading="pageLoading" class="px-20">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import EventBus from '../event-bus.js'
import { mapGetters } from 'vuex'
export default {
  name: 'Client',
  created () {
    var time = {
        time_interval: 'month'
    }
    this.$store.dispatch('setDashboardFilters', time)
    .then(() => {
        EventBus.$emit('updateGraph')
        
    })
    this.$store.dispatch('getTransactions', {cache: false})
    this.$store.dispatch('getTodayGraph', {cache: false})
    .then(() => {
        EventBus.$emit('updateTimeGraph')
    })
    this.$store.dispatch('setClient', JSON.parse(this.$session.get('client')))
    this.$store.dispatch('getJobs')
    this.$store.dispatch('getQueues')
    this.$store.dispatch('getPayouts')
    this.$store.commit('setPageLoading', true)
  },
  computed: {
    ...mapGetters(['pageLoading'])  
  },
//   mounted () {
//     window.addEventListener('unload', this.leaving(), false)
//   },
//   methods: {
//     leaving () {
//         this.$store.dispatch('getToken')
//     }
//   },
  onIdle() {
    this.$store.dispatch('logout')
    .then(() => {
      this.$router.push('/login')
    })
  },
  onActive() {
    setInterval(() => {
        console.log('active')
        this.$store.dispatch('setClient', JSON.parse(this.$session.get('client')))
        this.$store.dispatch('getToken')
    }, 3300000)
  }
}
</script>

<style lang="scss" scoped>
.px-20{
    padding: 8px 20px !important;
}
.full-height{
    height: 100vh;
    overflow: hidden;
}
</style>
