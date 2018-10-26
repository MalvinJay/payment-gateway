import Vue from 'vue'
import Header from '@/components/Header'
import SideNav from '@/components/SideNav'
import Tag from '@/components/Tag'
import LineChart from '@/components/LineChart'
import SummaryCard from '@/components/cards/SummaryCard'
import PaymentTable from '@/transactions/components/PaymentTable'
import QueuedTable from '@/transactions/components/QueuedTable'
import PendingTable from '@/transactions/components/PendingTable'
import PayoutsTable from '@/transactions/components/PayoutsTable'
import JobTable from '@/transactions/components/JobTable'
import FilterComponent from '@/transactions/components/FilterComponent'

Vue.component('side-nav', SideNav)
Vue.component('the-header', Header)
Vue.component('the-tag', Tag)
Vue.component('line-chart', LineChart)
Vue.component('summary-card', SummaryCard)
Vue.component('queued-table', QueuedTable)
Vue.component('payment-table', PaymentTable)
Vue.component('pending-table', PendingTable)
Vue.component('payouts-table', PayoutsTable)
Vue.component('job-table', JobTable)
Vue.component('filter-component', FilterComponent)

export default {
  SideNav: SideNav,
  Header: Header,
  Tag: Tag,
  SummaryCard: SummaryCard,
  LineChart: LineChart,
  FilterComponent: FilterComponent,
  PaymentTable: PaymentTable,
  PendingTable: PendingTable,
  JobTable: JobTable,
  QueuedTable: QueuedTable,
  PayoutsTable: PayoutsTable
}
