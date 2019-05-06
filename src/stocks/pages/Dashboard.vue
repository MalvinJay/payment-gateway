<template>
  <div class="dash h-auto">
    <div class="content mx-3">
      <div class="col-md-12 p-0">
        <div class="row d-flex">
          <div class="col-md-3" style="width: 25%">
            <div class="card card-stats card-raised border-10">
              <div class="card-body">
            <div class="statistics py-4">
              <div class="info">
                <div class="icon icon-primary">
                  <i class="now-ui-icons transportation_bus-front-12"></i>
                </div>
                <h3 class="info-title">
                  <span>20</span>
                </h3>
                <h6 class="stats-title">PRODUCTS</h6>
              </div>
            </div>
              </div>
            </div>
          </div>
          <div class="col-md-3" style="width: 25%">
            <div class="card card-stats card-raised border-10">
              <div class="card-body">
                <div class="statistics py-4">
                  <div class="info">
                    <div class="icon icon-primary">
                      <i class="now-ui-icons objects_support-17"></i>
                    </div>
                    <h3 class="info-title">
                      <span>15</span>
                    </h3>
                    <h6 class="stats-title">PURCHASE</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3" style="width: 25%">
            <div class="card card-stats card-raised border-10">
              <div class="card-body">
                <div class="statistics py-4">
                  <div class="info">
                    <div class="icon icon-primary">
                      <i class="now-ui-icons shopping_delivery-fast"></i>
                    </div>
                    <h3 class="info-title">
                      <span>76</span>
                    </h3>
                    <h6 class="stats-title">SUCCESSFUL</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3" style="width: 25%">
            <div class="card card-stats card-raised border-10">
              <div class="card-body">
                <div class="statistics py-4">
                  <div class="info">
                    <div class="icon icon-primary">
                      <i class="now-ui-icons business_money-coins"></i>
                    </div>
                    <h3 class="info-title">
                      <small style="font-size: 80%">$</small>
                      <span>3521</span>
                    </h3>
                    <h6 class="stats-title">OTHER</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "@/event-bus.js";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      chartData: {
        labels: [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        ],
        datasets: [
          {
            data: [50, 150, 100, 190, 130, 90, 150, 160, 120, 140, 190, 95],
            // data: [0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0],
            fill: true,
            borderWidth: 2,
            lineTension: 0,
            pointRadius: 5,
            pointHitRadius: 5,
            pointHoverHitRadius: 6,
            pointHoverRadius: 6,
            pointHoverBorderColor: '#4e78fe',
            pointBorderColor: "#4e78fe",
            pointBackgroundColor: "#fff",
            borderColor: "#4e78fe"
            // pointHoverBorderColor: '#fa8964',
            // pointBorderColor: "#fa8964",
            // pointBackgroundColor: "#fff",
            // borderColor: "#fa8964"
          }
        ]
      },
      chartOptions: {
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: true,
                display: true,
                stepSize: 50,
                fontColor: "#d5dbe6",
                color: "#000",
                fontStyle: "bold",
                fontSize: "12",
                padding: 30,
                margin: 20
              },
              gridLines: {
                display: true,
                color: "#ebeef5",
                drawBorder: false
              }
            }
          ],
          xAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: true,
                display: true,
                color: "#ebeef5",
                lineHeight: 2,
                padding: 2,
                fontSize: "12",
                fontColor: "#d5dbe6",
                fontStyle: "bold",
                padding: 15,
                margin: 20
              },
              gridLines: {
                display: false,
                color: "#ebeef5",
                drawBorder: true
              }
            }
          ]
        },
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: 'white',
          titleFontColor: 'black',
          footerFontColor: 'black',
          bodyFontColor: 'black',
          borderColor: '#dcdfe6',
          borderWidth: 1,
          displayColors: true
        },
      },
      todayError: false,
      loading: true,
      search: ''
    };
  },
  mounted() {
    // EventBus.$emit("sideNavClick", "dashboard");
  },
  methods: {
    fetchToday(){

    },
    searchButton() {

    }
  }
};
</script>

<style lang="scss" scoped>
.dash {
  background: #edf1f8;
}
.navbar a:not(.btn):not(.dropdown-item) {
  color: #4e78fe;
}
.navbar.navbar-transparent {
  padding: 0!important;
}

