<template>
     <el-dialog custom-class="new-transaction"
        title="Create Contact"
        @close="close"
        :visible.sync="dialogVisible"
        width="30%">
        <div class="flex justify-content-center new-transaction-bg">
            <el-form style="width:90%" size="mini" ref="form" label-position="left" hide-required-asterisk class="transaction-form" :rules="rules" :model="form" label-width="150px">
                <el-form-item label="Contact Name">
                    <el-input v-model="form.deposit_account.account_name"></el-input>
                </el-form-item>
                <el-form-item class="h-auto" label="Contact Email" prop="deposit_account.email">
                    <el-input v-model="form.deposit_account.email"></el-input>
                </el-form-item>
                <el-form-item class="h-auto" label="Phone Number" prop="deposit_account.customer_msisdn">
                    <el-input v-model="form.deposit_account.customer_msisdn"></el-input>
                </el-form-item>
                <el-form-item label="Description">
                    <el-input autosize type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="Mode">
                    <el-radio-group class="w-100 default-radio-group" v-model="form.accounts_provider_code">
                        <el-radio-button class="w-50" label="mobile">Mobile Money</el-radio-button>
                        <el-radio-button class="w-50" label="bank">Bank</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <div v-if="form.accounts_provider_code === 'mobile'">
                    <el-form-item label="Provider Name">
                        <el-select class="w-100" v-model="form.code" placeholder="Select Provider">
                            <el-option
                                v-for="(item, index) in providers" :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Mobile Money Number">
                        <el-input type="text" v-model="form.deposit_account.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="Branch">
                        <el-input type="text" v-model="form.deposit_account.bank"></el-input>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="Bank">
                        <el-input type="text" v-model="form.deposit_account.bank"></el-input>
                    </el-form-item>
                    <el-form-item label="Account Number">
                        <el-input type="text" v-model="form.deposit_account.account_no"></el-input>
                    </el-form-item>
                    <el-form-item label="Branch">
                        <el-input type="text" v-model="form.deposit_account.branch"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="resetForm('form')">Cancel</el-button>
            <el-button size="mini" class="z-depth-button b-0 bold-500 open-sans white-text" :loading="createLoading" type="primary" @click="submitForm('form')">Create Contact</el-button>
        </span>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
export default {
    name: 'AddContact',
    props: ['form', 'dialogVisible'],
    data () {
        return {
            rules: {
                'deposit_account.customer_msisdn': [
                    { required: true, min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: 'This field is required', trigger: 'blur' }
                ],
                'deposit_account.email': [
                    { required: true, message: 'This field is required', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters({
            providers: 'providers',
        })
    },
    methods: {
        close () {
            EventBus.$emit('addContact', false)
        },
        submitForm (formName) {
            this.createLoading = true
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$store.dispatch('createContact', this.form)
                .then((response) => {
                    this.createLoading = false
                    this.$message({
                        message: 'Contact Created Successfully',
                        type: 'success'
                    })
                    this.dialogVisible = false
                }).catch(() => {
                    this.createLoading = false
                    this.$message({
                        message: 'Unable to create Contact. Please try again later',
                        type: 'error'
                    })
                })
            } else {
                this.createLoading = false
                this.$message({
                    message: 'Please fill form correctly',
                    type: 'error'
                })
            }
            })
        },
        resetForm (formName) {
            this.dialogVisible = false
            this.createLoading = false
            this.$refs[formName].resetFields()
        }
    }
}
</script>

<style>

</style>
