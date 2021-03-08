<!-- 项目查询 -->
<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="mycard">
				<view v-for="item in cardList" :key="item.id" class="card-item">
					<uni-card is-full :title="item.projectType" is-shadow :extra="item.createTime"
						:thumbnail="`/static/img/project/${formatProjectType(item.projectType)}`"
						@tapHeader="clickCard(item)">
						<view class="audit-card-content">
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">项目名称</view>
								<view class="flex-item-80">{{item.projectName}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">项目类型</view>
								<view class="flex-item-80">{{item.projectType}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">所在区域</view>
								<view class="flex-item-80">{{item.area}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">项目地址</view>
								<view class="flex-item-80">{{item.addr}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">立项人</view>
								<view class="flex-item-80">{{item.createUser}}</view>
							</view>
							<view class="uni-flex uni-row" @tap="clickCard(item)">
								<view class="flex-item-20">审核状态</view>
								<view class="flex-item-80">
									<uni-tag size="small" :text="formatAuditStatus(item.auditStatus).text"
										:type="formatAuditStatus(item.auditStatus).color" :circle="true"></uni-tag>
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
					</uni-card>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
	import uniCard from "@/components/uni-card/uni-card"
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import {
		mapGetters
	} from 'vuex'
	import {
		filePreview,
		formatAuditStatus,
		formatProjectType
	} from '@/utils/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			uniCard,
			uniTag,
			uniIcons
		},
		computed: mapGetters(['user']),
		data() {
			return {
				isPass: false,
				selectedProject: {},
				// 列表数据
				cardList: []
			}
		},
		methods: {
			filePreview,
			formatAuditStatus,
			formatProjectType,
			/* 上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				if (!this.user) {
					this.mescroll.endErr()
					return
				}
				this.$minApi.listAuditProject({}, page.num, page.size).then(res => {
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
					url: '/pages/project/project-detail?data=' + JSON.stringify(item)
				})
			},
			async queryByName(name) {
				uni.showLoading({
					title: '正在查询数据...'
				})
				const res = await this.$minApi.listAuditProject()
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

<style>
	.mescroll-totop {
		opacity: 1 !important;
	}
</style>
