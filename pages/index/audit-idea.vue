<!-- 项目申请审批意见 -->
<template>
	<uni-popup ref="share" type="bottom" :custom="true">
		<view class="uni-share" :class="isPaddingBottom?'uni-share-padding-bottom':''">
			<view class="uni-share-content">
				<!-- <view class="uni-form-item uni-column">
					<view class="title">填写处理反馈(非必填)</view>
					<textarea v-model="auditIdea" class="idea-textarea" placeholder="请输入" />
				</view> -->
				<view class="margin-left-sm">填写处理反馈(非必填)</view>
				<view class="cu-form-group idea-textarea">
					<textarea maxlength="-1" v-model="auditIdea" placeholder="请输入"></textarea>
				</view>
			</view>
			<view class="flex">
				<view class="flex-sub margin-sm">
					<button class="cu-btn block shadow bg-white" @tap="cancelClick">取消</button>
				</view>
				<view class="flex-sub margin-sm" v-if="isPass">
					<button class="cu-btn block shadow bg-green" @tap="passClick">通过</button>
				</view>
				<view class="flex-sub margin-sm" v-if="!isPass">
					<button class="cu-btn block shadow bg-red" @tap="unPassClick">拒绝</button>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { mapGetters } from 'vuex'
	export default {
		props: {
			isPass: {
				type: Boolean,
				required: true
			},
			isPaddingBottom: {
				type: Boolean,
				default: false
			}
		},
		components: {
			uniPopup
		},
		computed: {
			...mapGetters(['user'])
		},
		data() {
			return {
				auditIdea: ''
			}
		},
		mounted() {
			this.initAuditIdea()
		},
		watch: {
			isPass() {
				this.initAuditIdea()
			}
		},
		methods: {
			// 初始化审核意见
			initAuditIdea() {
				this.auditIdea = this.isPass ? '通过' : '不通过'
			},
			cancelClick() {
				this.$refs.share.close()
				// 更新数据
				this.$emit('updateQuery')
			},
			passClick() {
				uni.showLoading({
					title: '正在提交数据...'
				})
				/**
				 * todo: api请求审批意见
				 */
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '审批通过！',
						icon: 'success'
					})
					// 取消返回更新
					this.cancelClick()
				}, 1000)
			},
			unPassClick() {
				uni.showLoading({
					title: '正在提交数据...'
				})
				/**
				 * todo: api请求审批意见
				 */
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '审批不通过！',
						icon: 'none'
					})
					// 取消返回更新
					this.cancelClick()
				}, 1000)
			}
		}
	}
</script>
