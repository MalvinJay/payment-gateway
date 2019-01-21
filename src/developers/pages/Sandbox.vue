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
                                        <el-input class="little-padding-input" v-model="recipient_amount"><span slot="prefix">&#8373</span></el-input>
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
                                    <td> {{phone}} </td>
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
                    <div class="img">
                        <div v-if="ready" class="message">
                            {{message}}
                        </div>
                        <div v-if="authorize">
                            <div class="v-center message">
                                <p>Authorize payment of GHs{{form.sender_amount}} from your account. Enter MM PIN to continue</p>
                                <el-input size="mini" type="password" v-model="pin"></el-input>
                                <div class="my-1">
                                    <el-button @click="cancel" size="mini">Cancel</el-button>
                                    <el-button @click="sendTrans" size="mini">Send</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <img src="../../assets/images/s8.png" alt=""> -->
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
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
        },
        message: 'You have received GHs1 into your mobile money account',
        ready: false,
        authorize: false,
        pin: '',
        rules: {
            customer_no: [
                { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
            ],
            recipient_no: [
                { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
            ],
        }
      }
    },
    watch: {
        ready (newValue, oldValue) {
            if (newValue === true) {
               setTimeout(() => {
                   this.ready = false
               }, 3000)
            }
        }
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'sandbox')
    },
    methods: {
        submitForm (formName) {
            this.createLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form.reference = 'FLPCO' + Math.floor(Math.random() * 99999999999)
                    var amount = this.form.service_code === 'cashin' ? this.form.amount : this.form.sender_amount

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
                        // if (response.data.success) {
                        //     this.$message({
                        //         message: 'Payment successful',
                        //         type: 'success'
                        //     })
                        // } else {
                        //     this.$message({
                        //         type: 'error',
                        //         message: response.data.response.error_message
                        //     })
                        // }
                        if (this.form.service_code === 'cashin') {
                            this.ready = true
                            this.message = `You have received GHs${amount} into your mobile money account`
                        } else {
                            this.authorize = true
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
        },
        cancel () {
            this.authorize = false
        },
        sendTrans () {
            this.authorize = false
            this.ready = true
            var amount = this.form.service_code === 'cashin' ? this.form.amount : this.form.sender_amount
            if (this.pin === '1234') {
                this.authorize = false
                this.pin = ''
                this.message = `GHs${amount} has been withdrawn from your mobile money account`
            } else {
                this.authorize = false
                this.message = `Pin is incorrect. Please try again`
                setTimeout(() => {
                    this.authorize = true
                }, 800)
            }
        }
    },
    computed: {
        phone () {
            return this.form.service_code === 'cashin' ? this.form.customer_no : this.form.recipient_no
        },
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
img{
    width: 55%;
}
.img{
    background: url('https://res.cloudinary.com/seddiescloudimagecdn/image/upload/v1547459489/s8.png') no-repeat center;
    background-size: 50% 90%;
    height: 100%;
    width: 100%;
    position: relative;

    .message{
        position: absolute;
        top: 50%;
        left: 50%;
        position: absolute;
        left: 30%;
        top: 40%;
        background: #EBF0F1;
        width: 40%;
        font-size: 12px;
        padding: 10px;
        color: #2c3e50;
        text-align: center;
        border-top: 2px solid #e67e22;
        border-radius: 5px;
        box-shadow: 0.5px 1px 2px rgba(0,0,0,.3);
        height: auto;
        animation: fadeIn .2s ease-in forwards;
    }
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
