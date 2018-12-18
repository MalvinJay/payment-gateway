<template>
    <div>
        <el-card>
            <div slot="header">
                <p class="header-text">API Keys</p>
            </div>
            <div>
                <h3>Credentials</h3>
                <p>To you use our web API, you need to use the client_id and client_secret to get an access_token.
                    The access_token would serve as a master key to unlock all the endpoints you would like to access on our platform</p>
                <h3>API documentation</h3>
                <p>Flopay provides you with an interactive API documentation which would reduce the amount of time you would have to spend to reading a long text of instructions. 
                    Access the API documentation from this link: <a href="https://developer.flopay.io"> flopay.io/docs</a></p>
            </div>
        </el-card>
        <el-card class="my-2">
            <div slot="header">
                <p class="header-text">API Credentials</p>
            </div>
            <div>
                <div v-if="revealSecret">
                    <div class="flex my-2">
                        <el-row>
                            <el-col :span="5">
                                <p class="blue-text bold-600 mr-6">client_id: </p>
                            </el-col>
                            <el-col :span="19">
                                <p>{{user.access_key.client_id}}</p>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="flex">
                        <el-row>
                            <el-col :span="5">
                                <p class="blue-text bold-600 mr-6">client_secret: </p>
                            </el-col>
                            <el-col :span="19">
                                <p>{{user.access_key.client_secret}}</p>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <el-button size="mini" v-else class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text">Reveal credentials</el-button>
            </div>
        </el-card>
        <el-card class="my-2">
            <div slot="header">
                <p class="header-text">Development - Callback URL</p>
            </div>
            <div>
                <div class="w-100">
                    <div class="flex my-2">
                        <el-row type="flex" align="middle" class="w-100">
                            <el-col :span="8">
                                <p class="blue-text bold-600 mr-6">Provide callback url for testing</p>
                            </el-col>
                            <el-col :span="10">
                                <el-input size="mini" v-model="user.client.callbackurl"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="flex">
                        <el-row type="flex" align="middle" class="w-100">
                            <el-col :span="8">
                                <p class="blue-text bold-600 mr-6">Provide callback url for production</p>
                            </el-col>
                            <el-col :span="10">
                                <el-input size="mini" v-model="user.client.test_callbackurl"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="flex justify-content-end">
                        <el-button :loading="saveLoading" @click="saveNewDetails" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button" type="primary">Save</el-button>
                    </div>
                </div>
            </div>
        </el-card>

        <!-- REVEAL SECRET -->
        <el-dialog
            :visible.sync="dialogVisible"
            width="30%">
            <div class="v-center">
                <p class="mb-2">To continue, please enter your password</p>
                <el-form hide-required-asterisk :model="form" ref="form" :rules="rules" class="w-75" size="mini" label-position="left" label-width="80px">
                    <el-form-item label="Email">
                        <el-input :placeholder="user.client.email" v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                        <el-input type="password" v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="flex">
                            <el-button :loading="loading" type="primary" @click="authenticate('form')">Authenticate</el-button>
                            <el-button @click="dialogVisible = false">Cancel</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'

export default {
  name: 'APIKeys',
  data () {
    return {
       dialogVisible: false,
       revealSecret: false,
       form: {},
       loading: false,
       saveLoading: false,
       rules: {
        password: [
            { required: true, message: 'Password is required', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    authenticate (formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('login', {email: this.user.client.email, password: this.form.password})
            .then((response) => {
                if (response.data.success) {
                    this.revealSecret = true
                    this.dialogVisible = false
                } else {
                    this.$message({
                        message: response.data.response.message,
                        type: 'error'
                    })
                }
                this.loading = false
            }).catch((error) => {
                this.loading = false
                this.$message({
                    message: 'Error. Please try again later',
                    type: 'error'
                })
            })
          } else {
            this.loading = false
            this.$message({
                message: 'Please fill out all the details',
                type: 'error'
            })
          }
        })
    },
    saveNewDetails () {
        this.saveLoading = true
        var items = [this.user.client.test_callbackurl, this.user.client.callbackurl]
        this.$store.dispatch('getCurrentHook', items)
            .then((response) => {
                if (response.data.success) {
                    this.user.client.test_callbackurl = response.data.response.data.test_callbackurl
                    this.user.client.callbackurl = response.data.response.data.production_callbackurl
                    this.$message({
                        message: response.data.response.message,
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: response.data.response.message,
                        type: 'error'
                    })
                }
                this.saveLoading = false
            }).catch((error) => {
                this.saveLoading = false
                this.$message({
                    message: 'Error. Please try again later',
                    type: 'error'
                })
            })
    }
  },
  created () {
    EventBus.$emit('sideNavClick', 'keys')
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style lang="scss" scoped>
h3{
    font-size: 12px;
    text-transform: uppercase
}
</style>
