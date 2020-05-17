<template>
  <!-- Stripe -->
  <div class="checkout" v-loading.fullscreen.lock="fullscreenLoading">
    <div v-if="customerInfo.is_paid" class="is_paid flex flex-column justify-content-center align-items-center bg-white h-screen">
      <div class="swal-icon swal-icon--success">
        <span class="swal-icon--success__line swal-icon--success__line--long"></span>
        <span class="swal-icon--success__line swal-icon--success__line--tip"></span>
        <div class="swal-icon--success__ring"></div>
        <div class="swal-icon--success__hide-corners"></div>
      </div>
      <h3>Item Alredy Paid for</h3>
      <p>Kindly go back and request for a new item.</p>
      <h4>Thank you</h4>
    </div>
    <div v-else :class="[{'animate': !fullscreenLoading }, 'payment_page']">
      <div :class="[{'animate': !fullscreenLoading}, 'single-payment', 'mx-0', 'm-auto', 'h-screen']">
        <div class="left_side">
          <div class="position-relative">
            <div
              class="go_back cursor"
              style="display: block; margin-left: -24px; padding-left: 24px;"
              @click="cancelRequest"
            >
              <div
                class="flex-container align-items-center width-auto menu-gray-text"
                style="height: 50px;"
              >
                <div class="flex align-items-center">
                  <div class="box-button flex justify-content-center align-items-center">
                    <i class="el-icon-back position-absolute black-text trans-arrow bold-600 s-18"></i>
                  </div>
                  <span class="black-text bold-600 pl-6">Back</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-column justify-content-start mt-5 productSummary">
            <div class="flex flex-column productContainer w-100">
              <div class="flex flex-column gray-text w-100">
                <div class="flex align-items-center desc">
                  <!-- <img src="@/assets/waec.svg" style="max-height: 25px" alt /> -->
                  <span class="m-0 s-14 bold-500">{{customerInfo.meta_items.description || ''}}</span>
                </div>

                <div class="w-100 my-2">
                  <span
                    class="s-34 bold-600"
                    style="font-variant-numeric: tabular-nums;letter-spacing: -0.03rem"
                  >{{customerInfo.amount | money}}</span>
                </div>
              </div>

              <div class="flex flex-column pt-30 s-18">
                <!-- align-items-center justify-content-center -->
                <p class="text-lineHeight--40">
                  Payment for BECE (
                  <span class="bold-700">
                    <template v-if="customerInfo.meta_items.type === 'pece'">Private</template>
                    <template v-else>Basic</template>
                  </span>
                  ) year
                  <span class="bold-700">{{customerInfo.meta_items.year || 'N/A'}}</span> for candidate with index number
                  <span
                    class="bold-700"
                  >{{customerInfo.meta_items.index_no || 'N/A'}}</span>
                </p>

                <!-- <div class="py-20">
                  <span class="bold-700">{{customerInfo.meta_items.description}}</span>
                </div>
                <div class="py-20">
                  <span class="bold-500 pr-10">Index No.: </span>
                  <span class="bold-700 s-20">{{customerInfo.meta_items.index_no}}</span>
                </div>
                <div class="py-20">
                  <span class="bold-500 pr-10">Year: </span>
                  <span class="bold-700 s-20">{{customerInfo.meta_items.year}}</span>
                </div>
                <div class="py-20">
                  <span class="bold-500 pr-10">Exams Type: </span>
                  <span class="bold-700 s-20 upper-case">
                    <template v-if="customerInfo.meta_items.type === 'pece'">Private</template>
                    <template v-else>Basic</template>
                  </span>
                </div>-->
              </div>

              <div class="image-box flex align-items-center justify-content-center pt-50">
                <el-card class="box-card">
                  <img src="@/assets/waec.svg" style="max-height: 80px" alt />
                </el-card>
              </div>
            </div>
          </div>
        </div>

        <div class="right_side flex align-items-center pt-30">
          <div class="w-100 m-auto mr-0">
            <el-tabs class="default-tab position-relative" stretch type>
              <el-tab-pane label="Mobile Wallet">
                <template v-if="loading">
                  <div class="flex flex-column justify-content-center align-items-center p-30 bold-700">
                    <div class="py-10">
                      <i class="el-icon-loading s-24"></i>
                    </div>
                    <div class="box-button flex justify-content-center align-items-center m-0 p-20">
                      <span class="s-16 gray-text m-2">{{countDown}}</span>
                    </div>
                    <div class="payment-form black-text s-14 text-center py-20">
                      <span>Please complete authorization process on your phone.</span>
                    </div>
                    <el-button type="text" @click="cancel">Cancel</el-button>
                  </div>
                </template>
                <template v-else>
                  <mobile-money></mobile-money>
                </template>
              </el-tab-pane>
              <el-tab-pane :disabled="true" label="Card">
                <card-payment></card-payment>
              </el-tab-pane>
            </el-tabs>

            <div class="flex justify-content-center mt-5">
              <div class="flex justify-content-center align-items-center pr-10 w-50">
                <img style="height: 30%;" src="../assets/images/PoweredBy.svg" alt />
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
import MobileMoney from "@/checkout/MobileMoney.vue";
import CardPayment from "@/checkout/MobileMoney.vue";

