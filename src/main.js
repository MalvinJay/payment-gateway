// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/app.scss'
import components from './components'
import './assets/styles/element-ui.scss'
import locale from 'element-ui/lib/locale/lang/en'
import store from './store/store.js'
import VueMoment from 'vue-moment'

Vue.use(ElementUI, {locale})
Vue.use(VueMoment)
Vue.component(components)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
