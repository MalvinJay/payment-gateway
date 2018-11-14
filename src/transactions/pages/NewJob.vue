<template>
    <div>
        <el-card v-loading="fileUploading" element-loading-text="Uploading file..." :class="[{'test-data': isTest}, 'flex', 'flex-column', 'card-0', 'position-relative']">
            <div slot="header" class="flex justify-content-between align-items-center">
                <h3 class="blue-text bold-500 m-0 pb-5">Create a Job</h3>
                <div class="standard-button">
                    <el-button @click="cancel" class="z-depth-button bold-600 s-13 open-sans b-0" size="mini">Cancel</el-button>
                    <el-button :disabled="fileError" @click="save('form')" :loading="loading" class="z-depth-button bold-600 s-13 open-sans b-0" size="mini" type="primary">Save Job</el-button>
                </div>
            </div>
            <div class="p-20">
                <!-- JOB FORM -->
                <el-form size="mini" class="default-form" label-position="right" :rules="rules" ref="form" :model="form" label-width="250px">
                    <!-- NAME -->
                    <el-form-item label="Job name" prop="description">
                        <el-input class="w-25" v-model="form.description"></el-input>
                    </el-form-item>
                    <!-- JOB DESCRIPTION -->
                    <!-- <el-form-item label="Job description">
                        <el-input class="w-25" type="textarea" v-model="form.description"></el-input>
                    </el-form-item> -->
                    <!-- JOB AMOUNT -->
                    <!-- <el-form-item label="Amount" prop="amount">
                        <el-input class="w-25" v-model="form.amount">
                            <span slot="prefix">&#8373</span>
                        </el-input>
                    </el-form-item> -->
                    <!-- JOB LIMIT -->
                    <el-form-item label="Retry Limit">
                        <el-input class="w-25" v-model.number="form.retry_limit"></el-input>
                    </el-form-item>
                    <!-- JOB MODE -->
                    <el-form-item label="Mode">
                        <el-select v-model="form.scheduled">
                            <el-option label="Automatic" :value="true"></el-option>
                            <el-option label="Manual" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- JOB AUTOMATIC SCHEDULED -->
                    <div v-if="form.scheduled">
                        <el-form-item label="Frequency">
                            <div class="flex align-items-center h-30">
                                <el-switch class="w-150" active-text="Daily" v-model="form.schedule" active-value="daily"></el-switch>
                                <el-switch class="w-150" active-text="Weekly" v-model="form.schedule" active-value="weekly"></el-switch>
                                <el-switch class="w-150" active-text="Monthly" v-model="form.schedule" active-value="monthly"></el-switch>
                            </div>
                            <div class="flex align-items-center h-30 mt-2">
                                <el-switch class="w-150" active-text="BiMonthly" v-model="form.schedule" active-value="bimonthly"></el-switch>
                                <el-switch class="w-150" active-text="Quarterly" v-model="form.schedule" active-value="quarterly"></el-switch>
                                <el-switch class="w-150" active-text="Yearly" v-model="form.schedule" active-value="yearly"></el-switch>
                            </div>
                        </el-form-item>
                        <!-- SWITCH FOR SCHEDULE -->
                        <transition name="el-fade-in">
                            <el-form-item v-if="form.schedule === 'daily'" label="time of trasactions postings">
                                <el-time-select
                                v-model="schedule.time"
                                :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30'
                                }"
                                placeholder="Select time">
                                </el-time-select>
                            </el-form-item>
                            <el-form-item v-else-if="form.schedule === 'weekly'" label="date & time of trasactions postings">
                                <el-select placeholder="select day" v-model="schedule.date">
                                    <el-option v-for="(item, index) in days" :key="index" :label="item" :value="item"></el-option>
                                </el-select>
                                <el-time-select
                                v-model="schedule.time"
                                :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30'
                                }"
                                placeholder="Select time">
                                </el-time-select>
                            </el-form-item>
                            <el-form-item v-else label="date & time of trasactions postings">
                                <!-- <el-input placeholder="input " class="w-25" v-model="schedule.date"></el-input> -->
                                <el-date-picker
                                    type="date"
                                    placeholder="Date"
                                    value-format="yyyy-MM-dd"
                                    format="MMM dd, yyyy"
                                    v-model="schedule.date" 
                                    :default-value="Date.now()"></el-date-picker>
                                <el-time-select
                                v-model="schedule.time"
                                :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30'
                                }"
                                placeholder="Select time">
                                </el-time-select>
                            </el-form-item>
                        </transition>
                    </div>
                    <!-- <el-form-item label="Beneficiaries">
                        <el-select v-model="beneficiaries">
                            <el-option label="Upload CSV" value="upload"></el-option>
                            <el-option label="Select Contacts" value="select"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <div v-if="beneficiaries === 'upload'"> -->
                        <el-form-item label="Upload CSV">
                            <el-upload
                                class="upload-demo"
                                action=""
                                :on-change="onChange"
                                :auto-upload="false"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                :file-list="form.fileList">
                                <el-button size="small" type="primary">Click to upload</el-button>
                            </el-upload>
                            <div v-if="fileError" class="mt-2">
                                <p class="p-0 m-0">Error in Uploading File</p>
                                <el-button type="text" :loading="fileUploading" icon="sync icon" @click="onChange">Retry</el-button>
                            </div>
                        </el-form-item>
                    <!-- </div> -->
                    <!-- <div v-else>
                        <el-form-item label="add contacts">
                            <el-select
                                v-model="contactData"
                                multiple
                                collapse-tags>
                                <el-option
                                v-for="item in contacts"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div> -->
                    <el-form-item label="Download File Format">
                        <a download href="../../../static/Batch_file_format.csv">Download file format</a>
                        <!-- <el-switch
                        v-model="form.approval"
                        active-text="Require Approval"
                        inactive-text="Deny Approval">
                        </el-switch> -->
                    </el-form-item>
                </el-form>
                <div class="flex justify-content-end">
                    <p class="s-12">NB: Vodafone numbers not supported</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
