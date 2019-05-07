<template>
    <div class="center flex-column full-height">
      <div class="my-3 flex justify-content-center">
        <img src="../assets/images/logo/big.svg" alt="">
      </div>
      <div class="p-0 w-30 bg-white border-rounded">
        <p class="flopay-blue bold-600 border-bottom s-16 p-10 m-0 mx-1">
          Email or Password Not Found
          <!-- {{errorType}} -->
        </p>
        <el-form @keyup.enter.native="login('form')" ref="form">
          <div class="class">
            <p class="s-16 p-20">
              <span class="bold-600">'{{form.email}}'</span> or password provided is not associated with any Flopay account.
            </p>
          </div>
          <div class="flex justify-content-end align-items-center border-top s-12 p-5">
            <router-link :to="{name: 'Login'}">
              <el-button size="mini" class="blue-pure white-text mr-1">Try Again</el-button>
            </router-link>

            <!-- <router-link v-if="reset" :to="{name: 'ResetPassword'}">
              <el-button size="mini" class="blue-pure white-text">Reset Password</el-button>
            </router-link> -->

            <!-- <a v-else :href="'/forgot-password'" class="cursor open-sans el-button el-button--mini" target="_blank" style="text-decoration: none;">
              Reset Password
            </a> -->

            <router-link :to="{name: 'ResetPassword'}">
              <el-button size="mini" class="">Reset Password</el-button>
            </router-link>
          </div>
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
        email: '',
        password: ''
      },
      loading: false,
      isAdmin: false,
      type: 'password',
      errorType: "",
      errorDetails: "",
      reset: false,
    }
  },
  computed: {
    ...mapGetters({
        admin: 'isAdmin'
    })
  },
  mounted() {
    if (localStorage.getItem('wrong_email')) {
      this.form.email = localStorage.getItem('wrong_email')
      this.reset = false
      this.errorDetails = `'${localStorage.getItem('wrong_email')}' is not associated with any Flopay account.`
      this.errorType = 'Email Not found'
    }

    if (localStorage.getItem('wrong_password')) {
      this.form.password = localStorage.getItem('wrong_password')
      this.reset = true
      this.errorDetails = `'${localStorage.getItem('wrong_password')}' is a wrong password.`
      this.errorType = 'Password Error'
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
                    this.$session.set('email', this.form.email)

                    if(response.data.response.data.is_sub_user) {
                        if(!response.data.response.data.sub_user.is_login_before) {
                            localStorage.setItem('FTloginToken', response.data.response.data.sub_user.token)
                            this.$store.dispatch('getToken')
                            this.$router.push('/reset_password')
                        } else {
                            if (this.$session.has('client')) {
                                this.$store.dispatch('getToken')
                                .then((response) => {
                                    this.$session.set('token', response.data.access_token)
                                    this.$store.dispatch('setToken', response.data.access_token)
                                    this.$router.push('/')
                                })
                            } else {
                                this.$store.dispatch('setClient', response.data.response.data)
                                .then(()=> {
                                    this.$router.push('/')
                                })
                            }
                        }
                    } else {
                        if (!response.data.response.data.is_login_before) {
                            localStorage.setItem('FTloginToken', response.data.response.data.token)
                            this.$store.dispatch('getToken')
                            this.$router.push('/reset_password')
                        } else {
                            if (this.$session.has('client')) {
                                this.$store.dispatch('getToken')
                                .then((response) => {
                                    this.$session.set('token', response.data.access_token)
                                    this.$store.dispatch('setToken', response.data.access_token)
                                    this.$router.push('/')
                                })
                            } else {
                                this.$store.dispatch('setClient', response.data.response.data)
                                .then(()=> {
                                    this.$router.push('/')
                                })
                            }
                        }
                    }
                } else {
                  // Do redirection to the login help page to assist user trying to login

                  this.$message({
                    message: response.data.response.message,
                    type: 'error'
                  })
                }
                    this.loading = false
                })
            .catch((error) => {
                this.loading = false
                let resp = ''
                console.log('Here')

                if(error.response != undefined) {
                    switch (error.response.status) {
                        case 400:
                            resp = error.response.data.message
                            break;
                        case 500:
                            resp = error.response.data.error
                            break;
                        default:
                            resp = 'An error occured, please try again'
                            break;
                    }
                }
                else
                    resp = '500 - (Internal Server Error)'

                this.$message({
                    message: error.response,
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
    },
    forgotPassword () {
        this.$router.push('/forgot-password')
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
        width: 100px;
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