export default {
  name: "Checkout",
  components: {
    "mobile-money": MobileMoney,
    "card-payment": CardPayment
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      form: {
        payment_types: []
      },
      modalVisible: false,
      styleObject: {
        fontSize: "12px"
      },
      test: true,
      customerInfo: {
        email: "",
        amount: "",
        timeout: 120,
        meta_items: {
          description: null,
          index_no: null
        },
        is_paid: null
      },
      fullscreenLoading: null,
      countDown: 0,
      loading: false,
    };
  },
  created() {
    // this.fullscreenLoading = true
  },
  mounted() {
    EventBus.$on("startTrans", val => {
      this.loading = val;
      if (val) {
        this.counter(this.customerInfo.timeout || 120);
      } else {
        this.loading = false;
        this.countDown = 0;
      }
    });
    EventBus.$on("itemFetched", info => {
      this.customerInfo.email = info.customer.address;
      this.customerInfo.amount = info.invoice.total;
      this.customerInfo.meta_items = info.meta_items;
      this.customerInfo.is_paid = info.invoice.is_paid;
      this.fullscreenLoading = false;
    });
  },
  methods: {
    cancelRequest() {
      EventBus.$emit("cancelRequest");
    },
    cancel() {
      this.loading = false;
      this.countDown = 0;
      EventBus.$emit("cancelRequest");
    },
    counter(total) {
      let timeout = parseInt(total);
      this.countDown = timeout;
      const timer = setInterval(() => {
        this.countDown > 0 ? this.countDown -= 1 : clearInterval(timer)
      }, 1000);

      const finaTimeout = timeout * 1000;
      console.log("Final Timeout: 12000", finaTimeout);
      const countLimit = setTimeout(() => {
        clearInterval(timer);
        this.countDown = 0;
      }, finaTimeout);
    }
  }
};
</script>

<style lang="scss" scoped>
.is_paid {
  &::before {
    content: "";
    height: 100%;
    width: 100%;
    background: #fff;
    position: absolute;
    z-index: -1;
  }
}
.payment_page {
  .single-payment {
    padding: 20px 10px;
    max-width: 380px;
    margin: 0 auto;

    .left_side, .right_side {
      width: auto;
      height: auto;
    }

    .right_side {
      padding-top: 30px;
    }

    .productSummary {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      .productContainer {
        -webkit-box-ordinal-group: 3;
        order: 2;

        .desc {
          justify-content: center;
        }
      }

      .productImage {
        -webkit-box-ordinal-group: 2;
        order: 1;

        img {
          max-height: 120px;
        }
      }
    }

    .clientLogo {
      margin: 2.5rem auto;
    }
  }
}

@media (min-width: 768px) {
  .payment_page {
    &::before {
      height: 100%;
      width: 50%;
      position: fixed;
      content: " ";
      top: 0;
      right: 0;
      background: #fff;
      box-shadow: 2px 1px 20px 2px #f3ecec;
      background-image: url("../assets/pageBack.jpg");
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.2;
    }

    &.animate {
      &::before {
        animation: enter 0.6s;
        animation-fill-mode: both;
        transform-origin: right;
      }
    }

    &::after {
      height: 100%;
      width: 50%;
      position: fixed;
      content: " ";
      top: 0;
      left: 0;
      background: #fff;
      z-index: -1;
      // background-image: url('../assets/pageBack.jpg');
      // background-repeat: no-repeat;
      // background-size: cover;
    }

    .single-payment {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      max-width: 1000px;
      padding-top: 100px;
      padding-bottom: 90px;
      flex-direction: row;
      justify-content: space-between;

      .left_side, .right_side {
        height: 100%;
        width: 400px;
      }

      .right_side {
        padding: 0;
      }

      &.animate {
        animation: enter 0.6s;
        animation-delay: 0.2s;
        animation-fill-mode: both;
      }

      .productSummary {
        height: 70%;
        flex-direction: column;
        text-align: left;
        justify-content: center;
        align-items: flex-start;

        .productContainer {
          display: flex;
          // align-items: center;
          flex-shrink: 0;

          .image-box {
            justify-content: flex-start;
          }

          .desc {
            justify-content: flex-start;
          }
        }

        .productImage {
          display: flex;
          flex-direction: column;
          justify-content: center;

          img {
            width: 250px;
            opacity: 0.7;
            max-height: none;
          }
        }
      }

      // .clientLogo {

      // }
    }
  }
}
.my-3 {
  margin: 2rem 0;

  img {
    width: 100px;
  }
}

.go_back {
  .trans-arrow {
    opacity: 0.4;
    transform: translateX(0px);
    -ms-transform: translateX(-5px) translateY(-50%);
    -webkit-transform: translateX(0px);
    transition: opacity 0.25s ease, -webkit-transform 0.25s ease;
    transition: opacity 0.25s ease, transform 0.25s ease;
    transition: opacity 0.25s ease, transform 0.25s ease,
      -webkit-transform 0.25s ease;
    fill: hsla(0, 0%, 10%, 0.9);
  }

  &:hover .trans-arrow {
    opacity: 1;
    transform: translateX(-5px);
    -ms-transform: translateX(-5px) translateY(-50%);
    -webkit-transform: translateX(-5px);
  }
}
.box-button {
  // transform: translateX(-20px);
  // -ms-transform: translateX(-20px) translateY(-50%);
  // -webkit-transform: translateX(-20px);
  // -ms-transform: translateX(-20px);
  // transform: translateX(-20px);
  height: 32px;
  width: 32px;
  margin-right: 8px;
  box-shadow: 0 2px 5px 0 rgba(50, 50, 93, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.07);
  background: #fff;
  border-radius: 100%;
}

@media screen and (max-width: 768px) {
  .big-round {
    width: 100% !important;
  }
}

@media screen and (max-width: 505px) {
  .big-round {
    .s-16 {
      font-size: 12px !important;
    }
    .mini-round {
      width: 90% !important;
      padding: 10px !important;
    }
  }
}

@keyframes enter {
  0% {
    -webkit-transform: scale(0.97);
    transform: scale(0.97);
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}
</style>
