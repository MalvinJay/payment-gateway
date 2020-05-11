<template>
  <!-- Stripe -->
  <div :class="[{'animate': !fullscreenLoading }, 'payment_page']" v-loading.fullscreen.lock="fullscreenLoading">
    <div :class="[{'animate': !fullscreenLoading}, 'single-payment', 'mx-0', 'm-auto']">
      <div class>
        <div class="position-relative">
          <div class="go_back cursor" style="display: block;margin-left: -24px;padding-left: 24px;" @click="cancelRequest">
            <div class="flex-container align-items-center width-auto menu-gray-text">
              <div class="flex align-items-center">
                <div class="box-button flex justify-content-center align-items-center">
                  <i class="el-icon-back position-absolute black-text trans-arrow bold-600 s-18"></i>
                  <!-- <img src="@/assets/go_back.png" class="" style="width: 20px" alt=""> -->
                </div>
                <span class="black-text bold-600">Back</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-column justify-content-start mt-5">
          <div class="flex flex-column gray-text">
            <span class="m-0 s-16 bold-500">{{customerInfo.meta_items.description || ''}}</span>
            <span
              class="s-24 my-3 bold-600"
              style="font-variant-numeric: tabular-nums;letter-spacing: -0.03rem"
            >{{customerInfo.amount | money}}</span>
            <!-- <span class="bold-500 s-16">Paying for serial number</span> -->
          </div>

          <div class="flex mt-6">
            <div class="bg-white border-round p-20">
              <!-- <el-avatar shape="square" class="bg-white" :size="300" src="@/assets/qrcode.png"></el-avatar> -->
              <!-- <img src="@/assets/qrcode.png" style="width: 250px;opacity: 0.7;" alt=""> -->

              <span class="bold-500 s-16">{{customerInfo.meta_items.description || ''}}</span>
            </div>
          </div>
          <div class="flex mt-6">
            <div class="bg-white border-round p-20">
              <img src="@/assets/waec.jpg" style="width: 250px; opacity: 0.7;" alt />
            </div>
          </div>
        </div>
      </div>

      <div class="pt-20">
        <div class="w-100 m-auto mr-0">
          <div class>
            <div class="">
              <div class="payment-form black-text bold-700 s-18 py-20 position-relative">Pay with</div>
            </div>
            <el-tabs class="default-tab position-relative" stretch type>
              <div class="position-absolute bg-orange test"></div>
              <el-tab-pane label="Mobile Wallet">
                <mobile-money></mobile-money>
              </el-tab-pane>
              <el-tab-pane :disabled="true" label="Card">
                <card-payment></card-payment>
              </el-tab-pane>
            </el-tabs>
            <!-- powered by no -->
            <div class="flex justify-content-center mt-2">
              <div class="mt-50 pr-10 w-50">
                <img style="width: 100%;" src="../assets/images/PoweredBy.svg" alt />
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
        meta_items: {
          description: null,
          index_no: null
        }
      },
      fullscreenLoading: false
    };
  },
  created() {
      // this.fullscreenLoading = true;
  },
  mounted() {
    setTimeout(() => {
      this.fullscreenLoading = false;
    }, 2000);

    EventBus.$on("itemFetched", info => {
      this.fullscreenLoading = true;
      this.customerInfo.email = info.customer.address;
      this.customerInfo.amount = info.invoice.total;
      this.customerInfo.meta_items = info.meta_items;
    });
  },
  methods: {
    cancelRequest() {
      EventBus.$emit("cancelRequest");
    }
  }
};
</script>

<style lang="scss" scoped>
  .payment_page {
    .single-payment {
      padding: 20px 10px;
      max-width: 380px;
      margin: 0 auto;
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
    }

    &.animate {
      &::before {
        -webkit-animation: enter 0.6s;
        animation: enter 0.6s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-transform-origin: right;
        -ms-transform-origin: right;
        transform-origin: right;
      }
    }

    &::after {
      height: 100%;
      width: 100%;
      position: fixed;
      content: " ";
      top: 0;
      right: 0;
      background: #f5f2f2;
      z-index: -1;
    }

    .single-payment {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      max-width: 920px;
      padding-top: 90px;
      padding-bottom: 90px;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -webkit-flex-direction: row;
      -ms-flex-direction: row;
      flex-direction: row;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;


      &.animate {
      -webkit-animation: enter 0.6s;
      animation: enter 0.6s;
      -webkit-animation-delay: 0.2s;
      animation-delay: 0.2s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      }
    }

    .payment-form {
      padding-top: 0!important;
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
