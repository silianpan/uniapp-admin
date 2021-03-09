/**
 * ip地址或域名
 */
const ipAddress = 'http://113.62.127.199:38080/app/mock/16'
// 文件访问地址
const fileAddr = 'http://localhost:8082/fileUpload/'

// 永中云服务-云预览
// 文档管理接口url
const yzPreviewDmc = 'http://dmc.yozocloud.cn'
const yzPreviewEic = 'http://eic.yozocloud.cn'
const yzPreviewAPPID = 'yozoqCDmN6GZ2936'
const yzPreviewAPPKEY = 'af0f63cf10f8e1918001d685f5c4'
/**
 * api前缀
 */
const apiPrefix = '/apiUA'
const apiYzPreviewDmc = '/apiYzPreviewDmc'
const apiYzPreviewEic = '/apiYzPreviewEic'
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
const getYzPreviewDmc = () => {
	// #ifdef H5
	return apiYzPreviewDmc
	// #endif
	// #ifndef H5
	return yzPreviewDmc
	// #endif
}
const getYzPreviewEic = () => {
	// #ifdef H5
	return apiYzPreviewEic
	// #endif
	// #ifndef H5
	return yzPreviewEic
	// #endif
}
export default {
	/**
	 * 针对不同平台的baseUrl
	 */
	baseUrl: getBaseUrl(),
	fileAddr,
	yzPreviewDmcUrl: getYzPreviewDmc(),
	yzPreviewEic,
	yzPreviewEicUrl: getYzPreviewEic(),
	yzPreviewAPPID,
	yzPreviewAPPKEY
}
