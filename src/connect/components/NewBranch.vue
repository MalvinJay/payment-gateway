<template>
    <el-dialog custom-class="export-dialog"
        :title="title"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-export-bg">
            <el-form class="transaction-form my-2" size="mini" style="width: 90%" :rules="rules" ref="form" :model="form" label-width="150px">
                <el-form-item :prop="item.prop" v-for="(item, index) in options" :key="index" :label="item.label">
                    <div v-if="item.value === 'phone_numbers'">
                        <el-tag
                            :key="tag"
                            v-for="tag in form.phone_numbers"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="mini"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Number</el-button>
                    </div>
                    <el-input v-else v-model="form[item.value]"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="flex justify-content-end" slot="footer">
            <el-button size="mini" @click="close">Cancel</el-button>
            <el-button size="mini" :loading="loading" type="primary" @click="mode === 'new' ? submitForm('form') : editBranch('form')">Submit</el-button>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
import Utils from '../../utils/services.js'

export default {
  name: 'NewBranch',
  props: ['modalVisible', 'title', 'options', 'action', 'callback', 'mode', 'form'],
  data () {
    return {
      loading: false,
      inputVisible: false,
      inputValue: '',
      rules: {
        name: [
          { required: true, message: 'This field is required', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close () {
      EventBus.$emit('branchModal', false)
    },
    handleClose(tag) {
        this.form.phone_numbers.splice(this.form.phone_numbers.indexOf(tag), 1)
    },
    showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus()
        })
    },
    handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
            this.form.phone_numbers.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
    },
    submitForm (formName) {
        this.loading = true
        var form = {
            ...this.form,
            client_till: this.$route.params.id
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch(this.action, form)
            .then((response) => {
                this.loading = false
                if (response.data.success) {
                    this.close()
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                    this.$store.dispatch(this.callback, this.$route.params.id)
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
    editBranch (formName) {
        this.loading = true
        var form = {
            client_till: this.$route.params.id,
            name: this.form.name,
            branch_code: this.form.branch_code,
            bank_account_no: this.form.bank_account_no,
            location: this.form.location,
            phone_numbers: this.form.phone_numbers
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('editSingleAccountBranch', form)
            .then((response) => {
                this.loading = false
                if (response.data.success) {
                    this.$store.dispatch('getSingleAccountBranches', this.$route.params.id)
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                    this.close()
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
</style>
