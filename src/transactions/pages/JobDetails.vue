<template>
    <div v-loading="loadingPage">
        <!-- BRIEF INFO -->
        <el-card :class="{'test-data': test}" class="card-0 position-relative">
            <div class="flex flex-column p-20">
                <div class="flex justify-content-between align-items-baseline mb-1">
                   <div class="flex align-items-baseline">
                       <p class="blue-text s-24 m-0 p-0 bold-600">{{form.description}}</p>
                   </div>
                   <div>
                       <p class="text-uppercase s-12 bold-600 m-0 p-0">{{header}}</p>
                   </div>
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
                    <el-button @click="update" v-loading="updateLoading" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" type="primary">Save</el-button>
                </div>
                <el-button v-if="readonly" @click="toggleReadonly" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" plain icon="pencil alternate icon">Update Details</el-button>
            </div>
            <div>
                <div v-if="hasNoData" class="center h-80">
                    {{noData}}
                </div>
                <div v-if="!hasNoData">
                    <div class="flex">
                        <div class="w-50">
                            <el-row type="flex" align="middle" v-for="(value, key, index) in data" :key="index" class="mb-1">
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
                                        <p v-if="key === 'no of contacts' || key === 'number of runs' || key === 'owner'" class="s-13 mono">{{value}}</p>
                                        <p v-else-if="key === 'date'" class="s-13 mono">{{value | moment("hh:mm a")}}</p>
                                        <p v-else-if="key === 'time'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
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
                                        <p v-else class="s-13 mono">{{value}}</p>
                                    </div>
                                    <div v-else>
                                        <p v-if="key === 'last run' || key === 'next run'" class="s-13 mono">{{value}}</p>
                                        <el-switch v-model="form.active" v-else-if="key === 'active'"></el-switch>
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
                <el-table @row-click="clickRun" empty-text="No job runs to display" v-loading="runLoading" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="runs">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="date" label="Date"></el-table-column>
                    <el-table-column prop="time" label="Time"></el-table-column>
                </el-table>
            </div>
        </el-card>
        <!-- JOB CONTACTS -->
        <el-card class="my-2">
            <div slot="header">
                <span class="blue-text bold-600 s-16">{{header}} Contacts</span>
            </div>
            <div>
                <el-table @row-click="clickRow" empty-text="No job contacts" v-loading="loading" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="contacts">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="name" label="name"></el-table-column>
                    <el-table-column prop="msisdn" label="Phone Number"></el-table-column>
                    <el-table-column prop="email" label="email"></el-table-column>
                    <el-table-column prop="updated_at" label="date">
                        <template slot-scope="scope">
                            {{scope.row.updated_at | moment("MMM Do, YYYY")}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center">
                        <template slot-scope="scope">
                            <el-button class="p-0 m-0" @click.native.prevent="deleteCustomer(scope.$index, scope.row)" icon="trash alternate outline icon" type="text"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
import Utils from '../../utils/services'
import Job from '../models/Job.js'
import moment from 'moment'

export default {
    name: 'JobDetails',
    data () {
        return {
            test: true,
            loading: false,
            readonly: true,
            updateLoading: false
        }
    },
    created () {
        // EventBus.$emit('sideNavClick', 'view')
        this.$store.dispatch('getCurrentJob', {id: this.$route.params.id})
        this.$store.dispatch('getJobRuns', {id: this.$route.params.id})
    },
    mounted () {
        this.$store.dispatch('getCurrentJob', {id: this.$route.params.id})
        this.$store.dispatch('getJobRuns', {id: this.$route.params.id})
    },
    methods: {
        clickRow () {

        },
        clickRun (row, event, column) {
            this.$router.push(`/run/${row.id}`)
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
        toggleReadonly () {
            this.readonly = !this.readonly
        },
        cancel () {
            this.readonly = true
        },
        update () {
            this.updateLoading = true
            var newForm = Job.getCreateView(this.form)
            this.$store.dispatch('updateJob', {id: this.form.id, data: this.form})
            .then(() => {
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
                
            }).catch(() => {
                this.updateLoading = false
                this.$message({
                    message: 'Job Not Updated',
                    type: 'error'
                })
            })
        }
    },
    mounted () {
        this.$store.dispatch('getCurrentJob', this.$route.params.id)
    },
    computed: {
        ...mapGetters({
            form: 'currentJob',
            state: 'currentJobState',
            runs: 'currentJobRuns',
            runState: 'currentJobRunsState',
        }),
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
                schedule: this.form.schedule,
                'no of contacts': this.form.contacts.length,
                date: this.form.created_at,
                time: this.form.created_at,
            }
            return nForm
        },
        contacts: {
            get () {
                return this.form.contacts.map(el => {
                    el.email = Utils.present(el.email) ? el.email : '-'
                    return el
                })
            },
            set (value) {
                this.form.contacts = value
            }
        },
        data2 () {
            var nForm = {
                'retry limit': this.form.retry_limit ? this.form.retry_limit : '-',
                'last run': this.form.last_run  ? this.form.last_run : 'No previous run',
                'next run': this.form.next_run  ? this.form.next_run : 'No run scheduled',
                active: this.form.active ? this.form.active : false
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
