<template>
    <div class="flex justify-content-between h-100 header">
        <!-- <div> -->
            <el-input @keyup.enter.native="searchButton" v-model="search" class="is-shadow border-rounded search-div" :prefix-icon="loading" placeholder="Search..."></el-input>
        <!-- </div> -->
        <div class="flex align-items-center header-side-panel">
            <div style="height: 25px">
                <el-switch active-text="Test" v-model="testData"></el-switch>
            </div>
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <img class="img-fluid" src="../assets/images/icons/bookmark.svg" alt="">
                </span>
                <el-dropdown-menu slot="dropdown" class="w-200">
                    <el-dropdown-item>Documentation</el-dropdown-item>
                    <el-dropdown-item>Support</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
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
            </el-dropdown>
            <el-dropdown class="logout-dropdown" @command="handleCommand" trigger="click">
                <span class="el-dropdown-link">
                    <img class="img-big circle" src="../assets/images/profile/profile.jpg" alt="">
                </span>
                <el-dropdown-menu slot="dropdown" class="w-200">
                    <el-dropdown-item disabled>
                        <div class="flex flex-column dropdown-header">
                            <p class="blue-text text-capitalize">{{client.full_name}}</p>
                            <p class="s-8">{{client.company_name}}</p>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item class="header-user-dropdown">Profile</el-dropdown-item>
                    <el-dropdown-item class="header-user-dropdown" command="logout">Sign Out</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  data () {
    return {
        search: '',
        loading: 'el-icon-search'
    }
  },
  methods: {
    searchButton () {
        this.loading = 'el-icon-loading'
        this.$store.dispatch('searchTransactions', {search: this.search})
        .then(() => {
            this.$router.push('/view')
            this.loading = 'el-icon-search'
        })
    },
    logout () {
        this.$store.dispatch('logout')
        .then(() => {
            this.$session.remove('client')
            // this.$session.remove(key)
            this.$session.destroy()
            this.$router.push('/login')
        })
    },
    handleCommand (command) {
        switch (command) {
            case 'logout':
                this.logout()
                break
            default:
                break
        }
    }
  },
  computed: {
    ...mapGetters(['user', 'test']),
    testData: {
        get () {
            return this.test
        },
        set (value) {
            this.$store.dispatch('setTest', value)
        }
    },
    client () {
        return {
            full_name: localStorage.getItem('name'),
            company_name: localStorage.getItem('company')
        }
    }
  }
}
</script>

<style lang="scss" scoped>
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
    width: 15%;
    justify-content: space-between;
    align-items: center;
}

</style>
