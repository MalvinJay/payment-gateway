<template>
  <div class="flex flex-column justify-content-center new-transaction-bg p-30">
    <!-- <p class="text-center pb-10">Enter your mobile money number and provider <br> to start the payment</p> -->
      <template v-if="paymentDone">
        <div class="w-100">
          <div class="swal-icon swal-icon--success">
            <span class="swal-icon--success__line swal-icon--success__line--long"></span>
            <span class="swal-icon--success__line swal-icon--success__line--tip"></span>
            <div class="swal-icon--success__ring"></div>
            <div class="swal-icon--success__hide-corners"></div>
          </div>

          <div class="flex flex-column justify-content-center align-items-center">
            <div class="swal-title m-0" style="">Done</div>
            <div class="swal-text" style="">Payment successful</div>
          </div>
          <!--
            <div class="flex justify-content-center">
              <el-button type="text" @click="proceed">Continue</el-button>
            </div>
          -->
        </div>
      </template>
      <template v-else>
        <el-form
          size="medium"
          ref="form"
          hide-required-asterisk
          class="transaction-form w-100 checkout"
          :rules="rules"
          :model="form"
          label-position="top"
          :status-icon="true"
        >
          <el-form-item class="h-auto" label="Phone" prop="customer_no">
            <el-input type="tel" class="bg-white" v-model="phone" placeholder="000 000 0000" @input="formatTel" style="white-space: pre-line;" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="Mobile Network">
            <div class="flex justify-content-between position-relative w-100">
              <el-select
                v-model="form.provider"
                @change="handleDataChange"
                :class="[{'add_space': form.provider}, 'w-100', 'network_images']"
                placeholder="Choose Provider"
                :disabled="true"
              >
                <el-option
                  v-for="(item, index) in providers"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div
                class="position-absolute left-0 h-100 flex justify-content-center align-items-center p-5"
              >
                <img :src="netImage" class="border-rounded h-100" alt />
              </div>
            </div>
          </el-form-item>

          <!-- <el-form-item v-if="form.provider === 'vodafone'">
            <el-input v-model="form.voucher" placeholder="Voucher"></el-input>
          </el-form-item> -->
          <div class="flex justify-content-stretch">
            <el-button type="primary" :loading="createLoading" @click="submitForm('form')" class="w-100">
              <!-- <template v-if="!createLoading">
                <img src="@/assets/loading.gif" alt="">
              </template> -->
              <template>
                Pay {{this.payingAmount | money}}
              </template>
            </el-button>
            <!-- <el-button class="w-50" @click="cancel">Cancel</el-button> -->
          </div>
        </el-form>
      </template>
  </div>
</template>

<script>
import EventBus from "@/event-bus.js";
// import { mapGetters } from 'vuex'
import { apiCall } from "@/store/apiCall";
import { GET_BASE_URI } from "@/store/constants";
import mtn from "@/assets/mtn.svg";
import voda from "@/assets/vodafone.png";
import artigo from "@/assets/airteltigo.png";

