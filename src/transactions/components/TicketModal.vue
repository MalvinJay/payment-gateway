<template>
    <el-dialog top="25vh" custom-class="ticket-dialog" class="no-padding-dialog"
        title="Open Ticket"
        @close="close"
        :visible="ticketVisible"
        width="30%">
        <div class="flex new-ticket-bg">
            <el-form label-width="80px" ref="ticketForm" size="mini" class="w-80 m-auto">
                <el-form-item label="Issue">
                    <el-select class="w-100" placeholder="Please select reason" v-model="form.description">
                        <el-option
                            v-for="item in reasons"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Email">
                    <div class="flex flex-wrap">
                        <el-tag
                            :key="tag"
                            v-for="tag in form.email"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                            {{tag}}
                            </el-tag>
                        <el-input
                            resize="horizontal"
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                            >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Email</el-button>
                    </div>
                    <!-- <el-input v-model="form.email" type="email"></el-input> -->
                </el-form-item>
                <el-form-item label="Subject">
                    <el-input v-model="form.subject" type="text"></el-input>
                </el-form-item>
                <el-form-item label="Remarks">
                    <el-input v-model="other" :autosize="{ minRows: 3, maxRows: 8}" type="textarea"></el-input>
                </el-form-item>
                <div class="flex justify-content-end my-2">
                    <el-button size="mini" @click="close">Cancel</el-button>
                    <el-button size="mini" :loading="loading" type="primary" @click="submitTicket('ticketForm')">Submit</el-button>
                </div>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'

export default {
    name: 'TicketModal',
    props: ['ticketVisible', 'transaction'],
    data () {
      return {
        reasons: ['other', 'pending transaction', 'successful but customer not credited', 'transaction callback not received'],
        form: {
            description: '',
            email: []
        },
        other: '',
        loading: false,
        // form.email: ['Tag 1', 'Tag 2', 'Tag 3'],
        inputVisible: false,
        inputValue: ''
      }
    },
    methods: {
      close () {
        EventBus.$emit('ticketModal', false)
      },
      handleClose (tag) {
        this.form.email.splice(this.form.email.indexOf(tag), 1)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.form.email.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      submitTicket (formName) {
        this.loading = true
        // this.form.description = this.form.description === 'other' ? this.other : this.form.description
        var form = {
            ...this.form,
            wallet_number: this.transaction.receiver_no,
            amount: this.transaction.sender_amount,
            reference: this.transaction.reference,
            date_of_transaction: this.transaction.created_at,
            email: [this.$session.get('email')],
            emails: [...this.form.email],
            customer_name: this.transaction.receiver_name,
            provider_reference: this.transaction.provider_ref,
            from: this.$session.get('email')
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
            this.loading = false
            const response = error.response
            this.$message({
                type: 'error',
                message: response.data.error,
            })
        })
      },
      resetForm (formName) {
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
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 0px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: auto;
    margin-left: 0px;
    vertical-align: bottom;
}
</style>
