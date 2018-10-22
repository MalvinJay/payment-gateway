import Vue from 'vue'
import Header from '@/components/Header'
import SideNav from '@/components/SideNav'
import Tag from '@/components/Tag'
import SummaryCard from '@/components/cards/SummaryCard'

Vue.component('side-nav', SideNav)
Vue.component('the-header', Header)
Vue.component('the-tag', Tag)
Vue.component('summary-card', SummaryCard)

export default {
  SideNav: SideNav,
  Header: Header,
  Tag: Tag,
  SummaryCard: SummaryCard
}
