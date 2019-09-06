import Vue from 'vue'
import Header from '@/components/Header'
import SideNav from '@/components/SideNav'
import Tag from '@/components/Tag'
import LineChart from '@/dashboard/components/LineChart'
import TimelineChart from '@/dashboard/components/TimelineChart'
import SummaryCard from '@/components/cards/SummaryCard'
import PaymentTable from '@/transactions/components/PaymentTable'
import QueuedTable from '@/transactions/components/QueuedTable'
import PendingTable from '@/transactions/components/PendingTable'
import FailedTable from '@/transactions/components/FailedPaymentsTable.vue'
import PayoutsTable from '@/transactions/components/PayoutsTable'
import JobTable from '@/transactions/components/JobTable'
import FilterComponent from '@/transactions/components/FilterComponent'
import ExportModal from './transactions/components/ExportModal'
import Avatar from '@/components/Avatar'
import EventWebhook from '@/developers/components/EventWebhook'
const TicketModal = () => import('./transactions/components/TicketModal')
const AddGroup = () => import('./business/components/AddGroup')
const AddContact = () => import('./contacts/components/AddContact')

Vue.component('side-nav', SideNav)
Vue.component('the-header', Header)
Vue.component('the-tag', Tag)
Vue.component('line-chart', LineChart)
Vue.component('time-line-chart', TimelineChart)
Vue.component('summary-card', SummaryCard)
Vue.component('queued-table', QueuedTable)
Vue.component('payment-table', PaymentTable)
Vue.component('pending-table', PendingTable)
Vue.component('failed-table', FailedTable)
Vue.component('payouts-table', PayoutsTable)
Vue.component('job-table', JobTable)
Vue.component('filter-component', FilterComponent)
Vue.component('export-modal', ExportModal)
Vue.component('ticket-modal', TicketModal)
Vue.component('avatar', Avatar)
Vue.component('event-webhook', EventWebhook)
Vue.component('add-group', AddGroup)
Vue.component('add-contact', AddContact)

export default {
  SideNav: SideNav,
  Header: Header,
  Tag: Tag,
  SummaryCard: SummaryCard,
  LineChart: LineChart,
  TimelineChart: TimelineChart,
  FilterComponent: FilterComponent,
  PaymentTable: PaymentTable,
  PendingTable: PendingTable,
  FailedTable: FailedTable,
  ExportModal: ExportModal,
  TicketModal: TicketModal,
  JobTable: JobTable,
  QueuedTable: QueuedTable,
  PayoutsTable: PayoutsTable,
  Avatar: Avatar,
  EventWebhook: EventWebhook,
  AddGroup: AddGroup,
  AddContact: AddContact
}
