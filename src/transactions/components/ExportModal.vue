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
                    @change="dateRangeClicked"
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
                    <div class="flex">
                        <el-button @click="close">Cancel</el-button>
                        <a :href="`${GET_BASE_URI}v1/clients/reports/download?access_token=${token}&file_name=${link}`"
                        class="cursor open-sans el-button el-button--primary el-button--mini" target="_blank" v-if="ready" download>Download</a>
                        
                        <el-button v-else @click="submitExport('form')" type="primary" :loading="loading">Submit</el-button>
                    </div>
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
import { GET_BASE_URI } from '../../store/constants'

export default {
    name: 'ExportModal',
    props: ['modalVisible', 'type'],
    data () {
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
        },
        GET_BASE_URI: GET_BASE_URI
      }
    },
    methods: {
      dateRangeClicked () {
        this.reset()
      },
      handleCheckAllChange (val) {    
        this.reset()     
        this.form.payment_types = val ? this.types.map(el => el.value) : []
        this.isIndeterminate = false
      },
      handleCheckedTypesChange (value) {   
        this.reset()      
        let checkedCount = value.length
        this.checkAll = checkedCount === this.types.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.types.length
      },
      close () {
        this.form = {
            payment_types: [],
            fields: '',
            file_type: 'csv',
            from: '',
            to: ''
        }
        this.loading = false
        this.ready = false
        EventBus.$emit('exportModal', false)
      },
      submitExport (formName) {
        this.loading = true
        this.form.cash_flow = this.type
        this.form.payment_types = this.form.payment_types.length === 3 ? [] : this.form.payment_types
        this.form.fields = this.column === 'all' ? this.fieldSet.map(el => el.key).join(',') : this.form.fields
        var query = Utils.createExportQuery(this.form)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('submitReport', query)
            .then((response) => {
                if (response.data.success) {
                    // if(this.link)
                    this.ready = true

                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                    // var link = document.getElementById('dwnl').href = response.data.response.data.file_name
                    // link.href = this.link
                } else {
                    this.loading = false
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                }
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
      toggleDownload () {
        this.loading = false
        this.ready = true
      },
      reset () {
        this.loading = false
        this.ready = false           
      }
    //   download () {
    //     var link = document.getElementById('dwnl')
    //     link.href = `https://api.flopay.io/v1/clients/reports/download?access_token=${this.token}&file_name=${this.link}`
    //     this.$store.dispatch('downloadReport')
    //     .then((response) => {
    //         console.log('file data', response.data)
            
    //     })
    //   }
    },
    created () {
    },
    mounted () {
        EventBus.$on('toggleDownload', this.toggleDownload)
    },
    computed: {
        ...mapGetters({
            fields: 'fields',
            link: 'downloadLink',
            token: 'token'
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
.mini-button{
    background: #4f5fc4;
    border-radius: 2px;
    margin-left: 10px;
    color: white;
    padding: 7px 15px;
    font-size: 12px;
    border-radius: 3px;
}
.new-export-bg{
    background: #F7FAFC;
}
.m-0{
    margin: 0 !important;
}
</style>
