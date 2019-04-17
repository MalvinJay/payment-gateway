<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div>
                    <filter-component dispatch="setPurchasesFilters" filterType="purchases"></filter-component>
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
                        <el-table-column label="Purchase Ref.">
                            <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.reference}}</p>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column show-overflow-tooltip prop="name" label="Reference"></el-table-column> -->
                        <el-table-column label="Status">
                            <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.status}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Prev. Quantity">
                            <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.previous_quantity}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Cur. Quantity">
                            <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.current_quantity}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Remarks">
                            <template slot-scope="scope">
                              {{scope.row.remarks}}
                            </template>
                        </el-table-column>
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
                        <el-table-column label="Date">
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
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            <span class="bold-600">{{purchases.length}}</span> results
                        </div>
                        <el-pagination class="my-2 flex justify-content-end"
                            @current-change="handleCurrentChange"
                            :page-size="total"
                            layout="prev, pager, next"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <export-modal :modalVisible.sync="exportVisible"></export-modal>
        </div>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

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
      this.dialogVisible = false

      // setTimeout(() => {
      //   this.form = Object.assign({}, this.defaultItem)
      //   this.editedIndex = -1
      // }, 300)
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
      if (column.property) {
        // this.$router.push(`/stock/purchases/${row.id}`)
      }
    },
    handleCurrentChange (val) {
      this.$store.dispatch('getPurchases', {page: val, cache: false })
    },
    fetchPurchases () {
      this.$store.dispatch('getPurchases', {cache: false})
    }
  },
  computed: {
    ...mapGetters({
      purchases: 'purchases',
      state: 'purchasesState',
      meta: 'purchasesMeta'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
      return this.meta.purchases
    },
    loading () {
      return this.state === 'LOADING'
    },
    filteredPurchases () {
      return this.purchases
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

