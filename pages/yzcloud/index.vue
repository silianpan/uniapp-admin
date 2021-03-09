<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<button style="margin:20rpx 60rpx" type="primary" @click="uploadPreviewFile">上传文件，预览</button>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('YzCloud')
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
			uploadPreviewFile() {
				uni.navigateTo({
					url: '/pages/file/file-upload'
				})
			}
		}
	}
</script>
