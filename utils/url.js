/**
 * 获取href页面参数key
 */
export const getQueryString = key => {
  // 方法一：正则
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null

  // 方法二：字符串
  // var url = window.location.search;
  // var theRequest = new Object();
  // if (url.indexOf("?") != -1) {
  // var str = url.substr(1);
  // var strs = str.split("&");
  // for (var i = 0; i < strs.length; i++) {
  //     theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
  //     }
  // }
}

/**
 * 获取url中的参数key
 */
export const getQueryString4Url = (url, key) => {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
  const r = url.substr(url.indexOf('?') + 1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
