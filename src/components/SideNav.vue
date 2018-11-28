<template>
    <div class="bg pt-20 nav-container">
        <div class="navigation-card card-0">
            <div class="flex align-items-center">
                <el-button class="side-button" icon="bars icon" style="padding: 5px;margin-right: 5px"></el-button>
                <!-- <avatar :size="25" username="Flopay" backgroundColor="#f7921e"></avatar> -->
                <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="user.client.company_name">
                    <p slot="reference" class="text-uppercase s-16 p-0 m-0 bold-500 client_name">{{user.client.company_name}}</p>                
                </el-popover>
            </div>
        </div>

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
                <el-menu-item route="/payments" index="payments">Payments</el-menu-item>
                <el-menu-item route="/payouts" index="payouts">Payouts</el-menu-item>
                <el-menu-item route="/disputes" index="disputes">Disputes</el-menu-item>
                <el-menu-item index="2-4">Settings</el-menu-item>
            </el-submenu>
            <el-submenu ref="sideMenu" index="3">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/balance.svg" alt="">Account
                </template>
                <el-menu-item route="/fees" index="fees">Fees</el-menu-item>
                <el-menu-item route="/topups" index="topups">Topups</el-menu-item>
                <el-menu-item route="/settlements" index="settlements">Settlements</el-menu-item>
                <el-menu-item index="3-4">Settings</el-menu-item>
            </el-submenu>
            <el-menu-item route="/contacts" index="contacts">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/customer.svg" alt="">Customers
                </template>
            </el-menu-item>
            <!-- <el-submenu ref="sideMenu" index="5">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/billing.svg" alt="">Radar
                </template>
                <el-menu-item index="5-1">Tickets</el-menu-item>
                <el-menu-item index="5-2">List</el-menu-item>
                <el-menu-item index="5-3">Rules</el-menu-item>
            </el-submenu> -->
            <el-submenu ref="sideMenu" index="6">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/billing.svg" alt="">Billing
                </template>
                <el-menu-item index="6-1">Invoices</el-menu-item>
                <el-menu-item index="6-2">Subscriptions</el-menu-item>
                <el-menu-item index="6-3">Products</el-menu-item>
                <el-menu-item index="6-4">Orders</el-menu-item>
            </el-submenu>
            <!-- <el-submenu index="connect">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/connect.svg" alt="">Connect
                </template>
                <el-menu-item route="/connect/overview" index="overview">Overview</el-menu-item>
                <el-menu-item route="/connect/accounts" index="accounts">Accounts</el-menu-item>
                <el-menu-item route="/connect/transfers" index="transfers">Settlements</el-menu-item>
                <el-menu-item route="/connect/application_fees" index="fees">Fees</el-menu-item>
                <el-menu-item route="/connect/settings" index="settings">Settings</el-menu-item>
            </el-submenu> -->
            <el-menu-item route="/fonemessenger" index="fonemessenger">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/radar.svg" alt="">FoneMessenger
                </template>
            </el-menu-item>
            <el-submenu ref="sideMenu" index="9">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/developer.svg" alt="">Developers
                </template>
                <el-menu-item index="9-1">Apps</el-menu-item>
                <el-menu-item route="/events" index="events">Events</el-menu-item>
                <el-menu-item route="/logs" index="logs">Logs</el-menu-item>
                <el-menu-item route="/webhooks" index="webhooks">Webhooks</el-menu-item>
                <el-menu-item index="9-5">Settings</el-menu-item>
            </el-submenu>
            <el-submenu ref="sideMenu" route="/account" index="10">
                <template slot="title">
                    <img class="mr-10" src="../assets/images/icons/business-settings.svg" alt=""> Business Settings
                </template>
                <el-menu-item route="/account" index="bs_account">Account Set-up</el-menu-item>
                <!-- <el-menu-item index="10-2">Verifications</el-menu-item> -->
                <!-- <el-menu-item route="/taxation" index="taxation">Tax details</el-menu-item> -->
                <el-menu-item route="/team" index="team">Team</el-menu-item>
                <el-menu-item route="/roles" index="roles">Roles</el-menu-item>   
                <!-- <el-menu-item index="10-6">Integration</el-menu-item>     -->
                <!-- <el-menu-item index="10-7">Relay</el-menu-item>     -->
                <!-- <el-menu-item index="10-8">Authorized apps</el-menu-item> -->
                <!-- <el-menu-item route="/reports" index="reports">Data Reports</el-menu-item> -->
                <!-- <el-menu-item index="10-10">Customer emails</el-menu-item> -->
                <!-- <el-menu-item index="10-11">Documents</el-menu-item> -->
                <!-- <el-menu-item index="10-12">Security history</el-menu-item> -->
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
import EventBus from '../event-bus.js'
import { mapGetters } from 'vuex'

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
  },
  computed: {
    ...mapGetters({
        user: 'user'
    })
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
        padding-left: 60px !important;
        font-size: 13px;
    }
}
.el-menu-item, .el-submenu__title{
    height: 46px;
    line-height: 46px;
    padding-left: 30px !important;
}
.nav-container{
    width: 230px;
    margin: 0 auto;
}
.navigation-card{
    // width: 95%;
    width: 80%;
    padding: 5px 0px;
    background: #f1f6f8;
    color: #999999;
    // height: 80px;
}
.client_name{
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 90%;
    display: block;
    overflow: hidden;
    color: #999999;
}
</style>
