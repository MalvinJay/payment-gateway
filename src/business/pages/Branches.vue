<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="flex justify-content-between align-items-center px-20 py-16">
                <div class="search_n_roles flex justify-content-between w-50">
                    <el-input @keyup.enter.native="searchButton" v-model="search" class="search-div mr-2" size="mini" placeholder="Filter by name or code"></el-input>
                    
                    <!-- <div class="roles">
                        <el-select v-model="value" size="mini" filterable placeholder="Select">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>                    
                    </div> -->
                </div>            
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New branch</el-button>
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="fetchBranches" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else class="breathe">
                    <el-table @row-click="clickRow" empty-text="No branches found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredBranches">
                        <el-table-column prop="name" label="NAME">
                            <template slot-scope="scope">
                                <div class="flex flex-column justify-content-center">
                                    <span>{{scope.row.name}}</span>
                                </div>
                            </template>                            
                        </el-table-column>
                        <el-table-column prop="branch_code" label="CODE">
                            <template slot-scope="scope">
                                {{scope.row.branch_code || 'N/A'}}
                            </template>                            
                        </el-table-column>
                        <el-table-column prop="location" label="CODE">
                            <template slot-scope="scope">
                                {{scope.row.location || 'N/A'}}
                            </template>                            
                        </el-table-column>                        
                        <!-- <el-table-column prop="location" label="LAST LOGIN">
                            <template slot-scope="scope">
                                {{scope.row.date_registered | moment("MMM Do, YYYY") || 'N/A'}}
                            </template>                            
                        </el-table-column> -->
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-20">
                        <div class="s-12">
                            <span class="bold-600">{{teams.length}}</span> branches
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
                    <el-table @row-click="checkRole" ref="team" empty-text="No Roles Available" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredBranches">
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
                    <el-button size="mini" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="saveBranch('form')">Save Branch</el-button>
                </span>
            </el-dialog>        
        </div>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
    name: 'Branches',
    data (){
        return {
            multiemail: '',
            isTest: true,
            dialogVisible: false,
            dialogVisible1: false,
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
        this.$store.dispatch('getBranches');
    },

    methods: {
        clickRow (row, event, column) {
            if (column.property) {
                this.$router.push(`/branches/${row.reference}`)
            }        
        },  
        checkRole (row, event, column){
            this.$refs.team.toggleRowSelection(row)
        },
        handleCurrentChange (val) {
            this.$store.dispatch('getBranches', {page: val, cached: false })
        },             
        fetchBranches () {
            this.$store.dispatch('getBranches', {cache: false})
        },        
        searchButton (){

        },
        saveBranch() {

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
            return this.teams;
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
