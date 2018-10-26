<template>
    <div class="h-inherit">
        <canvas class="line-chart" ref="line"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js'
export default {
  name: 'LineChart',
  props: ['data', 'labels'],
  mounted () {
    var line = this.$refs.line
    var ctxl = line.getContext('2d')
    // ctxl.height= 76
    var myChartLine = new Chart(ctxl, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: '#E8EBF8',
          pointBackgroundColor: 'rgba(255,255,255,1)',
          pointRadius: '0',
          borderColor: '#586ADA',
          borderWidth: 2,
          lineTension: 0
        }]
      },
      options: {
        legend: {
          display: false,
        },
        layout: {
          padding: {
            left: 25  //set that fits the best
          }
        },
        maintainAspectRatio: false,
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
          display: false,
          ticks: {
            beginAtZero: false,
            display: false
          },
          gridLines: {
            display: false
          }
        }]
      },
      tooltips: {
        // Disable the on-canvas tooltip
        enabled: false,

        custom: function(tooltipModel) {
            // Tooltip Element
          var tooltipEl = document.getElementById('chartjs-tooltip')

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div')
            tooltipEl.id = 'chartjs-tooltip'
            tooltipEl.innerHTML = "<table></table>"
            document.body.appendChild(tooltipEl)
          }

            // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0
            return
          }

            // Set caret Position
          tooltipEl.classList.remove('above', 'below', 'no-transform')
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign)
          } else {
            tooltipEl.classList.add('no-transform')
          }

          function getBody(bodyItem) {
            return bodyItem.lines
          }

            // Set Text
          if (tooltipModel.body) {
                var titleLines = tooltipModel.title || []
                var bodyLines = tooltipModel.body.map(getBody)

                var innerHtml = '<thead>';

                titleLines.forEach(function(title) {
                    innerHtml += '<tr><th>' + title + '</th></tr>'
                })
                innerHtml += '</thead><tbody>'

                bodyLines.forEach(function(body, i) {
                    var colors = tooltipModel.labelColors[i]
                    var style = 'background:' + colors.backgroundColor
                    style += '; border-color:' + colors.borderColor
                    style += '; border-width: 2px'
                    var span = '<span style="' + style + '"></span>'
                    innerHtml += '<tr><td>' + span + body + '</td></tr>'
                });
                innerHtml += '</tbody>'

                var tableRoot = tooltipEl.querySelector('table')
                tableRoot.innerHTML = innerHtml
          }

            // `this` will be the overall tooltip
            var position = this._chart.canvas.getBoundingClientRect()

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipEl.style.pointerEvents = 'none'
          }
        }
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.h-inherit{
    height: inherit;
    height: 44px;
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

