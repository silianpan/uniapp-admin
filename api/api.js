import Vue from 'vue'
import MinRequest from '@/utils/MinRequest'
import globalConfig from '@/config'
import { generateSign } from '@/pages/yzcloud/signclient.js'

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
		// 文档管理接口：HTTP上传文件
		yzEditHttpUploadFile({ fileUrl }) {
			const sign = generateSign(globalConfig.yzEditAPPKEY, {"appId": [globalConfig.yzEditAPPID],
				"fileUrl": [fileUrl]
			})
			return minRequest.post('/api/file/http', {
				fileUrl,
				appId: globalConfig.yzEditAPPID,
				sign
			}, {
				baseURL: globalConfig.yzDmcUrl
			})
		},
		// 格式转换接口
		yzConvertFile(params) {
			const sign = generateSign(globalConfig.yzFormatConvertAPPKEY, {"appId": [globalConfig.yzFormatConvertAPPID],
				"fileVersionId": [params.fileVersionId],
				"convertType": [params.convertType],
				"destinationName": [params.destinationName]
			})
			return minRequest.post('/api/convert/file', { ...params,
				appId: globalConfig.yzFormatConvertAPPID,
				sign
			}, {
				baseURL: globalConfig.yzEicUrl,
				header: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			})
		}
		// 文档管理接口：上传文件
		// yzPreviewUploadFile({ file }) {
		// 	const sign = ''
		// 	return minRequest.post('/api/file/upload', {
		// 		file,
		// 		appId: globalConfig.yzPreviewAPPID,
		// 		sign
		// 	}, {
		// 		baseURL: globalConfig.yzDmcUrl
		// 	})
		// },
		// 永中云预览-在线预览
		// yzPreviewFile({ fileVersionId }) {
		// 	const sign = ''
		// 	return minRequest.get('/api/view/file', {
		// 		fileVersionId,
		// 		appId: globalConfig.yzPreviewAPPID,
		// 		sign
		// 	}, {
		// 		baseURL: globalConfig.yzEicUrl
		// 	})
		// }
	}
}
