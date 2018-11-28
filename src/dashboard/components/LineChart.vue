<template>
    <div class="h-inherit">
        <canvas :id="id" class="line-chart" ref="line"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js'
import EventBus from '../../event-bus.js'
export default {
  name: 'LineChart',
  props: ['data', 'labels', 'id'],
  data () {
    return {
       graph: {}
    }
  },
  methods: {
    changeGraph (myChart) {
      myChart.config.data = this.data
      
      myChart.update()
    },
    destroyGraph (myChart) {
        myChart.destroy()
    }
  },
  mounted () {
    EventBus.$on('updateGraph', () => {
        this.changeGraph(myLineChart)
    })
    var line = document.getElementById(this.id)
    
    var myLineChart = new Chart(line, {
        type: 'line',
        data: this.data,
        options: this.labels
    })
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

