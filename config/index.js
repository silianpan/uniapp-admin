/**
 * ip地址或域名
 */
const ipAddress = 'http://113.62.127.199:38080/app/mock/16'
// 文件访问地址
const fileAddr = 'http://localhost:8082/fileUpload/'

// 永中云服务
// 文档管理接口url
const yzDmc = 'http://dmc.yozocloud.cn'
const yzEic = 'http://eic.yozocloud.cn'
// 云预览应用信息
const yzPreviewAPPID = 'appId'
const yzPreviewAPPKEY = 'appKey'
// 云编辑应用信息
const yzEditAPPID = 'appId'
const yzEditAPPKEY = 'appKey'
/**
 * api前缀
 */
const apiPrefix = '/apiUA'
const apiYzDmc = '/apiYzDmc'
const apiYzEic = '/apiYzEic'
/**
 * 针对不同平台的baseUrl
 */
const getBaseUrl = () => {
	// #ifdef H5
	return apiPrefix
	// #endif
	// #ifndef H5
	return ipAddress
	// #endif
}
const getYzDmc = () => {
	// #ifdef H5
	return apiYzDmc
	// #endif
	// #ifndef H5
	return yzDmc
	// #endif
}
const getYzEic = () => {
	// #ifdef H5
	return apiYzEic
	// #endif
	// #ifndef H5
	return yzEic
	// #endif
}
export default {
	/**
	 * 针对不同平台的baseUrl
	 */
	baseUrl: getBaseUrl(),
	fileAddr,
	yzDmcUrl: getYzDmc(),
	yzEic,
	yzEicUrl: getYzEic(),
	yzPreviewAPPID,
	yzPreviewAPPKEY,
	yzEditAPPID,
	yzEditAPPKEY
}
