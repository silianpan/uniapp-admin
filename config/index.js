/**
 * ip地址或域名
 */
const ipAddress = 'http://113.62.127.199:38080/app/mock/16'
// 文件访问地址
const fileAddr = 'http://localhost:8082/fileUpload/'
/**
 * api前缀
 */
const apiPrefix = '/apiUA'
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
export default {
	/**
	 * 针对不同平台的baseUrl
	 */
	baseUrl: getBaseUrl(),
	fileAddr
}
