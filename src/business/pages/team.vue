<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="flex justify-content-between align-items-center px-20 py-16">
                <div class="search_n_ roles flex justify-content-between">
                    <el-input @keyup.enter.native="searchButton" v-model="search" class="border-rounded search-div mr-2" size="mini" placeholder="Filter by name or email"></el-input>
                    
                    <div class="roles">
                        <el-select v-model="value" size="mini" filterable placeholder="Select">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
                    <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredTeams">
                        <el-table-column prop="name" label="USER">
                            <template slot-scope="scope">
                                <div class="flex flex-column justify-content-center">
                                    <span class="bold-600">{{scope.row.name || 'N/A'}}</span>
                                    <span>{{scope.row.email || 'N/A'}}</span>
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
                            <span>Enter the email addresses of the users you'd like to invite, and choose the role they should have.</span>
                        </span>
                    </div>
                    <div class="MultiEmailInput pt-10">
                        <el-input placeholder="toni@flopay.com, seddie@flopay.com" size="mini" v-model="multiemail" clearable></el-input>                
                    </div>
                </div>
                <div class="flex justify-content-center">
                  <div class="custom">
                    <el-table empty-text="No Roles Available" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredRoles">
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <el-radio v-model="scope.row.id"></el-radio>
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
                                        <!-- <el-table row-class-name="roles-table-body" header-row-class-name="no-header-table" :data="scope.row.privileges">
                                            <el-table-column prop="action" label="action"></el-table-column>
                                        </el-table> -->
                                    </div>
                                    <el-button icon="info circle icon" type="text" slot="reference"></el-button>
                                </el-popover>
                            </template>
                        </el-table-column>                                          
                    </el-table>                      
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
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
    name: 'Team',
    data (){
        return {
            multiemail: '',
            isTest: true,
            dialogVisible: false,
            exportVisible: false, 
            styleObject: {
                fontSize: '12px'
            },        
            search: '',       
            options: [
            {
                value: 'all',
                label: 'All Roles'
            }, {
                value: 'administrator',
                label: 'Administrator'
            }, {
                value: 'developer',
                label: 'Developer'
            }, {
                value: 'analyst',
                label: 'Analyst'
            },
            {
                value: 'support',
                label: 'Support Specialist'
            },
            {
                value: 'view_only',
                label: 'View Only'
            }        ],
            value: 'all', 
            createLoading: false,
            rules: {
                customer_no: [
                    { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: 'This field is required', trigger: 'blur' }
                ]
            }                           
        }
    },

    mounted () {
        EventBus.$on('exportModal', (val) => {
            this.exportVisible = false
        })
        this.$store.dispatch('getTeams');
        this.$store.dispatch('getRoles');
    },

    methods: {
        clickRow (row, event, column) {
            if (column.property) {
                this.$router.push(`/teams/${row.reference}`)
            }        
        },  
        handleCurrentChange (val) {
            this.$store.dispatch('getTeams', {page: val, cached: false })
        },             
        fetchTeams () {
            this.$store.dispatch('getTeams', {cache: false})
        },        
        searchButton (){

        },
        inviteUser() {

        }
    },

    computed: {
        ...mapGetters({
            teams: 'teams',
            state: 'teamsState',
            roles: 'roles',
            rolesState: 'rolesState',
            pageSize: 'pageSize'
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
            return this.teams;
        },   
        filteredRoles (){
            return this.roles;
        }
    }
}
</script>

<style lang="scss" scoped>
.custom {
    width: 100%;
    
    .transactions-table-header {
        display: none;
    }
}

.mini-button{
    // height: 30px;
    line-height: 1em;
    // padding: 0 10px;
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
