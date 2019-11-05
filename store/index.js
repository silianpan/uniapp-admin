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
					
					// 关于消息推送的保存
					// 保存clientid到服务器
					// #ifdef APP-PLUS
					const clientInfo = plus.push.getClientInfo()
					let pushUser = {
					  clientid: clientInfo.clientid,
					  appid: clientInfo.appid,
					  appkey: clientInfo.appkey,
					  userName: '用户名',
					  userRole: '用户角色'
					}
					// 提交api请求，服务端保存客户端角色信息
					// Vue.prototype.$minApi.savePushUser(pushUser)
					// #endif
					
					resolve(tmp)
				}, 1000)
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
