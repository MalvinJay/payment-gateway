<template>
    <el-dialog custom-class="user-dialog"
        :title="title"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-export-bg">
            <el-form class="transaction-form my-2" size="mini" style="width: 90%" :rules="rules" ref="userForm" :model="userForm" label-width="150px">
                <el-form-item v-for="(item, index) in columns" :key="index" :label="item.label">
                    <el-input v-model="userForm[item.value]"></el-input>
                </el-form-item>
                <el-form-item label="Use Branch Account">
                    <el-switch v-model="userForm.use_branch_account"></el-switch>
                </el-form-item>
                <el-form-item label="Branch">
                    <el-select v-model="branch" class="w-100">
                        <el-option
                        v-for="(item, index) in branches"
                        :key="index"
                        :label="item.name"
                        :value="item.branch_code"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="flex justify-content-end" slot="footer">
            <el-button size="mini" @click="close">Cancel</el-button>
            <el-button size="mini" :loading="loading" type="primary" @click="mode === 'new' ? submitForm('userForm') : editUser('userForm')">Submit</el-button>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
export default {
  name: 'NewUser',
  props: ['modalVisible', 'title', 'groupId', 'userForm', 'mode'],
  data () {
    return {
      columns: [
        {label: 'User Name', value: 'name', prop: 'name'},
        {label: 'Phone Number', value: 'msisdn', prop: 'msisdn'},
        {label: 'Email', value: 'email', prop: 'email'},
        {label: 'Bank Account Number', value: 'bank_account_no', prop: 'bank_account_no'}
      ],
      loading: false,
      rules: {
        name: [
          { required: true, message: 'This field is required', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close () {
      EventBus.$emit('userModal', false)
    },
    submitForm (formName) {
        this.loading = true
        var form = {
            ...this.userForm,
            client_till: this.$route.params.id,
            user_group_id: this.groupId
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createSingleAccountUser', form)
            .then((response) => {
                this.loading = false
                if (response.data.success) {
                    this.$store.dispatch('getSingleAccountUsers', this.$route.params.id)
                    this.close()
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
                const response = error.response
                this.$message({
                    type: 'error',
                    message: response.data.error,
                })
            })
        } else {
            this.loading = false
            this.$message({
                type: 'error',
                message: 'Please correctly fill all fields',
            })  
          }
        })
    },
    editUser (formName) {
        this.loading = true
        var form = {
            client_till: this.$route.params.id,
            name: this.userForm.name,
            email: this.userForm.email,
            branch_code: this.userForm.branch_code,
            branch_name: this.userForm.branch_name,
            msisdn: this.userForm.msisdn,
            role: 'admin',
            bank_account_no: this.userForm.bank_account_no,
            use_branch_account: this.userForm.use_branch_account
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('editSingleAccountUser', { user: form, id: this.userForm.id })
            .then((response) => {
                this.loading = false
                if (response.data.success) {
                    this.close()
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                    this.$store.dispatch('getSingleAccountUsers', this.$route.params.id)
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message,
                    })
                }
            }).catch((error) => {
                this.loading = false
                const response = error.response
                this.$message({
                    type: 'error',
                    message: response.data.error,
                })
            })
        } else {
            this.loading = false
            this.$message({
                type: 'error',
                message: 'Please correctly fill all fields',
            })  
          }
        })
    }
  },
  computed: {
    ...mapGetters({
        privileges: 'currentAccountPrivileges',
        branches: 'currentAccountBranches'
    }),
    branch: {
        get () {
            return this.branches.find(el => el.name === this.userForm.branch_name)
        },
        set (val) {
            this.userForm.branch_name = this.branches.find(el => el.branch_code === val).name
            this.userForm.branch_code = this.branches.find(el => el.branch_code === val).code
        }
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-tag + .el-tag {
//     margin-left: 10px;
//   }
.el-tag{
    margin-right: 10px;
}
  .button-new-tag {
    // margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    // margin-left: 10px;
    vertical-align: bottom;
  }
.el-checkbox__label{
    font-size: 12px !important;
}
</style>
