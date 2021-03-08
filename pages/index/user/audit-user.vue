<!-- 单位审批 -->
<template>
	<view style="margin-bottom: 100rpx">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="mycard">
				<view v-for="item in cardList" :key="item.id" class="card-item">
					<uni-card is-full :title="item.orgType" is-shadow note="true" :extra="item.createTime"
						:thumbnail="'/static/img/user/agencyOrg.png'" @tapHeader="clickCard(item)">
						<view class="audit-card-content">
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">单位名称</view>
								<view class="flex-item-80">{{item.orgName}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">组织机构代码</view>
								<view class="flex-item-80">{{item.orgNo}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">单位类别</view>
								<view class="flex-item-80">{{item.orgType}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">法定代表人</view>
								<view class="flex-item-80">{{item.orgRepresent}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">注册地</view>
								<view class="flex-item-80">{{item.orgRegAddress}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">审核状态</view>
								<view class="flex-item-80">
									<uni-tag size="small" :text="formatAuditStatus(item.status).text"
										:type="formatAuditStatus(item.status).color" :circle="true"></uni-tag>
								</view>
							</view>
							<view class="uni-flex uni-row">
								<view class="flex-item-20">附件</view>
								<view class="flex-item-80">
									<view v-for="atta in item.attachment" :key="atta.url" @tap="filePreview(atta)">
										<uni-icons color="#007aff" type="paperclip" size="22"></uni-icons>
										<text>{{atta.name}}</text>
									</view>
								</view>
							</view>
						</view>
						<template v-slot:footer>
							<view class="footer-box">
								<view class="iconfont icontongguo my-iconfont text-green" @tap="passClick(item)">通过
								</view>
								<view class="iconfont iconweibiaoti522 my-iconfont text-red" @tap="unPassClick(item)">拒绝
								</view>
							</view>
						</template>
					</uni-card>
				</view>
			</view>
		</mescroll-body>
		<audit-idea ref="popupAuditIdeaRef" :isPass="isPass" :isPaddingBottom="true" @updateQuery="updateQuery">
		</audit-idea>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
	import uniCard from "@/components/uni-card/uni-card"
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import auditIdea from '@/pages/index/audit-idea.vue'
	import {
		mapGetters
	} from 'vuex'
	import {
		filePreview,
		formatAuditStatus
	} from '@/utils/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			uniCard,
			uniTag,
			uniIcons,
			auditIdea
		},
		computed: mapGetters(['user']),
		data() {
			return {
				isPass: false,
				selectedUserItem: {},
				// 列表数据
				cardList: []
			}
		},
		methods: {
			filePreview,
			formatAuditStatus,
			/* 上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				if (!this.user) {
					this.mescroll.endErr()
					return
				}
				this.$minApi.listAuditUser({}, page.num, page.size).then(res => {
					const curPageData = res.data // 当前页面获取数据
					const totalSize = 10 // 后台接口有返回列表的总数据量totalSize
					this.mescroll.endBySize(curPageData.length, totalSize)
					// 设置列表数据
					if (page.num == 1) this.cardList = [] // 如果是第一页需手动置空列表
					this.cardList = this.cardList.concat(curPageData) // 追加新数据
				}).catch(() => {
					this.mescroll.endErr()
				})
			},
			clickCard(item) {
				uni.navigateTo({
					url: '/pages/index/user/detail-user?data=' + JSON.stringify(item)
				})
			},
			passClick(item) {
				this.selectedUserItem = item
				this.isPass = true
				this.$refs.popupAuditIdeaRef.$refs.share.open()
			},
			unPassClick(item) {
				this.selectedUserItem = item
				this.isPass = false
				this.$refs.popupAuditIdeaRef.$refs.share.open()
			},
			async queryByName(name) {
				uni.showLoading({
					title: '正在查询数据...'
				})
				const res = await this.$minApi.listAuditUser()
				if (res.ok()) {
					this.cardList = res.data
				}
				uni.hideLoading()
			},
			updateQuery() {
				this.queryByName()
			}
		}
	}
</script>
