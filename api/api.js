import Vue from 'vue'
import MinRequest from '@/utils/MinRequest'
import globalConfig from '@/config'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
	return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
	return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
	config.baseURL = globalConfig.baseUrl
	return config
})

export default {
	// 这里统一管理api请求
	apis: {
		login(params) {
			return minRequest.post('/post/user/login', params)
		},
		userPwdModify(params) {
			return minRequest.post('/post/user/pwd/modify', params)
		},
		// 项目审批列表
		listAuditProject() {
			return minRequest.get('/get/audit/project/list')
		},
		// 用户审批列表
		listAuditUser() {
			return minRequest.get('/get/audit/user/list')
		},
		// 永中云预览-上传文件
		yzPreviewUploadFile({ file, appId, sign }) {
			return minRequest.post('/apiYzPreviewDmc/api/file/upload', { file, appId, sign }, {
				baseURL: globalConfig.yzPreviewDmcUrl
			})
		},
		// 永中云预览-在线预览
		yzPreviewFile({ fileVersionId, appId, sign }) {
			return minRequest.post('/apiYzPreviewEic/api/view/file', { fileVersionId, appId, sign }, {
				baseURL: globalConfig.yzPreviewEicUrl
			})
		}
	}
}
