<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="customer-div flex justify-content-between">
                <div class="flex align-items-baseline">
                    <p class="blue-text bold-600 s-16 m-0 p-0">Customers</p>
                    <!-- <filter-component filterType="payment"></filter-component> -->
                </div>
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="newContact" type="text"><i class="plus icon"></i> New</el-button>
                    <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" type="text"><i class="file alternate outline icon"></i> Export</el-button> -->
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="fetchCustomers" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-table @row-click="clickRow" empty-text="No contacts found" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="contacts">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="name" label="Name">
                            <template slot-scope="scope">
                                <!-- <router-link :to="{name: 'ContactDetails', params: {id: scope.row.code}}"> -->
                                    <div class="flex align-items-center cursor black-text">
                                        {{scope.row.name}}
                                    </div>
                                <!-- </router-link> -->
                            </template>
                        </el-table-column>
                        <el-table-column :formatter="formatContent" :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                        <el-table-column width="100px">
                            <template slot-scope="scope">
                                <div>
                                    <!-- <i v-if="scope.row.status ==='failed'" class="reply icon blue-text cursor first-icon"></i> -->
                                    <el-dropdown class="mini-menu" @command="command => handleCommand(command, scope.row)" trigger="click">
                                        <el-button class="trans-icon-only-button" type="text" size="mini" plain icon="ellipsis horizontal icon"></el-button>
                                        <el-dropdown-menu class="w-200" slot="dropdown">
                                            <el-dropdown-item disabled>
                                                <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                                    actions
                                                </div>
                                            </el-dropdown-item>
                                            <el-dropdown-item command="edit" class="s-12">Edit Customer</el-dropdown-item>
                                            <el-dropdown-item command="delete" class="s-12">Delete Customer</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            {{contacts.length}} results
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
            <!-- New Customer -->
           <add-contact :form="contact" :dialogVisible="dialogVisible"></add-contact>
        </div>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import AddContact from '../components/AddContact'
import Customer from '../model/customer.js'

export default {
  name: 'Contacts',
  props: ['type'],
  components: {
    AddContact
  },
  data () {
    return {
      test: true,
      columns: [
        {label: 'Type', dataField: 'type', width: 'auto'},
        {label: 'phone number', dataField: 'account_no', width: 'auto'},
        {label: 'Provider', dataField: 'bank', width: 'auto'},
        {label: 'Owner', dataField: 'owner', width: 'auto'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      activeName: '1',
      date: false,
      dialogVisible: false,
      form: {
        accounts_provider_code: 'mobile',
        deposit_account: {}
      },
      contact: {},
      retryLoading: false,
      createLoading: false
    }
  },
  created () {
    this.$store.dispatch('getContacts')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'contacts')
    EventBus.$on('addContact', (val) => {
        this.dialogVisible = false
    })
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('setCurrentContacts', val)
    },
    clickRow (row, event, column) {
      // this.$router.push(`/contacts/${row.id}`)
      var form = Customer.getEditView(row)
      this.dialogVisible = true
      this.contact = form
        // if (column.property) {
        // }
    },
    newContact () {
        this.dialogVisible = true
        this.contact = this.form
    },
    fetchCustomers () {
      this.$store.dispatch('getContacts')
    },
    //format the content of each quota
    formatContent (row, column, cellValue, index) {
        return cellValue = typeof cellValue === 'undefined' || !cellValue ? '-' : cellValue
    },
    submitForm (formName) {
        this.createLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createContact', this.form)
            .then((response) => {
                this.createLoading = false
                this.$message({
                    message: 'Contact Created Successfully',
                    type: 'success'
                })
                this.dialogVisible = false
            }).catch(() => {
                this.createLoading = false
                this.$message({
                    message: 'Unable to create Contact. Please try again later',
                    type: 'error'
                })
            })
          } else {
            this.createLoading = false
            this.$message({
                message: 'Please fill form correctly',
                type: 'error'
            })
          }
        })
    },
    resetForm (formName) {
        this.dialogVisible = false
        this.createLoading = false
        this.$refs[formName].resetFields()
    },
    editContact (row) {
        // this.$router.push(`/contacts/${row.id}`)
        var form = Customer.getEditView(row)
        this.dialogVisible = true
        this.contact = form
    },
    handleCommand (command, row) {
        switch (command) {
            case 'edit':
                this.editContact(row)
                break
            case 'delete':
                this.deleteContact(row.id)
                break
            default:
                break
        }
    }
  },
  computed: {
    ...mapGetters({
      contacts: 'currentContacts',
      state: 'contactsState',
      count: 'contactsCount',
      providers: 'providers',
      pageSize: 'pageSize'
    }),
    total () {
      return this.count
    },
    loading () {
      return this.state === 'LOADING'
    },
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    }
  }
}
</script>


<style lang="scss" scoped>
.mini-menu{
    position: absolute;
    top: 8px;
    padding: 0;
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
.customer-div{
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

