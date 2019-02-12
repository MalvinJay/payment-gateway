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
            <el-main v-loading="pageLoading" class="px-20">
                <!-- <transition name="fade" mode="out-in"> -->
                    <router-view></router-view>
                <!-- </transition> -->
                <div>
                    <!-- <div id="v-step-0">A DOM element on your page. The first step will pop on this element because its ID is 'v-step-0'.</div> -->
                    <!-- <div class="v-step-1">A DOM element on your page. The second step will pop on this element because its ID is 'v-step-1'.</div>
                    <div data-v-step="2">A DOM element on your page. The third and final step will pop on this element because its ID is 'v-step-2'.</div> -->

                    <!-- <v-tour name="myTour" :steps="steps"></v-tour> -->
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import EventBus from '../event-bus.js'
import { mapGetters } from 'vuex'
export default {
  name: 'Client',
  data () {
    return {
      steps: [
        {
            target: '#v-step-0',  // We're using document.querySelector() under the hood
            content: `Discover <strong>Vue Tour</strong>!`
        },
        {
            target: '.v-step-1',
            content: 'An awesome plugin made with Vue.js!'
        },
        {
            target: '[data-v-step="2"]',
            content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
            params: {
                placement: 'top'
            }
        }
      ]
    }
  },
  mounted () {
    // if (!this.user.is_login_before) {
    //     this.$tours['myTour'].start()
    // }
    if (!this.$session.exists()) {
        this.logout()
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapGetters(['pageLoading', 'user'])  
  },
  methods: {
    init () {
        var time = {
            time_interval: 'month'
        }
        this.$store.dispatch('setDashboardFilters', time)
        .then((response) => {
            EventBus.$emit('updateGraph')
        }).catch((error) => {
            if (error.response.status === 401) {
                // console.log('erro', error.response)
                // console.log('erro status', error.response.status)
                // console.log('erro data', error.response.data)
                // this.logout()
                this.$store.dispatch('getToken')
            }
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
        // table columns for reports
        this.$store.dispatch('getFields', {cache: false})
        // account balance
        this.$store.dispatch('getBalance')
    },
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
        this.$store.dispatch('setClient', JSON.parse(this.$session.get('client')))
        this.$store.dispatch('getToken')
    }, 3300000)
  }
}
</script>

<style lang="scss" scoped>
.px-20{
    padding: 10px 20px !important;
}
.full-height{
    height: 100vh;
    overflow: hidden;
}
</style>
