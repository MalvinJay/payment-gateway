<template>
    <div>
        <!-- General Settings -->
        <el-card class="my-2 card-0 custom">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="header-text">Profile</span>
                <el-button @click="logout" type="primary" class="z-depth-button s-13 open-sans mini-button b-0" size="mini">Sign Out</el-button>
            </div>
            <div>
                <el-row type="flex" justify="center">
                    <el-col :sm="16" :lg="13">
                        <el-form label-position="left" size="mini" ref="form" hide-required-asterisk class="transaction-form py-20" :model="user.client" label-width="200px">
                            <!-- <el-form-item label="Client Photo">
                                <el-upload
                                    class="avatar-uploader"
                                    action="https://flopay-batchstore.s3.eu-central-1.amazonaws.com/flopay-file-batch/3Hw_Batch_file_format%20%284%29.csv"
                                    :show-file-list="false"
                                    accept=".png,.jpeg,.jpg"
                                    :on-success="handleAvatarSuccess"
                                    :on-change="handlePictureCardPreview">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item> -->
                            <el-form-item v-for="(item, index) in columns" :key="index" :label="item.label">
                                <el-input :disabled="item.editable" v-if="item.type === 'input'" v-model="user.client[item.model]"></el-input>
                                <p v-if="item.subtext" class="my-1">
                                    <span class="info s-12 pl-6">{{item.subtext}}</span>
                                </p>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="el-card__footer flex justify-content-end">
                <el-button size="mini" class="z-depth-button s-13 open-sans mini-button b-0">Cancel</el-button>
                <el-button size="mini" :loading="createLoading" @click="updateProfile('form')" class="z-depth-button s-13 b-0 bold-500 open-sans white-text" type="primary">Update Client Profile</el-button>
            </div>
        </el-card>


        <!-- Set Password -->
        <el-card class="my-2 card-0 custom" v-loading="changePassword">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="header-text">Password Settings</span>
            </div>
            <div>
                <el-row type="flex" justify="center">
                    <el-col :sm="16" :lg="13">
                        <el-form label-position="left" size="mini" ref="reset" hide-required-asterisk class="transaction-form py-20" :model="passReset" label-width="200px">
                            <el-form-item v-for="(item, index) in setPassCol" :key="index" :label="item.label">
                                <el-input v-model="passReset[item.model]" :type="type">
                                    <i slot="suffix" @click="togglePassword" class="el-input__icon eye icon"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="el-card__footer flex justify-content-end">
                <el-button size="mini" class="z-depth-button s-13 open-sans mini-button b-0" @click="$router.push('/forgot-password')">Forgot Password?</el-button>
                <el-button size="mini" :loading="changePassword" @click="changePass('reset')" class="z-depth-button s-13 b-0 bold-500 open-sans white-text" type="primary">Save Password</el-button>
            </div>            
        </el-card>


        <!-- Accounts -->
        <el-card class="my-2 card-0">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="header-text">Deposit Accounts</span>
            </div>
            <div>
                <el-table class="breathe" :data="deposit" empty-text="No services to display" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header">
                    <el-table-column
                        v-for="(item, index) in depositColumns"
                        :key="index"
                        :label="item.label"
                        :prop="item.prop">
                    </el-table-column>
                    <el-table-column align="right">
                        <template slot-scope="scope">
                            <el-popover
                                placement="left"
                                width="400"
                                popper-class="no-padding-popover"
                                trigger="hover">
                                <div>
                                    <div class="flex justify-content-between p-10 border-bottom">
                                        <p class="blue-text bold-600 s-14 m-0 p-0">Accounts</p>
                                        <the-tag status="failed" :title="scope.row.name" icon="reply icon"></the-tag>
                                    </div>
                                    <div class="p-10">
                                        <el-row>
                                            <el-col :span="12">
                                                <div v-for="(item, index) in scope.row.accounts.slice(0, scope.row.accounts.length / 2 + 1)" :key="index">
                                                    <p class="s-12 py-5">{{item.name}}</p>
                                                </div>
                                            </el-col>
                                            <el-col :span="12">
                                                <div v-for="(item, index) in scope.row.accounts.slice(scope.row.accounts.length / 2 + 1, scope.row.accounts.length)" :key="index">
                                                    <p class="s-12 py-5">{{item.name}}</p>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <el-button class="icon-only-button" icon="info circle icon" type="text" slot="reference"></el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-20">
                    <div class="s-12">
                        {{deposit.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end"
                        @current-change="handleCurrentChange"
                        :page-size="pageSize"
                        layout="prev, pager, next"
                        :total="deposit.length">
                    </el-pagination>
                </div>
            </div>
        </el-card>

        <!-- Privileges -->
        <el-card class="my-2">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="header-text">Privileges</span>
            </div>
            <div>
                <div class="flex">
                    <div class="w-50">
                        <el-row type="flex" align="middle" v-for="(value, key, index) in privileges.slice(0, privileges.length / 2 + 1)" :key="index" class="mb-1">
                            <el-col :span="12">
                                <p class="m-0 text-capitalize menu-gray-text s-13">{{value.action}}</p>
                            </el-col>
                            <el-col :span="12">
                                <!-- <el-switch :active-value="value.value" v-model="value.value"></el-switch> -->
                            </el-col>
                        </el-row>
                    </div>
                    <div class="w-50">
                        <el-row type="flex" align="middle" v-for="(value, key, index) in privileges.slice(privileges.length / 2 + 1, privileges.length)" :key="index" class="mb-1">
                            <el-col :span="12">
                                <p class="m-0 text-capitalize menu-gray-text s-12">{{value.action}}</p>
                            </el-col>
                            <el-col :span="12">
                                <!-- <el-switch :active-value="value.value" v-model="value.value"></el-switch> -->
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </el-card>
        <!-- Services -->
        <el-card class="my-2 card-0">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="header-text">Account Services</span>
            </div>
            <div>
                <el-table class="breathe" :data="services" empty-text="No services to display" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header">
                    <el-table-column
                        v-for="(item, index) in tableColumns"
                        :key="index"
                        :label="item.label"
                        :prop="item.prop">
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-20">
                    <div class="s-12">
                        {{services.length}} results
                    </div>
                    <el-pagination class="my-2 flex justify-content-end"
                        @current-change="handleCurrentChange"
                        :page-size="pageSize"
                        layout="prev, pager, next"
                        :total="services.length">
                    </el-pagination>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import initState from '../utils/initState'
import TransactionsChannel from '../channels/TransactionsChannel';

export default {
  name: 'Profile',
  data () {
    return {
      imageUrl: '',
      fileList: [],
      columns: [
        { label: 'Client Name', type: 'input', model: 'full_name', subtext: 'Enter your client name.'},
        { label: 'Client Till', type: 'input', model: 'code', editable: true},
        { label: 'Client Company', type: 'input', model: 'company_name', subtext: `Enter your company's name.`},
        { label: 'Phone Number', type: 'input', model: 'msisdn'},
        { label: 'Email', type: 'input', model: 'email', subtext: 'We also use email for avatar detection if no photo is uploaded.'},
        { label: 'Account Number (Optional)', type: 'input', model: 'bank_account_no', editable: true},
        { label: 'Bank Name', type: 'input', model: 'bank_name', editable: true},
        { label: 'Business Address', type: 'input', model: 'address'},
        { label: 'City', type: 'input', model: 'city'}
      ],
      setPassCol: [
        { label: 'Current password', type: 'password', model: 'current_password', showPass: false},
        { label: 'New password', type: 'password', model: 'password', showPass: false},
        { label: 'Password confirmation', type: 'password', model: 'confirm_new', showPass: false}
      ],
      styleObject: {
        fontSize: '12px'
      },
      tableColumns: [
        {label: 'name', prop: 'name', align: 'left'},
        {label: 'account entry', prop: 'account_entry', align: 'left'},
        {label: 'amount', prop: 'money', align: 'left'},
        {label: 'limit', prop: 'nlimit', align: 'left'},
        {label: 'date', prop: 'date', align: 'center'},
      ],
      depositColumns: [
        {label: 'name', prop: 'name'},
        {label: 'desciption', prop: 'description'}
      ],
      form: {},
      type: 'password',
      passReset: {
        current_password: '',
        password: '',
        confirm_new: ''
      },      
      showPassword: false,
      createLoading: false,
      changePassword: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters(['user', 'permissions', 'pageSize']),
    services () {
        return this.user.account_services.map(el => {
            el.date = moment(el.created_at).format('D MMM,YY hh:mm A')
            el.money = `GHs ${el.amount}`
            el.nlimit = `GHs ${el.limit}`
            return el
        })
    },
    privileges () {
        // return this.user.client.privileges
        return this.permissions
    },
    deposit () {
        return this.user.deposit_accounts
    },
    // imageUrl: {
    //     get () {
    //         return this.user.client.picture_url
    //     },
    //     set (val) {
    //         this.user.client.picture_url = val
    //     }
    // }
  },
  methods: {
    updateProfile (formName) {
        this.form = {
          is_verified_account: true,
          country_code: "GH",
          name: this.user.client.full_name,
          company: this.user.client.company_name,
          client_msisdn: this.user.client.msisdn,
          email: this.user.client.email,
          city: this.user.client.city
        }

        this.createLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('updateProfile', this.form)
            .then((response) => {
                this.createLoading = false
                this.$message({
                    message: 'Profile Updated Successfully',
                    type: 'success'
                })
            }).catch(() => {
                this.createLoading = false
                this.$message({
                    message: 'Unable to update profile. Please try again later',
                    type: 'error'
                })
            })
          } else {
            this.createLoading = false
            this.$message({
                message: 'Please fill form correctly',
                type: 'error'
            })
          }
        })
    },
    togglePassword() {
        this.type = this.type === 'password' ? 'text' : 'password'
    },
    changePass (formName) {
        if(this.passReset.password !== this.passReset.confirm_new){
            this.$message({
                message: 'New Password must match. Kindly check and try again',
                type: 'error'
            })        
        }
        else {
            if(this.$route.query.token) {
                this.form.token = this.$route.query.token
                this.makeRequest('resetPassword', formName)
            } else {
                if(localStorage.getItem('FTloginToken')){
                    this.form.token = localStorage.getItem('FTloginToken')
                }
                else {
                    this.form.token = localStorage.getItem('token')
                }
    
                this.makeRequest('resetPassword', formName)
            }
        }
    },
    makeRequest(url, formName){
        this.changePassword = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //   console.log('Url to sent: ', url)
            this.$store.dispatch(`${url}`, this.passReset)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        message: response.data.response.message,
                        type: 'success'
                    })

                    if (this.$session.has('client')) {
                        // login sucessful
                        this.$store.dispatch('getToken')
                        .then((response) => {
                            // SETTING TOKEN
                            this.$session.set('token', response.data.access_token)
                            this.$store.dispatch('setToken', response.data.access_token)
                            this.$router.push('/')
                        })
                    } else {
                        this.$message({
                            message: 'Password Saved',
                            type: 'success'
                        })      
                        this.$router.push('/login')
                    }
                } else {
                    this.$message({
                        message: response.data.response.message,
                        type: 'error'
                    })
                }
               this.changePassword = false
            }).catch((error) => {
               this.changePassword = false
                this.$message({
                    message: 'Error. Please try again later',
                    type: 'error'
                })
            })
          } else {
           this.changePassword = false
            this.$message({
                message: 'Please fill out all the details',
                type: 'error'
            })
          }
        })
    },    
    handleAvatarSuccess (res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
    },
    logout () {
        this.$store.dispatch('logout')
        .then(() => {
            // var init = initState.initState()
            // this.$store.replaceState(init)
            this.$session.remove('client')
            this.$session.remove('token')
            this.$session.destroy()
            this.$router.push('/login')
            // TransactionsChannel.close()
        })
    },
    handleCurrentChange (page) {
        this.page = page
    },
    handlePictureCardPreview (file) {
        this.imageUrl = file.url
    }
  }
}
</script>

<style>

</style>