.input-group.no-border {
  .form-control {
    transition: none;
    color: #d3d0d3;
    // background-color: hsla(0,0%,87%,.3);
    // background-color: rgba(161, 161, 161, 0.75);
    background-color: #f0f3f9;

    &::placeholder {
      color: #d3d0d3;
    }

    &:focus,
    &:focus + .search-end {
      transition: none;
      // background-color: rgba(161, 161, 161, 1);
    }
  }
}

li i {
  // color: rgba(161, 161, 161, 1);
  color: #4e78fe!important;
}

.search-div {
  width: 100%;
}

.card {
  border: 0;
  border-radius: 0.1875rem;
  display: inline-block;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  -webkit-box-shadow: 0 1px 15px 1px rgba(39, 39, 39, 0.1);
  box-shadow: 0 1px 15px 1px rgba(39, 39, 39, 0.1);

  .card-body {
    padding: 15px 15px 10px 15px;
    }
  .card-body.table-full-width {
    padding-left: 0;
    padding-right: 0;
  }
  .card-header {
    padding: 15px 15px 0;
    border: 0;
  }
  .card-header:not([data-background-color]) {
    background-color: transparent;
  }
  .card-header .card-title {
    margin-top: 10px;
  }
  .map {
    border-radius: 0.1875rem;
  }
  .map.map-big {
    height: 400px;
  }
}
.card[data-background-color="orange"],
.card[data-background-color="orange"] .card-header {
  background-color: #f96332;
}
.card[data-background-color="orange"] .card-footer .stats {
  color: #fff;
}
.card[data-background-color="red"] {
  background-color: #ff3636;
}
.card[data-background-color="yellow"] {
  background-color: #ffb236;
}
.card[data-background-color="blue"] {
  background-color: #2ca8ff;
}
.card[data-background-color="green"] {
  background-color: #18ce0f;
}

.info {
  .icon > i {
    font-size: 2.3em;
  }

  .info-title {
    margin: 15px 0 5px;
    color: #91dc5a;
    font-weight: 700;
  }
}

.card-stats-mini .card-title {
  margin-top: 0;
  margin-bottom: 5px;
}
.card-stats-mini .info-area {
  text-align: left;
  width: 40%;
  float: left;
  padding: 15px 0;
}
.card-stats-mini .info-area .icon > i {
  font-size: 2em;
}
.card-stats-mini .chart-area {
  float: left;
  width: 60%;
}
.card-stats-mini .stats {
  text-align: left;
  color: #fff;
}
.card-contributions hr,
.card-stats hr {
  margin: 5px 15px;
}
.card-stats .statistics {
  position: relative;
  text-align: center;
  // padding: 15px 0;
}
.card-stats .statistics .title {
  margin-bottom: 0;
}
.card-stats .statistics .stats-title {
  margin-top: 10px;
  color: #8292aa;
  font-weight: 400;
}
.card-stats .statistics.statistics-horizontal,
.card-stats .statistics.statistics-horizontal .info-title {
  padding: 0;
}
.card-stats .icon {
  display: inline-block;
  vertical-align: top;
  margin: 0 15px;
}
.card-stats .stats-information {
  display: inline-block;
  margin-bottom: 15px;
}
.card-stats .stats-information .stats-text {
  font-size: 29px;
}
.card-stats .stats-information .stats-details {
  display: block;
  color: #888;
}
.card-stats .dots {
  text-align: right;
}
.card-stats .dots .dot {
  background-color: #2c2c2c;
  height: 3px;
  width: 3px;
  border-radius: 50%;
  display: inline-block;
}
.card-stats [class*="col-"] .statistics:after {
  position: absolute;
  right: 0;
  top: 20px;
  width: 1px;
  height: calc(100% - 40px);
  content: "";
  background: #ddd;
}
.card-stats [class*="col-"]:last-child .statistics:after {
  display: none;
}
.card-subcategories .card-body {
  padding-bottom: 30px;
}
.card-body {
  padding-top: 25px;
}
.card-description + .card-title {
  margin-top: 20px;
}
.card-footer {
  margin-top: 0;
  margin-bottom: 2.5rem;
}
.card-description + .card-title {
  margin-top: 30px;
}
.icon i {
  font-size: 32px;
}
.icon.icon-primary i {
  color: #4e78fe;
}
.icon.icon-info i {
  color: #2ca8ff;
}
.icon.icon-danger i {
  color: #ff3636;
}
.icon.icon-warning i {
  color: #ffb236;
}
.icon.icon-success i {
  color: #18ce0f;
}
.card-wizard .card-header {
  padding-bottom: 40px;
}
.footer {
  padding: 24px 0;
}
</style>
