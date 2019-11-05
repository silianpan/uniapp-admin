<script>
	import Vue from 'vue'
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: mapGetters(['user']),
		onLaunch: function() {
			// 初始化系统
			this.initSystem()
			// 自动登录检测
			this.autoLogin()
			// 处理推送消息
			this.handlePush()
		},
		methods: {
			/**
			 * 处理推送消息
			 */
			handlePush() {
				// #ifdef APP-PLUS
				const _self = this
				const _handlePush = function(message) {
					// 获取自定义信息
					let payload = message.payload
					try {
						// JSON解析
						payload = JSON.parse(payload)
						// 携带自定义信息跳转应用页面
						uni.navigateTo({
							url: '/pages/xxx?data=' + JSON.stringify(payload)
						})
						
					} catch(e) {}	
				}
				// 事件处理
				plus.push.addEventListener('click', _handlePush)
				plus.push.addEventListener('receive', _handlePush)
				// #endif
			},
			/**
			 * app整包更新检测
			 */
			appUpgrade(platform) {
				if (platform !== 'android') {
					return
				}
				//#ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
					let params = {
						appid: plus.runtime.appid,
						version: wgtinfo.versionCode,
						platform: platform
					}
					this.$minApi.findUpgradeApp(params).then(appRes => {
						if (appRes.appid) {
							uni.showModal({
								title: "下载更新提示",
								content: appRes.note,
								showCancel: false,
								confirmText: '确定',
								success: sucRes => {
									if (sucRes.confirm) {
										plus.runtime.openURL(appRes.url)
										// uni.downloadFile({
										//     url: appRes.url,
										//     success: res => {}
										// })
									}
								}
							})
						}
					})
				})
				//#endif
			},
			/**
			 * 自动登录
			 * 判断本地是否有账号信息，如果有，就自动重新登录
			 */
			autoLogin() {
				// 判断本地是否有账号信息，如果有，就自动重新登录
				if (this.user && this.user.id && this.user.name && this.user.passwd) {
					const params = {
						name: this.user.name,
						passwd: this.user.passwd
					}
					uni.showLoading({
						title: '自动登录中...'
					})
					this.$store.dispatch('login', params).then(res => {
						uni.hideLoading()
						// uni.showToast({
						// 	title: '已自动登录！',
						// 	icon: 'success'
						// })
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
				} else {
					// 如果本地没有账号信息，就提示用户必须登录
					uni.showModal({
						title: '未登录',
						content: '您未登录，需要登录后才能继续',
						showCancel: false,
						confirmText: '确定',
						success: res => {
							if (res.confirm) {
								uni.reLaunch({
									url: '/pages/login/login'
								})
							}
						}
					})
				}
			},
			/**
			 * 初始化系统
			 */
			initSystem() {
				const self = this
				uni.getSystemInfo({
					success: function(e) {
						// app整包更新检测
						self.appUpgrade(e.platform)

						// #ifndef MP
						Vue.prototype.StatusBar = e.statusBarHeight;
						if (e.platform == 'android') {
							Vue.prototype.CustomBar = e.statusBarHeight + 50;
						} else {
							Vue.prototype.CustomBar = e.statusBarHeight + 45;
						};
						// #endif

						// #ifdef MP-WEIXIN
						Vue.prototype.StatusBar = e.statusBarHeight;
						let custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.Custom = custom;
						Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						// #endif		

						// #ifdef MP-ALIPAY
						Vue.prototype.StatusBar = e.statusBarHeight;
						Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
						// #endif
					}
				})
			}
		}
	}
</script>

<style>
	@import "common/css/uni.css";
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "common/css/iconfont.css";
	@import "common/css/common.css";
</style>