var S3 = require('aws-sdk/clients/s3')
import { AWS_BUCKET } from '../store/transactions-store-constants.js'
import Utils from '../../utils/services'

export default {
    name: 'NewJob',
    data () {
        return {
            isTest: true,
            form: {
                name: '',
                scheduled: true,
                schedule: "daily",
                // beneficiaries: 'upload',
                // times: [],
                // contacts: [],
                timezone: "Africa/Accra",
                country_code: "GH",
                live: !this.testData,
                test: this.testData,
                service_code: 'cashin'
            },
            beneficiaries: 'upload',
            contactData: [],
            schedule: {},
            loading: false,
            response: {},
            files: [],
            days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            rules: {
                description: [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                    { min: 3, message: 'Length should be at least 3 letters', trigger: 'blur' },
                ],
                amount: [
                    { required: true, message: 'This field is required', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        this.$store.dispatch('getContacts')
    },
    computed: {
        ...mapGetters({
            contacts: 'contacts',
            file: 'file',
            test: 'test',
            state: 'fileState'
        }),
        testData () {
            return this.test
        },
        fileUploading () {
            return this.state === 'LOADING'
        },
        fileError () {
            return this.state === 'ERROR'
        }
    },
    methods: {
        cancel () {
            this.$router.push('/payments')
        },
        save (formName) {
            this.loading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var job = ''
                    // if (this.beneficiaries === 'upload') {
                    job = 'createJob'
                    this.form.upload_details = {
                        Bucket: AWS_BUCKET,
                        Key: this.file.key
                    }
                    this.form.batch_details = {
                        Bucket: AWS_BUCKET,
                        Key: this.file.key
                    }
                    // } else {
                    //     job = 'createJobContact'
                    //     this.form.contacts = this.contactData
                    //     this.form.is_sub_user = false
                    // }
                    this.form.test = this.test
                    this.form.dummy = this.test
                    this.form.live = !this.test
                    var schedule = Utils.createJobQuery (this.form.schedule, this.schedule)
                    this.form.schedule = schedule

                    this.$store.dispatch(job, this.form)
                    .then((response) => {
                        if (response.data.success) {
                            this.$message({
                                type: 'success',
                                message: 'Job created',
                            })
                            this.$store.dispatch('getJobs', {cache: false})
                            EventBus.$emit('tabNumber', '3')
                            this.$router.push('/payments')
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
                            message: response.data.error,
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
        onChange (file, fileList) {
            this.files = fileList
            let fileInput = this.$el.querySelector(".upload-demo input[type='file']")
            let filess = fileInput.files[0]
            console.log('file', filess)
            this.$store.dispatch('sendToBucket', filess)
        }
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'payments')
    }
}
</script>

<style lang="scss" scoped>
.w-150{
    width: 150px;
}
.mt-2{
    margin-top: 1rem;
}
</style>
