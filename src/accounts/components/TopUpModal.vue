<template>
    <el-dialog custom-class="export-dialog"
        title="Top-Up EVA"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-transaction-bg">
            <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="Wallet Name">
                    <el-input v-model="form.recipient_name"></el-input>
                </el-form-item>
                <el-form-item class="h-auto" label="Wallet Number" prop="recipient_no">
                    <el-input v-model="form.recipient_no"></el-input>
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
                <el-form-item label="Sender Amount" prop="sender_amount">
                    <el-input class="little-padding-input" v-model="form.sender_amount"><span slot="prefix">&#8373</span></el-input>
                </el-form-item>
                <el-form-item label="Recipient Amount" prop="recipient_amount">
                    <el-input class="little-padding-input" v-model="recipient_amount"><span slot="prefix">&#8373</span></el-input>
                </el-form-item>
                <el-form-item label="Remarks">
                    <el-input type="textarea" v-model="form.remarks"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="close">Cancel</el-button>
            <el-button size="mini" :loading="loading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="createLog('form')">Initiate Topup</el-button>
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
    data() {
      return {
        checkAll: false,
        topupoption: 'flopay',
        form: {
            sender_amount: '',
            sender_currency: 'GHS',
            recipient_amount: '',
            recipient_currency: 'GHS',
            recipient_no: '',
            recipient_name: '',
            provider: '',
            country_code: 'GH',
            service_code: 'cashin',
            live: false
        },
        options: [
            {name: 'Flopay Wallet', value: 'flopay'},
            {name: 'External Wallet', value: 'external'}
        ],
        rules: {
            recipient_no: [
                { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
            ],
            sender_amount: [
                { required: true, message: 'This field is required', trigger: 'blur' }
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
        EventBus.$emit('topupModal', false)
      },
      createLog (formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.form.live = !this.test
                this.form.dummy = this.test
                this.form.service_code = 'cashin'
                this.form.reference = 'FLPCI' + Math.floor(Math.random() * 99999999999)
                this.$store.dispatch('createPayouts', this.form)
                .then((response) => {
                    if (response.data.success) {
                        this.$message({
                            type: 'success',
                            message: response.data.response.message,
                        })
                        this.$store.dispatch('getBalance')
                        this.$store.dispatch('getTopUps', {cache: false})
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
            providers: 'providers',
            test: 'test'
        }),
        recipient_amount: {
            get () {
                return this.form.sender_amount
            },
            set (val) {
                this.form.sender_amount = val
                this.form.recipient_amount = val
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
