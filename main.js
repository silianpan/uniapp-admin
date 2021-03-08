import Vue from 'vue'
import App from './App'
import store from './store'
import i18n from './i18n'
import _ from 'lodash'
import MinRequest from './utils//MinRequest'
import minApi from './api/api'
import MinCache from './utils/MinCache'
// mescroll-body
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.use(MinRequest)
// 注册缓存器
Vue.use(MinCache)
// mescroll-body
Vue.component('mescroll-body', MescrollBody)

App.mpType = 'app'
Vue.prototype._i18n = i18n
Vue.prototype.$_ = _

const app = new Vue({
	store,
	minApi,
	i18n,
	...App
})
app.$mount()
