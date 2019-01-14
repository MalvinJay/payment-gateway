<template>
    <div>
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="12">
                <el-card >
                    <div>
                        <h3>Perform test transactions</h3>
                        <el-form>
                            <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form" :rules="rules" :model="form" label-width="170px">
                                <el-form-item label="Transaction Type">
                                    <el-select class="w-100" v-model="form.service_code">
                                        <el-option value="cashin" label="Deposit to Mobile Money Wallet"></el-option>
                                        <el-option value="cashout" label="Withdrawal from Mobile Money Wallet"></el-option>
                                    </el-select>
                                </el-form-item>
                                <div v-if="form.service_code === 'cashin'">
                                    <el-form-item class="h-auto" label="Receipient Phone Number" prop="customer_no">
                                        <el-input v-model="form.customer_no"></el-input>
                                    </el-form-item>
                                    <el-form-item  label="Amount" prop="amount">
                                        <el-input class="little-padding-input" v-model="form.amount"><span slot="prefix">&#8373;</span></el-input>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    <el-form-item class="h-auto" label="Recipient Phone Number" prop="recipient_no">
                                        <el-input v-model="form.recipient_no"></el-input>
                                    </el-form-item>
                                    <el-form-item label="Sender Amount" prop="sender_amount">
                                        <el-input class="little-padding-input" v-model="form.sender_amount"><span slot="prefix">&#8373</span></el-input>
                                    </el-form-item>
                                    <el-form-item label="Recipient Amount" prop="recipient_amount">
                                        <el-input class="little-padding-input" v-model="form.recipient_amount"><span slot="prefix">&#8373</span></el-input>
                                    </el-form-item>
                                </div>
                                <div class="flex justify-content-end">
                                    <el-button @click="submitForm('form')" size="mini" :loading="createLoading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary">Send</el-button>
                                </div>
                            </el-form>
                        </el-form>
                    </div>
                </el-card>
                <el-card class="my-2">
                    <div>
                        <h3>hello</h3>
                        <p>Welcome to your FloPay Smart Phone. You can simulate payments from your api and see them appear here.</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Telephone No:</td>
                                    <td> {{form.phone}} </td>
                                </tr>
                                <tr>
                                    <td>Transaction type</td>
                                    <td> {{form.service_code}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3>INSTRUCTIONS</h3>
                        <ul>
                            <li>
                                Payments should have [test] parameter included in your request body. The [test] parameter should be set to [true]
                            </li>
                            <li>Refresh this page to display dialog incase you make any request with the [test] parameter.</li>
                            <li>Your test pin code is 1234. This pin is for simulation hence no live transactions are made.</li>
                        </ul>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <div class="center h-100">
                    <img src="../../assets/images/s8.png" alt="">
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Sandbox',
    data () {
      return {
        createLoading: false,
        form: {
            phone: '0203236633',
            service_code: 'cashin',
            currency: 'GHS',
            country_code: 'GH',
            live: false,
            dummy: true
        }
      }
    },
    methods: {
        submitForm (formName) {
            this.createLoading = true
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.form.reference = 'FLPCO' + Math.floor(Math.random() * 99999999999)

                var dispatch = ''
                if (this.form.service_code === 'cashin') {
                    dispatch = 'createTransactions'
                } else {
                    dispatch = 'createPayouts'
                    this.form.sender_currency= 'GHS'
                    this.form.recipient_currency= 'GHS'
                }

                this.$store.dispatch(dispatch, this.form)
                .then((response) => {
                    if (response.data.success) {
                        this.$message({
                            message: 'Payment successful',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.response.error_message
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
        }
    }
}
</script>

<style lang="scss" scoped>
img{
    width: 55%;
}
h3{
    font-size: 12px;
    text-transform: uppercase
}
ul{
    padding-left: 15px
}
li, p{
    font-size: 12px;
}
table{
    border: 1px solid #8fc6ec;
    width: 75%;
    border-collapse: collapse;

    td {
        font-size: 12px;
        border: 1px solid #8fc6ec;
        padding: 5px;
    }
}
</style>
