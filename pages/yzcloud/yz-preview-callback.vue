<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<web-view v-if="yzPreviewUrl" :src="yzPreviewUrl"></web-view>
		<view v-else-if="convertMsg">{{ convertMsg }}</view>
		<view v-else>文档地址无效，无法加载该文档</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import globalConfig from '@/config'
	import { generateSign } from '@/pages/yzcloud/signclient.js'
	export default {
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		data() {
			return {
				yzPreviewUrl: '',
				convertMsg: ''
			}
		},
		onLoad(option) {
			// 接收H5页面，跳转页面url传递数据
			if (option.fileData) {
				const d = JSON.parse(decodeURIComponent(option.fileData))
				if (d.yzAppType == 1) {
					const sign = generateSign(globalConfig.yzPreviewAPPKEY, {"appId": [globalConfig.yzPreviewAPPID], 
						"fileVersionId": [d.fileVersionId], 
						"watermark": ["uniapp-admin"], // 水印内容
						"isCopy": [1], // 是否防复制，1是0否
						"viewType": [2], // 预览模式0-标清 1-canvas预览 2-高清
						// "pageStart": [2], // 预览页数起始页
						// "pageEnd": [3], // 预览页数终止页
						// "isShowBar": [1], // 是否显示黑条1是0否
						// "htmlTitle": ['uniapp-admin'], // html标签名字
						// "isDownload": [1], // 是否支持源文件下载1是0否
					})
					this.yzPreviewUrl = globalConfig.yzEic + '/api/view/file' + '?fileVersionId=' + d.fileVersionId + '&appId=' +
						globalConfig.yzPreviewAPPID + '&sign=' + sign + '&watermark=uniapp-admin&isCopy=1&viewType=2'
				} else if (d.yzAppType == 2) {
					const sign = generateSign(globalConfig.yzEditAPPKEY, {"appId": [globalConfig.yzEditAPPID],
						"fileVersionId": [d.fileVersionId], 
						"userRight": ["0"], // 模式：0:编辑（默认）1:只读
						"userName": ['silianpan'], // 用户名称
					})
					this.yzPreviewUrl = `${globalConfig.yzEic}/api/edit/file?fileVersionId=${d.fileVersionId}&appId=${globalConfig.yzEditAPPID}&sign=${sign}&userRight=0&userName=silianpan`
				} else if (d.yzAppType == 3) {
					this.convertMsg = '正在转换文档...'
					this.$minApi.yzConvertFile({
						fileVersionId: d.fileVersionId,
						convertType: 1,
						destinationName: 'ua'
					}).then(res => {
						this.convertMsg = '转换完成\n\n' + JSON.stringify(res) 
						uni.showModal({
							content: JSON.stringify(res),
							showCancel: false
						})
					})
				}
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('YzDocPreviewEdit')
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
