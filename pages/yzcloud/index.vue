<template>
	<view>
		<button type="primary" @click="uploadPreviewFile">上传文件，预览</button>
	</view>
</template>

<script>
	export default {
		methods: {
			uploadPreviewFile() {
				uni.navigateTo({
					url: '/pages/file/file-upload'
				})
			}
		}
	}
</script>
