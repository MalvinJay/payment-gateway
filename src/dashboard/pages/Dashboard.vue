<template>
    <div v-loading="pageLoading">
        <!-- <div class="center h-80" v-if="error">
            <div class="center flex-column">
                <p class="m-0 p-0">Unable to load this page</p>
                <el-button @click.prevent="handleError" icon="sync icon" type="text">Retry</el-button>
            </div>
        </div>
        <div v-else> -->
            <!-- Blue div -->
            <dashboard-header></dashboard-header>
            <!-- Summary Div -->
            <el-card class="b-0 analytics my-2">
                <div class="flex flex-column analytics-div">
                    <p class="bold-600 blue-text pb-5 m-0">Analytics</p>
                    <div class="flex justify-content-between">
                        <div style="height: 30px;" class="flex align-items-center">
                            <!-- time interval -->
                            <el-radio-group @change="handleChange" v-model="form.time_interval" size="mini" class="dashboard-checkboxes mr-6 z-depth-button border-rounded">
                                <el-radio-button v-for="duration in durations" :label="duration.value" :key="duration.label">{{duration.label}}</el-radio-button>
                            </el-radio-group>
                            <el-radio-group @change="handleChange" v-model="form.payment_types" size="mini" class="dashboard-checkboxes text-capitalize mr-6 z-depth-button border-rounded">
                                <el-radio-button v-for="duration in payment" :label="duration" :key="duration">{{duration}}</el-radio-button>
                            </el-radio-group>
                            <el-radio-group @change="handleChange" v-model="form.statuses" size="mini" class="dashboard-checkboxes text-capitalize mr-6 z-depth-button border-rounded">
                                <el-radio-button v-for="duration in status" :label="duration" :key="duration">{{duration}}</el-radio-button>
                            </el-radio-group>
                            <!-- <div class="w-200 mr-6 z-depth-button border-rounded">
                                <el-date-picker class="date-input blue-text"
                                    v-model="form.from"
                                    type="date"
                                    placeholder="From.."
                                    default-value="2010-10-01"
                                    @change="changeDate"
                                    format="MMM dd, yyyy">
                                    </el-date-picker>
                                <i class="arrow right icon"></i>
                                <el-date-picker class="date-input"
                                    v-model="form.to"
                                    type="date"
                                    @change="changeDate"
                                    placeholder="To.."
                                    default-value="2010-10-01"
                                    format="MMM dd, yyyy">
                                </el-date-picker>
                            </div> -->
                            <!-- <div>
                                <el-button class="z-depth-button bold-600 s-13 open-sans blue-button mini-button" type="text">Daily</el-button>
                            </div> -->
                        </div>
                        <div>
                            <!-- <el-button @click="editAnalytics" class="z-depth-button bold-600 s-13 open-sans blue-button mini-button" type="text"><i class="cog icon "></i> Customize</el-button> -->
                            <el-button @click="clearDashboard" class="z-depth-button bold-600 s-13 open-sans blue-button mini-button" type="text"><i class="cog icon "></i> Clear</el-button>
                        </div>
                    </div>
                </div>
                <div>
                    <div v-if="graphError" class="h-100">
                        <div class="center flex-column">
                            <p class="m-0 p-0">Unable to load this graph</p>
                            <el-button @click.prevent="fetchGraph" icon="sync icon" type="text">Retry</el-button>
                        </div>
                    </div>
                    <div v-else v-loading="graphLoading">
                        <analytics-div v-for="(item, index) in options" :key="index" :form="item"></analytics-div>
                    </div>
                </div>
            </el-card>
        <!-- </div> -->
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import DashboardHeader from '../components/DashboardHeader'
import AnalyticsDiv from '../components/AnalyticsDiv'
import { mapGetters } from 'vuex'
import Utils from '../../utils/services'

