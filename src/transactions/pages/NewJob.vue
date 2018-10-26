<template>
    <div>
        <el-card :class="[{'test-data': isTest}, 'flex', 'flex-column', 'card-0']">
            <div slot="header" class="flex justify-content-between align-items-center">
                <h3 class="blue-text bold-500 m-0 pb-5">Create a Job</h3>
                <div class="standard-button">
                    <el-button @click="cancel" class="z-depth-button bold-600 s-13 open-sans b-0" size="mini">Cancel</el-button>
                    <el-button @click="save('form')" :loading="loading" class="z-depth-button bold-600 s-13 open-sans b-0" size="mini" type="primary">Save Job</el-button>
                </div>
            </div>
            <div class="p-20">
                <el-form size="mini" class="default-form" label-position="right" :rules="rules" ref="form" :model="form" label-width="250px">
                    <el-form-item label="Job name" prop="name">
                        <el-input class="w-25" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="Job description">
                        <el-input class="w-25" type="textarea" v-model="form.description"></el-input>
                    </el-form-item>
                    <el-form-item label="Amount" prop="amount">
                        <el-input class="w-25" v-model="form.amount">
                            <span slot="prefix">&#8373</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Retry Limit">
                        <el-input class="w-25" v-model.number="form.limit"></el-input>
                    </el-form-item>
                    <el-form-item label="Mode">
                        <el-select v-model="form.scheduled">
                            <el-option label="Automatic" :value="true"></el-option>
                            <el-option label="Manual" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="form.mode === 'automatic'">
                        <el-form-item label="time of trasactions postings">
                            <el-time-select
                            v-model="form.value1"
                            :picker-options="{
                                start: '08:30',
                                step: '00:15',
                                end: '18:30'
                            }"
                            placeholder="Select time">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="Frequency">
                            <div class="flex justify-content-between align-items-center h-30">
                                <el-switch active-text="Daily" v-model="form.schedule" active-value="daily"></el-switch>
                                <el-switch active-text="Weekly" v-model="form.schedule" active-value="weekly"></el-switch>
                                <el-switch active-text="Monthly" v-model="form.schedule" active-value="monthly"></el-switch>
                                <el-switch active-text="BiMonthly" v-model="form.schedule" active-value="bimonthly"></el-switch>
                                <el-switch active-text="Quarterly" v-model="form.schedule" active-value="quarterly"></el-switch>
                                <el-switch active-text="Semi Annually" v-model="form.schedule" active-value="semi-annually"></el-switch>
                            </div>
                        </el-form-item>
                    </div>
                    <el-form-item label="Beneficiaries">
                        <el-select v-model="form.beneficiaries">
                            <el-option label="Upload CSV" value="upload"></el-option>
                            <el-option label="Select Contacts" value="select"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="form.beneficiaries === 'upload'">
                        <el-form-item label="Upload CSV">
                            <el-upload
                            class="upload-demo"
                            action=""
                            :auto-upload="false"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            :file-list="form.fileList">
                            <el-button size="small" type="primary">Click to upload</el-button>
                                <!-- <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div> -->
                            </el-upload>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item label="add contacts">
                            <el-select
                                v-model="form.contacts"
                                multiple
                                collapse-tags>
                                <el-option
                                v-for="item in contacts"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item label="Approval Settings">
                        <el-switch
                        v-model="form.approval"
                        active-text="Require Approval"
                        inactive-text="Deny Approval">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
export default {
    name: 'NewJob',
    data () {
        return {
            isTest: true,
            form: {
                name: '',
                mode: 'automatic',
                beneficiaries: 'upload',
                times: [],
                contacts: [],
                daily: '',
                is_sub_user: false,
                service_code: 'cashout'
            },
            loading: false,
            response: {},
            rules: {
                name: [
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
            contacts: 'contacts'
        })
    },
    methods: {
        cancel () {
            this.$router.push('/view')
        },
        save (formName) {
            this.loading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('createJob', this.form)
                    .then(() => {
                        this.$message({
                            message: 'Job created',
                            type: 'success'
                        })
                        this.$router.push('/view')
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                        this.$message({
                            message: 'Job creation failed',
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
        }
        // onChange (file, fileList){
        //     // this.files = fileList
        //     this.save()
        // },
        // uploadFile () {
        //     let url = this.url 
        //     let fileInput = this.$el.querySelector(".upload-demo input[type='file']")
        //     let file = fileInput.files[0]
        //     let that = this

        //     function getFileExtension(filename) {
        //         return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
        //     }

        //     var fileExtension = getFileExtension(file.name)

        //     const _this = this
        //     var BucketName = AWS_BUCKET
        //     var accessKeyId = "AKIAISGE5JFR22F6XTLQ"
        //     var SecretAccessKey = "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"
        //     var fileName = file.name 
        //     // aws.config.update({
        //     //     region: 'eu-central-1', 
        //     //     accessKeyId : accessKeyId,
        //     //     secretAccessKey : SecretAccessKey,
        //     // })

        //     // var s3 = new AWS.S3({apiVersion: '2006-03-01',params: {Bucket: BucketName}})
        //     var s3 = new S3({
        //         apiVersion: '2006-03-01',
        //         region: 'eu-central-1', 
        //         accessKeyId: accessKeyId,
        //         secretAccessKey: SecretAccessKey,
        //         params: {Bucket: BucketName}
        //     })
        //     // var albumFileKey = encodeURIComponent("flopay-file-batch") + '//'
        //     var albumFileKey = '//'
        //     var fileKey = moment().format('YYMMddhhmmss')+"_" + Utils.randomString2(3) + "_" + file.name    
        //     batchUploadsChannel.subscribe(fileKey, _this.onFileProcessed)
        //     var params = {Bucket: BucketName, Key: fileKey, Body: file}

        //     s3.upload(params, function(err, data) {
        //         if(err){
        //             console.log('err', err)
        //             batchUploadsChannel.unsubscribe(fileKey, _this.onFileProcessed)
        //             this.$emit('saveComplete', false)
        //             that.$notify.error("Upload Failed")
        //             return
        //         }
        //         console.log('DATA RESPONSE', data)
        //         let admin = {
        //             s3_object_key: data.key,
        //             file_type: fileExtension
        //         }
                
        //         axios.post(url, admin).then((response) => {
        //             that.processingFile = true  
        //         },error=>{
        //             that.$notify.error("Upload Failed")
        //             batchUploadsChannel.unsubscribe(fileKey, _this.onFileProcessed)
        //             this.$emit('saveComplete', false)
        //         });


        //         let params = {Bucket: BucketName, Key: fileKey};
        //         s3.getSignedUrl('getObject', params, function (err, url) {
        //             console.log("The URL is", url);
        //         });
                
        //     })
        // },
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'view')
    }
}
</script>

<style lang="scss" scoped>

</style>
