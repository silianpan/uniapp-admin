<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<web-view v-if="url" :src="url"></web-view>
		<view v-else>文档地址无效，无法加载该文档</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		data() {
			return {
				url: ''
			}
		},
		onLoad(option) {
			this.url = decodeURIComponent(option.url)
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: this.$t('YzDocEdit')
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
