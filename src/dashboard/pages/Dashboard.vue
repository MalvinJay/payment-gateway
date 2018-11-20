<template>
    <div v-loading="pageLoading">
        <!-- Blue div -->
        <el-card class="blue-pure b-0 blue-banner">
            <div class="flex justify-content-between">
                <div class="flex flex-column">
                    <div class="flex">
                        <p class="p-0 m-0">Account Balance</p>
                        <p class="p-0 m-0 bold-600" style="padding-left: 16px">{{ balance | money }}</p>
                    </div>
                    <div class="flex align-items-center">
                        <el-date-picker class="transparent-input"
                            v-model="currentDate"
                            type="date"
                            :picker-options="pickerOptions"
                            placeholder="Today">
                            </el-date-picker>
                        <p class="p-0 m-0 bold-600 little-money" style="padding-left: 16px">{{ sum | money }}</p>
                    </div>
                </div>
            </div>
            <div class="blue-graph">
                <time-line-chart :dashboard="today" :data="count" :labels="days"></time-line-chart>
            </div>
        </el-card>
        <!-- Summary Div -->
        <el-card class="b-0 analytics my-2">
            <div class="flex flex-column analytics-div">
                <p class="bold-600 blue-text pb-5 m-0">Analytics</p>
                <div class="flex">
                    <div style="height: 30px;" class="flex align-items-center">
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
                        <!-- <el-button class="z-depth-button bold-600 s-13 open-sans blue-button mini-button" type="text"><i class="cog icon "></i> Customize</el-button> -->
                    </div>
                </div>
            </div>
            <div class="light-background analytics-div h-76 border-top flex justify-content-between align-items-center">
                <div class="flex flex-column justify-content-center">
                    <p class="grey-text m-0 pb-5">Gross Volume</p>
                    <p class="light-blue-text s-16 bold-600">{{grossVolume | money}}</p>
                </div>
                <div style="height: 88px" class="w-50">
                    <line-chart id="line-chart" :data="chartData" :labels="chartOptions"></line-chart>
                </div>
            </div>
            <div class="light-background analytics-div h-76 border-top flex justify-content-between align-items-center">
                <div class="flex flex-column justify-content-center">
                    <div class="grey-text m-0 p-0 flex align-items-center">
                        <p class="m-0 p-0 mr-6"> Payments </p>
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            content="Lorem">
                            <el-button class="p-0" slot="reference" icon="info circle icon" type="text"></el-button>
                        </el-popover>
                    </div>
                    <p class="light-blue-text s-16 bold-600">{{depositVolume | money}}</p>
                </div>
                <div style="height: 88px" class="w-50">
                    <line-chart id="deposit" :data="chartDataDep" :labels="chartOptions"></line-chart>
                </div>
            </div>
            <div class="light-background analytics-div h-76 border-top flex justify-content-between align-items-center">
                <div class="flex flex-column justify-content-center">
                    <div class="grey-text m-0 p-0 flex align-items-center">
                        <p class="m-0 p-0 mr-6"> Payouts </p>
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            content="Lorem">
                            <el-button class="p-0" slot="reference" icon="info circle icon" type="text"></el-button>
                        </el-popover>
                    </div>
                    <p class="light-blue-text s-16 bold-600">{{withVolume | money}}</p>
                </div>
                <div style="height: 88px" class="w-50">
                    <line-chart id="with" :data="chartDataWith" :labels="chartOptions"></line-chart>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Utils from '../../utils/services'

export default {
  name: 'Dashboard',
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
      status: ['Succeeded', 'pending','failed'],
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
    handleChange (val) {
      this.$store.dispatch('setDashboardFilters', this.form)
      .then(() => {
        EventBus.$emit('updateGraph')
      })
    },
    changeDate (val) {

    }
  },
  computed: {
    ...mapGetters({
        dashboard: 'dashboard',
        state: 'dashboardState',
        user: 'user',
        today: 'today',
        sum: 'todaySum'
    }),
    balance () {
        return this.user.available_balance
    },
    grossVolume () {
        var gross = Utils.sum(this.dashboard.map(el => el.count))
        return gross
    },
    withVolume () {
        var gross = Utils.sum(this.dashboard.map(el => el.withdrawal_count))
        return gross
    },
    depositVolume () {
        var gross = Utils.sum(this.dashboard.map(el => el.deposit_count))
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
    pageLoading () {
        return this.state === 'LOADING'
    },
    days () {
        return this.dashboard.map((el) => {
            return el.label
        })
    },
    count () {
        return this.dashboard.map((el) => {
           return `${el.count}`
        })
    },
    depositCount () {
        return this.dashboard.map((el) => {
           return `${el.deposit_count}`
        })
    },
    withCount () {
        return this.dashboard.map((el) => {
           return `${el.withdrawal_count}`
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
