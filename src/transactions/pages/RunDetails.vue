<template>
    <div v-loading="loadingPage">
        <!-- Run Card -->
        <el-card class="card-0">
            <div class="flex flex-column p-20">
                <div class="flex justify-content-between align-items-baseline mb-1">
                   <div class="flex align-items-baseline">
                       <p class="blue-text s-24 m-0 p-0 bold-600">{{form.name}}</p>
                       <!-- <p class="text-uppercase blue-text s-14 m-0 p-0 ml-1">{{form.currency}}</p> -->
                   </div>
                   <div>
                       <p class="text-uppercase s-12 bold-600 m-0 p-0">{{header}}</p>
                   </div>
                </div>
                <div>
                    <el-button v-if="status === 'failed'" size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="undo icon"></i> Refund</el-button>
                    <el-button size="mini" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" plain><i class="plus icon"></i> Note</el-button>
                </div>
            </div>
            <!-- :class="[{success ? 'green': 'gray' }]" -->
            <div class="border-top px-20 py-10">
                <div class="flex">
                    <div>
                        <i class="user s-12 icon green" ></i>
                    </div>
                    <div class="flex flex-column ml-1">
                        <p class="light mb-1 s-13">{{header}} was created</p>
                        <p class="light mb-1 s-12 gray">{{form.created_at | moment("MMM Do, HH:mm A")}}</p>
                    </div>
                </div>
            </div>
        </el-card>
        <!-- Run Detail Card -->
        <el-card class="my-2">
            <div slot="header">
                <div class="flex justify-content-between">
                    <span class="blue-text bold-600 s-16">{{header}} details</span>
                    <el-button @click="toggleReadonly" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" plain icon="pencil alternate icon">Update Details</el-button>
                </div>
            </div>
            <div>
                <!-- If there's no data hasNoData => computed property -->
                <div v-if="hasNoData" class="center h-80">
                    {{noData}}
                </div>
                <!-- If there's data -->
                <div v-if="!hasNoData">
                    <div class="flex">
                        <!-- first half -->
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
                                        <el-input style="width: 80%" size="mini" v-model="data[key]"></el-input>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- second half -->
                        <div class="w-50">
                            <el-row  v-for="(value, key, index) in data2" :key="index" class="mb-1">
                                <el-col :span="8">
                                    <p class="m-0 text-capitalize lightgray s-14">{{key}}</p>
                                </el-col>
                                <el-col :span="6">
                                    <p v-if="key === 'date'" class="s-13 mono">{{value | moment("MMM Do, YYYY")}}</p>
                                    <p v-else class="s-13 mono">{{value}}</p>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!readonly" class="flex justify-content-end">
                <el-button @click="cancel" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" plain>Cancel</el-button>
                <el-button @click="update" class="z-depth-button bold-600 s-13 open-sans mini-button b-0" size="mini" type="primary">Save</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '../../event-bus.js'
export default {
    name: 'RunDetails',
    data () {
        return {
            status: 'failed',
            edit: false,
            readonly: true,
            remarks: '',
            page: this.$route.path
        }
    },
    watch: {

    },
    methods: {
        toggleReadonly () {
            this.readonly = !this.readonly
        },
        cancel () {
            this.readonly = true
        },
        update() {
        
        },
    },
    created () {
        // EventBus.$emit('sideNavClick', 'payments')
    },
    mounted () {
        EventBus.$emit('sideNavClick', 'payments')
        this.$store.dispatch('getCurrentRun', this.$route.params.id)
    },
    computed: {
        ...mapGetters({
            form: 'currentContact',
            state: 'currentContactState'
        }),
        loadingPage () {
            return this.state === 'LOADING'
        },
        success () {
            return this.status === 'paid'
        },
        data () {
            var symbol = '\u20B5'
            if (this.form.currency === 'GHs') {
               symbol = '\u20B5'
            }
            var nForm = {
                name: this.form.name,
                'phone number': this.form.account_no,
                email: this.form.email ? this.form.email : '-',
                type: this.form.type ? this.form.type : '-',
                bank: this.form.bank,
                date: this.form.created_at,
                time: this.form.created_at,
                description: this.form.remarks ? this.form.remarks : '-'
            }
            return nForm
        },
        data2 () {
            var nForm = {
                'Send emails to': this.form.email ? this.form.email : 'Not Provided',
                'Address': this.form.address ? this.form.address : 'Not Provided',
                'Phone Number': this.form.account_no ? this.form.account_no : 'Not Provided'
            }
            return nForm
        },
        hasNoData () {
            return typeof this.form === 'undefined'
        },
        header () {
            return 'Run'
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
