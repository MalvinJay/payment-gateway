<template>
    <div class="h-inherit">
        <canvas class="time-chart" ref="time"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'TimeLineChart',
  props: ['dashboard'],
  mounted () {
    var time = this.$refs.time
    var ctx = time.getContext('2d')
    const data = {
        labels: this.labels,
        datasets: [{
            labels: this.labels,
            data: this.data,
            backgroundColor: 'transparent',
            borderColor: '#E8EBF8',
            borderWidth: 1,
            pointRadius: 0,
            pointHitRadius: 20,
            lineTension: 0
        }]
    }
    Chart.Tooltip.positioners.myCustomPosition = function(unused, position) {
        return { x: position.x, y: 230 }; // HARDCODING VALUES
    }
    const options = {
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
                    beginAtZero: false,
                    display: false
                },
                gridLines: {
                    display: true,
                    color: "rgba(255, 255, 255, 0.1)",
                    drawBorder: false,
                    tickMarkLength: 0
                }
            }],
            gridLines: {
                color: "rgba(255, 255, 255, 0.1)",
                drawTicks: false,
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
                bottom: 20
            }
        }
    }
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    })
    myLineChart.resize()
  },
  computed: {
    labels () {
        return this.dashboard.map((el) => {
            return el.label
        }) 
    },
    data () {
        return this.dashboard.map((el) => {
           return `${el.count}`
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.h-inherit{
    height: inherit;
    height: 88px;
}

#canvas-holder {
  width: 100%;
  margin-top: 50px;
  text-align: center;
}

#chartjs-tooltip {
  opacity: 1;
  position: absolute;
  background: rgba(0, 0, 0, .7);
  color: white;
  border-radius: 3px;
  -webkit-transition: all .1s ease;
  transition: all .1s ease;
  pointer-events: none;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}

.chartjs-tooltip-key {
  display: inline-block;
  width: 10px;
  height: 10px;
}

</style>

