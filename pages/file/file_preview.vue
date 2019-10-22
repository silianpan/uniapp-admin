<template>
	<view>
		<!-- <web-view src="/hybrid/html/index.html?filepath=http://localhost:8082/fileUpload/1.pdf"></web-view> -->
		<!-- <web-view src="/hybrid/html/web/viewer.html?file=http://localhost:8082/fileUpload/1.pdf"></web-view> -->
		<web-view :src="allUrl"></web-view>
	</view>
</template>

<script>
	import globalConfig from '@/config'
	export default {
		data() {
			return {
				viewerUrl: globalConfig.baseUrl + '/pdf/web/viewer.html',
				allUrl: ''
			}
		},
		onLoad(options) {
			let viewerUrl = globalConfig.baseUrl + '/pdf/web/viewer.html'
			let fileUrl = encodeURIComponent(
				globalConfig.baseUrl + '/api/attachment?name=' + options.name + '&url=' + options.url)
			this.allUrl = viewerUrl + '?file=' + fileUrl
		}
	}
</script>
