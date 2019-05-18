<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="flex justify-content-between align-items-center px-20 py-16">
                <div class="search_n_roles flex justify-content-between w-25">
                    <el-input @keyup.enter.native="searchButton" v-model="search" class="search-div mr-2" size="mini" placeholder="Filter branch by name or code"></el-input>
                </div>
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="addBranch" type="text"><i class="plus icon"></i> New branch</el-button>
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
                    <el-table
                    @row-click="clickRow"
                    empty-text="No branches found, create a new branch"
                    v-loading="loading" :row-style="styleObject"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="filteredBranches.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) ||  data.location.toLowerCase().includes(search.toLowerCase()))">
                        <el-table-column prop="name" label="NAME">
                            <template slot-scope="scope">
                                <div class="flex flex-column justify-content-center">
                                    <span>{{scope.row.name}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="branch_code" label="CODE" width="100">
                            <template slot-scope="scope">
                                {{scope.row.branch_code || 'N/A'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="location" label="PHONE NUMBER(s)">
                            <template slot-scope="scope">
                              <div class="flex">
                                <the-tag  status="pending" :title="phone" :width="100" icon="detail check icon" v-for="(phone, index) in scope.row.phone_numbers" :key="index" class="mr-2"></the-tag>
                              </div>
                              <!-- <div v-for="(phone, index) in scope.row.phone_numbers" :key="index">
                                {{phone || 'N/A'}}
                              </div> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="location" label="LOCATION" width="180">
                            <template slot-scope="scope">
                                {{scope.row.location || 'N/A'}}
                            </template>
                        </el-table-column>
                        <el-table-column width="80px">
                            <template slot-scope="scope">
                                <div class="mini-menu">
                                    <el-dropdown @command="command => handleTableCommand(command, scope.row)" trigger="click">
                                        <i class="ellipsis horizontal icon mr-0 cursor"></i>
                                        <el-dropdown-menu class="w-200" slot="dropdown">
                                            <el-dropdown-item disabled>
                                                <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                    action
                                                </div>
                                            </el-dropdown-item>
                                            <el-dropdown-item command="edit" class="s-12">Edit Branch</el-dropdown-item>
                                            <el-dropdown-item command="delete" class="s-12">Delete Branch</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-20">
                        <div class="s-12">
                            <span class="bold-600">{{branches.length}}</span> branches
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

        <!-- New Branch -->
        <el-dialog custom-class="new-transaction"
            :title="title"
            :visible.sync="dialogVisible"
            width="30%">
            <div class="flex justify-content-center new-transaction-bg">
                <el-form size="mini" hide-required-asterisk class="transaction-form" :rules="rules" :model="form" label-width="120px">
                    <el-form-item label="Name">
                        <el-input v-model="form.name" placeholder="Branch Name"></el-input>
                    </el-form-item>
                    <el-form-item label="Branch Code">
                        <el-input v-model="form.branch_code" placeholder="Branch Code"></el-input>
                    </el-form-item>
                    <el-form-item label="Phone Number(s)" prop="phone_numbers">
                        <el-input v-model="phone" type="textarea" placeholder="Phone Number(s)"></el-input>
                    </el-form-item>
                    <el-form-item label="Location">
                        <el-input v-model="form.location" placeholder="Location"></el-input>
                    </el-form-item>
                    <el-form-item label="Email">
                        <el-input v-model="form.email" placeholder="Email"></el-input>
                    </el-form-item>
                    <el-form-item label="Bank Account">
                        <el-input v-model="form.bank_account_no" placeholder="Bank Account (Optional)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                <el-button v-if="save" size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="saveBranch">Save Branch</el-button>
                <el-button v-else size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="updateBranch">Update Branch</el-button>
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
    data () {
        return {
            phone: '',
            isTest: true,
            form: {},
            emptyForm: {
                name: '',
                branch_code: '',
                bank_account_no: '',
                location: '',
                phone_numbers: [],
                email: ''
            },
            dialogVisible: false,
            dialogVisible1: false,
            exportVisible: false,
            createLoading: false,
            selected: '',
            styleObject: {
                fontSize: '12px'
            },
            maxVal: 0,
            rules: {
              phone_numbers: [
                { required: true, min: 10, max: maxVal, message: 'Length should be 10', trigger: 'blur' }
              ]
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
                }
            ],
            value: 'all',
            title: "Create New Branch",
            save: true
        }
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'branches')
        this.$store.dispatch('getBranches')
    },
    methods: {
      clickRow (row, event, column) {
          if (column.property) {
            // this.$router.push(`/branches/${row.reference}`)
          }
      },
      handleCurrentChange (val) {
          this.$store.dispatch('getBranches', {page: val, cached: false })
      },
      editBranch (row) {
        this.save = false
        this.title = "Edit A Branch"
        this.dialogVisible = true

        this.form = row
        this.phone = this.form.phone_numbers.join()
      },
      addBranch () {
        this.dialogVisible = true
        this.phone = ''
        this.form = this.emptyForm
      },
      handleTableCommand (command, row) {
        switch (command) {
            case 'edit':
              this.editBranch(row)
              break
            case 'delete':
              this.deleteJob(row.branch_code)
            break
            default:
              break
        }
      },
      fetchBranches () {
        this.$store.dispatch('getBranches', {cache: false})
      },
      searchButton () {

      },
      deleteJob (code) {
          this.$confirm('This will permanently delete this branch. Continue?', 'Warning', {
              confirmButtonText: 'Delete',
              cancelButtonText: 'Cancel',
              type: 'warning'
          }).then(() => {
              this.$store.dispatch('deleteBranch', code)
              .then((response) => {
              if (response.data.success) {
                  this.$message({
                      type: 'success',
                      message: 'Branch deleted'
                  })
                  this.$store.dispatch('getBranches', {cache: false})
              } else {
                  this.$message({
                      type: 'error',
                      message: response.data.response.message
                  })
              }
              }).catch((error) => {
                  this.$message({
                      type: 'error',
                      message: 'Branch not deleted'
                  })
              })
          }).catch(() => {
              this.$message({
                  type: 'error',
                  message: 'Branch not deleted'
              })
          })
      },
      saveBranch() {
        this.createLoading = true
        var temp = new Array()
        temp = this.phone.split(',')

        this.form.phone_numbers.push(temp)
        this.$store.dispatch('createBranch', this.form)
        .then((response) => {
            if (response.data.success) {
                this.$message({
                    type: 'success',
                    message: response.data.response.message
                })
                this.fetchBranches()
                this.dialogVisible = false
            } else {
            this.$message({
                    type: 'error',
                    message: response.data.response.message.message
                })
            }
            this.createLoading = false
        }).catch((error) => {
            this.createLoading = false
            const response = error.response
            this.$message({
                type: 'error',
                message: response.data.error
            })
        })
      },
      updateBranch() {
        this.createLoading = true
        
        this.form.phone_numbers = []
        var temp = new Array()
        console.log('Display all phones', this.phone)
        temp = this.phone.split(',')
        console.log('Display splited', temp)

        this.form.phone_numbers = temp
        delete this.form.key
        delete this.form.bucket
        this.form.branch_id = this.form.id
        delete this.form.id
        console.log('Final branch state', this.form)

        this.$store.dispatch('updateBranch', this.form)
        .then((response) => {
            if (response.data.success) {
                this.$message({
                  type: 'success',
                  message: response.data.response.message
                })
                this.fetchBranches()
                this.dialogVisible = false
            } else {
            this.$message({
                  type: 'error',
                  message: response.data.response.message.message
                })
            }
            this.createLoading = false
            this.save = true
            this.title = "Create New Branch"
        })
        .catch((error) => {
            this.createLoading = false
            const response = error.response
            this.$message({
                type: 'error',
                message: response.data.error
            })

          // this.save = true
          // this.title = "Create New Branch"
        })

      }
    },
    computed: {
        ...mapGetters({
            branches: 'branches',
            pageSize: 'pageSize',
            state: 'branchesState'
        }),
        error () {
            return this.state === 'ERROR' && this.state !== 'LOADING'
        },
        total () {
            return this.branches.length
        },
        loading () {
            return this.state === 'LOADING'
        },
        filteredBranches () {
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

.el-dialog__footer {
    padding: 20px!important;
}
</style>
