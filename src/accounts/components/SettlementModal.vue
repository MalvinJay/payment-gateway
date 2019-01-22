<template>
    <el-dialog custom-class="export-dialog"
        title="Initiate Settlement"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-transaction-bg">
            <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form mt-2 w-70" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="Bank Name">
                    <el-select filterable class="w-100" v-model="form.bank_name">
                        <el-option label="Direct Transfer" value="N/A"></el-option>
                        <el-option
                            v-for="(item, index) in providers" :key="index"
                            :label="item.name"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.bank_name === 'N/A'" label="Location">
                    <el-input v-model="form.location"></el-input>
                </el-form-item>
                <div v-else>
                    <el-form-item label="Name on Account">
                        <el-input v-model="form.location"></el-input>
                    </el-form-item>
                    <el-form-item label="Account Number">
                        <el-input v-model="form.account_no"></el-input>
                    </el-form-item>
                    <el-form-item label="Branch">
                        <el-input v-model="form.branch"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="Amount" prop="amount">
                    <el-input class="little-padding-input" v-model="form.amount"><span slot="prefix">&#8373</span></el-input>
                </el-form-item>
                <el-form-item label="Name" prop="recipient_name">
                    <el-input v-model="form.recipient_name"></el-input>
                </el-form-item>
                <!-- <el-form-item label="Service Code">
                    <el-select v-model="form.service_code">
                        <el-option
                            v-for="(item, index) in options" :key="index"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="Remarks">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="close">Cancel</el-button>
            <el-button size="mini" :loading="loading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="createLog('form')">Initiate Settlement</el-button>
        </span>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Utils from '../../utils/services'
import moment from 'moment'

export default {
    name: 'TopupAccount',
    props: ['modalVisible'],
    data () {
      var checkAmount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('This field is required'))
        }
        setTimeout(() => {
          if (Number(value) < 1000) {
            callback(new Error('Amount must be greater than GHc1000'))
          } else {
              callback()
          }
        }, 1000)
      };
      return {
        form: {
            bank_name: 'N/A',
            currency: "Ghs",
            country_code: "GH",
            live: true,
            dummy: false,
            service_code: 'cash_transfer',
            integration_type: 'FLOPAY_WEB',
            is_direct_transfer: true
        },
        options: [
            {name: 'Cash In', value: 'cashin'},
            {name: 'Cash Out', value: 'cashout'}
        ],
        rules: {
            recipient_no: [
                { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
            ],
            amount: [
                { validator: checkAmount, trigger: 'blur' }
            ],
            recipient_amount: [
                { required: true, message: 'This field is required', trigger: 'blur' }
            ]
        },
        loading: false
      }
    },
    methods: {
      close () {
        this.form = {
            bank_name: 'N/A',
            currency: "Ghs",
            country_code: "GH",
            live: true,
            dummy: false,
            service_code: 'cash_transfer',
            integration_type: 'FLOPAY_WEB',
            is_direct_transfer: true
        },
        EventBus.$emit('settlementModal', false)
      },
      createLog (formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.form.live = !this.test
                this.form.dummy = this.test
                this.form.account_no = this.form.account_no ? this.form.account_no : 'others'
                
                this.$store.dispatch('createSettlement', this.form)
                .then((response) => {
                    if (response.data.success) {
                        this.$message({
                            type: 'success',
                            message: response.data.response.message,
                        })
                        this.close()
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
                    message: 'Please correct the errors',
                    type: 'error'
                })
            }
        })
      }
    },
    computed: {
        ...mapGetters({
            providers: 'banks',
            test: 'test'
        })
    }
}
</script>

<style lang="scss" scoped>
.w-70{
    width: 70%;
}
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

.el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
}
.button-new-tag {
    // margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 150px;
    margin-bottom: 5px;
    // margin-left: 10px;
    vertical-align: bottom;
}
</style>
