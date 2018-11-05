<template>
    <el-dropdown ref="messageDrop" placement="bottom-start" trigger="click" :hide-on-click="false">
        <el-button class="z-depth-button bold-600 el-dropdown-link s-13 open-sans mini-button" type="text"><i class="filter icon"></i> Filter </el-button>
        <!-- <span v-if="count != 0" class="border-left pl-6">2</span> -->
        <el-dropdown-menu class="filter-dropdown" slot="dropdown">
            <div class="dropdown-header flex justify-content-between align-items-center">
                <el-button size="mini" @click="resetFilters" class="s-13 open-sans filter-button b-0">Clear</el-button>
                <p class="p-0 m-0 blue-text">Filters</p>
                <el-button size="mini" @click="createFilters" type="primary" class="s-13 open-sans filter-button b-0">Done</el-button>
            </div>
            <el-dropdown-item>
                <el-checkbox class="mr-10" v-model="date"></el-checkbox> Date</el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="date">
                    <div class="flex align-items-center">
                        <el-date-picker class="filter-input blue-text mr-10"
                            v-model="filters.from"
                            type="date"
                            placeholder="From.."
                            @change="keepVisible"
                            @focus="keepVisible"
                            @blur="keepVisible"
                            value-format="yyyy-MM-dd"
                            format="MMM dd, yyyy">
                            </el-date-picker>
                        <el-date-picker class="filter-input"
                            v-model="filters.to"
                            type="date"
                            @change="keepVisible"
                            @focus="keepVisible"
                            @blur="keepVisible"
                            placeholder="To.."
                            value-format="yyyy-MM-dd"
                            format="MMM dd, yyyy">
                            </el-date-picker>
                    </div>
                </div>
            </el-collapse-transition>
            <el-dropdown-item v-if="showStatus" divided><el-checkbox class="mr-10" v-model="status"></el-checkbox> Status</el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="status">
                    <el-select size="mini" v-model="filters.statuses" @remove-tag="removeAll" @change="statusClick" multiple collapse-tags placeholder="Select Status">
                        <el-option
                        v-for="item in stati"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-transition>
            <el-dropdown-item divided><el-checkbox class="mr-10" v-model="type"></el-checkbox> Payment Type</el-dropdown-item>
            <el-collapse-transition>
                <div class="filter-bg" v-show="type">
                    <el-select size="mini" v-model="filters.payment_types" @remove-tag="removeAllTypes" @change="typeClick" multiple collapse-tags placeholder="Select Type">
                        <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-collapse-transition>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import EventBus from '../../event-bus.js'
export default {
    name: 'FilterComponent',
    props: ['filterType', 'dispatch'],
    data () {
        return {
            date: false,
            status: false,
            type: false,
            stati: [
                // {label: 'All', value: 'all'},
                {label: 'Success', value: 'succeeded'},
                {label: 'Pending', value: 'pending'},
                {label: 'Failed', value: 'failed'}
            ],
            all: ['success', 'pending', 'failed'],
            types: [
                // {label: 'All', value: 'all'},
                {label: 'Card', value: 'card'},
                {label: 'Wallet', value: 'wallet'},
                {label: 'Bank', value: 'bank'}
            ],
            filters: {
                to: '',
                from: '',
                statuses: [],
                payment_types: []
            },
            count: 0
        }
    },
    methods: {
        createFilters () {
            this.$refs.messageDrop.hide()
            this.count = this.size(this.filterType)
            this.$store.dispatch(this.dispatch, this.filters)
            // if (this.filterType === 'queue') {
            //     // this.filters.statuses = 'queued'
            //     this.$store.dispatch('setQueueFilters', this.filters)
            // } else if (this.filterType === 'pending') {
            //     this.$store.dispatch('setPendingFilters', this.filters)
            // } else if (this.filterType === 'payouts') {
            //     this.$store.dispatch('setPayoutsFilters', this.filters)
            // } else {
            //     this.$store.dispatch('setTransactionsFilters', this.filters)
            // }
            // .then(() => {
            //     this.$store.dispatch('getTransactions', {page: 1})
            // })
        },
        size (obj) {
            var size = 0, key
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++
            }
            return size
        },
        resetFilters () {
            this.filters = {
                to: '',
                from: '',
                statuses: [],
                payment_types: []
            }
            this.date = false
            this.status = false
            this.type = false
            this.count = 0
            this.createFilters()
        },
        keepVisible () {
            console.log('now')
            this.$refs.messageDrop.show()
        },
        statusClick (val) {
            this.keepVisible()
            if (val[0] === 'all') {
                var all = ['succeeded', 'pending', 'failed']
                all.forEach(element => {
                    this.filters.statuses.push(element)
                })
            }
        },
        removeAll (val) {
            // if (val === 'all') {
            //     this.filters.statuses = []
            // }
        },
        typeClick (val) {
            this.$refs.messageDrop.show()
            if (val[0] === 'all') {
                var all = ['card', 'wallet', 'bank']
                all.forEach(element => {
                    this.filters.payment_types.push(element)
                })
            }
        },
        removeAllTypes (val) {
            // if (val === 'all') {
            //     this.filters.payment_types = []
            // }
        }
    },
    mounted () {
        EventBus.$on('blur', this.keepVisible)
        EventBus.$on('focus', this.keepVisible)
    },
    computed: {
        showStatus () {
            return this.filterType === 'payment' || this.filterType === 'payouts'
        }
    }
}
</script>

<style lang="scss" scoped>
.mini-button{
    // height: 30px;
    line-height: 1em;
    // padding: 0 10px;
    padding: 7px 10px !important;
    color: rgba(0,0,0,.6);

    &:hover{
        color: rgba(0,0,0,.8);
    }

    span{
        font-weight: 600
    }
    i{
        margin-right: 5px;
    }
}
.filter-bg{
    background: #F7FAFC;
    padding: 12px;
}
.dropdown-header{
    background: #F7FAFC;
    height: 37px;
    padding: 0 6px;
    border-bottom: 1px solid #e3e8ee;

    .filter-button{
        // height: 24px;
        padding: 4px 8px;
        display: flex;
        justify-content: center;
        font-size: 13px;
        box-shadow: 0 0 0 1px rgba(43,45,80,.1), 0 2px 5px 0 rgba(43,45,80,.08), 0 1px 1.5px 0 rgba(0,0,0,.07), 0 1px 2px 0 rgba(0,0,0,.08)
    }
}
.mr-10{
    margin-right: 10px
}
</style>

