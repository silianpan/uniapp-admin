import CryptoJS from 'crypto-js'

function uniqSortParams(params) {
	delete params.sign

	var var5 = []
	var var6 = 0
	for (var key in params) {
		var5[var6] = key
		var6++
	}
	var5.sort(function(a, b) {
		return a.localeCompare(b, 'zh-CN')
	})

	var result = ""
	for (var var7 = 0; var7 < var5.length; var7++) {
		var key = var5[var7]
		var var8 = params[key]
		var8.sort(function(a, b) {
			return a.localeCompare(b, 'zh-CN')
		})

		if (var8 != null && var8.length > 0) {
			for (var var9 = 0; var9 < var8.length; var9++) {
				result += key + "=" + var8[var9]
			}
		} else {
			result += key + "="
		}
	}
	return result
}

function hmacSHA256(data, key) {
	data != null ? data : ""
	var var2 = CryptoJS.HmacSHA256(data, key)
	var var3 = var2.toString(CryptoJS.enc.Hex)
	return var3.toUpperCase()
}

export const generateSign = (secret, params) => {
	var fullParamStr = uniqSortParams(params)
	return hmacSHA256(fullParamStr, secret)
}
