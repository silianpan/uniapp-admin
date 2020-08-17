import Vue from 'vue'
import App from './App'
import store from './store'
import i18n from './i18n'
import MinRequest from './utils//MinRequest'
import minApi from './api/api'
import MinCache from './utils/MinCache'
// import minRouter from './router/router.js'

// import cuCustom from './colorui/components/cu-custom.vue'
// Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.use(MinRequest)
// 注册缓存器
Vue.use(MinCache)
// 注册路由
// Vue.use(MinRouter)

App.mpType = 'app'
Vue.prototype._i18n = i18n

const app = new Vue({
	store,
	minApi,
	i18n,
	// minRouter,
	...App
})
app.$mount()
