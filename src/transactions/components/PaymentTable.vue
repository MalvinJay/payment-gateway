<template>
    <div class="transactions">
        <div class="trans-div flex justify-content-between">
            <div>
                <filter-component filterType="payment"></filter-component>
            </div>
            <div>
                <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New</el-button>
                <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="exportVisible = true" type="text"><i class="file alternate outline icon"></i> Export</el-button>
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
                <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredTransactions">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="Amount" width="100">
                        <template slot-scope="scope">
                            <p class="m-0 p-0 mr-10 bold-500 s-13">{{scope.row.receiver_amount | money}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="" width="auto">
                        <template slot-scope="scope">
                            <div class="flex">
                                <the-tag v-if="scope.row.status === 'Paid'" status="success" :title="scope.row.status" icon="detail check icon"></the-tag>
                                <the-tag v-else-if="scope.row.status === 'Failed'" status="failed" :title="scope.row.status" icon="close icon"></the-tag>
                                <the-tag v-else status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="created_at" label="Date">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("MMM Do, YYYY")}}
                        </template>
                    </el-table-column>
                    <el-table-column width="80px">
                        <template slot-scope="scope">
                            <div class="mini-menu">
                                <i v-if="scope.row.status.toLowerCase() ==='failed'" class="reply icon cursor first-icon"></i>
                                <el-dropdown trigger="click">
                                    <i class="ellipsis horizontal icon mr-0 cursor"></i>
                                    <el-dropdown-menu class="w-200" slot="dropdown">
                                        <el-dropdown-item disabled>
                                            <div class="table-dropdown-header bold-600 text-uppercase">
                                                action
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item class="s-12">Recharge Funds</el-dropdown-item>
                                        <el-dropdown-item divided disabled>
                                            <div class="table-dropdown-header bold-600 text-uppercase">
                                                connection
                                            </div></el-dropdown-item>
                                        <el-dropdown-item class="s-12">View Payment Details</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-10">
                    <div class="s-12">
                        {{transactions.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :total="total">
                    </el-pagination>
                </div>
                
            </div>
        </div>

        <!-- New Payment -->
        <el-dialog custom-class="new-transaction"
            title="Create New Payment - Mobile Money"
            :visible.sync="dialogVisible"
            width="30%">
            <div class="flex justify-content-center new-transaction-bg">
                <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form" :rules="rules" :model="form" label-width="100px">
                    <el-form-item label="Name">
                        <el-input v-model="form.customer_name"></el-input>
                    </el-form-item>
                    <el-form-item class="h-auto" label="Phone Number" prop="customer_no">
                        <el-input v-model="form.customer_no"></el-input>
                    </el-form-item>
                    <el-form-item label="Provider">
                        <el-select v-model="form.provider" placeholder="Select Provider">
                            <el-option
                                v-for="(item, index) in providers" :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Amount" prop="amount">
                        <el-input class="little-padding-input" v-model="form.amount"><span slot="prefix">&#8373</span></el-input>
                    </el-form-item>
                    <el-form-item label="Remarks">
                        <el-input type="textarea" v-model="form.remarks"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="dialogVisible = false">Cancel</el-button>
                <el-button size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="submitForm('form')">Create Payment</el-button>
            </span>
        </el-dialog>
        <export-modal :modalVisible.sync="exportVisible"></export-modal>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'PaymentTable',
  props: ['type'],
  data () {
    return {
      columns: [
        // {label: 'Method', dataField: 'method', width: '100px'},
        {label: 'Customer', dataField: 'customer', width: 'auto'},
        {label: 'Reference', dataField: 'reference', width: 'auto'},
        {label: 'type', dataField: 'transaction_type', width: '100px'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      activeName: '1',
      date: false,
      dialogVisible: false,
      exportVisible: false,
      form: {
        amount: '',
        currency: 'GHS',
        customer_no: '',
        country_code: 'GH',
        service_code: 'cashout',
        live: false,
        dummy: true
      },
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
  created () {
    this.$store.dispatch('getTransactions')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'view')
    EventBus.$on('exportModal', (val) => {
        this.exportVisible = false
    })
  },
  methods: {
    clickRow (row, event, column) {
        if (column.property) {
            this.$router.push(`/view/${row.reference}`)
        }
    },
    handleCurrentChange (val) {
        this.$store.dispatch('getTransactions', {page: val, cache: false})
    },
    fetchTransactions () {
      this.$store.dispatch('getTransactions', {cache: false})
    },
    submitForm(formName) {
        this.createLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.live = !this.test
            this.form.dummy = this.test
            this.form.service_code = 'cashout'
            this.form.reference = 'FLPCO' + Math.floor(Math.random() * 99999999999)

            this.$store.dispatch('createTransactions', this.form)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        message: 'Payment successful',
                        type: 'success'
                    })
                    this.fetchTransactions()
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
                    message: response.data.error,
                    type: 'error'
                })
            })
          } else {
            this.createLoading = false  
            this.$message({
                message: 'Please correct the errors',
                type: 'error'
            })
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
    // 1. what you want to call the getter here : 2. the name of the getter from the vuex store
      transactions: 'transactions',
      state: 'transactionsState',
      meta: 'transactionsMeta',
      providers: 'providers',
      test: 'test',
      contacts: 'contacts'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
      return this.meta.trans
    },
    filteredTransactions () {
        return this.transactions.map(el => {
            el.method = 'Wallet'
            el.customer = `${el.receiver_no} - ${el.receiver_name}`
            return el
        })
    },
    count () {
        // return this.transactions.length
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
