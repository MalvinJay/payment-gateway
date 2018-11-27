<template>
    <div>
        <div v-if="isAdmin">
            <account-table></account-table>
        </div>
    </div>
</template>

<script>
import AccountTable from '../components/AccountTable'
import { mapGetters } from 'vuex'
export default {
  name: 'Account',
  components: {
    AccountTable
  },
  mounted () {
    if (!localStorage.getItem('isAdmin')) {
        this.$router.push('/dashboard')
    }  
  },
  computed: {
    // ...mapGetters(['isAdmin'])
    isAdmin () {
        console.log('type of', localStorage.getItem('isAdmin') === 'true')
        return localStorage.getItem('isAdmin') === 'true'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
