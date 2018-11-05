<template>
    <el-dialog top="25vh" custom-class="ticket-dialog" class="no-padding-dialog"
        title="Open Ticket"
        @close="close"
        :visible="ticketVisible"
        width="25%">
        <div class="flex new-ticket-bg">
            <el-form ref="ticketForm" size="mini" class="w-80 m-auto">
                <el-form-item label="Possible reason">
                    <el-select class="w-100" placeholder="Please select reason" v-model="form.description">
                        <el-option
                            v-for="item in reasons"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.description === 'other'" label="Subject">
                    <el-input v-model="form.subject" type="text"></el-input>
                </el-form-item>
                <el-form-item v-if="form.description === 'other'" label="Other">
                    <el-input v-model="other" autosize type="textarea"></el-input>
                </el-form-item>
                <el-form-item class="flex justify-content-end">
                    <el-button @click="close">Cancel</el-button>
                    <el-button :loading="loading" type="primary" @click="submitTicket('ticketForm')">Submit</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'

export default {
    name: 'TicketModal',
    props: ['ticketVisible', 'transaction'],
    data() {
      return {
        reasons: ['other', 'pending transaction', 'successful but customer not credited', 'transaction callback not received'],
        form: {
            description: ''
        },
        other: '',
        loading: false
      }
    },
    methods: {
      close () {
        EventBus.$emit('ticketModal', false)
      },
      submitTicket (formName) {
        this.loading = true
        this.form.description = this.form.description === 'other' ? this.other : this.form.description
        var form = {
            ...this.form,
            wallet_number: this.transaction.receiver_no,
            amount: this.transaction.receiver_amount,
            reference: this.transaction.reference,
            date_of_transaction: this.transaction.created_at,
            email: [this.$session.getItem('email')],
            customer_name: this.transaction.receiver_name,
            provider_reference: this.transaction.provider_ref,
            from: this.$session.getItem('email')
        }
        this.$store.dispatch('createTicket', form)
        .then((response) => {
            this.loading = false
            this.$message({
                type: 'success',
                message: response.data.response.message,
            })
            if (response.data.success) {
                this.close()
            }
        }).catch((error) => {
            const response = error.response
            this.$message({
                type: 'error',
                message: response.data.error,
            })
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style lang="scss" scoped>
.ticket-dialog{
    .el-dialog__header{
        color: #2b2d50;
    }
    .el-dialog__body{
        padding: 0px !important
    }
}
.new-ticket-bg{
    background: #F7FAFC;
    padding: 20px;
}
.w-80{
    width: 80%
}
</style>
