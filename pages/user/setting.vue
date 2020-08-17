<!-- setting -->
<template>
	<scroll-view scroll-y :class="darkMode?'custom-dark':'custom-light'" class="w-h-100">
		<view class="bg-white margin-top-xs">
			<view class="cu-list menu sm-border u-skeleton-rect">
				<view class="cu-item arrow" @tap="tapLang">
					<view class="content">
						<text class="list-left-icon cu-avatar round bg-purple iconfont iconyuyan1" />
						<text class="user-item padding-left-sm">{{ $t('Language') }}</text>
					</view>
					<view class="action">
						<view>{{ $t(currentLang) }}</view>
					</view>
				</view>
				<view class="cu-item arrow" @tap="tapTheme">
					<view class="content">
						<text class="list-left-icon cu-avatar round bg-red iconfont icontheme" />
						<text class="user-item padding-left-sm">{{ $t('Theme') }}</text>
					</view>
					<view class="action">
						<view class="cu-tag round light text-white" :style="{backgroundColor:themeBgColor}">{{ currentTheme }}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="list-left-icon cu-avatar round bg-orange iconfont iconyueliang" />
						<text class="user-item padding-left-sm">{{ $t('DarkMode') }}</text>
					</view>
					<view class="action">
						<!-- <u-switch v-model="darkModeChecked" @change="changeDarkMode" /> -->
						<switch color="#2979ff" :checked="darkModeChecked" @change="changeDarkMode" />
					</view>
				</view>
			</view>
		</view>
		
		<!-- languages modal -->
		<view class="cu-modal bottom-modal" :class="modalLang" @tap="modalLang = null">
			<view class="cu-dialog">
				<view class="cu-list menu">
					<view @tap="clickLang(index)" class="cu-item" v-for="(item, index) in listLang" :key="item.text">
						<view class="content">
							<text>{{item.text}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- theme modal -->
		<view class="cu-modal bottom-modal" :class="modalTheme" @tap="modalTheme = null">
			<view class="cu-dialog">
				<view class="grid col-3 padding-sm">
					<view class="padding-sm" v-for="(item,index) in listTheme" :key="`theme-${index}`" @tap="clickTheme(item)">
						<view class="padding radius text-center shadow-blur" :style="{backgroundColor: item.color}">
							<view class="text-lg text-white">{{item.text}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters(['themeBgColor', 'darkMode']),
			listLang() {
				return [{ text: 'System' },
					{ text: 'English' },
					{ text: '中文' }]
			},
			listTheme() {
				return [
					{ text: this.$t('Dark'), color: '#161a23' },
					{ text: this.$t('Indigo'), color: '#27547d' },
					{ text: this.$t('IndigoBlue'), color: '#177cb0' },
					{ text: this.$t('Volcano'), color: '#fa541c' },
					{ text: this.$t('BluishGreen'), color: '#48c0a3' },
					{ text: this.$t('Blush'), color: '#f9906f' },
					{ text: this.$t('Orange'), color: '#ff8936' },
					{ text: this.$t('Verdant'), color: '#519a73' },
					{ text: this.$t('Water'), color: '#88ada6' },
					{ text: this.$t('Grey'), color: '#808080' },
					{ text: this.$t('PinkGold'), color: '#f2be45' },
					{ text: this.$t('Dim'), color: '#41555d' },
					{ text: this.$t('Verdigris'), color: '#549688' },
					{ text: this.$t('DeepBlack'), color: '#3d3b4f' },
					// { text: this.$t('AgateGreen'), color: '#25f8cb' },
					{ text: this.$t('DarkGreen'), color: '#75878a' }
				]
			}
		},
		data() {
			return {
				darkModeChecked: false,
				modalTheme: null,
				modalLang: null,
				currentLang: '',
				currentTheme: ''
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: this.$t('Settings')
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
		mounted() {
			this.getCurrentLang()
			this.getCurrentTheme()
			this.darkModeChecked = this.darkMode
		},
		methods: {
			getCurrentTheme() {
				const tmp = this.listTheme.filter(item => item.color === this.themeBgColor)
				this.currentTheme = tmp[0].text
			},
			getCurrentLang() {
				this.currentLang = uni.getStorageSync('_lang').data || 'System'
			},
			tapLang() {
				this.modalLang = 'show'
			},
			clickLang(index) {
				if (index === 0) {
					const res = uni.getSystemInfoSync()
					this.$i18n.locale = res.language
					this.$cache.set('_lang', 'System', 0)
				} else if (index === 1) {
					this.$cache.set('_lang', 'en', 0)
					this.$i18n.locale = 'en'
				} else if (index === 2) {
					this.$cache.set('_lang', 'zh-CN', 0)
					this.$i18n.locale = 'zh-CN'
				}
				this.getCurrentLang()
			},
			tapTheme() {
				this.modalTheme = 'show'
			},
			clickTheme(item) {
				this.currentTheme = item.text
				const color = item.color
				this.$store.dispatch('initThemeBgColor', color)
				// navBar-bg-color
				uni.setNavigationBarColor({
				    frontColor: '#ffffff',
				    backgroundColor: color,
				    animation: {
				        duration: 400,
				        timingFunc: 'easeIn'
				    }
				})
			},
			changeDarkMode(e) {
				const status = e.target.value
				this.$store.dispatch('initDarkMode', status)
				this.setDarkMode(status)
			},
			setDarkMode(status) {
				status ? uni.setTabBarStyle({
				  backgroundColor: '#2a2b2d'
				}) : uni.setTabBarStyle({
					backgroundColor: '#ffffff'
				})
			}
		}
	}
</script>
