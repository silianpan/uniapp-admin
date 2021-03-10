<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<web-view :src="'/hybrid/html/index.html?info=' + info" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import globalConfig from '@/config'
	export default {
		data() {
			return {
				info: encodeURIComponent(JSON.stringify({
					appId: globalConfig.yzPreviewAPPID,
					appKey: globalConfig.yzPreviewAPPKEY,
					dmc: globalConfig.yzDmcUrl
				}))
			}
		},
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('DocUpload')
			})
			this.setNavBarColor()
		},
		onShow() {
			this.setNavBarColor()
		},
		methods: {
			setNavBarColor() {
				// navBar-bg-color
				uni.setNavigationBarColor({
				    frontColor: '#ffffff',
				    backgroundColor: this.themeBgColor,
				    animation: {
				        duration: 400,
				        timingFunc: 'easeIn'
				    }
				})
			},
			handleMessage(evt) {
				let msg = '@message传递数据：' + JSON.stringify(evt.detail.data)
				uni.showModal({
					content: msg,
					showCancel: false
				});
				// todo 写入到store中
			}
		}
	}
</script>
