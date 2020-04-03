<template>
  <el-card class="card-0">
    <div class="transactions">
      <div class="trans-div flex justify-content-between">
        <div>
          <filter-component dispatch="setPurchasesFilters" filterType="stocks"></filter-component>
        </div>
        <div>
          <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="exportVisible = true" type="text"><i class="file alternate outline icon"></i> Export</el-button>
        </div>
      </div>
      <div>
          <div class="center h-80" v-if="error">
            <div class="center flex-column">
              <p class="m-0 p-0">Unable to load this page</p>
              <el-button @click.prevent="fetchPurchases" icon="sync icon" type="text">Retry</el-button>
            </div>
          </div>
          <div v-else class="breathe">
              <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredPurchases">
                  <el-table-column label="Purchase Ref." width="auto">
                    <template slot-scope="scope">
                      <p class="m-0 p-0 mr-10 s-13">{{scope.row.reference}}</p>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column show-overflow-tooltip prop="name" label="Reference"></el-table-column> -->
                  <el-table-column label="Status" width="120">
                    <template slot-scope="scope">
                      <p class="m-0 p-0 mr-10 s-13">{{scope.row.status}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="Prev. Quantity" width="130">
                    <template slot-scope="scope">
                      <p class="m-0 p-0 mr-10 s-13">{{scope.row.previous_quantity}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="Cur. Quantity" width="130">
                    <template slot-scope="scope">
                      <p class="m-0 p-0 mr-10 s-13">{{scope.row.current_quantity}}</p>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="Branch" width="160">
                      <template slot-scope="scope">
                        {{scope.row.branch}}
                      </template>
                  </el-table-column> -->
                  <el-table-column label="Customer No.">
                    <template slot-scope="scope">
                      {{scope.row.customer_number}}
                    </template>
                  </el-table-column>
                  <el-table-column label="Product">
                    <template slot-scope="scope">
                      {{scope.row.product.name}}
                    </template>
                  </el-table-column>
                  <el-table-column label="Date" width="auto">
                    <template slot-scope="scope">
                      {{scope.row.created_at | moment("D MMM,YY hh:mm A")}}
                    </template>
                  </el-table-column>
              <el-table-column width="80px">
                  <template slot-scope="scope">
                      <div>
                        <el-dropdown class="mini-menu" @command="command => handleTableCommand(command, scope.row)" trigger="click">
                            <el-button class="trans-icon-only-button" type="text" size="mini" plain icon="ellipsis horizontal icon"></el-button>
                            <el-dropdown-menu class="w-200" slot="dropdown">
                              <el-dropdown-item command="edit" class="s-12">View Purchase Details</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                  </template>
              </el-table-column>
              </el-table>

              <!-- FOOTER -->
              <div class="flex justify-content-between align-items-center px-20">
                  <div class="s-12">
                    <span class="bold-600">{{purchases.length}}</span> results
                  </div>
                  <el-pagination class="my-2 flex justify-content-end"
                    @current-change="handleCurrentChange"
                    :page-size="pageSize"
                    layout="prev, pager, next"
                    :total="total">
                  </el-pagination>
              </div>
          </div>
      </div>
      <el-dialog custom-class="export-dialog" title="Export Purchases" :visible="exportVisible" width="25%">
        <div class="flex justify-content-center new-export-bg ">
            <el-form hide-required-asterisk class="transaction-form my-2" size="mini" style="width: 90%" ref="form" :model="form" label-position="top">
              <el-form-item label="Select Date">
                  <el-date-picker
                  v-model="dateColumns"
                  type="daterange"
                  @change="dateRangeClicked"
                  start-placeholder="Start date"
                  end-placeholder="End date">
                  </el-date-picker>
              </el-form-item>
              <el-form-item class="flex justify-content-end">
                <div class="flex">
                    <el-button @click="close">Cancel</el-button>
                    <a :href="`${GET_BASE_URI}v1/products_delivery/${letsEncrypt}/download_file?${generateQueryParams}`"
                    class="cursor open-sans el-button el-button--primary el-button--mini" target="_blank" @click="close" download>Download</a>
                </div>
              </el-form-item>
            </el-form>
          </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'
import Utils from '@/utils/services'
import moment from 'moment'
import { GET_BASE_URI } from '../../store/constants'

export default {
  name: "Purchases",
  data(){
    return {
      test: true,
      styleObject: {
        fontSize: '12px'
      },
      exportVisible: false,
      dialogVisible: false,
      form: {
        from: '',
        to: ''
      },
      GET_BASE_URI: GET_BASE_URI,
      fields: 'fields[]=product_name&fields[]=description&fields[]=transaction_ref&fields[]=previous_quantity&fields[]=current_quantity&fields[]=network_provider&fields[]=code&fields[]=created_at&fields[]=status&fields[]=remarks&fields[]=reference'
    }
  },
  created() {
    this.$store.dispatch('getPurchases')
  },
  mounted(){
    EventBus.$emit('sideNavClick', 'purchases')
    EventBus.$on('exportModal', (val) => {
      this.exportVisible = false
    })
  },
  methods: {
    close () {
      this.exportVisible = false
      this.ready = false
    },
    reset () {
      this.exportVisible = false
      this.ready = false
    },
    handleTableCommand (command, row) {
        switch (command) {
            case 'view':
                // this.$router.push(`payments/${row.id}`)
                // this.editItem(row)
                break
            default:
                break
        }
    },
    clickRow (row, event, column) {
      // this.$router.push(`/stock/purchases/${row.id}`)
      // if (column.property) {
      // }
    },
    handleCurrentChange (val) {
      this.$store.dispatch('getPurchases', {page: val, cache: false })
    },
    fetchPurchases () {
      this.$store.dispatch('getPurchases', {cache: false})
    },
    dateRangeClicked () {
      // this.reset()
    }
  },
  computed: {
    ...mapGetters({
      purchases: 'purchases',
      state: 'purchasesState',
      meta: 'purchasesMeta',
      pageSize: 'pageSize',
      token: 'token',
      user: 'user',
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
      return this.meta.totalCount
    },
    loading () {
      return this.state === 'LOADING'
    },
    filteredPurchases () {
      return this.purchases
    },
    dateColumns: {
      get () {
        var from = this.form.from
        var to = this.form.to
        var arr = [from, to]
        return arr
      },
      set (value) {
        this.form.from = moment(value[0]).format('YYYY-MM-DD')
        this.form.to = moment(value[1]).format('YYYY-MM-DD')
      }
    },
    generateQueryParams() {
      var query = `till_number=${this.user.client.code}`

      if (Utils.present(this.form.from)) {
        query = query += `&from=${this.form.from}`
      }
      if (Utils.present(this.form.to)) {
        query = query += `&to=${this.form.to}`
      }

      if (Utils.present(this.form.fields)) {
        if (this.form.fields.length === 1) {
          query = query += `&fields[]=${this.form.fields}`
        } else {
          var q = this.form.fields.split(',')
          q.forEach(element => {
            query = query += `&fields[]=${element}`
          })
        }
      }

      console.log('Query:', query)
      return query
    },
    letsEncrypt() {
      const CTRL_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      var Base64 = {_keyStr: CTRL_KEY, encode: function (e) { var t = ''; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ''; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ''); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } }t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, '\n'); var t = ''; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ''; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t }}
      var encodedString = Base64.encode('5b1892ab46d583da4542d5951ccf6d38ec27a6a8a3f1e3d9bbeb730827731314')

      return encodedString
    }
  }
}
</script>

