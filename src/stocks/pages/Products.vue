<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div>
                  <p class="blue-text bold-600 s-16 m-0 p-0">Products</p>
                    <!-- <filter-component dispatch="setProductsFilters" filterType="stocks"></filter-component> -->
                </div>
                <div>
                  <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New Product</el-button>
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="fetchProducts" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else class="breathe">
                    <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredProducts">
                        <el-table-column label="Name">
                            <template slot-scope="scope">
                                <p class="m-0 p-0 mr-10 s-13">{{scope.row.name}}</p>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column show-overflow-tooltip prop="name" label="Reference"></el-table-column> -->
                        <el-table-column label="Code" width="180">
                            <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.code}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Quantity" width="150">
                            <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.quantity}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Unit Price(Ghs)" width="120">
                            <template slot-scope="scope">
                              <div class="d-flex">
                                <!-- <span> Ghs </span> -->
                                <p class="m-0 p-0 mr-10 s-13">{{scope.row.unit_price}}</p>
                              </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" label="Description">
                            <template slot-scope="scope">
                              {{scope.row.description}}
                            </template>
                        </el-table-column>
                    <el-table-column width="80px">
                        <template slot-scope="scope">
                            <div>
                              <el-dropdown class="mini-menu" @command="command => handleTableCommand(command, scope.row)" trigger="click">
                                  <el-button class="trans-icon-only-button" type="text" size="mini" plain icon="ellipsis horizontal icon"></el-button>
                                  <el-dropdown-menu class="w-200" slot="dropdown">
                                      <el-dropdown-item disabled>
                                          <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                              action
                                          </div>
                                      </el-dropdown-item>
                                      <el-dropdown-item command="edit" class="s-12">Edit</el-dropdown-item>
                                      <el-dropdown-item command="delete" class="s-12">Delete</el-dropdown-item>
                                      <!-- <el-dropdown-item divided disabled>
                                          <div class="table-dropdown-header blue-text bold-600 text-uppercase">
                                              connection
                                          </div></el-dropdown-item>
                                      <el-dropdown-item command="edit" class="s-12">View Payment Details</el-dropdown-item> -->
                                  </el-dropdown-menu>
                              </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            <span class="bold-600">{{products.length}}</span> results
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

        <!-- New Product -->
        <el-dialog custom-class="new-transaction"
            :title="formTitle"
            :visible.sync="dialogVisible"
            width="30%">
            <div class="flex justify-content-center new-transaction-bg">
                <el-form size="mini" ref="form" hide-required-asterisk class="transaction-form" :model="form" label-width="120px">
                    <div>
                      <el-form-item label="Product Name">
                          <el-input v-model="form.name" placeholder="Product Name"></el-input>
                      </el-form-item>
                      <el-form-item class="h-auto" label="Quantity" prop="quantity">
                          <el-input v-model="form.quantity" type="number" class="addProduct"></el-input>
                      </el-form-item>
                      <el-form-item class="h-auto" label="Unit Price" prop="unit_price">
                          <el-input class="little-padding-input addProduct" v-model="form.unit_price" type="number">
                            <span slot="prefix">&#8373</span>
                          </el-input>
                      </el-form-item>
                      <el-form-item class="h-auto" label="Description" prop="description">
                          <el-input v-model="form.description" type="textarea" :rows="2"></el-input>
                      </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" class="z-depth-button b-0 open-sans black-text" @click="close">Cancel</el-button>
              <el-button size="mini" :loading="loading" class="z-depth-button b-0 bold-500 open-sans white-text" type="primary" @click="save('form')">Add Product</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: "Products",
  data(){
    return {
      test: true,
      styleObject: {
        fontSize: '12px'
      },
      form: {
        name: '',
        quantity: 0,
        unit_price: 0.00,
        description: '',
        currency: 'GHs'
      },
      exportVisible: false,
      dialogVisible: false,
      editedIndex: -1,
      form: {
        name: '',
        quantity: 0,
        unit_price: 0.00,
        description: '',
        currency: 'GHs'
      },
      defaultItem: {
        name: '',
        quantity: 0,
        unit_price: 0.00,
        description: '',
        currency: 'GHs'
      },
    }
  },
  created() {
    this.$store.dispatch('getProducts')
  },
  mounted(){
    EventBus.$emit('sideNavClick', 'products')
    EventBus.$on('exportModal', (val) => {
      this.exportVisible = false
    })
  },
  methods: {
    close () {
      this.exportVisible = false
      this.dialogVisible = false

      setTimeout(() => {
        this.form = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    handleTableCommand (command, row) {
      switch (command) {
        case 'edit':
          this.editItem(row)
          break
        case 'delete':
          this.deleteUser(row.id)
          break
        default:
          break
      }
    },
    save () {
      if (this.editedIndex > -1) {
        console.log('Editing the item!!')
        this.$store.dispatch('updateProduct', this.form)
        .then((response) => {
          if(response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.response.message
            })
            // Re-fetch products without caching --mini websocket shid!!
            this.$store.dispatch('getProducts', {cache: false})
            .then(() => {
              this.close()
            })
          } else {
            this.$message({
              type: 'error',
              message: response.data.response.message
            })
          }
        }).catch((error) => {
          this.$message({
            type: 'error',
            message: error
          })
        })
      } else {
        console.log('Saving a new item')
        this.$store.dispatch('createProduct', this.form)
        .then((response) => {
          if(response.data.success) {
            this.$message({
                message: response.data.response.message,
                type: 'success'
            })

            // Re-fetch products without caching --mini websocket shid!!
            this.$store.dispatch('getProducts', {cache: false})
            .then(() => {
              this.close()
            })
          } else {
            this.$message({
              type: 'error',
              message: response.data.response.message
            })
          }
        }).catch((error) => {
          this.$message({
              type: 'error',
              message: error
          })
        })
      }
    },
    editItem (item) {
      this.editedIndex = this.products.indexOf(item)
      console.log('Index: ', this.editedIndex)
      this.form = Object.assign({}, item)

      if(this.editedIndex === -1){
        this.editedIndex = 1
        setTimeout(() => {
          this.dialogVisible = true
        }, 300)
      } else {
        this.dialogVisible = true
      }
    },
    deleteUser (code) {
        this.$confirm('This will permanently delete this User. Continue?', 'Warning', {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }).then(() => {
            this.$store.dispatch('deleteProduct', code)
            .then((response) => {
            if (response.data.success) {
                this.$message({
                    type: 'success',
                    message: response.data.response.message
                })
                this.$store.dispatch('getProducts', {cache: false})
            } else {
                this.$message({
                    type: 'error',
                    message: response.data.response.message
                })
            }
            }).catch((error) => {
                this.$message({
                    type: 'error',
                    message: 'Product not deleted'
                })
            })
        }).catch(() => {
            this.$message({
                type: 'error',
                message: 'Product not deleted'
            })
        })
      },
    clickRow (row, event, column) {
      // this.$router.push(`/stock/${row.reference}`)
      // if (column.property) {
      // }
    },
    handleCurrentChange (val) {
      this.$store.dispatch('getProducts', {page: val, cache: false })
    },
    fetchProducts () {
      this.$store.dispatch('getProducts', {cache: false})
    }
  },
  computed: {
    ...mapGetters({
      products: 'products',
      meta: 'productsMeta',
      state: 'productsState',
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
    filteredProducts () {
      // return this.products.map(el => {
      //   el.net_amount = el.receiver_amount - el.charged_amount
      //   return el
      // })
      return this.products
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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

