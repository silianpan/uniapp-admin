<template>
	<view>
		<web-view :src="allUrl"></web-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import globalConfig from '@/config'
	export default {
		data() {
			return {
				// viewerUrl: '/hybrid/html/web/viewer.html',
				viewerUrl: globalConfig.baseUrl + '/pdf/web/viewer.html',
				allUrl: ''
			}
		},
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('FilePreview')
			})
			// navBar-bg-color
			uni.setNavigationBarColor({
			    frontColor: '#ffffff',
			    backgroundColor: this.themeBgColor,
			    animation: {
			        duration: 400,
			        timingFunc: 'easeIn'
			    }
			})
			// #ifdef APP-PLUS
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.setStyle({scalable:true})
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		},
		onLoad(options) {
			let fileUrl = encodeURIComponent(
				globalConfig.baseUrl + '/api/attachment?name=' + options.name + '&url=' + options.url)
			this.allUrl = this.viewerUrl + '?file=' + fileUrl
		}
	}
</script>
