<template>
    <div>
        <el-form>
            <el-form-item>
                <el-input v-model="email" type="form.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="password" type="form.password"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {}
    }
  },
  methods: {
    login: function () {
      const { username, password } = this.form
      if (username === 'admin' && password === 'password') {
        this.$router.push('/')
      } else {
      }
    //   this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
    //     this.$router.push('/')
    //   })
    }
  }
}
</script>
