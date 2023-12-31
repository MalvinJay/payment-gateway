// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
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
import swal from 'sweetalert'

import store from './store/store.js'
import VueMoment from 'vue-moment'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import IdleVue from 'idle-vue'
// import VueLocalStorage from 'vue-localstorage'
import VueSession from 'vue-session'
import highlightJs from 'highlight.js'
// import ActionCableVue from 'actioncable-vue'
// import VueTour from 'vue-tour'

// require('vue-tour/dist/vue-tour.css')

// Vue.use(VueTour)
Vue.use(VueSweetalert2)
Vue.use(highlightJs)
Vue.use(VueSession)
// Vue.use(VueLocalStorage)
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
    symbol = 'GHS'
  }
  if (options.symbol === 'text') {
    symbol = 'GHS'
  }
  value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${symbol} ${value}`
})

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
})

Vue.directive('can', {
  bind: function (el, binding) {
    if (store.getters.permissions.find(el => el.action.toLowerCase() === binding.value.toLowerCase())) {
      return true
    } else {
      el.style.display = 'none'
    }
  }
})

Vue.directive('service', {
  bind: function (el, binding) {
    if (store.getters.services.find(el => el.name.toLowerCase() === binding.value.toLowerCase())) {
      return true
    } else {
      el.style.display = 'none'
    }
  }
})

// Vue.component('payment-table', (resolve, reject) => {
//   setTimeout(function () {
//     resolve(require('@/transactions/components/PaymentTable.vue'))
//   }, 5000)
// })

// Vue.use(ActionCableVue, {
//   debug: true,
//   debugLevel: 'error',
//   connectionUrl: 'wss://api.flopay.io/websocket'
// })

Vue.config.devtools = process.env.NODE_ENV === 'development'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
