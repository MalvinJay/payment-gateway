<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="flex justify-content-between align-items-center px-20 py-16">
                <div class="search_n_roles flex justify-content-between w-50">
                    <el-input @keyup.enter.native="searchButton" v-model="search" class="search-div mr-2" size="mini" placeholder="Filter by name or email..."></el-input>
                    
                    <div class="roles">
                        <el-select 
                            v-model="value" 
                            size="mini"
                            filterable
                            @change="filterByName"
                            placeholder="Select a role">
                            <el-option v-model="all" label="all"></el-option>
                            <el-option v-for="item in filteredRoles" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>                    
                    </div>
                </div>            
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New user</el-button>
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="fetchTeams" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else class="breathe">
                    <el-table @row-click="clickRow" empty-text="No team found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredTeams">
                        <el-table-column prop="name" label="USER">
                            <template slot-scope="scope">
                                <div class="flex flex-column justify-content-center">
                                    <span class="bold-600">{{scope.row.name}}</span>
                                    <span>{{scope.row.email}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="role" label="ROLE">
                            <template slot-scope="scope">
                                {{scope.row.user_group || 'N/A'}}
                            </template>                            
                        </el-table-column>
                        <el-table-column prop="login" label="LAST LOGIN">
                            <template slot-scope="scope">
                                {{scope.row.date_registered | moment("MMM Do, YYYY") || 'N/A'}}
                            </template>                            
                        </el-table-column>  
                        <el-table-column width="80px">
                            <template slot-scope="scope">
                                <div class="mini-menu">
                                    <el-dropdown @command="command => handleTableCommand(command, scope.row)" trigger="click">
                                        <i class="ellipsis horizontal icon mr-0 cursor"></i>
                                        <el-dropdown-menu class="w-200" slot="dropdown">
                                            <el-dropdown-item command="edit" class="s-12">View User Details</el-dropdown-item>
                                            <el-dropdown-item command="delete" class="s-12">Delete User</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </template>
                        </el-table-column>                                              
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-20">
                        <div class="s-12">
                            <span class="bold-600">{{teams.length}}</span> users
                        </div>
                        <el-pagination class="my-2 flex justify-content-end"
                            @current-change="handleCurrentChange"
                            :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>   
            </div>

            <!-- Invite User -->
            <el-dialog custom-class="invite-user" :visible.sync="dialogVisible" width="40%">
                <div class="head flex flex-column justify-content-start px-20 py-16">
                    <div class="ContentHeader flex justify-content-center flex-column black-text">
                        <span class="black-text bold-600 text-lineHeight--30">
                            <span>Invite new users</span>
                        </span>
                        <span class="text-lineHeight--20 s-13">
                            <span>Enter the name and email addresses of the user you'd like to invite, and choose the role they should have.</span>
                        </span>
                    </div>
                    <div class="pt-10">
                        <el-input v-model="form.email" placeholder="toni@flopay.com, seddie@flopay.com..." size="mini" clearable></el-input>                
                    </div>
                    <div class="flex justify-content-center">
                        <div class="pt-10 pr-10 w-50">
                            <el-input v-model="form.name" placeholder="username..." size="mini" clearable></el-input>                
                        </div>
                        <div class="pt-10 w-50">
                            <el-input v-model="form.msisdn" placeholder="phone number.." size="mini" clearable></el-input>                
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-center">
                  <div class="custom">
                    <el-table :show-header="header" highlight-current-row @row-click="checkRole" ref="role" empty-text="No Roles Available" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredRoles">
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <el-radio v-model="form.user_group_id" :label="scope.row.id"></el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" class="bold-600">
                            <template slot-scope="scope">
                                {{scope.row.name || 'N/A'}}
                            </template>                            
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.description || 'N/A'}}
                            </template>              
                        </el-table-column>
                        <el-table-column align="right">
                            <template slot-scope="scope">
                                <el-popover
                                    placement="left"
                                    width="400"
                                    popper-class="no-padding-popover"
                                    trigger="hover">
                                    <div>
                                        <div class="flex justify-content-between p-10 border-bottom">
                                            <p class="blue-text bold-600 s-14 m-0 p-0">Role Type</p>
                                            <the-tag status="failed" :title="scope.row.name" icon="reply icon"></the-tag>
                                        </div>
                                        <div class="p-10">
                                            <div v-for="(item, index) in scope.row.privileges" :key="index">
                                                <p class="s-12 py-5">{{item.action}}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <el-button icon="info circle icon" type="text" slot="reference" class="p-0"></el-button>
                                </el-popover>
                            </template>
                        </el-table-column>                                          
                    </el-table>                      
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                    <el-button size="mini" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="goForward(true)">Select Branch</el-button>
                </span>
            </el-dialog>

            <!-- Select A Branch -->
            <el-dialog custom-class="invite-user" :visible.sync="dialogVisible1" width="40%">
                <div class="head flex flex-column justify-content-start px-20 py-16">
                    <div class="ContentHeader flex justify-content-center flex-column black-text">
                        <span class="black-text bold-600 text-lineHeight--30">
                            <span>Select A Branch</span>
                        </span>
                    </div>
                </div>
                <div class="flex justify-content-center">
                  <div class="custom  w-100">
                    <el-table highlight-current-row @row-click="checkBranch" ref="branch" empty-text="No Branches Available" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredBranches">
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <el-radio v-model="form.branch_code" :label="scope.row.branch_code"></el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column label="NAME" width="auto" class="bold-600">
                            <template slot-scope="scope">
                                {{scope.row.name || 'N/A'}}
                            </template>                            
                        </el-table-column>
                        <el-table-column label="CODE" width="80">
                            <template slot-scope="scope">
                                {{scope.row.branch_code || 'N/A'}}
                            </template>                            
                        </el-table-column>
                        <el-table-column label="LOCATION" width="170">
                            <template slot-scope="scope">
                                {{scope.row.location || 'N/A'}}
                            </template>                            
                        </el-table-column>                        
                    </el-table>                      
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="goForward(false)">Back</el-button>
                    <el-button size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="inviteUser">Invite</el-button>
                </span>
            </el-dialog>            
        </div>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
    name: 'Teams',
    data (){
        return {
            header: false,
            roleId: '',
            multiemail: '',
            form: {
                email: '',
                name: '',
                msisdn: '',
                branch_code: '',
                role: 'admin',
                user_group_id: '',
            },            
            isTest: true,
            selected: '',
            dialogVisible: false,
            dialogVisible1: false,
            exportVisible: false, 
            styleObject: {
                fontSize: '12px'
            },        
            search: '',       
            value: 'all',
            all: 'all',
            createLoading: false,
            filter: {
                name: ''
            }
        }
    },

    mounted () {
        EventBus.$emit('sideNavClick', 'teams')
        // EventBus.$on('exportModal', (val) => {
        //     this.exportVisible = false
        // })
        this.$store.dispatch('getTeams')
        this.$store.dispatch('getRoles')
        this.$store.dispatch('getBranches')
    },

    methods: {
        close () {
            EventBus.$emit('teamModal', false)
        },        
        clickRow (row, event, column) {
            if (column.property) {
                // this.$router.push(`/teams/${row.reference}`)
            }        
        },  
        checkRole (row, event, column){
            this.$refs.role.setCurrentRow(row)
            this.form.user_group_id = row.id
        },
        checkBranch (row, event, column){
            this.$refs.branch.setCurrentRow(row)
            this.form.branch_code = row.branch_code
        },        
        handleCurrentChange (val) {
            this.$store.dispatch('getTeams', {page: val, cached: false })
        },  
        handleTableCommand (command, row) {
            switch (command) {
                case 'edit':
                    // this.$router.push(`/teams/${row.reference}`)
                    break
                case 'delete':
                    this.deleteUser(row.msisdn)
                    break                    
                default:
                    break
            }
        },                   
        fetchTeams () {
            this.$store.dispatch('getTeams', {cache: false})
        },              
        searchButton (){

        },
        deleteUser (code) {
            this.$confirm('This will permanently delete this User. Continue?', 'Warning', {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('deleteUser', code)
                .then((response) => {
                if (response.data.success) {
                    this.$message({
                        type: 'success',
                        message: response.data.response.message
                    })
                    this.$store.dispatch('getTeams', {cache: false})
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                }  
                }).catch((error) => {
                    this.$message({
                        type: 'error',
                        message: 'User not deleted'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'error',
                    message: 'User not deleted'
                })                        
            })
        },        
        filterByName(val){
            this.filter.name = val
            this.$store.dispatch('setTeamsFilters', this.filter)
        },
        inviteUser() {
            this.createLoading = true
            this.$store.dispatch('createUser', this.form)
            .then((response) => {
                this.$message({
                    type: 'success',
                    message: response.data.response.message,
                })
                this.createLoading = false

                if (response.data.success) {
                    this.dialogVisible1 = false
                    this.$store.dispatch('getTeams', {cache: false})
                }
            }).catch((error) => {
                this.createLoading = false
                const response = error.response
                this.$message({
                    type: 'error',
                    message: response.data.error,
                })
            })
        },
        goForward(val){
            if(val == true){
                this.dialogVisible = false
                this.dialogVisible1 = true
            } else {
                this.dialogVisible = true
                this.dialogVisible1 = false            
            }
        }        
    },

    computed: {
        ...mapGetters({
            teams: 'teams',
            state: 'teamsState',
            roles: 'roles',
            rolesState: 'rolesState',
            pageSize: 'pageSize',
            branches: 'branches',
            branchesState: 'branchesState'
        }),  
        error () {
            return this.state === 'ERROR' && this.state !== 'LOADING'
        },              
        total () {
            return this.teams.length
        },    
        loading () {
            return this.state === 'LOADING'
        },
        filteredTeams () {
            return this.teams
        },   
        filteredRoles (){
            return this.roles;
        },
        filteredBranches (){
            return this.branches
        }
    }
}
</script>

<style lang="scss" scoped>
.mini-menu {
    position: absolute;
    // top: 8px;
    top: 31%;
    padding: 2px 7px;
    border-radius: 4px;
    transition: all ease;
    line-height: normal;
    right: 20px;

    &:hover{
        // background: red;
    }
    .first-icon{
        opacity: 0;
    }
    i{
        // &:first-child{
        //     opacity: 0;
        // }
        font-size: 12px;
    }
}

.custom {
    width: 100%;
    
    .transactions-table-header {
        display: none;
    }
}

.mini-button{
    line-height: 1em;
    padding: 7px 10px !important;
    color: rgba(0,0,0,.6);

    &:hover{
        color: rgba(0,0,0,.8);
    }

    span{
        font-weight: 600
    }
    i{
        margin-right: 5px;
    }
}

.ContentHeader{
    flex: 1 1;
}

</style>
