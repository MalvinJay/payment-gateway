<template>
    <div class="bg pt-20 nav-container">
        <div class="center">
            <div class="ui card z-depth navigation-card">
                <!-- navigation card content -->
                <div class="content">
                    <!-- card items -->
                    <div class="ui items">
                        <!-- logo of client -->
                        <div class="item no-margin h-100 center">
                            <div class="ui center-block tiny image">
                                <img src="../assets/images/logo/BondCollect.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-menu router :unique-opened="true" :default-active="defaultActive" active-text-color='#586ada' text-color="#2b2d50" background-color="#E3E8EE">
            <el-menu-item route="/" index="dashboard">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/home.svg" alt="">
                    Dashboard
                </template>
            </el-menu-item>
            <el-submenu ref="sideMenu" index="11">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/payment.svg" alt="">Transactions
                </template>
                <el-menu-item route="/view" index="view">View Transactions</el-menu-item>
                <el-menu-item route="/logs" index="logs">Logs</el-menu-item>
                <el-menu-item index="settings">Settings</el-menu-item>
                <el-menu-item index="1-4">Jobs</el-menu-item>
                <el-menu-item index="1-5">Checkout</el-menu-item>
                <el-menu-item index="1-6">Invoices</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/radar.svg" alt="">
                    FoneMessenger
                </template>
            </el-menu-item>
            <el-menu-item index="4">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/developer.svg" alt="">
                    Report
                </template>
            </el-menu-item>
            <el-menu-item index="5">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/connect.svg" alt="">
                    Contacts
                </template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import EventBus from '../event-bus.js'

export default {
  name: 'SideNav',
  data () {
    return {
      defaultActive: 'dashboard'
    }
  },
  mounted () {
    EventBus.$on('sideNavClick', this.updateNav)
  },
  beforeDestroy () {
    EventBus.$off('sideNavClick', this.updateNav)
  },
  methods: {
    updateNav (payload) {
      this.defaultActive = payload
    }
  }
}
</script>

<style lang="scss" scoped>
.mr-10{
    margin-right: 10px;
}
.pt-20{
    padding-top: 20px
}
.el-menu-item.is-active{
    font-weight: 600
}
.el-menu-item:focus, .el-menu-item:hover{
    background: transparent !important;
}
.el-menu{
    margin: 1rem 0;
}
.el-submenu{
    .el-menu-item{
        height: 30px !important;
        line-height: 30px !important;
        padding-left: 40px !important;
        font-size: 13px;
    }
}
.el-menu-item, .el-submenu__title{
    height: 46px;
    line-height: 46px;
    padding-left: 4px !important;
}
.nav-container{
    width: 230px;
    margin: 0 auto;
}
.navigation-card{
    width: 95%;
    height: 80px;
}
</style>
