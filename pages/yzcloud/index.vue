<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<button style="margin:20rpx 60rpx" type="primary" @click="uploadPreviewFile">上传文件，云预览</button>
		<button style="margin:20rpx 60rpx" type="primary" @click="uploadEditFile">HTTP上传文件，云编辑</button>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import globalConfig from '@/config'
	import { generateSign } from './signclient.js'
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
			},
			uploadEditFile() {
				const fileUrl = 'http://113.62.127.199:8090/fileUpload/1.docx'
				uni.showLoading({
					title: '正在上传',
					mask: false
				})
				this.$minApi.yzEditHttpUploadFile({ fileUrl }).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '上传成功'
					})
					const fileVersionId = res.data.fileVersionId
					const sign = generateSign(globalConfig.yzEditAPPKEY, {"appId": [globalConfig.yzEditAPPID], 
						"fileVersionId": [fileVersionId], 
						"userRight": ["0"], // 模式：0:编辑（默认）1:只读
						"userName": ['silianpan'], // 用户名称
					})
					uni.navigateTo({
						url: '/pages/yzcloud/yz-edit?url=' + 
							encodeURIComponent(`${globalConfig.yzEic}/api/edit/file?fileVersionId=${fileVersionId}&appId=${globalConfig.yzEditAPPID}&sign=${sign}&userRight=1&userName=silianpan`)
					})
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: '上传失败'
					})
				})
			}
		}
	}
</script>
