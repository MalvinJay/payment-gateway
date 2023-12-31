import { Line } from 'vue-chartjs'
// import the component - chart you need

export default Line.extend({
  props: ['labels', 'data'],
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'News reports',
          backgroundColor: '#3c8dbc',
          data: [12, 20, 12, 18, 10, 6, 9, 32, 29, 19, 12, 11]
        }
      ]
    })
  }
})
