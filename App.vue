<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			// 初始化系统
			this.initSystem()
			this.setTabBarText()
			// 自动登录检测
			this.autoLogin()
			// 处理推送消息
			this.handlePush()
		},
		methods: {
			setTabBarText() {
				uni.setTabBarItem({
					index: 0,
					text: this.$t('ToDo')
				})
				uni.setTabBarItem({
					index: 1,
					text: this.$t('YzCloud')
				})
				uni.setTabBarItem({
					index: 2,
					text: this.$t('Project')
				})
				uni.setTabBarItem({
					index: 3,
					text: this.$t('Statistics')
				})
				uni.setTabBarItem({
					index: 4,
					text: this.$t('Profile')
				})
			},
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
				this.$store.dispatch('autoLogin')
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

<style lang="less">
	@import "common/css/uni.css";
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "common/css/iconfont.css";
	@import "common/css/common.css";
	@import "common/css/custom-dark.less";
	@import "common/css/custom-light.less";
</style>
