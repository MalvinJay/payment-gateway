<template>
    <div class="center flex-column full-height">
        <div class="my-3 flex justify-content-center">
            <img src="../assets/images/logo/big.svg" alt="">
        </div>
        <div class="logo-div w-30 bg-white border-rounded">
            <p class="text-center flopay-blue bold-500 s-16">Welcome. Please change your password</p>
            <el-form @keyup.enter.native="login('form')" :model="form" :rules="rules" ref="form">
                <el-form-item prop="email">
                    <el-input class="no-border-input" placeholder="Email" v-model="form.email" type="email"></el-input>
                </el-form-item>
                <el-form-item prop="current_password" class="">
                    <el-input class="no-border-input" placeholder="Current Password" v-model="form.current_password" :type="current_type">
                        <i slot="suffix" @click="showCurrentPassword" class="el-input__icon eye icon"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" class="">
                    <el-input class="no-border-input" placeholder="New Password" v-model="form.password" :type="type">
                        <i slot="suffix" @click="showPassword" class="el-input__icon eye icon"></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="my-2">
                    <el-button class="w-100" :loading="loading" type="warning" @click="changePassword('form')">Change Password</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'FirstTimeLogin',
  data () {
    return {
      form: {
            email: '',
            current_password: '',
            password: '',
      },
      loading: false,
      type: 'password',
      current_type: 'password',
      rules: {
        email: [
            { required: true, message: 'Please input email', trigger: 'blur' }
        ],
        password: [
            { required: true, message: 'Please input password', trigger: 'blur' }
        ],
        current_password: [
            { required: true, message: 'Please input password', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // console.log('QueryParams: ', this.$route.query.token)
  },
  methods: {
    changePassword (formName) {
        if(this.$route.query.token){
            this.form.token = this.$route.query.token
            this.makeRequest('resetPassword', formName)
        } else {
            if(localStorage.getItem('FTloginToken')){
                this.form.token = localStorage.getItem('FTloginToken')
                console.log('Form: ', this.form)
            }
            else {
                this.$message({
                    message: 'Password reset token not available',
                    type: 'error'
                })                
            }

            // this.makeRequest('userPassReset', formName)
            this.makeRequest('resetPassword', formName)
        }        
    },
    makeRequest(url, formName){
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
              console.log('Url to sent: ', url)
            this.$store.dispatch(`${url}`, this.form)
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
                            message: 'Password reset successful, login with your new credentials',
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
    showCurrentPassword () {
        this.current_type = this.current_type === 'password' ? 'text' : 'password'
    },
    showPassword () {
        this.type = this.type === 'password' ? 'text' : 'password'
    }
  }
}
</script>

<style lang="scss" scoped>
.my-3{
    margin: 1rem 0;
    img{
        width: 150px;
    }
}
.full-height{
    height: 100vh;
}
.w-30{
    width: 30%
}
.logo-div{
    // width: 25%;
    padding: 30px;
}
</style>
