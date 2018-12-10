<template>
    <el-dialog custom-class="export-dialog"
        title="Top-Up EVA"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div class="flex justify-content-center new-export-bg">
            <el-form hide-required-asterisk class="transaction-form my-2" size="mini" style="width: 90%" :rules="rules" ref="form" :model="form" label-width="150px">
                <el-form-item label="Topup Type">
                    <el-select class="w-75" v-model="topupoption">
                        <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Amount" prop="amount">
                    <el-input class="w-75" v-model="form.amount"><span slot="prefix">GHs</span></el-input>
                </el-form-item>
                <div v-if="topupoption === 'external'">
                    <el-form-item label="Provider">
                        <el-select class="w-75" v-model="form.provider">
                            <el-option
                            v-for="(item, index) in providers"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Phone" prop="phone">
                        <el-input class=" w-75" v-model="form.customer_no"></el-input>
                    </el-form-item>
                    <el-form-item v-if="form.provider === 'vodafone'" label="Voucher">
                        <el-input class=" w-75" v-model="form.voucher"></el-input>
                    </el-form-item>
                </div>
                <el-form-item>
                    <div class="flex justify-content-end w-100">
                        <el-button @click="close" type="text">Cancel</el-button>
                        <el-button @click="createLog('form')" :loading="loading" type="primary">Create</el-button>
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

export default {
    name: 'TopupAccount',
    props: ['modalVisible'],
    data() {
      return {
        checkAll: false,
        topupoption: 'flopay',
        form: {
            currency: "ghs"
        },
        options: [
            {name: 'Flopay Wallet', value: 'flopay'},
            {name: 'External Wallet', value: 'external'}
        ],
        rules: {
          amount: [
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
                var url = ''
                var form = {}
                if (this.topupoption === 'flopay') {
                    url = 'v1/ova/topup'
                    form = this.form
                } else {
                    url = 'v1/ova/wallet/topup'
                    form = {
                      ...this.form,
                      country_code: 'GH',
                      service_code: 'cashout',
                      live: true
                    }
                }
                this.$store.dispatch('topupOVA', { url: url, ova: form })
                .then((response) => {
                    if (response.data.success) {
                        this.$message({
                            type: 'success',
                            message: response.data.response.message,
                        })
                        this.$store.dispatch('getBalance')
                        this.$store.dispatch('getFoneMessengers', {cache: false})
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
            providers: 'providers'
        })
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
