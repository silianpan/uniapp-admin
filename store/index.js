import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: null
	},
	mutations: {
		login(state, user) {
			state.user = user
			// 缓存用户信息
			Vue.prototype.$cache.set('_user', user, 0)
		},
		logout(state) {
			state.user = null
			// 清理缓存用户信息
			Vue.prototype.$cache.delete('_user')
		}
	},
	actions: {
		login({
			commit
		}, params) {
			return new Promise((resolve, reject) => {
				/**
				 * api请求
				 * Vue.prototype.$minApi.login().then(res => {
				 *	 resolve(res)
				 * }).catch(err => {
				 *	 reject(err)
				 * })
				 */
				setTimeout(() => {
					let tmp = { ...params, id: 1, userName: '张三', roleStr: '管理员' }
					commit('login', tmp)
					resolve(tmp)
				}, 3000)
			})
		},
		logout({
			commit
		}) {
			commit('logout')
		}
	},
	getters: {
		user: state => {
			if (state.user) {
				return state.user
			}
			return Vue.prototype.$cache.get('_user')
		}
	}
})

export default store
