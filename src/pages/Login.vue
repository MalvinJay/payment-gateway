<template>
    <div class="center full-height">
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item>
                <el-input placeholder="Username" v-model="form.email" type="email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="Password" v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="login('form')">Enter</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {},
      loading: false,
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
.full-height{
    height: 100vh;
}
</style>