export default {
  name: 'Dashboard',
  components: {
    DashboardHeader,
    AnalyticsDiv
  },
  data () {
    return {
      durations: [
        {label: '1d', value: 'day'},
        {label: '1w', value: 'week'},
        // {label: '1y', value: 'yearly'},
        {label: 'Mtd', value: 'month'},
        {label: 'Qtd', value: 'quarter'},
        {label: 'Ytd', value: 'year'}
      ],
      edit: false,
      pickerOptions: {
        disabledDate(time) {
            return time.getTime() > Date.now();
        },
        shortcuts: [{
        text: 'Today',
        onClick(picker) {
            picker.$emit('pick', new Date());
        }
        }, {
        text: 'Yesterday',
        onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
        }
        }, {
        text: 'A week ago',
        onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
        }
        }]
      },
      currentDate: '',
      payment: ['wallet', 'card','bank'],
      status: ['succeeded', 'pending','failed'],
      statue: [],
      cash: [],
      form: {
        time_interval: 'month',
        payment_types: [],
        statuses: []
      },
      value2: null,
      date: '',
      date1: '',
      data: [1, 4],
      labels: ['Red', 'Blue'],
      data1: [0, 0, 0, 0, 0],
      labels1: [0, 0, 0, 0, 0],
      chartOptions: {
        scales: {
            yAxes: [{
                display: false,
                ticks: {
                    beginAtZero: false,
                    display: false
                },
                    // gridLines: {
                    //     display: false
                    // }
                }],
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: false,
                    display: false
                },
                gridLines: {
                    color: "rgba(128, 142, 227, 0.1)",
                    drawBorder: false,
                    tickMarkLength: 0
                }
            }],
            gridLines: {
                display: true,
                color: "rgba(255, 255, 255, 0.1)",
                drawBorder: false,
                tickMarkLength: 0
            }
        },
        legend: {
        display: false,
        },
        tooltips: {
            // callbacks: {
            //     label: function(tooltipItem, data) {
            //         var label = data.datasets[tooltipItem.datasetIndex].label[tooltipItem.index] || ''
            //         if (label) {
            //             label += ': '
            //         }
            //         label += Math.round(tooltipItem.yLabel * 100) / 100
            //         // var labeldiv = `<div class="flex justify-content-between">${label}</div>`
            //         return label
            //     }
            // },
            backgroundColor: 'white',
            titleFontColor: 'black',
            footerFontColor: 'black',
            bodyFontColor: 'black',
            borderColor: '#dcdfe6',
            borderWidth: 1,
            displayColors: false
        },
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 20,
                bottom: 20
            }
        }
      }
    }
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'dashboard')
    // EventBus.$emit('updateTimeGraph')
  },
  methods: {
    handleChange () {
      this.$store.dispatch('setDashboardFilters', this.form)
      .then(() => {
        EventBus.$emit('updateGraph')
      })
    },
    editAnalytics () {
        this.edit = true
    },
    clearDashboard () {
        var form = {
            time_interval: 'month',
            payment_types: [],
            statuses: []
        }
        this.form = form
        this.handleChange()
    },
    changeDate (val) {

    },
    handleError () {
        var time = {
            time_interval: 'month'
        }
        this.$store.dispatch('setDashboardFilters', time)
        .then((response) => {
            console.log('header', response.data)
            console.log('header data', response)
            EventBus.$emit('updateGraph')
        })
        this.$store.dispatch('getTodayGraph', {cache: false})
        .then(() => {
            EventBus.$emit('updateTimeGraph')
        })
    },
    fetchToday () {
        this.$store.dispatch('getTodayGraph', {cache: false})
        .then(() => {
            EventBus.$emit('updateGraph')
        })
    },
    fetchGraph () {
        var time = {
            time_interval: 'month'
        }
        this.$store.dispatch('setDashboardFilters', time)
        .then((response) => {
            EventBus.$emit('updateGraph')
        })
    }
  },
  computed: {
    ...mapGetters({
        dashboard: 'dashboard',
        state: 'dashboardState',
        user: 'user',
        today: 'today',
        sum: 'todaySum',
        todayState: 'todayState',
        pageLoading: 'pageLoading'
    }),
    options () {
        var analytics = [
            {title: 'Gross Volume', id: 'line-chart', volume: this.grossVolume, chartData: this.chartData, chartOptions: this.chartOptions, popover: false},
            {title: 'Receipts', id: 'line-chart1', volume: this.depositVolume, chartData: this.chartDataDep, chartOptions: this.chartOptions, popover: true,
            popoverContent: 'All receipts recorded within the specified filters'},
            {title: 'Payments', id: 'line-chart2', volume: this.withVolume, chartData: this.chartDataWith, chartOptions: this.chartOptions, popover: true,
            popoverContent: 'All payments recorded within the specified filters'}
        ]
        return analytics
    },
    error () {
        return this.state === 'ERROR'
    },
    balance () {
        return this.user.available_balance
    },
    grossVolume () {
        var gross = this.dashboard ? Utils.sum(this.dashboard.map(el => el.count_sum)) : 0
        return gross
    },
    withVolume () {
        var gross = this.dashboard ? Utils.sum(this.dashboard.map(el => el.withdrawal_count_sum)) : 0
        return gross
    },
    depositVolume () {
        var gross = this.dashboard ? Utils.sum(this.dashboard.map(el => el.deposit_count_sum)) : 0
        return gross
    },
    chartData () {
        var count = ''
        return {
            labels: this.days,
            datasets: [{
                // label: this.labels,
                data: this.count,
                backgroundColor: '#E8EBF8',
                borderColor: '#808EE3',
                borderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 20,
                lineTension: 0
            }]
        }
    },
    chartDataDep () {
        var count = ''
        return {
            labels: this.days,
            datasets: [{
                // label: this.labels,
                data: this.depositCount,
                backgroundColor: '#E8EBF8',
                borderColor: '#808EE3',
                borderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 20,
                lineTension: 0
            }]
        }
    },
    chartDataWith () {
        var count = ''
        return {
            labels: this.days,
            datasets: [{
                // label: this.labels,
                data: this.withCount,
                backgroundColor: '#E8EBF8',
                borderColor: '#808EE3',
                borderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 20,
                lineTension: 0
            }]
        }
    },
    todayLoading () {
        return this.todayState === 'LOADING'
    },
    todayError () {
        return this.todayState === 'ERROR'
    },
    graphLoading () {
        return this.state === 'LOADING'
    },
    graphError () {
        return this.state === 'ERROR'
    },
    days () {
        return this.dashboard.map((el) => {
            return el.label
        })
    },
    count () {
        return this.dashboard.map((el) => {
           return `${el.count_sum}`
        })
    },
    depositCount () {
        return this.dashboard.map((el) => {
           return `${el.deposit_count_sum}`
        })
    },
    withCount () {
        return this.dashboard.map((el) => {
           return `${el.withdrawal_count_sum}`
        })
    },
    sData () {
        return this.dashboard.map((el) => {
          var way = {
            x: el.count,
            y: el.day
          }
          return way
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.blue-banner{
    color: white;
    // font-weight: 500;
    font-size: 18px;
    .el-card__body{
        padding: 10px 20px !important;
    }
}
.blue-graph{
    height: 70px;
}
.little-money{
    font-size: 12px;
}
.transparent-input{
    width: 100px;
}
.date-input{
    width: calc((200px/2) - 17px )
}
.w-200{
    width: 200px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    i{
        margin-top: -3px;
    }
}
.mini-button{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;

    span{
        font-weight: 600
    }
    i{
        margin-right: 5px;
    }
}
.analytics{
    .el-card__body{
        padding: 0 !important;
    }
    .analytics-div{
        height: 100px;
        padding: 20px;
    }
}
.h-76{
    height: 76px !important;
}
</style>
