<template>
	<view>
		<view class="bg-white solids-bottom padding-xs flex align-center">
			<view class="flex-sub text-center">
				<view class="solid-bottom text-xxl padding">
					<text class="text-blue">{{userNum}}</text>
				</view>
				<view class="padding">注册用户</view>
			</view>
			<view class="flex-sub text-center">
				<view class="solid-bottom text-xxl padding">
					<text class="text-blue">{{projectNum}}</text>
				</view>
				<view class="padding">本月项目</view>
			</view>
		</view>
		<ucharts-demo></ucharts-demo>
		<project-time-table></project-time-table>
	</view>
</template>

<script>
	import ProjectTimeTable from '@/pages/analysis/time-table.vue'
	import UchartsDemo from '@/pages/analysis/ucharts-demo.vue'
	export default {
		components: {
			ProjectTimeTable,
			UchartsDemo
		},
		data() {
			return {
				projectNum: 199,
				userNum: 128
			}
		}
	}
</script>
