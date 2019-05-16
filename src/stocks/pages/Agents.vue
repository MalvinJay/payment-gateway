<template>
    <el-card class="card-0">
        <div class="transactions">
            <div class="trans-div flex justify-content-between">
                <div>
                  <p class="blue-text bold-600 s-16 m-0 p-0">Agents</p>
                    <!-- <filter-component dispatch="stocks" filterType="stocks"></filter-component> -->
                </div>
                <div>
                    <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="dialogVisible = true" type="text"><i class="plus icon"></i> New Agent</el-button>
                    <!-- <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="exportVisible = true" type="text"><i class="file alternate outline icon"></i> Export</el-button> -->
                </div>
            </div>
            <div>
                <div class="center h-80" v-if="error">
                    <div class="center flex-column">
                       <p class="m-0 p-0">Unable to load this page</p>
                       <el-button @click.prevent="fetchAgents" icon="sync icon" type="text">Retry</el-button>
                    </div>
                </div>
                <div v-else class="breathe">
                  <el-table @row-click="clickRow" empty-text="No match found, filter desired period range" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="filteredAgents">
                      <el-table-column label="Name">
                          <template slot-scope="scope">
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.first_name}} {{scope.row.last_name}}</p>
                          </template>
                      </el-table-column>
                      <!-- <el-table-column show-overflow-tooltip prop="name" label="Reference"></el-table-column> -->
                      <el-table-column label="Username">
                          <template slot-scope="scope">
                            <p class="m-0 p-0 mr-10 s-13">{{scope.row.username}}</p>
                          </template>
                      </el-table-column>
                      <el-table-column label="Email">
                          <template slot-scope="scope">
                            <p class="m-0 p-0 mr-10 s-13">{{scope.row.email}}</p>
                          </template>
                      </el-table-column>
                      <el-table-column label="Phone Number">
                          <template slot-scope="scope">
                            <div class="d-flex">
                              <!-- <span> Ghs </span> -->
                              <p class="m-0 p-0 mr-10 s-13">{{scope.row.phone_number}}</p>
                            </div>
                          </template>
                      </el-table-column>
                      <el-table-column label="Number of Deliveries">
                          <template slot-scope="scope">
                            {{scope.row.number_of_deliveries}}
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
                                  </el-dropdown-menu>
                              </el-dropdown>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                    <!-- FOOTER -->
                    <div class="flex justify-content-between align-items-center px-10">
                        <div class="s-12">
                            <span class="bold-600">{{agents.length}}</span> results
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
  name: "Agents",
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
    this.$store.dispatch('getAgents')
  },
  mounted(){
    EventBus.$emit('sideNavClick', 'agents')
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
        this.$store.dispatch('updateAgent', this.form)
        .then((response) => {
          if(response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.response.message
            })
            // Re-fetch agent without caching --mini websocket shid!!
            this.$store.dispatch('getAgents', {cache: false})
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
        console.log('Saving a new agent')
        this.$store.dispatch('createAgent', this.form)
        .then((response) => {
          if(response.data.success) {
            this.$message({
                message: response.data.response.message,
                type: 'success'
            })

            // Re-fetch agent without caching --mini websocket shid!!
            this.$store.dispatch('getAgents', {cache: false})
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
      this.editedIndex = this.agents.indexOf(item)
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
        this.$confirm('This will permanently delete this Agent. Continue?', 'Warning', {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }).then(() => {
            this.$store.dispatch('deleteAgent', code)
            .then((response) => {
            if (response.data.success) {
                this.$message({
                    type: 'success',
                    message: response.data.response.message
                })
                this.$store.dispatch('getAgents', {cache: false})
            } else {
                this.$message({
                    type: 'error',
                    message: response.data.response.message
                })
            }
            }).catch((error) => {
                this.$message({
                    type: 'error',
                    message: 'Agent not deleted'
                })
            })
        }).catch(() => {
            this.$message({
                type: 'error',
                message: 'Agent not deleted'
            })
        })
      },
    clickRow (row, event, column) {
      if (column.property) {
        // this.$router.push(`/stock/${row.reference}`)
      }
    },
    handleCurrentChange (val) {
      this.$store.dispatch('getAgents', {page: val, cache: false })
    },
    fetchAgents () {
      this.$store.dispatch('getAgents', {cache: false})
    }
  },
  computed: {
    ...mapGetters({
      agents: 'agents',
      meta: 'agentsMeta',
      state: 'agentsState',
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
    filteredAgents () {
      return this.agents
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Agent' : 'Edit Agent'
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