<style lang="scss" scoped>

.mini-menu{
    position: absolute;
    top: 8px;
    // padding: 2px 7px;
    padding: 0;
    border-radius: 4px;
    transition: all ease;
    line-height: normal;
    right: 20px;

    &:hover{
        // background: red;
    }
    .first-icon{
        opacity: 0;
    }
    i{
        // &:first-child{
        //     opacity: 0;
        // }
        font-size: 12px;
    }
}
.new-transaction{
    .el-dialog__header{
        color: #2b2d50;
    }
    .el-dialog__body{
        padding: 20px
    }
}
.new-transaction-bg{
    background: #F7FAFC;
}
.mini-button{
    // height: 30px;
    line-height: 1em;
    // padding: 0 10px;
    padding: 7px 10px !important;
    color: rgba(0,0,0,.6);

    &:hover{
        color: rgba(0,0,0,.8);
    }

    span{
        font-weight: 600
    }
    i{
        margin-right: 5px;
    }
}

// report
.export-dialog {
  .el-dialog__header {
    color: #2b2d50;
  }
  .el-dialog__body {
    padding: 0px !important
  }
}
.new-export-bg {
  background: #F7FAFC;
}
.m-0{
  margin: 0 !important;
}

.transactions-table-header{
    background-color: #F7FAFC !important;
    height: 36px !important;

    th{
        background-color: #F7FAFC !important;
        padding: 0 !important;
    }

}
.white-text{
    color: white
}
.mr-10{
    margin-right: 10px;
}
</style>

