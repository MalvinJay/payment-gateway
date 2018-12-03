<template>
    <div class="center flex-column full-height">
        <div class="my-3 flex justify-content-center">
            <img src="../assets/images/logo/big.svg" alt="">
        </div>
        <div class="logo-div w-30 bg-white border-rounded">
            <p class="text-center flopay-blue bold-500 s-16">Welcome Back</p>
            <el-form @keyup.enter.native="login('form')" :model="form" :rules="rules" ref="form">
                <el-form-item prop="email">
                    <el-input autocomplete="on" class="no-border-input" placeholder="Email" v-model="form.email" type="email"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="">
                    <el-input class="no-border-input" placeholder="Password" v-model="form.password" :type="type">
                        <i slot="suffix" @click="showPassword" class="el-input__icon eye icon"></i>
                    </el-input>
                </el-form-item>
                <div class="flex justify-content-between align-items-center s-12 my-2">
                    <el-checkbox size="mini" v-model="isAdmin" label="Admin?"></el-checkbox>
                    <el-button v-if="false" size="mini" type="text">Forgot password?</el-button>
                </div>
                <el-form-item class="my-2">
                    <el-button class="w-100" :loading="loading" type="warning" @click="login('form')">Sign In</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="false" class="border border-rounded center w-30 my-2">
            <p style="color: #808080" class="p-0 m-0">Don't have an account?</p>
            <el-button class="mx-1" type="text">Sign Up</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {},
      loading: false,
      isAdmin: false,
      type: 'password',
      rules: {
        email: [
            { required: true, message: 'Please input email', trigger: 'blur' }
        ],
        password: [
            { required: true, message: 'Please input password', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (formName) {
        this.loading = true
        if (this.isAdmin) {
            localStorage.setItem('isAdmin', true)
            this.$store.commit('isAdmin', true)
        } else {
            localStorage.setItem('isAdmin', false)
            this.$store.commit('isAdmin', false)
        }
        var url = this.isAdmin ? 'adminLogin' : 'login'
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch(url, {email: this.form.email, password: this.form.password})
            .then((response) => {
                if (response.data.success) {
                    this.$session.start()
                    this.$session.set('client', JSON.stringify(response.data.response.data))
                    // this.$store.dispatch('setClient', response.data.response.data)

                    if (!response.data.response.data.is_login_before) {
                        this.$router.push('/change_password')
                    } else {
                        if (this.$session.has('client')) {
                            // login sucessful
                            this.$store.dispatch('getToken')
                            .then((response) => {
                                // SETTING TOKEN
                                this.$session.set('token', response.data.access_token)
                                this.$store.dispatch('setToken', response.data.access_token)
                                // this.$message({
                                //     message: 'Login successful',
                                //     type: 'success'
                                // })
                                this.$router.push('/')
                            })
                        } else {
                            this.$store.dispatch('setClient', response.data.response.data)
                        }
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
            console.log('error submit!!')
            return false;
          }
        })
    },
    showPassword () {
        this.type = this.type === 'password' ? 'text' : 'password'
    }
    // login () {
    //   const { username, password } = this.form
    //   if (username === 'admin' && password === 'password') {
    //     this.$router.push('/')
    //   } else {
    //   }
    // //   this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
    // //     this.$router.push('/')
    // //   })
    // }
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

