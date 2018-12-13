<template>
    <div class="center flex-column full-height">
        <div class="my-3 flex justify-content-center">
            <img src="../assets/images/logo/big.svg" alt="">
        </div>
        <div class="logo-div w-30 bg-white border-rounded">
            <p class="text-center flopay-blue bold-500 s-16 m-0">Reset your password</p>
            <p class="text-center gray-text bold-500 s-13 my-1">Enter your email address and we will send you a link to reset your password.</p>
            <el-form @keyup.enter.native="login('form')" :model="form" :rules="rules" ref="form">
                <el-form-item prop="email">
                    <el-input class="no-border-input" placeholder="Enter your email address" v-model="form.email" type="email"></el-input>
                </el-form-item>
                <el-form-item class="my-2">
                    <el-button class="w-100" :loading="loading" type="warning" @click="sendEmail('form')">Send password to reset email</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        email: ''
      },
      email: '',
      loading: false,
      rules: {
        email: [
            { required: true, message: 'Please input email', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sendEmail (formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('sendEmail', this.form)
            .then((response) => {
                if (response.data.success) {
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
.mb-1{

}
</style>

