<template>
    <div>
        <!-- ERROR -->
        <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">Unable to load this page</p>
                <el-button @click.prevent="fetchTransactions" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <div v-else v-loading="loadingPage">
            <!-- BRIEF INFO -->
            <el-card :class="{'test-data': test}" class="card-0 position-relative">
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
                        <el-button :loading="runLoading" @click="runJob" v-if="!form.scheduled" icon="undo icon" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain>Run Job</el-button>
                    </div>
                </div>
                <div class="border-top px-20 py-10">
                    <div class="flex">
                        <div>
                            <i class="check circle s-12 icon green" ></i>
                        </div>
                        <div class="flex flex-column ml-1">
                            <p class="light mb-1 s-13">{{header}} was created</p>
                            <p class="light mb-1 s-12 gray">{{form.created_at | moment("MMM Do, HH:mm A")}}</p>
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
                                        <p class="m-0 text-capitalize lightgray s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="16">
                                        <div v-if="readonly">
                                            <p v-if="key === 'time'" class="s-13 mono">{{value | moment("hh:mm a")}}</p>
                                            <p v-else-if="key === 'date'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
                                            <p v-else class="s-13 mono">{{value}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="key === 'number of runs' || key === 'owner'" class="s-13 mono">{{value}}</p>
                                            <p v-else-if="key === 'date'" class="s-13 mono">{{value | moment("hh:mm a")}}</p>
                                            <p v-else-if="key === 'time'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
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
                                        <p class="m-0 text-capitalize lightgray s-14">{{key}}</p>
                                    </el-col>
                                    <el-col :span="16">
                                        <div v-if="readonly">
                                            <el-switch disabled v-model="data2[key]" v-if="key === 'active'"></el-switch>
                                            <el-switch disabled v-model="data2[key]" v-else-if="key === 'test'"></el-switch>
                                            <p v-else class="s-13 mono">{{value}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if="key === 'last run' || key === 'next run'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
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
            <el-card class="my-2">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">{{header}} runs</span>
                </div>
                <div>
                    <el-table class="default-table-expanded" empty-text="No job runs to display" v-loading="loadingPage" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="runs">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table empty-text="No transactions" tooltip-effect="light" header-row-class-name="transactions-table-header" row-class-name="transactions-table-body" :data="props.row.executed_transctions">
                                    <el-table-column prop="receiver_name" label="Name"></el-table-column>
                                    <el-table-column prop="receiver_no" label="Number"></el-table-column>
                                    <el-table-column prop="type" label="Type">
                                        <template slot-scope="scope">
                                            <div class="flex">
                                                <p v-if="scope.row.service_code === 'cashin'">Payout</p>
                                                <p v-else>Payment</p>
                                            </div>
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
                                    <!-- <el-table-column width="150" show-overflow-tooltip prop="response_message" label="remarks"></el-table-column> -->
                                    <el-table-column prop="status" label="" width="80px">
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
                    </el-table>
                </div>
            </el-card>
           <!-- JOB RUNS WITH ITS TRANSACTIONS -->
            <!-- <el-card class="my-2">
                <div slot="header">
                    <span class="blue-text bold-600 s-16">{{header}} runs</span>
                </div>
                <div>
                    <el-table highlight-current-row empty-text="No job runs to display" v-loading="loadingPage" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="runs">
                        <el-table-column type="expand" label="run_ID">
                            <template slot-scope="props">
                                <p>Name: {{ props.row.receiver_name }}</p>
                                <p>Phone Number: {{ props.row.receiver_no }}</p>
                                <p>Amount: {{ props.row.sender_amount | money}}</p>
                                <p>Remarks: {{ props.row.remarks }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="reference" label="reference"></el-table-column>
                        <el-table-column prop="status" label="run_TIME">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <the-tag status="failed" :title="scope.row.status" icon="reply icon"></the-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="Type">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <p v-if="scope.row.service_code === 'cashin'">Payout</p>
                                    <p v-else>Payment</p>
                                </div>
                            </template>
                        </el-table-column>
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
                    </el-table>
                </div>
            </el-card>             -->
            <!-- JOB CONTACTS -->
            <el-card class="my-2">
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
                <div>
                    <el-table empty-text="No job customers" v-loading="loading" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="form.contacts">
                        <el-table-column type="index"></el-table-column>
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
                        <!-- <el-table-column align="center">
                            <template slot-scope="scope">
                                <el-button class="p-0 m-0" @click.native.prevent="deleteCustomer(scope.$index, scope.row)" icon="trash alternate outline icon" type="text"></el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
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
import { diff } from 'semver'
import { AWS_BUCKET } from '../store/transactions-store-constants.js'

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
            field: {}
        }
    },
    // watch: {
    //     form (oldvalue, newValue) {
    //         console.log('old')
    //         var differ = diff(oldvalue, newValue)
    //         console.log('unique', differ)
    //     }
    // },
    mounted () {
        EventBus.$emit('sideNavClick', 'view')
        this.$store.dispatch('getJobRuns', {id: this.$route.params.id})

        this.$store.dispatch('getCurrentJob', {id: this.$route.params.id})
    },
    methods: {
        clickRun (row, event, column) {
            this.$router.push(`/run/${row.id}`)
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
                console.log('response', response)
                if (response.data.success) {
                    this.$message({
                        message: 'Job Run Successfully',
                        type: 'success'
                    })
                    this.runLoading= false
                    EventBus.$emit('tabNumber', '3')
                    this.$store.dispatch('getCurrentJob', {id: this.$route.params.id, cache: false})
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
        onChange (file, fileList){
            this.addLoading = true
            let fileInput = this.$el.querySelector(".upload-contacts input[type='file']")
            let filess = fileInput.files[0]
            console.log('file', filess)
            this.$store.dispatch('sendToBucket', filess)
            .then((response) => {
                console.log('data res', response)
                if (response) {
                    console.log('fileState', this.fileState)
                    console.log('fileState', response.body)
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
            var newForm = Job.getCreateView(this.form)
            var schedule = Utils.createJobQuery (newForm.schedule, this.schedule)
            newForm.schedule = schedule
            newForm.contacts = this.contacts
            
            this.$store.dispatch('updateJob', {id: this.form.id, data: newForm})
            .then((response) => {
                console.log('response', response)
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
                this.$store.dispatch('getCurrentJob', {id: this.$route.params.id, cache: false})
            }
                
            }).catch((error) => {
                this.updateLoading = false
                const response = error.response
                this.$message({
                    message: response.data.error,
                    type: 'error'
                })
                this.$store.dispatch('getCurrentJob', {id: this.$route.params.id, cache: false})
            })
        }
    },
    computed: {
        ...mapGetters({
            form: 'currentJob',
            state: 'currentJobState',
            runs: 'currentJobRuns',
            runState: 'currentJobRunsState',
            file: 'file',
            fileState: 'fileState'
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
                schedule: this.form.schedule,
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
