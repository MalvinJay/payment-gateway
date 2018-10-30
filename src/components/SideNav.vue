<template>
    <div class="bg pt-20 nav-container">
        <!-- <div class="center"> -->
            <el-card class="navigation-card card-0">
                <div class="flex align-items-center">
                    <avatar :size="25" username="Flopay" backgroundColor="#f7921e"></avatar>
                    <p class="text-uppercase s-18 blue-text p-0 m-0 bold-500">Flopay</p>                
                </div>
            </el-card>
            <!-- <div class="ui card z-depth navigation-card"> -->
                <!-- navigation card content
                <div class="content">
                    <div class="ui items">
                        <div class="item no-margin h-100 center">
                            <div class="ui center-block tiny image">
                                <avatar username="Flopay"></avatar>
                                <img src="../assets/images/logo/BondCollect.png" alt="">
                            </div>
                        </div>
                    </div>
                </div> -->
            <!-- </div> -->
        <!-- </div> -->
        <el-menu router :unique-opened="true" :default-active="defaultActive" active-text-color='#586ADA' text-color="#999999" background-color="#f1f6f8">
            <el-menu-item route="/" index="dashboard">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/home.svg" alt="">
                    Dashboard
                </template>
            </el-menu-item>
            <el-submenu ref="sideMenu" index="2">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/payment.svg" alt="">Transactions
                </template>
                <el-menu-item route="/view" index="view">Payments</el-menu-item>
                <el-menu-item route="/payouts" index="payouts">Payouts</el-menu-item>
                <el-menu-item index="settings">Disputes</el-menu-item>
                <el-menu-item index="product">Settings</el-menu-item>
            </el-submenu>
            <el-submenu ref="sideMenu" index="3">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/balance.svg" alt="">Account
                </template>
                <el-menu-item index="3-1">Transactions</el-menu-item>
                <el-menu-item index="3-2">Topups</el-menu-item>
                <el-menu-item index="3-3">Settlements</el-menu-item>
                <el-menu-item index="3-4">Settings</el-menu-item>
            </el-submenu>
            <el-menu-item route="/contacts" index="contacts">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/customer.svg" alt="">
                    Customers
                </template>
            </el-menu-item>
            <el-submenu ref="sideMenu" index="5">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/billing.svg" alt="">Billing
                </template>
                <el-menu-item index="3-1">Invoices</el-menu-item>
                <el-menu-item index="3-2">Subscriptions</el-menu-item>
                <el-menu-item index="3-3">Products</el-menu-item>
                <el-menu-item index="3-4">Orders</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/connect.svg" alt="">Connect
                </template>
                <el-menu-item index="6-1">Accounts</el-menu-item>
                <el-menu-item index="logs">Settlements</el-menu-item>
                <el-menu-item index="settings">Fees</el-menu-item>
                <el-menu-item index="product">Settings</el-menu-item>
            </el-submenu>
            <el-menu-item index="7">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/radar.svg" alt="">
                    FoneMessenger
                </template>
            </el-menu-item>
            <el-submenu ref="sideMenu" index="8">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/developer.svg" alt="">Developers
                </template>
                <el-menu-item index="8-1">Apps</el-menu-item>
                <el-menu-item index="events">Events</el-menu-item>
                <el-menu-item index="logs">Logs</el-menu-item>
                <el-menu-item index="product">Settings</el-menu-item>
            </el-submenu>
            <el-menu-item index="9">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/business-settings.svg" alt="">
                    Business
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
    // width: 95%;
    width: 80%;
    padding: 5px 15px;
    // height: 80px;
}
</style>
