<!-- 项目调整 -->
<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">立项时间</view>

				<view class="time-content" @tap="showApplyTime">
					<view class="my-uni-input" v-if="projectItem.applyTime">{{projectItem.applyTime}}</view>
					<view v-else class="placeholder">{{placeholder}} </view>
				</view>
				<tui-datetime ref="applyDateTimeRef" :type="1" :startYear="startYear" :endYear="endYear" :cancelColor="cancelColor"
				 :color="color" :setDateTime="projectItem.applyTime" @confirm="getApplyTime"></tui-datetime>
			</view>
			<view class="cu-form-group">
				<view class="title">创建时间</view>

				<view class="time-content" @tap="showCreateTime">
					<view class="my-uni-input" v-if="projectItem.createTime">{{projectItem.createTime}}</view>
					<view v-else class="placeholder">{{placeholder}} </view>
				</view>
				<tui-datetime ref="createDateTimeRef" :type="1" :startYear="startYear" :endYear="endYear" :cancelColor="cancelColor"
				 :color="color" :setDateTime="projectItem.createTime" @confirm="getCreateTime"></tui-datetime>
			</view>
			<view class="cu-form-group">
				<view class="title">所在区域</view>
				<picker @change="areaPickerChange" v-model="areaIndex" :value="areaIndex" :range="areaList">
					<view class="picker">
						{{areaIndex>-1?areaList[areaIndex]:'请选择所在区域'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">项目地址</view>
				<picker @change="addrPickerChange" v-model="addrIndex" :value="addrIndex" :range="addrList">
					<view class="picker">
						{{addrIndex>-1?addrList[addrIndex]:'请选择项目地址'}}
					</view>
				</picker>
			</view>
		</form>
		<view class="flex">
			<view class="flex-sub margin-sm">
				<button class="cu-btn block shadow bg-white margin-tb-sm lg" @tap="cancelClick">取消</button>
			</view>
			<view class="flex-sub margin-sm">
				<button class="cu-btn block shadow bg-blue margin-tb-sm lg" @tap="saveClick">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiDatetime from "@/components/tui/tui-datetime.vue"
	var graceChecker = require("../../../utils/graceChecker.js")
	export default {
		components: {
			tuiDatetime
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('ProjectAdjust')
			})
		},
		onLoad(options) {
			try {
				this.projectItem = JSON.parse(options.data)
				this.areaIndex = this.areaMap[this.projectItem.area]
				this.addrIndex = this.addrMap[this.projectItem.addr]
				this.projectItem.applyTime = this.projectItem.applyTime
				this.projectItem.createTime = this.projectItem.createTime
			} catch (e) {
				this.projectItem = {
					applyTime: '',
					area: '',
					createTime: '',
					addr: ''
				}
			}
		},
		data() {
			return {
				startYear: new Date().getFullYear(),
				endYear: 2050,
				cancelColor: "#888",
				color: "#5677fc",
				setDateTime: '',
				placeholder: '请选择日期时间',

				projectItem: {
					applyTime: '',
					area: '',
					createTime: '',
					addr: ''
				},
				areaIndex: -1,
				addrIndex: -1,
				areaList: [
					'省内',
					'省外'
				],
				addrList: [
					'四川',
					'广东',
					'安徽'
				],
				areaMap: {
					'省内': 0,
					'省外': 1
				},
				addrMap: {
					'四川': 0,
					'广东': 1,
					'安徽': 2
				},
				formRule: [{
						name: "applyTime",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择日期时间"
					},
					{
						name: "area",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择所在区域"
					},
					{
						name: "createTime",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择日期时间"
					},
					{
						name: "addr",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择项目地址"
					}
				]
			}
		},
		methods: {
			// 时间日期选择start
			showApplyTime() {
				this.$refs.applyDateTimeRef.show()
			},
			showCreateTime() {
				this.$refs.createDateTimeRef.show()
			},
			getApplyTime(e) {
				this.projectItem.applyTime = e.result
			},
			getCreateTime(e) {
				this.projectItem.createTime = e.result
			},
			// 时间日期选择end

			areaPickerChange(e) {
				this.areaIndex = e.detail.value
				this.projectItem.area = this.areaList[this.areaIndex]
			},
			addrPickerChange(e) {
				this.addrIndex = e.detail.value
				this.projectItem.addr = this.addrList[this.addrIndex]
			},
			cancelClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 跳转上一页并刷新
			updateQuery() {
				// 更新数据
				let pages = getCurrentPages()
				// let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2] //上一个页面
				prevPage.isDoRefresh = true
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}, 1000)
			},
			saveClick() {
				if (!this.projectItem && !this.projectItem.id) {
					uni.showToast({
						title: '请选择一个待审核预约！',
						icon: 'none'
					})
					return
				}
				var checkRes = graceChecker.check(this.projectItem, this.formRule);
				if (checkRes) {
					let tmp = { ...this.projectItem
					}
					// 时间字符串转换为时间
					tmp.applyTime = new Date(tmp.applyTime)
					tmp.createTime = new Date(tmp.createTime)
					uni.showLoading({
						title: '正在提交数据...'
					})
					/**
					 * todo: api请求
					 */
					setTimeout(() => {
						uni.hideLoading()
						uni.showToast({
							title: '保存成功！',
							icon: 'success'
						})
						this.updateQuery()
					}, 3000)
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.placeholder {
		color: #8c8c8c;
		line-height: 84rpx;
		font-size: 31rpx;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		width: 100%;
		text-align: right;
	}

	.my-uni-input {
		line-height: 84rpx;
		font-size: 31rpx;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		width: 100%;
		text-align: right;
	}

	.cu-form-group .time-content {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		padding-right: 33rpx;
		overflow: hidden;
		position: relative;
	}

	.cu-form-group .time-content::after {
		font-family: cuIcon;
		display: block;
		content: "\E6A3";
		position: absolute;
		font-size: 31rpx;
		color: #8799a3;
		line-height: 84rpx;
		width: 50rpx;
		text-align: center;
		top: 0;
		bottom: 0;
		right: -16rpx;
		margin: auto;
	}
</style>
