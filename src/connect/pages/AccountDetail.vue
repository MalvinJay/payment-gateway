<template>
    <div v-loading="loadingPage">
        <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">Unable to load this page</p>
                <el-button @click.prevent="fetchAccount" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <div v-else>
            <div >
                <el-card class="card-0 position-relative">
                    <div class="flex flex-column p-20">
                        <div class="flex justify-content-between align-items-baseline mb-1">
                        <div class="flex align-items-baseline">
                            <p class="blue-text s-24 m-0 p-0 bold-600">{{form.balance | money}}</p>
                            <p class="text-uppercase blue-text s-14 m-0 p-0 ml-1">{{form.currency}}</p>
                        </div>
                        <div>
                            <p class="text-uppercase s-12 bold-600 m-0 p-0">{{header}}</p>
                        </div>
                        </div>
                        <div>
                            <el-button @click="viewTransactions" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="undo icon"></i> View Transactions</el-button>
                            <!-- <el-button size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Note</el-button> -->
                        </div>
                    </div>
                    <!-- :class="[{success ? 'green': 'gray' }]" -->
                    <div class="border-top px-20 py-10">
                        <div class="flex">
                            <div>
                                <!-- <i v-if="form.status == 'paid'" class="check circle s-12 icon green" ></i>
                                <i v-else class="exclamation circle s-12 icon gray" ></i> -->
                            </div>
                            <div class="flex flex-column ml-1">
                                <!-- <p v-if="form.status == 'paid'" class="light mb-1 s-13">{{header}} succeeded</p>
                                <p v-else class="light mb-1 s-13">{{header}} failed</p>
                                <p class="light mb-1 s-12 gray">{{form.date | moment("MMM Do, hh:mm A")}}</p> -->
                            </div>
                        </div>
                    </div>
                </el-card>
                <!-- Account Details -->
                <el-card class="my-2">
                    <div slot="header">
                        <span class="blue-text bold-600 s-16">{{header}} Details</span>
                    </div>
                    <div>
                        <div v-if="hasNoData" class="center h-80">
                            {{noData}}
                        </div>
                        <div v-if="!hasNoData">
                            <div class="flex">
                                <div class="w-50">
                                    <el-row v-for="(value, key, index) in data" :key="index" class="mb-1">
                                        <el-col :span="8">
                                            <p class="m-0 text-capitalize menu-gray-text s-14">{{key}}</p>
                                        </el-col>
                                        <el-col :span="16">
                                            <p class="">{{value}}</p>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div class="w-50">
                                    <el-row v-for="(value, key, index) in data2" :key="index" class="mb-1">
                                        <el-col :span="8">
                                            <p class="m-0 text-capitalize menu-gray-text s-14">{{key}}</p>
                                        </el-col>
                                        <el-col :span="16">
                                            <p class="">{{value}}</p>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
                <!-- Settings -->
                <el-card class="my-2">
                    <div slot="header">
                        <span class="blue-text bold-600 s-16">{{header}} Settings</span>
                    </div>
                    <div>
                        <div v-if="hasNoData" class="center h-80">
                            {{noData}}
                        </div>
                        <div v-if="!hasNoData">
                            <div class="flex">
                                <div class="w-50">
                                    <el-row type="flex" align="middle" v-for="(value, key, index) in settings.slice(0, settings.length / 2)" :key="index" class="mb-1">
                                        <el-col :span="12">
                                            <p class="m-0 text-capitalize menu-gray-text s-12">{{value.name}}</p>
                                        </el-col>
                                        <el-col :span="12">
                                            <!-- <el-switch :active-value="value.value" v-model="value.value"></el-switch> -->
                                        </el-col>
                                    </el-row>
                                </div>
                                <div class="w-50">
                                    <el-row type="flex" align="middle" v-for="(value, key, index) in settings.slice(settings.length / 2, settings.length)" :key="index" class="mb-1">
                                        <el-col :span="12">
                                            <p class="m-0 text-capitalize menu-gray-text s-12">{{value.name}}</p>
                                        </el-col>
                                        <el-col :span="12">
                                            <!-- <el-switch :active-value="value.value" v-model="value.value"></el-switch> -->
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
                <!-- Services -->
                <el-card class="my-2 card-0">
                    <div class="flex align-items-baseline justify-content-between" slot="header">
                        <span class="blue-text bold-600 s-16">{{header}} Services</span>
                        <el-button @click="branchVisible = true" plain class="z-depth-button s-13 open-sans mini-button b-0" size="mini" icon="plus icon">Add Service</el-button>
                    </div>
                    <div>
                        <el-table class="breathe"
                            :row-style="styleObject"
                            row-class-name="transactions-table-body"
                            header-row-class-name="transactions-table-header"
                            :data="services.slice((page * 5) - 5, page * 5)">
                            <el-table-column type="index"></el-table-column>
                            <el-table-column
                                v-for="(item, index) in servicesColumns" :key="index"
                                :label="item.label" :prop="item.prop"></el-table-column>
                            <el-table-column label="Amount">
                                <template slot-scope="scope">
                                    {{ scope.row.amount | money }}
                                </template>
                            </el-table-column>
                            <el-table-column label="Date">
                                <template slot-scope="scope">
                                    {{ scope.row.created_at | moment("Do MMM, YYYY hh:mm A") }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- FOOTER -->
                        <div class="flex justify-content-between align-items-center px-20">
                            <div class="s-12">
                                {{ services.slice((page * 5) - 5, page * 5).length }} results
                            </div>
                            <el-pagination class="my-2 p-0 flex justify-content-end"
                                @current-change="handleCurrentChange"
                                :page-size="5"
                                layout="prev, pager, next"
                                :total="total">
                            </el-pagination>
                        </div>
                    </div>
                </el-card>
                <!-- Branches -->
                <branches-table :header="header"></branches-table>
                <!-- Users -->
                <users-table :header="header"></users-table>
            </div>
        </div>
        
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import NewBranch from '../components/NewBranch'
import NewGroup from '../components/NewGroup'
import UsersTable from '../components/UsersTable'
import BranchesTable from '../components/BranchesTable'
import EventBus from '../../event-bus.js'
import Utils from '../../utils/services.js'

export default {
  name: 'AccountDetail',
  components: {
    BranchesTable,
    UsersTable,
    NewGroup,
    NewBranch
  },
  data () {
    return {
        servicesColumns: [
            {label: 'Name', prop: 'name'},
            {label: 'Account Entry', prop: 'account_entry'}
        ],
        styleObject: {
            fontSize: '12px'
        },
        hasNoData: false,
        page: 1,
        countPerPage: 5,
    }
  },
  mounted () {
    this.fetchAccount()
    EventBus.$emit('sideNavClick', 'accounts')
  },
  beforeDestroy () {
    EventBus.$off('branchModal')
  },
  methods: {
    fetchAccount () {
        this.$store.dispatch('getSingleAccount', this.$route.params.id)
        this.$store.dispatch('getSingleAccountUsers', this.$route.params.id)
        this.$store.dispatch('getSingleAccountBranches', this.$route.params.id)
        this.$store.dispatch('getPrivileges', this.$route.params.id)
    },
    handleCurrentChange (page) {
        this.page = page
        this.countPerPage = this.services.slice((page * 5) - 5, page * 5).length
    },
    viewTransactions () {
        this.$router.push('/payments')
    },
    addUser (id) {
        
    },
    handleCommand (command, row) {
        switch (command) {
            case 'add':
                this.addUser(row.id)
                break
            case 'delete':
                this.deleteJob(row.id)
                break
            default:
                break
        }
    }
  },
  computed: {
    ...mapGetters({
      form: 'currentAccount',
      state: 'currentAccountState',
      branches: 'currentAccountBranches',
      users: 'currentAccountUsers',
      usersState: 'currentAccountUsersState',
      branchesState: 'currentAccountBranchesState',
      privileges: 'currentAccountPrivileges',
      settings: 'currentAccountSettings',
      pageSize: 'pageSize'
    }),
    services () {
      return this.form.services
    },
    noBranches () {
        return this.branches.length === 0
    },
    newUsers () {
        return this.users.map(el => {
            el.name = el.name.toLowerCase()
            el.users.map(element => {
                element.name = element.name.toLowerCase()
                element.branch_name = element.branch_name.toLowerCase()
                return element
            })
            return el
        })
    },
    error () {
        return this.state === 'ERROR'
    },
    loadingPage () {
        return this.state === 'LOADING'
    },
    usersLoading () {
        return this.usersState === 'LOADING'
    },
    branchesLoading () {
        return this.branchesState === 'LOADING'
    },
    header () {
        return Utils.capitalize(this.form.company)
    },
    total () {
        return this.services.length
    },
    data () {
        // var symbol = '\u20B5'
        var symbol = 'GHS'
        if (this.form.currency === 'GHs') {
            symbol = 'GHS'
        }
        var nForm = {
            company: this.form.company ? this.form.company : '-',
            name: this.form.name,
            'phone number': this.form.msisdn,
            email: this.form.email,
            date: moment(this.form.created_at).format('MMM Do, YYYY'),
            time: moment(this.form.created_at).format('hh:mm a'),
        }
        return nForm
    },
    data2 () {
        var nForm = {
            'billing address': this.form.address ? this.form.address : '-',
            city: this.form.city ? this.form.city : '-',
            'till number': this.form.code ? this.form.code : '-',
            'account code': this.form.account_code ? this.form.account_code : '-',
            'client type': this.form.client_type? this.form.client_type: '-',
            'onboard type': this.form.onboard_type? this.form.onboard_type: '-'
        }
        return nForm
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
