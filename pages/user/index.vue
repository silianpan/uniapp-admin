<template>
	<view>
		<view class="cu-bar solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>基本信息
			</view>
		</view>
		<view class="padding-lr padding-tb-xs">
			<view class="uni-flex uni-row">
				<view class="flex-item-30">用户名</view>
				<view class="flex-item-70">{{user?user.name:''}}</view>
			</view>
		</view>
		<view class="padding-lr padding-tb-xs">
			<view class="uni-flex uni-row">
				<view class="flex-item-30">姓名</view>
				<view class="flex-item-70">{{user?user.userName:''}}</view>
			</view>
		</view>
		<view class="padding-lr padding-tb-xs">
			<view class="uni-flex uni-row">
				<view class="flex-item-30">角色</view>
				<view class="flex-item-70">{{user?user.roleStr:''}}</view>
			</view>
		</view>
		<view class="padding-lr padding-tb-xs">
			<button class="cu-btn block shadow bg-gradual-blue margin" @tap="modifyPass">修改密码</button>
			<button class="cu-btn block shadow bg-gradual-orange margin" @tap="appUpgrade">软件更新</button>
			<button class="cu-btn block shadow bg-white margin text-red" @tap="logout">退出登录</button>
		</view>
		<view v-if="appInfo.version" class="text-grey text-center">
			{{appInfo.name}} {{appInfo.version}}
		</view>
		<uni-popup ref="modifyPassPopup" type="bottom" :custom="true">
			<view class="uni-share uni-share-padding-bottom">
				<view>
					<form>
						<view class="cu-form-group">
							<view class="title">原密码</view>
							<input password placeholder="原密码" name="oldPassword" v-model="item.oldPassword"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">新密码</view>
							<input password placeholder="新密码" name="newPassword" v-model="item.newPassword"></input>
						</view>
					</form>
					<view class="flex">
						<view class="flex-sub margin-sm">
							<button class="cu-btn block bg-blue margin" @tap="okClick">确认</button>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import md5 from '@/common/lib/md5.min.js'
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {
			uniPopup
		},
		computed: {
			...mapGetters(['user'])
		},
		data() {
			return {
				appInfo: {
					version: '',
					name: ''
				},
				item: {
					oldPassword: '',
					newPassword: ''
				}
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.appInfo.version = wgtinfo.version
				this.appInfo.name = wgtinfo.name
			})
			//#endif
		},
		methods: {
			okClick() {
				const params = {
					id: this.user.id,
					password: md5(this.item.oldPassword),
					newpw: md5(this.item.newPassword)
				}
				this.$minApi.editUserPwd(params).then(res => {
					if (res) {
						this.$refs.modifyPassPopup.close()
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							this.logout()
						}, 2000)
					} else {
						uni.showToast({
							title: '原密码不正确！',
							icon: 'none'
						})
					}
				})
			},
			modifyPass() {
				this.$refs.modifyPassPopup.open()
			},
			logout() {
				this.$store.dispatch('logout')
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			/**
			 * app整包更新检测
			 */
			appUpgrade() {
				//#ifndef APP-PLUS
				uni.showToast({
					title: '目前只支持Android版本软件更新',
					icon: 'none'
				})
				//#endif
				//#ifdef APP-PLUS
				uni.getSystemInfo({
					success: sysInfo => {
						let platform = sysInfo.platform
						plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
							// this.appInfo.version = wgtinfo.version
							// this.appInfo.name = wgtinfo.name
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
								} else {
									uni.showToast({
										title: '已经是最新版本了。',
										icon: 'none'
									})
								}
							})
						})
					}
				})
				//#endif
			}
		}
	}
</script>
