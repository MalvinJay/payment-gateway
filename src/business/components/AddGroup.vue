<template>
    <el-dialog custom-class="export-dialog"
        :title="title"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-export-bg">
            <el-form class="transaction-form my-2" size="mini" style="width: 90%" :rules="rules" ref="form" :model="form" label-width="100px">
                <el-form-item :prop="item.prop" v-for="(item, index) in columns" :key="index" :label="item.label">
                    <el-input v-model="form[item.value]" :placeholder="item.label"></el-input>
                </el-form-item>
                <el-form-item label="Privileges" class="my-2 privileges">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check all</el-checkbox>
                    <el-checkbox-group @change="handleCheckedPrivilegesChange" v-model="priv">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-checkbox class="no-margin-checkbox m-0" v-for="(field, index) in privileges.slice(0, 7)" :key="index" :label="field.code">{{field.action}}</el-checkbox>
                            </el-col>
                            <el-col class="flex flex-column" :span="12">
                                <el-checkbox class="no-margin-checkbox m-0" v-for="(field, index) in privileges.slice(8, 13)" :key="index" :label="field.code">{{field.action}}</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </div>
        <div class="flex justify-content-end" slot="footer">
            <el-button size="mini" @click="close">Cancel</el-button>
            <el-button size="mini" :loading="loading" type="primary" @click="mode === 'new' ? submitForm('form') : editGroup('form')">Submit</el-button>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'NewGroup',
  props: ['modalVisible', 'title', 'form', 'mode'],
  data () {
    return {
      checkAll: false,
      isIndeterminate: true,
      columns: [
        {label: 'Group Name', value: 'name', prop: 'name'},
        {label: 'Description', value: 'description', prop: 'description'},
        {label: 'Limit: GH¢', value: 'approval_limit', prop: 'approval_limit'}
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
      EventBus.$emit('groupModal', false)
    },
    handleCheckAllChange (val) {
        this.priv = val ? this.privileges.map(el => el.code) : []
        this.isIndeterminate = false
    },
    handleCheckedPrivilegesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.privileges.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.privileges.length
    },
    submitForm (formName) {
        this.loading = true
        var form = {
            ...this.form,
            privileges: this.form.privileges.map(el => el.code),
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createRole', form)
            .then((response) => {
                this.loading = false
                if (response.data.success) {
                    this.close()
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                    this.$store.dispatch('getRoles',{cache: false})
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
    editGroup (formName) {
        this.loading = true
        var form = {
            name: this.form.name,
            privileges: this.form.privileges.map(el => el.code),
            description: this.form.description,
            approval_limit: this.form.approval_limit
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('createRole', { group: form, id: this.form.id })
            .then((response) => {
                this.loading = false
                if (response.data.success) {
                    this.close()
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                    this.$store.dispatch('getRoles')
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
        privileges: 'privileges'
    }),
    priv: {
        get () {
            return this.form.privileges.map(el => el.code)
        },
        set (val) {
            var newPriv = []
            for (let index = 0; index < val.length; index++) {
                var exists = this.privileges.find(el => el.code === val[index])
                if(Object.keys(exists).length > 0) {
                    newPriv.push(exists)
                }
            }
            this.form.privileges = newPriv
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag{
    margin-right: 10px;
}
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    vertical-align: bottom;
  }
.el-checkbox__label{
    font-size: 12px !important;
}
</style>
