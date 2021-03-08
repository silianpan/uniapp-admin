import Vue from 'vue'
const HttpErrorCode = {
	400: '请求错误',
	401: '未授权，请登陆',
	403: '拒绝访问',
	404: '请求地址出错',
	408: '请求超时',
	500: '服务器内部错误',
	501: '服务未实现',
	502: '网关错误',
	503: '服务不可用',
	504: '网关超时',
	505: 'HTTP版本不受支持'
}

// 去抖
function debounce(fn, wait) {
	let callback = fn
	let timerId = null

	function debounced() {
		// 保存作用域
		let context = this
		// 保存参数，例如 event 对象
		let args = arguments

		clearTimeout(timerId)
		timerId = setTimeout(function() {
			callback.apply(context, args)
		}, wait)
	}

	// 返回一个闭包
	return debounced
}

// 节流
function throttle(fn, wait) {
	let callback = fn
	let timerId = null

	// 是否是第一次执行
	let firstInvoke = true

	function throttled() {
		let context = this
		let args = arguments

		// 如果是第一次触发，直接执行
		if (firstInvoke) {
			callback.apply(context, args)
			firstInvoke = false
			return
		}

		// 如果定时器已存在，直接返回。        
		if (timerId) {
			return
		}

		timerId = setTimeout(function() {
			// 注意这里 将 clearTimeout 放到 内部来执行了
			clearTimeout(timerId)
			timerId = null

			callback.apply(context, args)
		}, wait)
	}

	// 返回一个闭包
	return throttled
}

/**
 * 跳转到登录页面
 */
const goLoginDebounce = debounce(
	function() {
		Vue.prototype.$store.dispatch('logout')
	},
	250
)
/**
 * 展示出错误信息
 */
const showErrorMsg = debounce(
	function(msg) {
		uni.showToast({
			title: msg,
			icon: 'none'
		})
	},
	250
)

/**
 *
 *检查reponse返回状态
 * @author silianpan
 * @date 2019-11-29
 * @param {*} [response={}]
 * @returns
 */
export const checkStatus = (response = {}) => {
	let {
		status,
		statusText
	} = response
	if (status === 200 || status === 304) {
		return response.data
	} else {
		let msg = HttpErrorCode[status] || statusText
		showErrorMsg(msg)
		return {
			code: status,
			msg: msg
		}
	}
}

/**
 *检查登录状态
 *
 * @author silianpan
 * @date 2019-11-29
 * @param {*} response
 * @returns
 */
export const checkLogin = (response) => {
	let { code } = response
	if (code === 401) {
		goLoginDebounce()
	}
	return response
}
/**
 *检查服务器返回结果
 * @author silianpan
 * @date 2019-11-29
 * @param {*} result
 * @returns
 */
export const checkResult = (result) => {
	// 对后台返回结果检测
	// if (!result.isOk) {
	// 	showErrorMsg(result.errMsg || '请求失败')
	// }
	let { code } = result
	result.ok = function() {
		return false
	}
	if (code === 200) {
		result.ok = function() {
			return true
		}
	} else {
		showErrorMsg(result.msg || HttpErrorCode[code] || '请求失败')
	}
	return result
}
