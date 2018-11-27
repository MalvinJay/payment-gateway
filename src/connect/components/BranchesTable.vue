<template>
    <div>
        <el-card class="my-2 card-0">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="blue-text bold-600 s-16">{{header}} Branches</span>
                <el-button @click="addBranch" plain class="z-depth-button s-13 open-sans mini-button b-0" size="mini" icon="plus icon">Add Branch</el-button>
            </div>
            <div>
                <el-table class="breathe" empty-text="No branches"
                    v-loading="branchesLoading"
                    :row-style="styleObject"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="branches">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                        v-for="(item, index) in branchesColumns" :key="index"
                        :label="item.label" :prop="item.prop"></el-table-column>
                    <el-table-column label="Amount">
                        <template slot-scope="scope">
                            {{ scope.row.funds_allocated | money }}
                        </template>
                    </el-table-column>
                    <el-table-column width="55px" align="right">
                        <template slot-scope="scope">
                            <div class="flex justify-content-end">
                                <el-dropdown @command="command => handleCommand(command, scope.row)">
                                    <i class="ellipsis vertical icon m-0 blue-text cursor"></i>
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
            </div>
        </el-card>
        <new-branch
            :mode='mode'
            :form="form"
            :title="title"
            action="createSingleAccountBranch"
            :options="branchOptions"
            callback="getSingleAccountBranches"
            :modalVisible="branchVisible"></new-branch>
    </div>
</template>

<script>
import NewBranch from './NewBranch'
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'

export default {
  name: 'BranchesTable',
  props: ['header'],
  components: {
    NewBranch
  },
  data () {
    return {
      form: {},
      mode: 'new',
      emptyForm: {
        client_till: '',
        name: '',
        bank_account_no: '',
        location: '',
        phone_numbers: [ ],
        email: ''
      },
      title: 'New Branch',
      branchVisible: false,
      styleObject: {
        fontSize: '12px'
      },
      branchesColumns: [
        {label: 'Name', prop: 'name'},
        {label: 'Till Number', prop: 'branch_code'},
        {label: 'Bank Account Number', prop: 'bank_account_no'}
      ],
      branchOptions: [
        {label: 'Name', value: 'name', prop: 'name'},
        {label: 'Account Number', value: 'bank_account_no', prop: 'bank_account_no'},
        {label: 'Phone Number', value: 'phone_numbers', prop: 'phone_numbers'},
        {label: 'Email', value: 'email', prop: 'email'},
        {label: 'Location', value: 'location', prop: 'location'}
      ]
    }
  },
  mounted () {
    EventBus.$on('branchModal', (val) => {
        this.branchVisible = false
    })
  },
  beforeDestroy () {
    EventBus.$off('branchModal')
  },
  computed: {
    ...mapGetters({
      branches: 'currentAccountBranches',
      branchesState: 'currentAccountBranchesState'
    }),
    branchesLoading () {
        return this.branchesState === 'LOADING'
    }
  },
  methods: {
    handleCommand (command, row) {
      switch (command) {
        case 'edit':
          this.editBranch(row)
          break
        case 'delete':
          this.deleteBranch(row)
          break
        default:
          break
      }
    },
    addBranch () {
        this.branchVisible = true
        this.form = this.emptyForm
        this.mode = 'new'
        this.title = 'New Branch'
    },
    editBranch (row) {
        this.branchVisible = true
        this.form = row
        this.mode = 'edit'
        this.title = 'Edit Branch'
    },
    deleteBranch (row) {
        var form = {
            client_till: this.$route.params.id,
            branch_code: row.branch_code
        }
        this.$confirm('This will permanently delete this branch. Continue?', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
            this.$store.commit('setSingleAccountBranchesState', 'LOADING')
            this.$store.dispatch('deleteSingleAccountBranch', form)
            .then((response) => {
                this.$store.commit('setSingleAccountBranchesState', 'DATA')
                if (response.data.success) {
                    this.$store.dispatch('getSingleAccountBranches', this.$route.params.id)
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
                this.$store.commit('setSingleAccountBranchesState', 'DATA')
                const response = error.response
                this.$message({
                    type: 'error',
                    message: response.data.error,
                })
            })
        })
        
    }
  }
}
</script>
