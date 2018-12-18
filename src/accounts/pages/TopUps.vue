<template>
    <el-card class="transactions">
        <div class="trans-div flex justify-content-between">
            <div class="flex align-items-baseline">
                <!-- <p class="header-text">Topups</p> -->
                <filter-component dispatch="setTopUpsFilters" filterType="payment"></filter-component>
            </div>
            <div>
                <el-button class="z-depth-button bold-600 s-13 open-sans mini-button" @click="topupVisible = true" type="text"><i class="plus icon"></i> New</el-button>
            </div>
        </div>
        <div>
            <div class="center h-80" v-if="error">
                <div class="center flex-column">
                    <p class="m-0 p-0">Unable to load this page</p>
                    <el-button @click.prevent="fetchTopUps" icon="sync icon" type="text">Retry</el-button>
                </div>
            </div>
            <div v-else class="breathe">
                <el-table @row-click="clickRow" empty-text="No Topups" v-loading="loading" :row-style="styleObject" row-class-name="transactions-table-body" header-row-class-name="transactions-table-header" :data="topups">
                    <el-table-column prop="amount" label="Amount">
                        <template slot-scope="scope">
                            <p class="m-0 p-0 mr-10 bold-500 s-13">{{scope.row.receiver_amount | money}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip :width="column.width" :key="index" v-for="(column, index) in columns" :prop="column.dataField" :label="column.label"></el-table-column>
                    <el-table-column prop="created_at" label="Date">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("D MMM,YY hh:mm A")}}
                        </template>
                    </el-table-column>
                </el-table>
                <!-- FOOTER -->
                <div class="flex justify-content-between align-items-center px-10">
                    <div class="s-12">
                        {{topups.length}} results
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
        <topup-modal :modalVisible="topupVisible"></topup-modal>
    </el-card>
</template>

<script>
import EventBus from '../../event-bus.js'
import TopupModal from '../components/TopUpModal'
import { mapGetters } from 'vuex'

export default {
  name: 'TopUps',
  components: {
    TopupModal
  },
  data () {
    return {
      test: true,
      columns: [
        {label: 'Customer', dataField: 'receiver_name', width: 'auto'},
        {label: 'Reference', dataField: 'reference', width: 'auto'},
        {label: 'type', dataField: 'remarks', width: '150px'}
      ],
      styleObject: {
        fontSize: '12px'
      },
      topupVisible: false
    }
  },
  created () {
    this.$store.dispatch('getTopUps')
  },
  mounted () {
    EventBus.$emit('sideNavClick', 'topups')
    EventBus.$on('topupModal', (val) => {
        this.topupVisible = false
    })
  },
  beforeDestroy () {
    EventBus.$off('topupModal', (val) => {
      this.topupVisible = false
    })
  },
  methods: {
    handleCurrentChange (val) {
        this.$store.dispatch('getTopUps', {page: val, cache: false})
    },
    clickRow (row, event, column) {
        // if (column.property) {
        //     this.$router.push(`/job/${row.id}`)
        // }
    },
    fetchTopUps () {
      this.$store.dispatch('getJobs')
    },
    handleCommand (command, row) {
        switch (command) {
            case 'edit':
                this.editJob(row.id)
                break
            case 'delete':
                this.deleteJob(row.id)
                break
            default:
                break
        }
    }
  },
  computed: {
    ...mapGetters({
      topups: 'topups',
      state: 'topupsState',
      pageSize: 'pageSize'
    }),
    error () {
      return this.state === 'ERROR' && this.state !== 'LOADING'
    },
    total () {
      return this.topups.length
    },
    loading () {
      return this.state === 'LOADING'
    }
  }
}
</script>


<style lang="scss" scoped>
.mini-menu{
    position: absolute;
    top: 8px;
    padding: 2px 7px;
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

