<template>
    <div v-loading="loadingPage" class="h-80">
        <!-- ERROR -->
        <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">Unable to load this page</p>
                <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <!--  v-loading="loadingPage" -->
        <div v-else>
            <!-- BRIEF INFO -->
            <el-card class="card-0 position-relative">
                <div class="flex flex-column p-20">
                    <div class="flex justify-content-between align-items-baseline mb-1">
                    <div class="flex align-items-baseline">
                        <p class="blue-text s-24 m-0 p-0 bold-600">{{form.description}}</p>
                    </div>
                    <div>
                        <p class="text-uppercase s-12 bold-600 m-0 p-0">{{header}}</p>
                        <!-- <el-button size="mini" type="primary" :loading="runLoading" @click="runJob" v-else>Run Job</el-button> -->
                    </div>
                    </div>
                    <div>
                        <el-button :loading="runLoading" @click="runJob" v-if="!form.scheduled && !form.is_mandate" icon="undo icon" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain>Run Job</el-button>
                    </div>
                </div>
                <div class="border-top px-20 py-10">
                    <div class="flex">
                        <div>
                            <i class="check circle s-12 icon green" ></i>
                        </div>
                        <div class="flex flex-column ml-1">
                            <p class="light mb-1 s-13">{{header}} was created</p>
                            <p class="light mb-1 s-12 gray">{{form.created_at | moment("MMM Do, YYYY hh:mm A")}}</p>
                        </div>
                    </div>
                </div>
            </el-card>

            <!-- JOB DETAILS -->
            <el-card class="my-2">
                <div class="flex justify-content-between" slot="header">
                    <span class="blue-text bold-600 s-16">{{header}} details</span>
                    <div v-if="!readonly" class="flex justify-content-end">
                        <el-button @click="cancel" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" plain>Cancel</el-button>
                        <el-button @click="update" :loading="updateLoading" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" type="primary">Save</el-button>
                    </div>
                    <!-- <el-button v-if="readonly" @click="toggleReadonly" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" plain icon="pencil alternate icon">Update Details</el-button> -->
                </div>
                <div>
                    <div v-if="hasNoData" class="center h-80">
                        No Data
                    </div>
                    <div v-if="!hasNoData">
                        <div class="flex">
                            <div class="w-50">
                                <el-row v-for="(value, key, index) in data" :key="index" class="mb-1">
                                    <el-col :span="8">
                                        <p class="m-0 text-capitalize menu-gray-text s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="16">
                                        <div v-if="readonly">
                                            <p v-if="key === 'time'" class="">{{value | moment("hh:mm a")}}</p>
                                            <p v-else-if="key === 'date'" class="">{{value | moment("MMM Do, YYYY")}}</p>
                                            <el-switch disabled v-else-if="key === 'scheduled'" class="w-50" v-model="form.scheduled"></el-switch>
                                            <p v-else class="">{{value}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="key === 'number of runs' || key === 'owner'" class="">{{value}}</p>
                                            <p v-else-if="key === 'time'" class="">{{value | moment("hh:mm a")}}</p>
                                            <p v-else-if="key === 'date'" class="">{{value | moment("MMM Do, YYYY")}}</p>
                                            <el-input v-else-if="key === 'name'" style="width: 80%" size="mini" v-model="form.description"></el-input>
                                            <el-switch v-else-if="key === 'scheduled'" class="w-50" v-model="form.scheduled"></el-switch>
                                            <div v-else-if="key === 'schedule' && form.scheduled">
                                                <div class="mb-2">
                                                    <div class="flex align-items-center h-30">
                                                        <el-switch class="w-50" active-text="Daily" v-model="form.schedule" active-value="daily"></el-switch>
                                                        <el-switch class="w-50" active-text="Weekly" v-model="form.schedule" active-value="weekly"></el-switch>
                                                    </div>
                                                    <div class="flex align-items-center h-30 mt-2">
                                                        <el-switch class="w-50" active-text="Monthly" v-model="form.schedule" active-value="monthly"></el-switch>
                                                        <el-switch class="w-50" active-text="BiMonthly" v-model="form.schedule" active-value="bimonthly"></el-switch>
                                                    </div>
                                                    <div class="flex align-items-center h-30 mt-2">
                                                        <el-switch class="w-50" active-text="Quarterly" v-model="form.schedule" active-value="quarterly"></el-switch>
                                                        <el-switch class="w-50" active-text="Yearly" v-model="form.schedule" active-value="yearly"></el-switch>
                                                    </div>
                                                </div>
                                                <!-- SWITCH FOR SCHEDULE -->
                                                <transition name="el-fade-in">
                                                    <div v-if="form.schedule === 'daily'">
                                                        <p class="text-uppercase s-12">time of trasactions postings</p>
                                                        <el-time-select size="mini"
                                                        v-model="schedule.time"
                                                        :picker-options="{
                                                            start: '08:30',
                                                            step: '00:15',
                                                            end: '18:30'
                                                        }"
                                                        placeholder="Select Time">
                                                        </el-time-select>
                                                    </div>
                                                    <div v-else-if="form.schedule === 'weekly'">
                                                        <p class="text-uppercase s-12">date & time of trasactions postings</p>
                                                        <el-select placeholder="Select Date" class="w-50 mb-1" size="mini" v-model="schedule.date">
                                                            <el-option v-for="(item, index) in days" :key="index" :label="item" :value="item"></el-option>
                                                        </el-select>
                                                        <el-time-select class="w-50" size="mini"
                                                        v-model="schedule.time"
                                                        :picker-options="{
                                                            start: '08:30',
                                                            step: '00:15',
                                                            end: '18:30'
                                                        }"
                                                        placeholder="Select Time">
                                                        </el-time-select>
                                                    </div>
                                                    <div v-else>
                                                        <p class="text-uppercase s-12">date & time of trasactions postings</p>
                                                        <el-date-picker class="w-50 mb-1" size="mini"
                                                            type="date" 
                                                            placeholder="Select Date"
                                                            value-format="yyyy-MM-dd"
                                                            format="MMM dd, yyyy"
                                                            v-model="schedule.date" 
                                                            :default-value="Date.now()"></el-date-picker>
                                                        <el-time-select class="w-50" size="mini"
                                                        v-model="schedule.time"
                                                        :picker-options="{
                                                            start: '08:30',
                                                            step: '00:15',
                                                            end: '18:30'
                                                        }"
                                                        placeholder="Select Time">
                                                        </el-time-select>
                                                    </div>
                                                </transition>
                                            </div>
                                            <el-input v-else style="width: 80%" size="mini" v-model="form[key]"></el-input>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="w-50">
                                <el-row type="flex" align="middle" v-for="(value, key, index) in data2" :key="index" class="mb-1">
                                    <el-col :span="8">
                                        <p class="m-0 text-capitalize menu-gray-text s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="16">
                                        <div v-if="readonly">
                                            <el-switch disabled v-model="data2[key]" v-if="key === 'active'"></el-switch>
                                            <el-switch disabled v-model="data2[key]" v-else-if="key === 'test'"></el-switch>
                                            <p v-else class="">{{value}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="key === 'last run' || key === 'next run'" class="">{{value | moment("MMM Do, YYYY")}}</p>
                                            <el-switch v-model="form.active" v-else-if="key === 'active'"></el-switch>
                                            <el-switch v-model="form.test" v-else-if="key === 'test'"></el-switch>
                                            <el-input v-else-if="key === 'retry limit'" v-model="form.retry_limit" style="width: 80%;" size="mini"></el-input>
                                            <el-input-number class="text-left" v-else :controls="false" style="width: 80%;" size="mini" v-model="form[key]"></el-input-number>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>

            <!-- JOB RUNS -->
            <el-card class="my-2 card-0">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">{{header}} runs</span>
                </div>
                <div>
                    <el-table @row-click="clickRun" ref="run" class="default-table-expanded" empty-text="No job runs to display" v-loading="loadingPage" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="runs">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table empty-text="No transactions" tooltip-effect="light" header-row-class-name="transactions-table-header" row-class-name="transactions-table-body" :data="props.row.executed_transctions">
                                    <el-table-column prop="receiver_name" label="Name"></el-table-column>
                                    <el-table-column prop="receiver_no" label="Number"></el-table-column>
                                    <el-table-column prop="reference" label="Reference">
                                        <template slot-scope="scope">
                                            {{scope.row.reference}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="sender_amount" label="Amount">
                                        <template slot-scope="scope">
                                            {{ scope.row.sender_amount | money}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="charged_amount" label="Fee">
                                        <template slot-scope="scope">
                                            {{ scope.row.charged_amount | money}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="status" label="" >
                                        <template slot-scope="scope">
                                            <div class="flex">
                                                <the-tag status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="date" label="Date">
                            <template slot-scope="scope">
                                {{scope.row.updated_at | moment("MMM Do, YYYY")}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="time" label="Time">
                            <template slot-scope="scope">
                                {{scope.row.updated_at | moment("hh:mm A")}}
                            </template>
                        </el-table-column>
                        <el-table-column min-width="80" align="center">
                            <template slot-scope="scope">
                                <a :href="`${GET_BASE_URI}v1/clients/reports/download?access_token=${token}&file_name=${link}`"
                                    class="cursor open-sans el-button el-button--primary el-button--mini" target="_blank" v-if="ready" download>Download</a>
                                <el-button @click="submitExport(scope.row.id)" :loading="exportLoading" v-else type="text" class="p-0 m-0" icon="download icon"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-20">
                        <div class="s-12">
                            {{runs.length}} results
                        </div>
                        <el-pagination class="my-2 flex justify-content-end"
                            @current-change="handleCurrentChange"
                            :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="totalRuns">
                        </el-pagination>
                    </div>
                </div>
            </el-card>

            <!-- JOB CONTACTS -->
            <el-card class="my-2 card-0">
                <div class="flex align-items-baseline justify-content-between" slot="header">
                    <span class="blue-text bold-600 s-16">Subscribers</span>
                    <el-upload
                        class="upload-contacts no-show-upload"
                        action=""
                        :on-change="onChange"
                        :auto-upload="false"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        :file-list="form.fileList">
                        <el-button :loading="addLoading" type="primary" class="z-depth-button s-13 open-sans mini-button b-0" size="mini" icon="plus icon">Upload Contacts</el-button>
                    </el-upload>
                </div>
                <div class="breathe">
                    <el-table
                    @row-click="clickContact"
                    empty-text="No job subscribers"
                    v-loading="loading"
                    row-class-name="transactions-table-body"
                    header-row-class-name="transactions-table-header"
                    :data="form.contacts.slice((page * 12) - 12, page * 12)">
                        <el-table-column type="index"></el-table-column>
                        <!-- <el-table-column type="expand">
                            <template slot-scope="props">
                                <div>
                                    <el-row>
                                        <el-col :span="5">
                                            <p class="blue-text s-13 bold-600 p-0 m-0 mr-6">Reference: </p>
                                        </el-col>
                                        <el-col :span="10">
                                            <p class="s-12 gray p-0 m-0 ">{{ props.row.data.reference }}</p>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div>
                                    <el-row>
                                        <el-col :span="5">
                                            <p class="blue-text s-13 bold-600 p-0 m-0 mr-6">Response Message: </p>
                                        </el-col>
                                        <el-col :span="10">
                                            <p class="s-12 gray p-0 m-0 ">{{ props.row.data.response_message }}</p>
                                        </el-col>
                                    </el-row>
                                </div>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="name" label="name"></el-table-column>
                        <el-table-column prop="msisdn" label="Phone Number"></el-table-column>
                        <el-table-column prop="amount" label="amount">
                            <template slot-scope="scope">
                                {{scope.row.amount | money}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="updated_at" label="date">
                            <template slot-scope="scope">
                                {{scope.row.updated_at | moment("MMM Do, YYYY")}}
                            </template>
                        </el-table-column>
                        <el-table-column width="80" align="center">
                            <template slot-scope="scope">
                                <el-button :loading="deleteLoading" class="p-0 m-0" @click.native.prevent="deleteJobContact(scope.$index, scope.row)" icon="trash alternate outline icon" type="text"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-20">
                        <div class="s-12">
                            {{form.contacts.slice((page * 12) - 12, page * 12).length}} results
                        </div>
                        <el-pagination class="my-2 flex justify-content-end"
                            @current-change="handleCurrentCustomerChange"
                            :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="totalRuns">
                        </el-pagination>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
import Utils from '../../utils/services'
import Job from '../models/Job.js'
import moment from 'moment'
import { AWS_BUCKET } from '../store/transactions-store-constants.js'
import { GET_BASE_URI } from '../../store/constants'

export default {
    name: 'JobDetails',
    data () {
        return {
            test: true,
            loading: false,
            readonly: true,
            updateLoading: false,
            addLoading: false,
            schedule: [],
            days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            field: {},
            changedFields: {},
            deleteLoading: false,
            page: 1,
            ready: false,
            exportLoading: false,
            GET_BASE_URI: GET_BASE_URI
        }
    },
    // watch: {
    //     form (oldValue, newValue) {
    //         var fields = ['description', 'retry_limit', 'scheduled', 'schedule', 'active', 'test']
    //         var diff = Utils.getChangedFields(newValue, fields, oldValue )
    //         // Object.assign(this.changedFields, diff)
    //         this.changedFields = diff
    //         console.log('result', diff)
    //     }
    // },
    mounted () {
        EventBus.$emit('sideNavClick', 'jobs')
        this.$store.dispatch('getJobRuns', {id: this.$route.params.id})

        this.$store.dispatch('getCurrentJob', {id: this.$route.params.id})
        // this.$nextTick(() => {
        //     const trs = [].slice.call(document.querySelectorAll('.el-table__row'))
        //     this.form.contacts.forEach((row, index) => {
        //         if (row.has_mandate === 'hola') {
        //             trs[index].querySelector('.el-table__expand-column').style.visibility = 'hidden'
        //         }
        //     })
        // })
    },
    methods: {
        clickRun (row, event, column) {
            if (column.property) {
                this.$refs.run.toggleRowExpansion(row)
            }
        },
        clickContact (row, event, column) {
            if (column.property) {
                this.$router.push(`/job-contacts/${row.id}`)
            }
        },
        fetchTransactions () {
            this.$store.dispatch('getCurrentJob', {id: this.$route.params.id})
        },
        deleteCustomer (index, row) {
            // console.log(index)
            var newForm = Job.getCreateView(this.form)
            this.$store.dispatch('updateJob', {id: this.form.id, data: this.form})
            .then(() => {
                this.$message({
                    message: 'Job Updated Successfully',
                    type: 'success'
                })
                // this.form.contacts.splice(index, 1)
                this.$store.dispatch('getCurrentJob', {id: this.$route.params.id, cache: false})
            }).catch(() => {
                this.$message({
                    message: 'Job Not Updated',
                    type: 'error'
                })
            })
            // this.$store.dispatch('removeEmployeeAbsence', {id: this.$route.params.id, name: this.absences[index].comment}).then(() => {
            //     this.$store.dispatch('employeeFetchAbsences', this.$route.params.id)
            // })
        },
        addContactToJob () {
        },
        toggleReadonly () {
            this.readonly = !this.readonly
        },
        cancel () {
            this.readonly = true
        },
        runJob () {
            this.runLoading = true
            
            this.$store.dispatch('runJob', this.form.id)
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        message: 'Job Run Successfully',
                        type: 'success'
                    })
                    this.runLoading= false
                    EventBus.$emit('tabNumber', '3')
                    setTimeout(() => {
                        this.$store.dispatch('getJobRuns', {id: this.$route.params.id})
                        this.$store.dispatch('getBalance')
                        // this.$store.dispatch('getCurrentJob', {id: this.$route.params.id, cache: false})
                    }, 5000)
                } else {
                this.$message({
                    type: 'error',
                    message: response.data.response.message
                })
                this.runLoading= false
            }
            }).catch((error) => {
                this.runLoading= false
                const response = error.response
                this.$message({
                    message: response.data.error,
                    type: 'error'
                })
            }) 
        },
        deleteJobContact (index, row) {
            this.deleteLoading = true
            
            this.$store.dispatch('deleteJobContact', {id: row.id, job: this.$route.params.id})
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        message: 'Contact Deleted Successfully',
                        type: 'success'
                    })
                    this.deleteLoading= false
                    this.$store.dispatch('getCurrentJob', {id: this.$route.params.id, cache: false})
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                    this.deleteLoading= false
                }
            }).catch((error) => {
                this.deleteLoading= false
                const response = error.response
                this.$message({
                    message: 'Delete failed',
                    type: 'error'
                })
            }) 
        },
        onChange (file, fileList){
            this.addLoading = true
            let fileInput = this.$el.querySelector(".upload-contacts input[type='file']")
            let filess = fileInput.files[0]
            this.$store.dispatch('sendToBucket', filess)
            .then((response) => {
                if (response) {
                    var upload = {
                        Bucket: AWS_BUCKET,
                        Key: this.file.key
                    }
                    var query = Utils.addContactToJobQuery(upload)
                    this.$store.dispatch('createJobContact', {id: this.form.id, job: query})
                    .then((res) => {
                        if (res.data.success) {
                            this.$message({
                                type: 'success',
                                message: res.data.response.message,
                            })
                            this.$store.dispatch('getCurrentJob', {id: this.$route.params.id})
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.response.message,
                            })
                        }
                        this.addLoading = false
                    })
                }
                
            })
        },
        update () {
            this.updateLoading = true
           
            this.form.schedule = this.form.scheduled ? Utils.createJobQuery (this.form.schedule, this.schedule) : 'false'
            var newForm = Utils.createJobDetailsArray(this.form, ['description', 'scheduled', 'schedule', 'retry_limit', 'active', 'test'])
            // var newForm = Job.getCreateView(this.form)
            // var schedule = Utils.createJobQuery (newForm.schedule, this.schedule)
            // newForm.schedule = schedule
            // newForm.contacts = this.contacts
            
            this.$store.dispatch('updateJob', {id: this.form.id, data: newForm})
            .then((response) => {
                if (response.data.success) {
                    this.$message({
                        message: 'Job Updated Successfully',
                        type: 'success'
                    })
                    this.updateLoading = false
                    this.$store.dispatch('getCurrentJob', {id: this.$route.params.id, cache: false})
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                    this.updateLoading = false
                }
            }).catch((error) => {
                this.updateLoading = false
                const response = error.response
                this.$message({
                    message: 'Update failed. Please try again later',
                    type: 'error'
                })
            })
        },
        handleCurrentChange (val) {
            this.$store.dispatch('getCurrentJobRuns', {page: val})
        },
        handleCurrentCustomerChange (page) {
            this.page = page
        },
        submitExport (id) {
            // this.exportLoading = true
            this.$store.dispatch('submitJobReport', id)
            .then((response) => {
                if (response.data.success) {
                    this.ready = true
                    this.$message({
                        type: 'success',
                        message: response.data.response.message,
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.response.message
                    })
                }
                this.exportLoading = false
            }).catch((error) => {
                console.log('job error', error.response)
                this.exportLoading = false
                const response = error.response
                this.$message({
                    message: response.data,
                    type: 'error'
                })
            })
        }
    },
    computed: {
        ...mapGetters({
            form: 'currentJob',
            state: 'currentJobState',
            runs: 'currentRuns',
            totalRunsStore: 'currentJobRuns',
            runState: 'currentJobRunsState',
            file: 'file',
            fileState: 'fileState',
            pageSize: 'pageSize',
            pageLoading: 'pageLoading',
            link: 'downloadLink',
            token: 'token'
        }),
        error () {
            return this.state === 'ERROR'
        },
        loadingPage () {
            return this.state === 'LOADING'
        },
        runLoading () {
            return this.runState === 'LOADING'
        },
        header () {
            return 'Job'
        },
        totalRuns () {
            return this.totalRunsStore.length
        },
        data () {
            var symbol = '\u20B5'
            if (this.form.currency === 'GHs') {
               symbol = '\u20B5'
            }
            var nForm = {
                owner: this.form.owner,
                name: this.form.description,
                'number of runs': this.form.number_of_runs,
                date: this.form.created_at,
                time: this.form.created_at,
                scheduled: this.form.scheduled
            }
            if (this.form.scheduled) {
                nForm.schedule = this.form.schedule
            }
            return nForm
        },
        contacts () {
            return this.form.contacts.map(el => el.name)
        },
        data2 () {
            var nForm = {
                'retry limit': this.form.retry_limit ? this.form.retry_limit : '-',
                'last run': this.form.last_run  ? this.form.last_run : 'No previous run',
                'next run': this.form.next_run  ? this.form.next_run : 'No run scheduled',
                active: this.form.active ? this.form.active : false,
                test: this.form.test
            }
            return nForm
        },
        hasNoData () {
            return typeof this.form === 'undefined'
        }
    }
}
</script>

<style lang="scss" scoped>
.payment-div{
    height: 80px;
}
.green{
    color: #1ea672;
}
.lightgray{
    color: #697386
}
.gray{
    color: #8792a2
}
.w-100{
    width: 100px;
}
.mb-2{
    margin-bottom: 1em
}
.h-80{
    min-height: 100px
}
</style>
