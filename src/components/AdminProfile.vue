<template>
    <div>
        <!-- General Settings -->
        <el-card class="my-2 card-0 custom">
            <div class="flex align-items-baseline justify-content-between" slot="header">
                <span class="header-text">Profile</span>
                <el-button type="primary" class="z-depth-button s-13 open-sans mini-button b-0" size="mini">Sign Out</el-button>
            </div>
            <div>
                <el-row type="flex" justify="center">
                    <el-col :sm="16" :lg="13">
                        <el-form label-position="left" size="mini" ref="form" hide-required-asterisk class="transaction-form py-20" :model="client" label-width="200px">
                            <el-form-item v-for="(item, index) in columns" :key="index" :label="item.label">
                                <el-input  v-model="form[item.prop]"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="el-card__footer flex justify-content-end">
                <el-button size="mini" class="z-depth-button s-13 open-sans mini-button b-0">Cancel</el-button>
                <el-button size="mini" class="z-depth-button s-13 b-0 bold-500 open-sans white-text" type="primary">Save</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AdminProfile',
  data () {
    return {
      columns: [
        {label: 'Client Name', prop: 'name'},
        {label: 'Company Name', prop: 'company'},
        {label: 'Username', prop: 'username'}
      ]
    }
  },
  computed: {
    ...mapGetters(['user']),
    form: {
        get () {
            var user = {
                ...this.user,
                name: `${this.user.firstname} ${this.user.lastname}`
            }
            return user
        },
        set (val) {
            this.user = val
            var name = val.name.split(' ')
            this.user.firstname = val[0]
            this.user.lastname = val[1]
        }
    }
  }
}
</script>

<style>

</style>
