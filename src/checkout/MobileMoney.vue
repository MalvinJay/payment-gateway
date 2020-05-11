<template>
  <div class="flex flex-column justify-content-center new-transaction-bg p-30">
    <p class="text-center pb-10">Enter your mobile money number and provider <br> to start the payment</p>
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
        <el-input type="tel" v-model="phone" placeholder="0XX 000 0000" @input="formatTel" style="white-space: pre-line;"></el-input>
      </el-form-item>

      <el-form-item label="Mobile Network">
        <div class="flex justify-content-between position-relative w-100">
          <el-select
            v-model="form.provider"
            @change="handleDataChange"
            :class="[{'add_space': form.provider}, 'w-100', 'network_images']"
            placeholder="Choose Provider"
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

      <el-form-item v-if="form.provider === 'vodafone'">
        <el-input v-model="form.voucher" placeholder="Voucher"></el-input>
      </el-form-item>
      <div class="flex justify-content-stretch">
        <el-button type="primary" :loading="createLoading" @click="submitForm('form')" class="w-100">
          <!-- <template v-if="!createLoading">
            <img src="@/assets/loading.gif" alt="">
          </template> -->
          <template>
            Pay {{this.form.amount | money}}
          </template>
        </el-button>
        <!-- <el-button class="w-50" @click="cancel">Cancel</el-button> -->
      </div>
    </el-form>
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
        amount: "",
        recipient_amount: null,
        currency: "GHS",
        customer_no: null,
        country_code: "GH",
        service_code: "cashout",
        integration_type: "WAEC_CHECKOUT",
        extra_data: {},

        // optional parameters
        customer_name: name,
        remarks: "",
        provider: "",
        live: true,
        dummy: false
      },
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
      netImage: ""
    };
  },
  created() {
    EventBus.$on("cancelRequest", this.cancel);
  },
  mounted() {
    this.fetchItem().then(res => {
      EventBus.$emit("itemFetched", this.itemInfo);

      this.itemInfo.customer.name
        ? (this.form.customer_name = this.itemInfo.customer.name)
        : "";
      this.itemInfo.customer.msisdn
        ? (this.form.customer_no = this.itemInfo.customer.msisdn)
        : "";
      this.itemInfo.invoice.total
        ? ((this.form.amount = this.itemInfo.invoice.total),
          (this.form.recipient_amount = this.itemInfo.invoice.total))
        : "";
      this.itemInfo.token ? (this.form.token = this.itemInfo.token) : "";
      this.itemInfo.invoice.reference
        ? (this.form.invoice_ref = this.itemInfo.invoice.reference)
        : "";
      this.form.extra_data = this.itemInfo.meta_items;
    });
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
      this.createLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("createTransactions", this.form)
            .then(response => {
              if (response.data.success) {
                // Redirect here
                swal({
                  title: response.data.response.message.message,
                  text: "Checking transaction status...",
                  icon: "info"
                });

                let trans_ref = response.data.response.message.reference;

                if (this.paymentDone == false) {
                  const timer = () => {
                    setInterval(() => {
                      this.$store
                        .dispatch("getCurrentTransaction", trans_ref)
                        .then(response => {
                          console.log("response :>> ", response);

                          if (response.status === 'paid') {
                            this.paymentDone = true;
                            clearInterval(timer);

                            swal({
                              title: "Done",
                              text: "Payment successful",
                              icon: "success"
                            })

                            setTimeout(() => {
                              window.location = this.itemInfo.invoice.return_url
                            }, 2000);
                          }
                        });
                    }, 5000);
                  };
                }
              } else {
                swal({
                  title: "Ooops!",
                  text:
                    response.data.response.message.message ||
                    response.data.response.message,
                  icon: "error"
                });
              }

              this.createLoading = false;
            })
            .catch(error => {
              this.createLoading = false;

              // swal({
              //   title: "Error",
              //   text: error,
              //   icon: "error"
              // });
            });
        } else {
          this.createLoading = false;
          this.$message({
            message: "Please correct the errors",
            type: "error"
          });
          return false;
        }
      });
    },
    cancel() {
      swal({
        title: "Ooops!",
        text: "You cancelled payment, redirecting.....",
        icon: "warning"
      });

      setTimeout(() => {
        window.location = this.itemInfo.invoice.cancel_url;
      }, 2000);
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
</style>
