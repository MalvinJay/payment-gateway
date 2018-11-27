<template>
    <div class="transactions">
        <div class="trans-div flex justify-content-between">
            <div class="flex align-items-baseline">
                <p class="blue-text bold-600 s-16 m-0 p-0">Jobs</p>
                <!-- <filter-component filterType="payment"></filter-component> -->
            </div>
            <div>
                <el-button @click="newJob" class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="plus icon"></i> New</el-button>
                <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="file alternate outline icon"></i> Export</el-button> -->
            </div>
        </div>
        <div>
            <div class="center h-80" v-if="error">
                <div class="center flex-column">
                    <p class="m-0 p-0">Unable to load this page</p>
                    <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
                </div>
            </div>
            <div v-else>
                <el-table @row-click="clickRow" empty-text="No jobs to display" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredJobs">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="description" label="Job Name" width="300">
                        <template slot-scope="scope">
                            <p style="color: #2b2d50;" class="m-0 cursor p-0 mr-10 bold-500 s-13">{{scope.row.description}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="scheduled" label="">
                        <template slot-scope="scope">
                            <div class="flex">
                                <the-tag v-if="scope.row.scheduled" status="success" title="Automatic" icon="detail check icon"></the-tag>
                                <the-tag v-else status="failed" title="Manual" icon="reply icon"></the-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" label="Date">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("MMM Do, YYYY")}}
                        </template>
                    </el-table-column>
                    <el-table-column width="100px">
                        <template slot-scope="scope">
                            <div class="mini-menu">
                                <i v-if="scope.row.status ==='failed'" class="reply icon blue-text cursor first-icon"></i>
                                <el-dropdown @command="command => handleCommand(command, scope.row)">
                                    <i class="ellipsis horizontal icon m-0 blue-text cursor"></i>
                                    <el-dropdown-menu class="w-200" slot="dropdown">
                                        <el-dropdown-item disabled>
                                            <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                action
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item command="edit" class="s-12">Edit Job</el-dropdown-item>
                                        <el-dropdown-item command="delete" class="s-12">Delete Job</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-10">
                    <div class="s-12">
                        {{jobs.length}} results
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
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'JobTable',
  props: ['type'],
  data () {
    return {
      test: true,
      columns: [
        {label: 'CONTACTS', dataField: 'contact', align: 'center'},
        {label: 'NUMBER OF RUNS', dataField: 'number_of_runs', align:"right"}
        // {label: 'STATUS', dataField: 'reference', width: 'auto'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      activeName: '1',
      date: false,
      dialogVisible: false,
      form: {
        amount: '',
        currency: 'GHS',
        customer_no: '',
        country_code: 'GH',
        service_code: 'cashout',
        live: false,
        dummy: true
      },
      rules: {
        phone: [
            { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
        ],
        amount: [
            { required: true, message: 'This field is required', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$store.dispatch('getJobs')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'payments')
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('getJobs', {page: val})
    },
    clickRow (row, event, column) {
        if (column.property) {
            this.$router.push(`/job/${row.id}`)
        }
    },
    editJob (id) {
        this.$router.push(`/job/${id}`)
    },
    newJob () {
        this.$router.push('/new-job')
    },
    fetchTransactions () {
      this.$store.dispatch('getJobs')
    },
    handleCommand (command, row) {
        switch (command) {
            case 'edit':
                this.editJob(row.id)
                break
            case 'delete':
                this.deleteJob(row.id)
                break
            default:
                break
        }
    },
    deleteJob (id) {
        this.$confirm('This will permanently delete this job. Continue?', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteJob', id)
          .then((response) => {
            if (response.data.success) {
               this.$message({
                    type: 'success',
                    message: 'Job deleted'
                })
                this.$store.dispatch('getJobs', {cache: false})
            } else {
               this.$message({
                    type: 'error',
                    message: response.data.response.message
                })
            }  
          }).catch((error) => {
            this.$message({
                type: 'error',
                message: 'Job not deleted'
            })
          })
        }).catch(() => {
                  
        })
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createTransactions', this.form)
            .then((response) => {
                this.$message({
                    message: 'Payment successful',
                    type: 'success'
                })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  },
  computed: {
    ...mapGetters({
      jobs: 'jobs',
      state: 'jobsState',
      providers: 'providers',
      pageSize: 'pageSize'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    filteredJobs () {
        return this.jobs.map(el => {
          var con = el.contacts.length
          el.contact = con ? con : 0
          el.description = el.description ? el.description : el.name
          return el
        })
    },
    total () {
      return this.jobs.length
    },
    loading () {
      return this.state === 'LOADING'
    }
  }
}
</script>


<style lang="scss" scoped>
.mini-menu{
    position: absolute;
    top: 8px;
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
.new-transaction{
    .el-dialog__header{
        color: #2b2d50;
    }
    .el-dialog__body{
        padding: 20px
    }
}
.new-transaction-bg{
    background: #F7FAFC;
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
.trans-div{
    height: 60px;
    padding: 20px 20px 0 20px
}
.transactions-table-header{
    background-color: #F7FAFC !important;
    height: 36px !important;

    th{
        background-color: #F7FAFC !important;
        padding: 0 !important;
    }

}
.white-text{
    color: white
}
.mr-10{
    margin-right: 10px;
}
</style>

