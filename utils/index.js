import globalConfig from '@/config'

/**
 * 随机从数据中选取n项元素
 */
export const getRandomArrayElements = (arr, count) => {
	var shuffled = arr.slice(0),
		i = arr.length,
		min = i - count,
		temp, index
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random())
		temp = shuffled[index]
		shuffled[index] = shuffled[i]
		shuffled[i] = temp
	}
	return shuffled.slice(min)
}

export const formatArr = (segmentType, sep = '/') => {
	let result = ''
	if (segmentType) {
		try {
			const segmentArr = JSON.parse(segmentType)
			segmentArr.forEach(item => {
				result += item + sep
			})
		} catch (error) {
			return segmentType
		}
	}
	if (result) {
		let len = sep.length > 1 ? 2 : 1
		result = result.substring(0, result.length - len)
	}
	return result
}
export const formatProjectType = pt => {
	if (!pt) {
		return ''
	}
	if (pt.indexOf('工程施工') !== -1) {
		return 'build.png'
	} else if (pt.indexOf('采购') !== -1) {
		return 'purchase.png'
	} else if (pt.indexOf('软件研发') !== -1) {
		return 'asset.png'
	} else if (pt.indexOf('系统集成') !== -1) {
		return 'land.png'
	}
	return ''
}
// 格式化附件json字符串
export const formatJsonStr = attaJsonStr => {
	if (attaJsonStr && attaJsonStr.length > 0) {
		try {
			return JSON.parse(attaJsonStr)
		} catch (e) {
			return []
		}
	}
	return []
}

export const formatAuditStatus = status => {
	let text = ''
	let color = ''
	switch (status) {
		case '-1':
			;
			(() => {
				text = '未提交'
				color = 'primary'
			})()
			break
		case '0':
			;
			(() => {
				text = '不通过'
				color = 'error'
			})()
			break
		case '1':
			;
			(() => {
				text = '通过'
				color = 'success'
			})()
			break
		default:
			;
			(() => {
				text = '待审核'
				color = 'warning'
			})()
			break
	}
	return {
		color,
		text
	}
}

/**
 * 附件预览
 * @param {Object} atta附件{name:'',url:''}
 */
export const filePreview = atta => {
	let name = atta.name
	let url = atta.url
	// 判断文件类型
	if (url && typeof url === 'string') {
		let index = url.lastIndexOf('.')
		let suffix = url.substring(index + 1)
		if (suffix) {
			suffix = suffix.toLowerCase()
			switch (suffix) {
				case 'pdf':
				case 'doc':
				case 'docx':
				case 'xls':
				case 'xlsx':
				case 'ppt':
				case 'pptx':
					// 转换为pdf进行预览
					uni.navigateTo({
						url: '/pages/file/file_preview?name=' + name + '&url=' + url
					})
					break
				case 'jpg':
				case 'jpeg':
				case 'png':
				case 'bmp':
				case 'gif':
					// 预览图片
					uni.previewImage({
						urls: [globalConfig.fileAddr + url],
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
							success: function(data) {
								console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						}
					})
					break
			}
		}
	}
}
