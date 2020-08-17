import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from './en-US'
import zhCN from './zh-CN'
Vue.use(VueI18n)

let lang = uni.getStorageSync('_lang').data
if (!lang || lang === 'System') {
	const res = uni.getSystemInfoSync()
	lang = res.language
	uni.setStorageSync('_lang', 'System')
}

const i18n = new VueI18n({
	locale: lang,
	fallbackLocale: 'en',
	silentFallbackWarn: true,
	messages: {
		'en': enUS,
		'zh-CN': zhCN
	}
})
export default i18n
