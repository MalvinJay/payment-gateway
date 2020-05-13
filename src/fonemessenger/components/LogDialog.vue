<template>
    <el-dialog custom-class="export-dialog"
        title="New Message"
        @close="close"
        :visible="modalVisible"
        width="35%">
        <div v-loading="fileUploading" class="flex justify-content-center new-export-bg">
            <el-form hide-required-asterisk class="transaction-form my-2" size="mini" style="width: 90%" :rules="rules" ref="form" :model="form" label-width="150px">
                <el-form-item label="Type Of Message">
                    <el-select v-model="form.is_batch">
                        <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="form.is_batch">
                    <el-form-item label="Upload CSV File">
                        <el-upload
                            class="upload-demo"
                            action=""
                            :on-change="onChange"
                            :limit="1"
                            :auto-upload="false"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            :file-list="fileList">
                            <el-button size="small" type="primary">Click to upload</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="Download File Format">
                        <a download href="../../../static/Batch_messages_format.csv">Download file format</a>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="Title Of Message">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="Phone Number(s)">
                        <el-tag
                            :key="tag"
                            v-for="tag in form.contacts"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                            {{tag}}
                            </el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                            >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Number</el-button>
                    </el-form-item>
                    <el-form-item label="Message">
                        <el-input type="textarea" autosize v-model="message"></el-input>
                        <p class="cha-info">{{characters}} characters {{messages}} messages</p>
                    </el-form-item>
                </div>
                <el-form-item>
                    <div class="flex justify-content-end w-100">
                        <el-button @click="close" type="text">Cancel</el-button>
                        <el-button @click="createLog('form')" :loading="loading" type="primary">Create</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Utils from '../../utils/services'
import moment from 'moment'

export default {
    name: 'ExportModal',
    props: ['modalVisible'],
    data() {
      return {
        checkAll: false,
        form: {
          is_batch: false,
          contacts: []
        },
        characters: 0,
        messages: 0,
        message: '',
        fileList: [],
        loading: false,
        column: 'all',
        options: [
          {name: 'Single', value: false},
          {name: 'File Upload', value: true}
        ],
        rules: {
          payment_types: [
            { required: true, message: 'Please select at least one option', trigger: 'change' }
          ]
        },
        inputVisible: false,
        inputValue: '',
        loading: false
      }
    },
    watch: {
        message () {
          this.characters = this.message.length
          this.messages = Math.ceil(this.characters / 160)
        }
    },
    methods: {
      close () {
        EventBus.$emit('logModal', false)
      },
      onChange (file, fileList) {
        this.files = fileList
        let fileInput = this.$el.querySelector(".upload-demo input[type='file']")
        let filess = fileInput.files[0]
        this.$store.dispatch('sendToBucket', filess)
      },
      handleClose (tag) {
        this.form.contacts.splice(this.form.contacts.indexOf(tag), 1);
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
          this.form.contacts.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      createLog (formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
            if (valid) {
                var form = {}
                if (this.form.is_batch) {
                    this.form.file_url = this.file
                    form.file_url = this.file
                    form.is_batch = true
                } else {
                    form.message = this.message
                    form.contacts = this.form.contacts
                    form.title = this.form.title
                    form.is_batch = false
                }
                console.log('fonemessages', form)
                // this.form.message = this.message
                this.$store.dispatch('createLog', form)
                .then((response) => {
                    if (response.data.success) {
                        this.$message({
                            type: 'success',
                            message: 'Message Sent'
                        })
                        this.$store.dispatch('getFoneMessengers', {cache: false})
                        this.$store.dispatch('getBalance')
                        this.close()
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.response.message
                        })
                    }
                    this.loading = false
                }).catch((error) => {
                    this.loading = false
                    const response = error.response
                    this.$message({
                        message: 'Failed to send message. Please try again',
                        type: 'error'
                    })
                })
            } else {
                this.loading = false
                this.$message({
                    message: 'Please correct the errors',
                    type: 'error'
                })
            }
        })
      },
    },
    computed: {
        ...mapGetters({
            state: 'fileState',
            file: 'file'
        }),
        fileUploading () {
            return this.state === 'LOADING'
        }
    }
}
</script>

<style lang="scss" scoped>
.export-dialog{
    .el-dialog__header{
        color: #2b2d50;
    }
    .el-dialog__body{
        padding: 0px !important
    }
}

.cha-info{
    font-size: 10px;
    font-style: italic;
    margin-top: 5px;
}
.new-export-bg{
    background: #F7FAFC;
}
.m-0{
    margin: 0 !important;
}
.el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
}
.button-new-tag {
    // margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 150px;
    margin-bottom: 5px;
    // margin-left: 10px;
    vertical-align: bottom;
}
</style>
