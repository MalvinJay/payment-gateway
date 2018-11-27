<template>
    <el-dialog custom-class="export-dialog"
        title="New Account"
        @close="close"
        :visible="accountVisible"
        top="10vh"
        width="35%">
        <div class="flex justify-content-center new-account">
            <el-form size="mini" class="my-2 s-12 transaction-form account-form" hide-required-asterisk style="width: 80%" ref="form" :model="form" label-width="150px">
                <el-form-item label="Upload Photo">
                    <el-upload
                        class="avatar-uploader"
                        action=""
                        accept=".png,.jpg,.jpeg"
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="handleAvatarSuccess"
                        :limit="1"
                        :file-list="fileList"
                        :on-success="handleAvatarSuccess">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item
                    v-for="(item, index) in columns" :key="index"
                    :label="item.label"
                    :prop="item.prop"
                    >
                    <el-input :type="item.type" v-model="form[item.model]"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
export default {
  name: 'NewAccount',
  props: ['accountVisible'],
  data () {
    return {
      form: {
        is_verified_account: true,
        country_code: 'GH',
        onboard_type: 'FLPW'
      },
      imageUrl: '',
      fileList: [],
      columns: [
        {label: 'Owners Name', prop: 'owner_name', model: 'owner_name', type: 'text'},
        {label: 'Company Name', prop: 'company_name', model: 'company_name', type: 'text'},
        {label: 'Phone Number', prop: 'client_msisdn', model: 'client_msisdn', type: 'text'},
        {label: 'Email Address', prop: 'email', model: 'email', type: 'text'},
        {label: 'Bank Account Number', prop: 'bank', model: 'bank', type: 'text'},
        {label: 'Clients Sub-Code', prop: 'code', model: 'code', type: 'text'},
        {label: 'Merchant Mobile Money Number', prop: 'email', model: 'email', type: 'text'},
        {label: 'Business Address', prop: 'address', model: 'address', type: 'textarea'},
        {label: 'City', prop: 'city', model: 'city', type: 'text'}
      ]
    }  
  },
  methods: {
    close () {
      EventBus.$emit('accountModal', false)
    },
    handleAvatarSuccess (res, file) {
      let fileInput = this.$el.querySelector(".avatar-uploader input[type='file']")
      let filess = fileInput.files[0]
      this.imageUrl = URL.createObjectURL(filess)
    }
  }
}
</script>

<style lang="scss" scoped>
.new-account{
//   height: 70vh;

//   .account-form{
//     height: 100%;
//     overflow-y: scroll;
//   }
}
</style>
