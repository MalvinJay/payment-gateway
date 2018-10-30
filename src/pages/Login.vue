<template>
    <div class="center flex-column full-height">
        <div class="my-3 flex justify-content-center">
            <img src="../assets/images/logo/big.svg" alt="">
        </div>
        <div class="logo-div w-30 bg-white border-rounded">
            <p class="text-center flopay-blue bold-500 s-16">Welcome Back</p>
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="email">
                    <el-input autocomplete="on" class="no-border-input" placeholder="Email" v-model="form.email" type="email"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="m-0">
                    <el-input class="no-border-input" placeholder="Password" v-model="form.password" type="password"></el-input>
                </el-form-item>
                <div v-if="false" class="flex justify-content-between align-items-center s-12 my-2">
                    <el-checkbox size="mini" v-model="remember" label="Remember me?"></el-checkbox>
                    <el-button size="mini" type="text">Forgot password?</el-button>
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
      remember: false,
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
        // if (this.remember) {
        //     localStorage.setItem('email')
        // }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('login', {email: this.form.email, password: this.form.password})
            .then((response) => {
                this.$store.dispatch('getToken').then(() => {
                    this.$message({
                        message: 'Login successful',
                        type: 'success'
                    })
                    this.loading = false
                    this.$router.push('/')
                })
            }).catch((error) => {
                this.loading = false
                this.$message({
                    message: 'Wrong email and password combination',
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

