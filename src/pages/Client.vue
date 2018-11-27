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
            <!-- v-loading="pageLoading" -->
            <el-main class="px-20">
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
    .then((response) => {
        console.log('header', response.data)
        console.log('header data', response)
        EventBus.$emit('updateGraph')
    }).catch((error) => {
        // if (error.response.status === 401) {
        //     console.log('erro', error.response)
        //     console.log('erro status', error.response.status)
        //     console.log('erro data', error.response.data)
        //     this.logout()
        // }
        
    })
    this.$store.dispatch('getTransactions', {cache: false})
    this.$store.dispatch('getTodayGraph', {cache: false})
    .then(() => {
        EventBus.$emit('updateGraph')
    })
    this.$store.dispatch('setClient', JSON.parse(this.$session.get('client')))
    this.$store.dispatch('getJobs', {cache: false})
    this.$store.dispatch('getQueues', {cache: false})
    this.$store.dispatch('getPayouts', {cache: false})
    // this.$store.commit('setPageLoading', true)
  },
  computed: {
    ...mapGetters(['pageLoading'])  
  },
//   mounted () {
//     window.addEventListener('unload', this.leaving(), false)
//   },
  methods: {
    leaving () {
        this.$store.dispatch('getToken')
    },
    logout () {
        this.$store.dispatch('logout')
        .then(() => {
            this.$session.remove('client')
            this.$session.remove('token')
            this.$session.destroy()
            this.$router.push('/login')
        })
    }
  },
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
