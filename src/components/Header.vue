<template>
    <div class="flex justify-content-between h-100 header">
        <!-- <div> -->
            <el-input @keyup.enter.native="searchButton" v-model="search" class="is-shadow border-rounded search-div" :prefix-icon="loading" placeholder="Search..."></el-input>
        <!-- </div> -->
        <div class="flex align-items-center justify-content-end header-side-panel">
            <!-- <div style="height: 25px">
                <el-switch active-text="Test" v-model="testData"></el-switch>
            </div>
            
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <img class="img-fluid" src="../assets/images/icons/bell.svg" alt="">
                </span>
                <el-dropdown-menu slot="dropdown" class="w-200">
                    <el-dropdown-item disabled>
                        <p class="green-text notify-header">NOTIFICATION</p>
                    </el-dropdown-item>
                    <el-dropdown-item divided>Lorem</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
            <div class="balance flex align-items-center">
                <div class="flex flex-column">
                    <p>Account balance</p>
                    <p>{{clientBalance | money}}</p>
                </div>
                <div class="v-divider"></div>
            </div>
            <el-dropdown @command="handleDocCommand" style="height: 17px" class="mr-2 cursor" trigger="click">
                <span class="el-dropdown-link">
                    <img class="img-fluid" src="../assets/images/icons/bookmark.svg" alt="">
                </span>
                <el-dropdown-menu slot="dropdown" class="w-200">
                    <el-dropdown-item command="docs">Documentation</el-dropdown-item>
                    <el-dropdown-item command="manual">User Manual</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown id="v-step-0" class="logout-dropdown cursor" @command="handleCommand" trigger="click">
                <span class="el-dropdown-link">
                    <!-- <img class="img-big circle" src="../assets/images/profile/profile.jpg" alt=""> -->
                    <avatar :size="28" :username="clientName"></avatar>
                </span>
                <el-dropdown-menu slot="dropdown" class="w-200">
                    <el-dropdown-item disabled>
                        <div class="flex flex-column dropdown-header">
                            <p class="blue-text text-capitalize bold-600">{{client.full_name}}</p>
                            <p class="s-8">{{client.company_name}}</p>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item divided class="header-user-dropdown" command="profile">Profile</el-dropdown-item>
                    <el-dropdown-item class="header-user-dropdown" command="logout">Sign Out</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import initState from '../utils/initState'
export default {
  name: 'Header',
  data () {
    return {
        search: '',
        loading: 'el-icon-search'
    }
  },
  created () {
    // if (Object.keys(this.user).length === 0) {
    //   this.logout()
    // }  
  },
  methods: {
    searchButton () {
        this.loading = 'el-icon-loading'
        this.$store.dispatch('searchTransactions', {search: this.search})
        .then(() => {
            this.$router.push('/payments')
            this.loading = 'el-icon-search'
        })
    },
    logout () {
        this.$store.dispatch('logout')
        .then(() => {
            // var init = initState.initState()
            // this.$store.replaceState(init)
            this.$session.remove('client')
            this.$session.remove('token')
            this.$session.destroy()
            this.$router.push('/login')
        })
    },
    handleCommand (command) {
        switch (command) {
            case 'logout':
                this.logout()
                break
            case 'profile':
                this.$router.push('/profile')
                break
            default:
                break
        }
    },
    handleDocCommand (command) {
        switch (command) {
            case 'docs':
                window.open('https://developer.flopay.io/','_blank')
                break
            case 'manual':
                this.$router.push('/profile')
                break
            default:
                break
        }
    }
  },
  computed: {
    ...mapGetters(['user', 'test', 'isAdmin', 'balance']),
    testData: {
        get () {
            return this.test
        },
        set (value) {
            this.$store.dispatch('setTest', value)
        }
    },
    client () {
        var client = {}
        // localStorage.getItem('isAdmin')
        if (this.isAdmin) {
            client.full_name = Object.keys(this.user).length !== 0 ? `${this.user.firstname} ${this.user.lastname}` : '',
            client.company_name = Object.keys(this.user).length !== 0 ? this.user.company : ''
        } else {
            client.full_name = Object.keys(this.user).length !== 0 ? this.user.client.full_name : '',
            client.company_name = Object.keys(this.user).length !== 0 ? this.user.client.company_name : ''
        }
        return client
    },
    clientBalance () {
        return this.balance.available_balance ? this.balance.available_balance : 0
    },
    clientName () {
        return this.client.company_name ? this.client.company_name : 'Sedinam'
    }
  }
}
</script>

<style lang="scss" scoped>
.mr-2{
    // margin-left: 1rem;
    margin-right: 10px;
}
.header{
    padding-top: 20px;

    .el-input{
        height: 30px;

        .el-input__icon .el-input__inner{
            height: 30px !important;
            line-height: 30px !important;
        }
    }
}
.balance {
    p{
        padding: 0;
        margin: 0;
        font-size: 12px;
        text-transform: uppercase;

        &:first-child{
            font-weight: 700;
            color: rgba(0,0,0,.5);
            margin-top: 3px;
            font-size: 9px;
        }

        &:last-child{
            margin: 0;
            white-space: nowrap;
            line-height: 1;
            text-align: left;
            margin-top: 3px;
            color: rgb(88, 106, 218);
        }
    }
    .v-divider{
        border-right: 1px solid #e5e5e5;
        height: 28px;
        width: 0;
        margin: 0 10px;
    }
}
.notify-header{
    font-size: 0.75em;
    font-weight: 700;
    letter-spacing: 0.5px;
}
.dropdown-header{
    padding: 10px 0;
    p{
        margin: 0;
        padding: 0;

        &:last-child{
            padding: 0;
            margin: 0;
        }
    }
}

.header-user-dropdown{
    line-height: 30px;
    color: #586ada;
    font-size: 1em;
    font-weight: 600;
}
.w-200{
    width: 200px
}
.w-100px{
    width: auto
}
.s-8{
    font-size: 10px
}
.search-div{
    width: 40%;
}
.header-side-panel{
    // width: 15%;
    // justify-content: space-between;
    // align-items: center;
}
a{
    color: #606266
}
</style>
