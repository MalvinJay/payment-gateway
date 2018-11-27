<template>
    <div>
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
                        <!-- <p class="p-0 m-0 bold-600 little-money" style="padding-left: 16px">{{ sum | money }}</p> -->
                    </div>
                </div>
            </div>
            <div class="blue-graph">
                <div class="blue-graph" v-if="todayError">
                    <div class="center flex-column">
                        <p class="m-0 p-0 s-12">Unable to load this graph</p>
                        <el-button @click.prevent="fetchToday" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div class="blue-graph" v-else v-loading="todayLoading">
                    <!-- <time-line-chart :dashboard="today" :data="count" :labels="days"></time-line-chart> -->
                    <line-chart id="time-line-chart" :data="chartData" :labels="chartOptions"></line-chart>
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
  name: 'DashboardHeader',
  data () {
    return {
        chartOptions: {
            scales: {
                yAxes: [{
                    display: false,
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        display: false
                    }
                    }],
                xAxes: [{
                    // display: false,
                    // type: 'time',
                    // time: {
                    //     unit: 'day',
                    //     min: 1,
                    //     max: 31,
                    //     tooltipFormat: 'Do'
                    // },
                    ticks: {
                        // beginAtZero: false,
                        // display: false,
                        fontColor: 'white',
                        lineHeight: 2,
                        padding: 2,
                        callback: function(value, index, values) {
                            switch (value) {
                                case '0:00':
                                    return value
                                    break
                                case '23:00':
                                    return value
                                    break
                                default:
                                    return ''
                            }
                        }
                    },
                    gridLines: {
                        display: true,
                        color: "rgba(255, 255, 255, 0.1)",
                        drawBorder: true,
                        tickMarkLength: 0
                    }
                }],
                gridLines: {
                    color: "rgba(255, 255, 255, 0.1)",
                    drawTicks: true,
                    drawBorder: false,
                    // tickMarkLength: 40,
                }
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || ''

                        if (label) {
                            label += ': ';
                        }
                        tooltipItem.width = 500
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        return label
                    }
                },
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
                    left: 5,
                    right: 5,
                    top: 20,
                    bottom: 10
                }
            }
        },
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
        currentDate: ''
    }
  },
  computed: {
    ...mapGetters({
        user: 'user',
        today: 'today',
        sum: 'todaySum',
        todayState: 'todayState'
    }),
    balance () {
        return this.user.available_balance
    },
    chartData () {
        var count = ''
        return {
            labels: this.days,
            datasets: [{
                // label: this.labels,
                data: this.count,
                borderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                borderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 20,
                lineTension: 0,
                fill: false
            }]
        }
    },
    todayLoading () {
        return this.todayState === 'LOADING'
    },
    todayError () {
        return this.todayState === 'ERROR'
    },
    days () {
        return this.today.map((el) => {
            return el.label
        })
    },
    count () {
        return this.today.map((el) => {
           return `${el.count}`
        })
    },
    sData () {
        return this.today.map((el) => {
          var way = {
            x: el.count,
            y: el.day
          }
          return way
        })
    }
  },
  methods: {
    fetchToday () {
        this.$store.dispatch('getTodayGraph', {cache: false})
        .then(() => {
            EventBus.$emit('updateGraph')
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
    width: 80px;
}
</style>

