<!-- 单位明细 -->
<template>
	<view>
		<view class="place-detail">
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">审核状态</view>
					<view class="flex-item-70">
						<uni-tag size="small" :text="formatAuditStatus(item.status).text" :type="formatAuditStatus(item.status).color"
						 :circle="true"></uni-tag>
					</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">附件</view>
					<view class="flex-item-70">
						<view v-for="atta in item.attachment" :key="atta.url" @tap="filePreview(atta)">
							<uni-icons color="#007aff" type="paperclip" size="22"></uni-icons><text>{{atta.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white" v-if="item.opinionList && item.opinionList.length > 0">
				<view class="uni-flex uni-row">
					<view class="uni-timeline">
						<!-- opIndex===0?'uni-timeline-first-item':(opIndex===(item.opinionList.length-1)?'uni-timeline-last-item':'') -->
						<view v-for="(opinion,opIndex) in item.opinionList" :key="opinion.id" class="uni-timeline-item" :class="opIndex===0?'uni-timeline-first-item':(opIndex===(item.opinionList.length-1)?'uni-timeline-last-item':'')">
							<view class="uni-timeline-item-keynode">{{opinion.createTime}}</view>
							<view class="uni-timeline-item-divider"></view>
							<view class="uni-timeline-item-content">
								<view>
									{{`${opinion.examiner}-${opinion.opinion}`}}
								</view>
								<view>
									<uni-tag :inverted="true" size="small" :text="formatAuditStatus(opinion.status).text" :type="formatAuditStatus(opinion.status).color"
									 :circle="false"></uni-tag>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>基本信息
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">单位名称</view>
					<view class="flex-item-70">{{item.orgName}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">组织机构代码</view>
					<view class="flex-item-70">{{item.orgNo}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">单位类别</view>
					<view class="flex-item-70">{{item.orgType}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">法定代表人</view>
					<view class="flex-item-70">{{item.orgRepresent}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">注册地</view>
					<view class="flex-item-70">{{item.orgRegAddress}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">注册资本(万元)</view>
					<view class="flex-item-70">{{item.regCapital}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">联系人</view>
					<view class="flex-item-70">{{item.orgContact}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">联系人电话</view>
					<view class="flex-item-70">{{item.orgContactPhone}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">提交时间</view>
					<view class="flex-item-70">{{item.commitTime}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">注册时间</view>
					<view class="flex-item-70">{{item.createTime}}</view>
				</view>
			</view>

			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>银行账号信息
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">开户银行</view>
					<view class="flex-item-70">{{item.basicBank}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">开户支行</view>
					<view class="flex-item-70">{{item.basicBranchBank}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">开户账号</view>
					<view class="flex-item-70">{{item.basicAccountNo}}</view>
				</view>
			</view>
			<view class="padding-lr padding-tb-xs bg-white">
				<view class="uni-flex uni-row">
					<view class="flex-item-30">银行账户名称</view>
					<view class="flex-item-70">{{item.basicAccountName}}</view>
				</view>
			</view>

			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>单位员工
				</view>
			</view>
			<view class="margin-top-sm" v-for="contactItem in item.orgContactList" :key="contactItem.id">
				<view class="padding-lr padding-tb-xs bg-white">
					<view class="uni-flex uni-row">
						<view class="flex-item-30">姓名</view>
						<view class="flex-item-70">{{contactItem.name}}</view>
					</view>
				</view>
				<view class="padding-lr padding-tb-xs bg-white">
					<view class="uni-flex uni-row">
						<view class="flex-item-30">身份证号码</view>
						<view class="flex-item-70">{{contactItem.idCard}}</view>
					</view>
				</view>
				<view class="padding-lr padding-tb-xs bg-white">
					<view class="uni-flex uni-row">
						<view class="flex-item-30">电话</view>
						<view class="flex-item-70">{{contactItem.phone}}</view>
					</view>
				</view>
				<view class="padding-lr padding-tb-xs bg-white">
					<view class="uni-flex uni-row">
						<view class="flex-item-30">详细地址</view>
						<view class="flex-item-70">{{contactItem.address}}</view>
					</view>
				</view>
				<view class="padding-lr padding-tb-xs bg-white">
					<view class="uni-flex uni-row">
						<view class="flex-item-30">附件</view>
						<view class="flex-item-70">
							<view v-for="atta in contactItem.attachment" :key="atta.url" @tap="filePreview(atta)">
								<uni-icons color="#007aff" type="paperclip" size="22"></uni-icons><text>{{atta.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-carts">
			<uni-goods-nav :options="options" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
		<audit-idea ref="popupAuditIdeaRef" :isPass="isPass" @updateQuery="updateQuery"></audit-idea>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import auditIdea from '@/pages/index/audit-idea.vue'
	import {
		filePreview,
		formatArr,
		formatAuditStatus
	} from '@/utils/index.js'
	export default {
		components: {
			uniGoodsNav,
			uniTag,
			uniIcons,
			auditIdea
		},
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
		},
		data() {
			return {
				isPass: false,
				item: {},
				options: [],
				buttonGroup: [{
						text: '拒绝',
						backgroundColor: '#e54d42',
						color: '#fff'
					},
					{
						text: '通过',
						backgroundColor: '#39b54a',
						color: '#fff'
					}
				]
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('UserApproval')
			})
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
		onLoad(options) {
			try {
				this.item = JSON.parse(options.data)
			} catch (e) {
				this.item = []
			}
		},
		methods: {
			filePreview,
			formatAuditStatus,
			onClick(e) {},
			buttonClick(e) {
				if (e.index === 0) {
					this.isPass = false
					this.$refs.popupAuditIdeaRef.$refs.share.open()
				} else if (e.index === 1) {
					this.isPass = true
					this.$refs.popupAuditIdeaRef.$refs.share.open()
				}
			},
			updateQuery() {
				// 更新数据
				let pages = getCurrentPages()
				// let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2] //上一个页面
				prevPage.isDoRefresh = true
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 1000)
			}
		}
	}
</script>

<style>
	.place-detail {
		/* margin: 27rpx 20rpx 104rpx 20rpx; */
		padding-bottom: 104rpx;
	}

	/* .place-detail .uni-row {
		margin: 5rpx 0;
	} */
</style>
