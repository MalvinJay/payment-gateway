<template>
    <div>
        <el-card class="my-2 card-0">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="blue-text bold-600 s-16">{{header}} Users</span>
                <el-button @click="addGroup" :disabled="noBranches" plain class="z-depth-button s-13 open-sans mini-button b-0" size="mini" icon="plus icon">Add Group</el-button>
            </div>
            <div>
                <el-table
                    class="default-table-expanded breathe"
                    empty-text="No groups to display"
                    ref="group"
                    @row-click="clickGroup"
                    :row-style="styleObject"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    v-loading="usersLoading" :data="newUsers.slice((page * 12) - 12, page * 12)">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table 
                                :row-style="styleObject"
                                row-class-name="transactions-table-body"
                                header-row-class-name="transactions-table-header" 
                                :data="props.row.users" 
                                empty-text="No users under this group to display">
                                <el-table-column :width="item.width"
                                    v-for="(item, index) in usersColumns" :key="index"
                                    :label="item.label" :prop="item.prop"></el-table-column>
                                <el-table-column label="Balance" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.balance | money }}
                                    </template>
                                </el-table-column>
                                <el-table-column width="100px" prop="status" label="">
                                    <template slot-scope="scope">
                                        <div class="flex">
                                            <the-tag v-if="scope.row.is_active" status="failed" title="Active" icon="detail check icon"></the-tag>
                                            <the-tag v-else status="success" title="Inactive" icon="reply icon"></the-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Created at" width="170">
                                    <template slot-scope="scope">
                                        {{ scope.row.created_at | moment("Do MMM, YYYY HH:mm A") }}
                                    </template>
                                </el-table-column>
                                <el-table-column width="50px" align="right">
                                    <template slot-scope="scope">
                                        <div class="flex justify-content-end">
                                            <el-dropdown @command="command => handleUserCommand(command, scope.row)">
                                                <i class="ellipsis vertical icon m-0 blue-text cursor"></i>
                                                <el-dropdown-menu class="w-200" slot="dropdown">
                                                    <el-dropdown-item disabled>
                                                        <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                            action
                                                        </div>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item command="edit" class="s-12">Edit User</el-dropdown-item>
                                                    <el-dropdown-item command="delete" class="s-12">Delete User</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                            <new-user
                                                :group-id="scope.row.id"
                                                title="New User"
                                                :modalVisible="userVisible"></new-user>
                                        </div>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column width="50px" align="center">
                                    <template slot-scope="scope">
                                        <el-button class="p-0 m-0" @click.native.prevent="deleteUserClient(scope.row.msisdn)" icon="trash alternate outline icon" type="text"></el-button>
                                    </template>
                                </el-table-column> -->
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column label="group" prop="name"></el-table-column>
                    <el-table-column label="Number of Users" prop="number_of_users"></el-table-column>
                    <el-table-column label="Approval Limit">
                        <template slot-scope="scope">
                            {{ scope.row.approval_limit | money }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At">
                        <template slot-scope="scope">
                            {{ scope.row.created_at | moment("Do MMM, YYYY HH:mm A") }}
                        </template>
                    </el-table-column>
                    <el-table-column align="right">
                        <template slot-scope="scope">
                            <div class="flex justify-content-end">
                                <el-popover
                                    placement="left"
                                    width="400"
                                    popper-class="no-padding-popover"
                                    trigger="click">
                                    <div>
                                        <div class="flex justify-content-between p-10 border-bottom">
                                            <p class="blue-text bold-600 s-14 m-0 p-0">Group Type</p>
                                            <the-tag status="failed" :title="scope.row.name" icon="reply icon"></the-tag>
                                        </div>
                                        <div class="p-10">
                                            <div v-for="(item, index) in scope.row.privileges" :key="index">
                                                <p class="s-12 py-5">{{item.action}}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <el-button class="p-0" icon="info circle icon" type="text" slot="reference"></el-button>
                                </el-popover>
                                <el-dropdown @command="command => handleCommand(command, scope.row)">
                                    <i class="ellipsis vertical icon m-0 blue-text cursor"></i>
                                    <el-dropdown-menu class="w-200" slot="dropdown">
                                        <el-dropdown-item disabled>
                                            <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                action
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item command="add" class="s-12">Add User</el-dropdown-item>
                                        <el-dropdown-item command="edit" class="s-12">Edit Group</el-dropdown-item>
                                        <el-dropdown-item command="delete" class="s-12">Delete Group</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <new-user
                                    :group-id="scope.row.id"
                                    :title="userTitle"
                                    :userForm="user"
                                    :mode="userMode"
                                    :modalVisible="userVisible"></new-user>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-20">
                    <div class="s-12">
                        {{users.slice((page * 12) - 12, page * 12).length}} results
                    </div>
                    <el-pagination class="my-2 p-0 flex justify-content-end"
                        @current-change="handleCurrentChange"
                        :page-size="pageSize"
                        layout="prev, pager, next"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </el-card>
        <new-group
            :form="group"
            :mode="mode"
            :title="title"
            :modalVisible="groupVisible"></new-group>
        
    </div>
</template>

<script>
import NewGroup from './NewGroup'
import NewUser from './NewUser'
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'

export default {
  name: 'UsersTable',
  props: ['header'],
  components: {
    NewUser,
    NewGroup
  },
  data () {
    return {
      groupVisible: false,
      userVisible: false,
      page: 1,
      usersColumns: [
        {label: 'User Name', prop: 'name'},
        {label: 'email', prop: 'email'},
        {label: 'Branch', prop: 'branch_name'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      group: {
        privileges: []
      },
      mode: 'new',
      title: 'New Group',
      emptyForm: {
        client_till: '',
        name: '',
        privileges: [],
        description: '',
        approval_limit: null
      },
      user: {
        privileges: []
      },
      userMode: 'new',
      userTitle: 'New User',
      userEmptyForm: {
        client_till: '',
        name: '',
        email: '',
        branch_code: '',
        branch_name: '',
        msisdn: '',
        role: 'admin',
        bank_account_no: '',
        use_branch_account: false
      },
    }
  },
  methods: {
    handleCurrentChange (page) {
        this.page = page
    },
    handleCommand (command, row) {
        switch (command) {
            case 'add':
                this.addUser()
                break
            case 'edit':
                this.editGroup(row)
                break
            case 'delete':
                this.deleteUserGroup(row)
                break
            default:
                break
        }
    },
    handleUserCommand (command, row) {
        switch (command) {
            case 'edit':
                this.editUser(row)
                break
            case 'delete':
                this.deleteUserClient(row.msisdn)
                break
            default:
                break
        }
    },
    addUser () {
        this.userVisible = true
        this.user = this.userEmptyForm
        this.userMode = 'new'
        this.userTitle = 'New User'
    },
    editUser (row) {
        this.userVisible = true
        this.user = row
        this.userMode = 'edit'
        this.userTitle = 'Edit User'
    },
    addGroup () {
        this.groupVisible = true
        this.group = this.emptyForm
        this.mode = 'new'
        this.title = 'New Group'
    },
    editGroup (row) {
        this.groupVisible = true
        this.group = row
        this.mode = 'edit'
        this.title = 'Edit Group'
    },
    deleteUserClient (phone) {
        this.$confirm('This will permanently delete this user. Continue?', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
            this.$store.commit('setSingleAccountUsersState', 'LOADING')
            var form = {
                client_till: this.$route.params.id,
                msisdn: phone
            }
            this.$store.dispatch('deleteSingleAccountUser', form)
            .then((response) => {
                this.$store.commit('setSingleAccountUsersState', 'DATA')
                if (response.data.success) {
                    this.$store.dispatch('getSingleAccountUsers', this.$route.params.id)
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message,
                    })
                }
            }).catch((error) => {
                this.$store.commit('setSingleAccountUsersState', 'DATA')
                const response = error.response
                this.$message({
                    type: 'error',
                    message: response.data.error,
                })
            })
        })
    },
    deleteUserGroup (row) {
        this.$confirm('This will permanently delete this group. Continue?', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
            this.$store.commit('setSingleAccountUsersState', 'LOADING')
            var form = {
                client_till: this.$route.params.id,
                code: row.code
            }
            this.$store.dispatch('deleteSingleAccountGroup', form)
            .then((response) => {
                this.$store.commit('setSingleAccountUsersState', 'DATA')
                if (response.data.success) {
                    this.$store.dispatch('getSingleAccountUsers', this.$route.params.id)
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message,
                    })
                }
            }).catch((error) => {
                this.$store.commit('setSingleAccountUsersState', 'DATA')
                const response = error.response
                this.$message({
                    type: 'error',
                    message: response.data.error,
                })
            })
        })
    },
    clickGroup (row, event, column) {
        if (column.property) {
            this.$refs.group.toggleRowExpansion(row)
        }
    }
  },
  mounted () {
    EventBus.$on('groupModal', (val) => {
        this.groupVisible = false
    })
    EventBus.$on('userModal', (val) => {
        this.userVisible = false
    })
  },
  beforeDestroy () {
    EventBus.$off('groupModal', (val) => {
        this.groupVisible = false
    }) 
    EventBus.$off('userModal', (val) => {
        this.userVisible = false
    }) 
  },
  computed: {
    ...mapGetters({
      form: 'currentAccount',
      branches: 'currentAccountBranches',
      users: 'currentAccountUsers',
      usersState: 'currentAccountUsersState',
      privileges: 'currentAccountPrivileges',
      pageSize: 'pageSize'
    }),
    noBranches () {
        return this.branches.length === 0
    },
    total () {
        return this.users.length
    },
    newUsers () {
        return this.users
    },
    usersLoading () {
        return this.usersState === 'LOADING'
    }
  }
}
</script>

