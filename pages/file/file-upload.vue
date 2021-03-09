<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<web-view src="/hybrid/html/index.html" @message="handleMessage"></web-view>
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
