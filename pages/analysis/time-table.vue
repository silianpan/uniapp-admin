<!-- 一周项目一览表 -->
<template>
	<view>
		<view v-for="(value, key) in weekDate" :key="key">
			<view class="cu-bar solid-bottom margin-top-xs">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>{{value.title}}
				</view>
			</view>
			<view class="cu-list menu project-list" v-for="project in value.projects" :key="project.id" @tap="clickCard(project)">
				<view class="cu-item">
					<view class="content padding-tb-sm">
						<view>{{project.projectName}}</view>
						<view class="text-gray text-sm">项目类型：{{project.projectType}}</view>
						<view class="text-gray text-sm">所在区域：{{project.area}}</view>
						<view class="text-gray text-sm">项目地址：{{project.addr}}</view>
						<view class="text-gray text-sm">立项时间：{{project.createTime}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDateDay
	} from '@/utils/datetime.js'
	export default {
		data() {
			return {
				weekDate: {},
				projectData: [{
						id: 1,
						projectName: '国旗护卫队服装采购项目',
						projectType: '采购',
						area: '省外',
						addr: '云南省',
						createTime: '2019-10-19 17:00'
					},
					{
						id: 2,
						projectName: '超声高频外科集成系统（超声刀）项目',
						projectType: '系统集成',
						area: '省外',
						addr: '广东省',
						createTime: '2019-09-21 13:00'
					},
					{
						id: 3,
						projectName: '培训考试信息管理系统项目',
						projectType: '软件研发',
						area: '省内',
						addr: '四川省',
						createTime: '2019-10-21 17:38'
					}
				]
			}
		},
		mounted() {
			this.initWeek()
			this.queryProject()
		},
		methods: {
			formatDateDay,
			queryProject() {
				let projectMap = {}
				this.projectData.forEach(item => {
					let dateKey = item.createTime
					if (!projectMap.hasOwnProperty(dateKey)) {
						projectMap[dateKey] = []
					}
					projectMap[dateKey].push(item)
				})

				for (let wKey in this.weekDate) {
					if (projectMap.hasOwnProperty(wKey)) {
						this.$set(this.weekDate[wKey], 'projects', projectMap[wKey])
					}
				}
			},
			initWeek() {
				let now = new Date()
				let day = now.getDay()
				day = day === 0 ? 7 : day
				let remain = 7 - day
				let weekStr = [
					'周一',
					'周二',
					'周三',
					'周四',
					'周五',
					'周六',
					'周日'
				]

				let ret = {}
				for (let i = 0; i < day; i++) {
					let cDate = new Date(now.getTime() - (1000 * 60 * 60 * 24 * (day - i - 1)))
					let date = this.formatDateDay(cDate.getTime())
					let cDay = cDate.getDay() === 0 ? 7 : cDate.getDay()
					ret[date] = {
						title: `${date}(${weekStr[cDay - 1]})`
					}
				}

				for (let i = 0; i < remain; i++) {
					let cDate = new Date(now.getTime() + (1000 * 60 * 60 * 24 * (i + 1)))
					let date = this.formatDateDay(cDate.getTime())
					let cDay = cDate.getDay() === 0 ? 7 : cDate.getDay()
					ret[date] = {
						title: `${date}(${weekStr[cDay - 1]})`
					}
				}
				this.weekDate = ret
			},
			clickCard(item) {}
		}
	}
</script>

<style>
	.project-list+.project-list {
		margin-top: 2rpx !important;
	}
</style>
