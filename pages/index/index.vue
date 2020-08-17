<template>
	<view>
		<uni-nav-bar :fixed="true" color="#333333" :background-color="themeBgColor" :border="false">
			<view class="input-view">
				<uni-icons type="search" size="22" color="#666666" />
				<input v-model="searchVal" confirm-type="search" class="input" type="text" placeholder="搜索项目/机构" @confirm="search">
				<uni-icons :color="'#999999'" v-if="searchVal!==''" class="icon-clear" type="clear" size="22" @click="clear" />
			</view>
		</uni-nav-bar>

		<uni-nav-bar :fixed="true" color="#333333" :background-color="themeBgColor" :border="false">
			<scroll-view scroll-x scroll-with-animation :scroll-left="scrollLeft" style="z-index: 9999;">
				<view class="tui-tabs-view tui-tabs-relative text-white" style="height:80rpx;padding:0 30rpx;top:auto" :style="{backgroundColor:themeBgColor}">
					<view v-for="(item, index) in tabbar" :key="index" class="tui-tabs-item" style="width:50%" @tap.stop="swichNav(index)">
						<view class="tui-tabs-title" :class="{'tui-tabs-active':currentTab==index,'tui-tabs-disabled':item.disabled}"
						 :style="{color:currentTab==index?'#ffffb8':'#ffffff',fontSize:'28rpx',lineHeight:'28rpx',fontWeight:false && currentTab==index?'bold':'normal'}">{{item.name}}</view>
					</view>
					<view class="tui-tabs-slider" :style="{transform:'translateX('+scrollLeft+'px)',width:'68rpx',height:'6rpx',bottom:'0rpx',background:'#ffffb8'}"></view>
				</view>
			</scroll-view>
		</uni-nav-bar>
		<swiper :class="darkMode?'custom-dark':'custom-light'" class="tab-content" :current="currentTab" duration="300" @change="switchTab" :style="{height:winHeight+'px'}">
			<swiper-item>
				<scroll-view scroll-y class="scoll-y">
					<audit-project ref="auditProjectRef"></audit-project>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y class="scoll-y">
					<audit-user ref="auditUserRef"></audit-user>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import auditUser from './user/audit-user'
	import auditProject from './project/audit-project'
	import md5 from '@/common/lib/md5.min.js'
	export default {
		components: {
			uniIcons,
			uniNavBar,
			auditUser,
			auditProject
		},
		computed: {
			...mapGetters(['themeBgColor', 'darkMode'])
		},
		data() {
			return {
				bgColor: '#FFFFFF',
				tabbar: [{
					name: '项目审批'
				}, {
					name: '用户审批'
				}],
				winHeight: "", // 窗口高度
				currentTab: 0, // 预设当前项的值
				scrollLeft: 0, // tab标题的滚动条位置
				searchVal: ''
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('ToDo')
			})
			this.setNavBarColor()
			this.setDarkMode()
		},
		watch: {
			themeBgColor() {
				this.setNavBarColor()
			},
			darkMode() {
				this.setDarkMode()
			}
		},
		onLoad() {
			//  高度自适应
			uni.getSystemInfo({
				success: res => {
					this.winHeight = res.windowHeight
					this.winWidth = res.windowWidth
					this.checkCor()
				}
			})
		},
		onShow(e) {
			// setNavBar
			this.setNavBarColor()
			// pages
			let pages = getCurrentPages()
			let currPage = pages[pages.length - 1]
			if (currPage.isDoRefresh === true) {
				currPage.isDoRefresh = false
				this.search()
			}
		},
		methods: {
			setDarkMode() {
				this.darkMode ? uni.setTabBarStyle({
				  backgroundColor: '#2a2b2d'
				}) : uni.setTabBarStyle({
					backgroundColor: '#ffffff'
				})
			},
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
			// swichNav(e) {
			// 	this.currentTab = e.index
			// },
			// 滚动切换标签样式
			switchTab(e) {
				this.currentTab = e.detail.current
				this.checkCor()
			},
			// 判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCorSwitchTab() {
				if (this.currentTab > 3) {
					// 这里距离按实际计算
					this.scrollLeft = 300
				} else {
					this.scrollLeft = 0
				}
			},
			checkCor() {
				let tabsNum = this.tabbar.length
				let padding = this.winWidth / 750 * 30
				let width = this.winWidth - padding * 2
				let left = (width / tabsNum - (this.winWidth / 750 * 68)) / 2 + padding
				let scrollLeft = left
				if (this.currentTab > 0) {
					scrollLeft = scrollLeft + (width / tabsNum) * this.currentTab
				}
				this.scrollLeft = scrollLeft
			},
			// 点击标题切换当前页时改变样式
			swichNav(index) {
				let item = this.tabbar[index]
				if (item && item.disabled) return
				if (this.currentTab == index) {
					return false
				} else {
					this.currentTab = Number(index)
				}
			},
			search() {
				if (this.currentTab == 0) {
					this.$refs.auditProjectRef.queryByName(this.searchVal)
				} else if (this.currentTab == 1) {
					this.$refs.auditUserRef.queryByName(this.searchVal)
				}
			},
			clear() {
				this.searchVal = ''
				this.search()
			}
		}
	}
</script>

<style>
	/* tab start */
	.tui-tabs-view {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 9999;
	}

	.tui-tabs-relative {
		position: relative;
	}

	.tui-tabs-fixed {
		position: fixed;
		left: 0;
	}

	.tui-tabs-fixed::before,
	.tui-tabs-relative::before {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tui-unlined::before {
		border-bottom: 0 !important
	}

	.tui-tabs-item {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-tabs-disabled {
		opacity: .6;
	}

	.tui-tabs-title {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 2;
	}

	.tui-tabs-active {
		transition: all 0.15s ease-in-out;
	}

	.tui-tabs-slider {
		border-radius: 40rpx;
		position: absolute;
		left: 0;
		transition: all 0.15s ease-in-out;
		z-index: 0;
	}

	/* tab end */
</style>
