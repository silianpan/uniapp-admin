import Vue from 'vue'
import MinRequest from '@/utils/MinRequest'
import globalConfig from '@/config'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
	return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	if (response.statusCode === 500 && response.data && response.data.errorMsg === '您还未登录系统，请先登录！') {
		const user = Vue.prototype.$store.getters.user
		if (user && user.id && user.name && user.passwd) {
			const params = {
				name: user.name,
				password: user.passwd,
				subSystemCode: 4
			}
			uni.showLoading({
				title: '会话过期，自动登录中...'
			})
			Vue.prototype.$store.dispatch('login', params).then(res => {
				uni.hideLoading()
				uni.showToast({
					title: '已自动登录！',
					icon: 'success'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}, 1000)
			}).catch(() => {
				uni.hideLoading()
				uni.showToast({
					title: '会话过期，请重新登录！',
					icon: 'none'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 1000)
			})
		}
	} else {
		if (response.statusCode !== 200) {
			let msg = ''
			if (response.data && response.data.errorMsg) {
				msg = response.data.errorMsg
			} else {
				msg = '请求超时，请检查网络配置，重新登录！'
			}
			uni.showToast({
				title: msg,
				icon: 'none'
			})
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}, 1000)
		}
	}
	return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
	config.baseURL = globalConfig.baseUrl
	return config
})

export default {
	// 这里统一管理api请求
	apis: {
		login(params) {
			return minRequest.post('/post/user/login', params)
		},
		userPwdModify(params) {
			return minRequest.post('/post/user/pwd/modify', params)
		}
	}
}
