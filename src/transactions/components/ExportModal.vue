<template>
    <el-dialog custom-class="export-dialog"
        title="Export"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-export-bg">
            <el-form hide-required-asterisk class="transaction-form my-2" size="mini" style="width: 90%" :rules="rules" ref="form" :model="form" label-position="top">
                <el-form-item label="Type of Transaction">
                    <div class="flex justify-content-between align-items-center">
                        <el-checkbox v-model="form.payment_types" @change="handleCheckedTypesChange" v-for="payment in types" :label="payment.value" :key="payment.value">{{payment.label}}</el-checkbox>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">All</el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="Select Date">
                    <el-date-picker
                    v-model="dateColumns"
                    type="daterange"
                    start-placeholder="Start date"
                    end-placeholder="End date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Columns">
                    <el-select placeholder="" v-model="column">
                        <el-option label="All" value="all"></el-option>
                        <el-option label="Custom" value="custom"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="column == 'custom'" class="my-2">
                    <el-checkbox-group v-model="fieldColumns">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-checkbox class="no-margin-checkbox m-0" v-for="(field, index) in fieldSet.slice(0, 10)" :key="index" :label="field.key">{{field.value}}</el-checkbox>
                        </el-col>
                        <el-col class="flex flex-column" :span="12">
                            <el-checkbox class="no-margin-checkbox m-0" v-for="(field, index) in fieldSet.slice(11, 20)" :key="index" :label="field.key">{{field.value}}</el-checkbox>
                        </el-col>
                    </el-row>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item class="flex justify-content-end">
                    <el-button @click="close">Cancel</el-button>
                    <a v-if="ready" download :href="this.link" type="primary">Download</a>
                    <el-button v-else @click="submitExport('form')" type="primary" :loading="loading">Submit</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Utils from '../../utils/services'
import moment from 'moment'

export default {
    name: 'ExportModal',
    props: ['modalVisible'],
    data() {
      return {
        checkAll: false,
        ready: false,
        types: [
            {label: 'Bank Account', value: 'bank'},
            {label: 'Card', value: 'card'},
            {label: 'Mobile Wallet', value: 'wallet'}
        ],
        isIndeterminate: false,
        form: {
            payment_types: [],
            fields: '',
            file_type: 'csv',
            from: '',
            to: ''
        },
        loading: false,
        column: 'all',
        rules: {
          payment_types: [
            { required: true, message: 'Please select at least one option', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.form.payment_types = val ? this.types.map(el => el.value) : []
        this.isIndeterminate = false
      },
      handleCheckedTypesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.types.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length
      },
      close () {
        EventBus.$emit('exportModal', false)
      },
      submitExport (formName) {
        this.loading = true
        this.form.fields = this.column === 'all' ? this.fieldSet.map(el => el.key).join(',') : this.form.fields
        var query = Utils.createExportQuery(this.form)
        console.log('query', query)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('submitReport', query)
            .then((response) => {
                if (response.data.success) {
                    console.log('success', response)
                    this.ready = true
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                }
                this.loading = false
            }).catch((error) => {
                this.loading = false
                const response = error.response
                this.$message({
                    message: response.data.error,
                    type: 'error'
                })
            })
          } else {
            this.loading = false
            this.$message({
                message: 'Please fill the form properly',
                type: 'error'
            })
            return false
          }
        })
      },
      download () {
        this.$store.dispatch('downloadReport', this.link)
        window.location.href = this.link
        // this.$router.push(this.link)
      }
    },
    computed: {
        ...mapGetters({
            fields: 'fields',
            link: 'downloadLink'
        }),
        fieldSet () {
            var props = Object.keys(this.fields).map(function(key) {
                return { key: key, value: this[key] }
            }, this.fields)
            return props
            // props.sort(function(p1, p2) { return p2.value - p1.value; });
            // var topThree = props.slice(0, 3);
        },
        fieldColumns: {
            get () {
                return this.form.fields.split(',')
            },
            set (value) {
                console.log('selected', value.join(','))
                this.form.fields = value.join(',')
            }
        },
        dateColumns: {
            get () {
                var from = this.form.from
                var to = this.form.to
                var arr = [from, to]
                return arr
            },
            set (value) {
                this.form.from = moment(value[0]).format('YYYY-MM-DD')
                this.form.to = moment(value[1]).format('YYYY-MM-DD')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.export-dialog{
    .el-dialog__header{
        color: #2b2d50;
    }
    .el-dialog__body{
        padding: 0px !important
    }
}
.new-export-bg{
    background: #F7FAFC;
}
.m-0{
    margin: 0 !important;
}
</style>
