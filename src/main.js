// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'element-ui/lib/theme-chalk/base.css'
import './assets/styles/element-variables.scss'
import locale from 'element-ui/lib/locale/lang/en'
import '@/assets/styles/app.scss'
import components from './components'
import store from './store/store.js'
import VueMoment from 'vue-moment'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import IdleVue from 'idle-vue'
import VueLocalStorage from 'vue-localstorage'
import VueSession from 'vue-session'

Vue.use(VueSession)
Vue.use(VueLocalStorage)
Vue.use(ElementUI, {locale})
Vue.use(VueMoment)
Vue.component(components)
Vue.component(CollapseTransition.name, CollapseTransition)
const eventsHub = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 900000,
  store
})

Vue.filter('money', function (value, currency, options) {
  try {
    value = parseFloat(Math.round(value * 100) / 100).toFixed(2)
  } catch (error) {
    return null
  }
  let symbol = ''
  options = options || {}
  currency = currency || 'GHS'
  if (currency === 'GHS') {
    // symbol = '\u20B5'
    symbol = 'GHs'
  }
  if (options.symbol === 'text') {
    symbol = 'GHS'
  }
  value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${symbol} ${value}`
})

// Vue.component('payment-table', (resolve, reject) => {
//   setTimeout(function () {
//     resolve(require('@/transactions/components/PaymentTable.vue'))
//   }, 5000)
// })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
