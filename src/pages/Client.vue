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
            <el-main class="px-20">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'Client',
  created () {
    this.$store.dispatch('getTransactions')
    this.$store.dispatch('getJobs')
    this.$store.dispatch('getQueues')
    this.$store.dispatch('getPayouts')
  },
  onIdle() {
    console.log('ZZZ', Date.now())
    this.$store.dispatch('logout')
    .then(() => {
      this.$router.push('/login')
    })
  },
  onActive() {
    setInterval(() => { 
        this.$store.dispatch('getToken')
    }, 3300000)
    console.log('Awake', Date.now())
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
