import Vue from 'vue'
import _ from 'lodash'
export default {
	state: {
		themeBgColor: '',
		darkMode: null
	},
	getters: {
		themeBgColor: state => {
			const color = Vue.prototype.$cache.get('_themeBgColor')
			if (_.isEmpty(color) && _.isEmpty(state.themeBgColor)) {
				return '#27547d'
			}
			return !_.isEmpty(state.themeBgColor) ? state.themeBgColor : color
		},
		darkMode: state => {
			const dark = Vue.prototype.$cache.get('_darkMode')
			if (_.isNil(dark) && _.isNil(state.darkMode)) {
				return false
			}
			return !_.isNil(state.darkMode) ? state.darkMode : dark
		}
	},
	mutations: {
		setThemeBgColor: (state, themeBgColor) => {
			// state.themeBgColor = themeBgColor
			Vue.set(state, 'themeBgColor', themeBgColor)
			Vue.prototype.$cache.set('_themeBgColor', themeBgColor, 0)
		},
		setDarkMode: (state, darkMode) => {
			Vue.set(state, 'darkMode', darkMode)
			Vue.prototype.$cache.set('_darkMode', darkMode, 0)
		}
	},
	actions: {
		initThemeBgColor({ commit }, themeBgColor) {
			commit('setThemeBgColor', themeBgColor)
		},
		initDarkMode({ commit }, darkMode) {
			commit('setDarkMode', darkMode)
		}
	}
}