export default {
  data() {
    return {
      styleObject: {
        fontSize: "12px"
      },
      activeName: "1",
      transaction: {},
      contact: {},
      date: false,
      contactVisible: false,
      dialogVisible: false,
      exportVisible: false,
      ticketVisible: false,
      form: {
        // required params
        amount: "",
        recipient_amount: null,
        currency: "GHS",
        customer_no: null,
        country_code: "GH",
        service_code: "cashout",
        integration_type: "WAEC_CHECKOUT",
        extra_data: {},

        // optional params
        customer_name: name,
        remarks: "",
        provider: "",
        live: true,
        dummy: false
      },
      payingAmount: null,
      dummyForm: null,
      providers: [
        {
          label: "MTN",
          value: "mtn",
          url: mtn
        },
        {
          label: "Vodafone",
          value: "vodafone",
          url: voda
        },
        {
          label: "Airtel/Tigo",
          value: "airteltigo",
          url: artigo
        }
      ],
      rules: {
        customer_no: [
          {
            required: true,
            min: 10,
            max: 10,
            message: "Length should be 10",
            trigger: "blur"
          }
        ],
        // amount: [
        //   { required: true, message: "This field is required", trigger: "blur" }
        // ]
      },
      createLoading: false,
      itemInfo: null,
      paymentDone: false,
      phone: "",
      netImage: "",
      timer: null,
      timeOut: null,
      timeoutValue: 120,
      transStatus: null
    };
  },

  mounted() {
    EventBus.$on("cancelRequest", this.cancel);

    // Cancel timer call
    EventBus.$on("cancelAnyRequest", () => {
      clearInterval(this.timer);
      clearTimeout(this.timeOut);
    });

    this.fetchItem()
    .then(res => {
      if(this.itemInfo) EventBus.$emit("itemFetched", this.itemInfo);

      // Set form customer's name for payment transaction
      this.itemInfo.customer.name
        ? (this.form.customer_name = this.itemInfo.customer.name)
        : "";

      // Set form customer number for payment transaction
      if(this.itemInfo.customer.msisdn) {
        this.form.customer_no = this.itemInfo.customer.msisdn
        this.formatTel(this.itemInfo.customer.msisdn)
      }

      // Set form customer provider
      if(this.itemInfo.invoice.provider_network) {
        this.handleDataChange(this.itemInfo.invoice.provider_network.toLowerCase());
        this.form.provider = this.itemInfo.invoice.provider_network
      }

      // Set form amount and recipient_amount respectively
      if (this.itemInfo.invoice.total) {
        this.form.amount = this.form.recipient_amount = this.itemInfo.invoice.total

        if (this.itemInfo.invoice.extra_data.charges_info.is_client_charge) {
          this.payingAmount = this.itemInfo.invoice.extra_data.charges_info.gross_amount
        } else {
         this.payingAmount = this.itemInfo.invoice.extra_data.charges_info.net_amount
        }
      }

      // Set form token for public receive transaction endpoint authentication
      this.itemInfo.token ? (this.form.token = this.itemInfo.token) : "";

      // Set form reference for transaction
      this.itemInfo.invoice.reference
      ? (this.form.invoice_ref = this.itemInfo.invoice.reference)
      : "";

      // Set form client_ref for info that will be displayed on payment prompt
      this.itemInfo.invoice.client_ref
      ? (this.form.client_ref = this.itemInfo.invoice.client_ref)
      : "";

      // Set form extra data
      this.form.extra_data = this.itemInfo.meta_items;
    })
    .catch(err => {
      console.info(err);
      EventBus.$emit("itemFetched", {});
    })
  },

  methods: {
    formatTel(input) {
      let temp = input.slice()
      this.form.customer_no = input.split(" ").join("");
      var replacedInput = temp.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.phone = !replacedInput[2] ? replacedInput[1] : '' + replacedInput[1] + ' ' + replacedInput[2] + (replacedInput[3] ? ' ' + replacedInput[3] : '');
    },

    handleDataChange(data) {
      switch (data) {
        case "mtn":
          this.netImage = mtn;
          break;
        case "vodafone":
          this.netImage = voda;
          break;
        case "airteltigo":
          this.netImage = artigo;
          break;

        default:
          break;
      }
    },

    fetchItem() {
      return new Promise((resolve, reject) => {
        apiCall({
          url: `${GET_BASE_URI}v2/checkouts/${this.$route.params.client}/search/${this.$route.params.ref}`,
          method: "GET"
        })
          .then(response => {
            this.itemInfo = response.data.response.message;
            resolve(response);
          })
          .catch(error => {
            console.log("ERROR", error);
            reject(error);
          });
      });
    },

    submitForm(formName) {
      console.log('submitting..');
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postTranasaction()
          this.dummyForm = this.form
        } else {
          this.createLoading = false;
          EventBus.$emit("startTrans", false);

          this.$message({
            message: "Please correct the errors",
            type: "error"
          });
          return false;
        }
      });
    },

    postTranasaction() {
      this.createLoading = true;

      this.$store.dispatch("createTransactions", this.form)
      .then(response => {
        if (response.data.success) {
          // swal({
          //   title: response.data.response.message.message,
          //   text: "Checking transaction status...",  //Add network specific text here to instruct the customer on what to do
          //   icon: "info"
          // });

          // Trigger count down timer event
          EventBus.$emit("startTrans", true); //Emit event to be invoked on Checkout component
          const trans_ref = response.data.response.message.reference;

          if (!this.paymentDone) {

            this.timer = setInterval(() => {
              this.checkTransactionStatus(trans_ref, this.timer, this.timeOut);
            }, 5000);

            // setTimeout(() => {
            //   this.pendingPayment();
            // }, 1000)

            this.timeOut = setTimeout(() => {
              clearInterval(this.timer);
              // this.createLoading = false;
              // EventBus.$emit("startTrans", false);
              // this.proceed();

              // Call completer function here if after 2 minutes and status is still not 'paid'
              this.transactionCompleter(trans_ref)
              .then(() => {
                // Check transaction status one more time and either choose to handle
                // response here or in the checkTransactionStatus method

                this.checkTransactionStatus(trans_ref, this.timer, this.timeOut)
                .then(response => {
                  if (response.payment_status !== 'paid') {
                    this.createLoading = false;
                    EventBus.$emit("startTrans", false);

                    this.pendingPayment(response);
                    // this.retry(response);
                  }
                })
                .catch(err => {

                });
              })
            }, 120000); //Poll the server for 2 minutes - 120000 micro seconds - 120 seconds - 120000 micro seconds

          } else {
            console.log('Payment successful!! Now redirect :>> ');
            this.proceed();
          }
        } else {
          swal({
            title: "Ooops!",
            text: response.data.response.message.message || response.data.response.message,
            icon: "error"
          });

          this.createLoading = false;
          EventBus.$emit("startTrans", false);
        }
      })
      .catch(error => {
        this.createLoading = false;
        EventBus.$emit("startTrans", false);

        swal({
          title: error,
          text: "Payment could not be made, check your internet and try again",
          icon: "error"
        });
      });
    },

    checkTransactionStatus(trans_ref, timer, timeOut) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch("getCurrentTransaction", trans_ref)
        .then(response => {
          let status = response.payment_status;
          console.log("Status: ", status);

          this.transStatus == status;

          if (status.toLowerCase() === 'paid') {
            console.log('Here as paid!!');
            this.createLoading = false;
            EventBus.$emit("startTrans", false);

            clearInterval(timer);
            clearTimeout(timeOut);

            // Just stay on checkout page
            this.paymentDone = true;

            // Or Show success message and redirect within 2 seconds
            // this.proceed();
          }

          else if (status.toLowerCase() === 'failed') {
            console.log('Here as failed!!');
            this.createLoading = false;
            EventBus.$emit("startTrans", false);

            clearInterval(timer);
            clearTimeout(timeOut);

            this.retry(response);
          }

          else {
            console.log('Here as pending or queued or whatever status!');
            resolve(response);
          }
        })
        .catch(error => {
          resolve(error);
        })
      });
    },

    transactionCompleter(ref) {
      return this.$store.dispatch("transactionCompleter", ref)
      .then(response => {
        console.log('response :>> ', response);
      })
      .catch(error => {
        console.log('error :>> ', error);
      });
    },

    pendingPayment(msg) {
      swal({
        title: 'Payment Pending',
        text: "Have you already approved payment prompt?",
        icon: "error",
        buttons: true,
        buttons: ["No", "Yes"],
        dangerMode: true,
      })
      .then(proceed => {
        if(proceed) {
          // Show info to customer that request is being processed and they should be expectant of an sms.
          swal({
            title: 'Request being processed',
            text: "You will received as sms shortly",
            icon: "success",
          })
          setTimeout(() => {
            window.location = this.itemInfo.invoice.return_url
          }, 3000);
          return;
        } else {
          this.retry(msg);
        }
      });
    },

    retry(msg) {
      swal({
        title: `${msg.response_message || 'Transaction '+ msg.payment_status}`,
        text: " Do you want to retry transaction?",
        icon: "error",
        buttons: true,
        buttons: ["No", "Yes"],
        dangerMode: true,
      })
      .then(proceed => {
        if(proceed) {
          this.paymentDone = false;
          this.postTranasaction();
        } else {
          // window.location = this.itemInfo.invoice.cancel_url;
          // console.log('cancelling payment but stay on page :>> ');
          return;
        }
      });
    },

    cancel() {
      if (this.timer && this.timeOut) {
        EventBus.$emit("cancelAnyRequest");
      }

      swal({
        title: "Are you sure you want to cancel this payment?",
        text: "Going back will cancel and delete this payment.",
        icon: "warning",
        buttons: true,
        buttons: ["No", "Yes"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal({
            title: "Payment Cancelled!",
            text: "Redirecting you back .....",
            icon: "error",
            buttons: false,
          });

          setTimeout(() => {
            window.location = this.itemInfo.invoice.cancel_url;
          }, 2000);
        } else {
          // swal({
          //   title: "Good",
          //   text: "Kindly try payment again.",
          //   icon: "info"
          // });

          return
        }
      });
    },

    proceed() {
      this.paymentDone = true;

      setTimeout(() => {
        window.location = this.itemInfo.invoice.return_url
      }, 2000);
    }
  },

  watch: {
    createLoading(newVal) {
      console.log('createLoading :>> ', newVal);
      // EventBus.$emit("startTrans", newVal);
    }
  },

  computed: {
    // ...mapGetters({
    //   providers: 'providers',
    // }),
  }
};
</script>

<style lang="scss" scoped>

@media (max-width: 767px) {
  .new-transaction-bg {
    padding: 20px;
  }
}
</style>
