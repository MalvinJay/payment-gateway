<template>
    <div>
        <div v-if="isAdmin">
            <admin-profile></admin-profile>
        </div>
        <div v-else>
            <client-profile></client-profile>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClientProfile from '../../components/ClientProfile'
import AdminProfile from '../../components/AdminProfile'

export default {
  name: 'Profile',
  components: {
    ClientProfile,
    AdminProfile
  },
  computed: {
    ...mapGetters(['isAdmin'])
  }
}
</script>

<style>

</style>
