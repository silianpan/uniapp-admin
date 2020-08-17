<template>
	<view :class="darkMode?'custom-dark':'custom-light'">
		<view class="analysis padding-xs flex align-center">
			<view class="flex-sub text-center">
				<view class="solid-bottom text-xxl padding">
					<text class="analysis-num">{{userNum}}</text>
				</view>
				<view class="padding">注册用户</view>
			</view>
			<view class="flex-sub text-center">
				<view class="solid-bottom text-xxl padding">
					<text class="analysis-num">{{projectNum}}</text>
				</view>
				<view class="padding">本月项目</view>
			</view>
		</view>
		<ucharts-demo></ucharts-demo>
		<project-time-table></project-time-table>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import ProjectTimeTable from '@/pages/analysis/time-table.vue'
	import UchartsDemo from '@/pages/analysis/ucharts-demo.vue'
	export default {
		components: {
			ProjectTimeTable,
			UchartsDemo
		},
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		data() {
			return {
				projectNum: 199,
				userNum: 128
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('Statistics')
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
