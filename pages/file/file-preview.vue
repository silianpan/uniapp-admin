<template>
	<view>
		<web-view :src="allUrl"></web-view>
	</view>
</template>

<script>
	import globalConfig from '@/config'
	export default {
		data() {
			return {
				// viewerUrl: '/hybrid/html/web/viewer.html',
				viewerUrl: globalConfig.baseUrl + '/pdf/web/viewer.html',
				allUrl: ''
			}
		},
		onLoad(options) {
			let fileUrl = encodeURIComponent(
				globalConfig.baseUrl + '/api/attachment?name=' + options.name + '&url=' + options.url)
			this.allUrl = this.viewerUrl + '?file=' + fileUrl
		}
	}
</script>
