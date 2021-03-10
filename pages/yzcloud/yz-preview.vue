<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<web-view v-if="yzPreviewUrl" :src="yzPreviewUrl"></web-view>
		<view v-else>文档地址无效，无法加载该文档</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import globalConfig from '@/config'
	export default {
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		data() {
			return {
				yzPreviewUrl: ''
			}
		},
		onLoad(option) {
			// 接收H5页面，跳转页面url传递数据
			if (option.fileData) {
				const d = JSON.parse(decodeURIComponent(option.fileData))
				this.yzPreviewUrl = globalConfig.yzPreviewEic + '/api/view/file' + '?fileVersionId=' + d.fileVersionId + '&appId=' +
					globalConfig.yzPreviewAPPID + '&sign=' + d.sign + '&watermark=uniapp-admin'
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('YzDocPreview')
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
			}
		}
	}
</script>
