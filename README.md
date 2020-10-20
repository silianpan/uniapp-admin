<p align="center">
  <a href="http://silianpan.cn/ua-doc/">
    <img width="200" src="http://silianpan.cn/ua-doc/logo.png">
  </a>
</p>

<h1 align="center">uniapp-admin</h1>

<div align="center">

Muti-platform management system for uniapp, H5, Android, IOS, Min Program.

基于uni-app管理系统模板，支持H5、Android、IOS和小程序

[![doc][doc-image]][doc-url] [![gitee][gitee-image]][gitee-url] [![uni-app-deps][uni-app-image]][uni-app-url] [![GitHub stars][github-starts-image]][github-url] [![GitHub commit activity][github-commit-activity-url]][github-url] [![GitHub top language][github-top-language-image]][github-url] [![GitHub license][license-image]][github-url]

[uni-app-image]: https://img.shields.io/badge/uni--app-latest-%2342b983
[uni-app-url]: https://uniapp.dcloud.io/
[github-starts-image]: https://img.shields.io/github/stars/silianpan/uniapp-admin?style=social
[github-url]: https://github.com/silianpan/uniapp-admin
[github-commit-activity-url]: https://img.shields.io/github/commit-activity/m/silianpan/uniapp-admin
[github-top-language-image]: https://img.shields.io/github/languages/top/silianpan/uniapp-admin?color=%234fc08d
[license-image]: https://img.shields.io/github/license/silianpan/uniapp-admin
[doc-image]: https://img.shields.io/badge/document-latest-blue
[doc-url]: http://silianpan.cn/ua-doc/
[gitee-image]: https://gitee.com/twofloor/uniapp-admin/badge/star.svg?theme=dark
[gitee-url]: https://gitee.com/twofloor/uniapp-admin/stargazers

</div>

## uniapp-admin 2.0.0 重磅发布！

* 更加完善的开发指南
* 主题定制：支持颜色主题和深色模式，页面更加美观
* 国际化/多语言：应用内容和pages.json国际化，支持N种语言
* 引入iconfont：海量字体图标支持
* 引入rap2接口管理平台：支持在线Mock数据模拟
* 接口请求：不同API可以单独配置baseURL
* 调整App升级方案：无缝升级更容易
* 消息推送，在线文档预览，跨域等多种解决方案

### [在线文档](http://ua-doc.silianpan.cn)

> 提示：Android二维码使用手机浏览器扫<br>
> 用户名：admin 密码：admin

<img src="http://silianpan.cn/wp-content/uploads/2020/08/wp_editor_md_5130d93e34fca6703f465b8d173cd042.jpg" width="120" alt="h5"/>
<img src="http://silianpan.cn/wp-content/uploads/2020/08/wp_editor_md_5e73998d5012227676299f651d760cf2.jpg" width="120" alt="android"/>

### 代码地址

[Github](https://github.com/silianpan/uniapp-admin)

[Gitee](https://gitee.com/twofloor/uniapp-admin)

<img src="http://silianpan.cn/wp-content/uploads/2020/08/ua.gif" alt="ua-gif"/>

### 一、前言

&emsp;&emsp;uniapp-admin是基于uni-app开发的管理系统模板。该模板集成了如下的功能：

* **UI方面**：登陆模板、顶部固定搜索框、顶部滑动选项卡、字段信息卡片、一周信息卡片、时间轴
* **功能方面**：下拉刷新上拉加载功能、文件在线预览功能
* **内置组件**：底部标签导航、顶部导航栏、商品导航、uni ui
* **第三方插件**
  * **UI库** [colorUI css库](http://ext.dcloud.net.cn/plugin?id=239)、[ThorUI组件库](https://ext.dcloud.net.cn/plugin?id=556)([参考UI方案](https://ask.dcloud.net.cn/article/35489))
  * **其他** [uCharts高性能跨全端图表](https://ext.dcloud.net.cn/plugin?id=271)、[mescroll-支持uni-app的下拉刷新上拉加载组件 ](https://ext.dcloud.net.cn/plugin?id=343)、[日期时间选择器tui-datetime](http://ext.dcloud.net.cn/plugin?id=239)
* **解决方案(重要)**
  * 文件在线预览方案，另见文章[《跨平台（uni-app）文件在线预览解决方案》](https://github.com/silianpan/uniapp-admin/blob/master/FILE_PREVIEW.md)
  * 开发环境和生产环境跨域方案
  * APP整包升级/更新方案
  * API调用方案
  * 消息推送方案，另见文章[《uni-app消息推送方案》](https://github.com/silianpan/uniapp-admin/blob/master/PUSH_MESSAGE.md)

&emsp;&emsp;如果有欠缺的地方，或者有更好的想法，大家可以**多多交流**，文章最后可以加我。

### 二、开发环境和生产环境跨域方案

> 跨域的解决方法之一就是采用**代理**

#### 2.1 开发环境

* 在manifest.json源码视图中，修改h5部分，添加端口port和代理proxy。

```json
"h5" : {
  "devServer" : {
      "port" : 9090,
      "disableHostCheck" : true,
      "proxy" : {
          "/ua/ua-service" : {
              "target" : "http://localhost:8080",
              "changeOrigin" : true,
              "secure" : false,
              "pathRewrite" : {
                  "^/ua" : ""
              }
          },
          "/ua-service" : {
              "target" : "http://localhost:8080",
              "changeOrigin" : true,
              "secure" : false
          }
      }
  },
  "title" : "uniapp-admin",
  "router" : {
      "mode" : "hash",
      "base" : "/ua"
  }
}
```

* 根据不同平台，自定义全局配置baseUrl，[参考代码](https://github.com/silianpan/uniapp-admin/blob/master/config/index.js)

> 原理：h5端配置api前缀，然后proxy代理（在manifest.json的proxy）；
> APP端不存在跨域问题，直接配置全域名或ip地址即可

```js
/**
 * ip地址或域名
 */
const ipAddress = 'http://localhost:8080'
// 文件访问地址
const fileAddr = 'http://localhost:8082/fileUpload/'
/**
 * api前缀
 */
const apiPrefix = '/ua-service'
/**
 * 针对不同平台的baseUrl
 */
const getBaseUrl = () => {
	// #ifdef H5
	return apiPrefix
	// #endif
	// #ifndef H5
	return ipAddress + apiPrefix
	// #endif
}
export default {
	/**
	 * 针对不同平台的baseUrl
	 */
	baseUrl: getBaseUrl(),
	fileAddr
}
```

* 在ui.request的参数选项中配置baseUrl，[参考代码](https://github.com/silianpan/uniapp-admin/blob/master/api/api.js)

```js
// 设置默认配置
minRequest.setConfig((config) => {
	config.baseURL = globalConfig.baseUrl
	return config
})
```

#### 2.2 生产环境

> 生产环境的跨域，典型的方案就是采用Nginx代理

配置如下：

```conf
# 前端访问代理
location /ua {
  alias /root/ua;
  index index.html index.htm;
  try_files $uri $uri/ /index.html?/$request_uri;
}
# 服务端代理，对应开发环境proxy
location ~/ua/ua-service/* {
  rewrite ^/ua/(.*)$ /$1 break;
  proxy_pass http://service;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_connect_timeout 360000s;
  proxy_read_timeout 360000s;
  proxy_send_timeout 360000s;
}
# 服务端代理，对应开发环境proxy
location ~/ua-service/* {
  proxy_pass http://service;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_connect_timeout 360000s;
  proxy_read_timeout 360000s;
  proxy_send_timeout 360000s;
}
```

其中*proxy_pass http://service*的service是配置在nginx的http{}下的后端服务

```config
upstream service {
  server 127.0.0.1:8080 max_fails=1 fail_timeout=10s;
}
```

rewrite ^/ua/(.*)$ \/\$1 break;是路径替换，第一个参数是正则表达式，\$1是正则表达式中第一个括号内容。

### 三、APP整包升级/更新方案

参考文档，[uni-app 整包升级/更新方案 ](https://ask.dcloud.net.cn/article/34972)，另外也有，[uni-app 资源在线升级/热更新](https://ask.dcloud.net.cn/article/35667)

本项目是采用整包升级更新方案，如下：

```js
/**
  * app整包更新检测
  */
appUpgrade() {
  //#ifndef APP-PLUS
  uni.showToast({
    title: '目前只支持Android版本软件更新',
    icon: 'none'
  })
  //#endif
  //#ifdef APP-PLUS
  uni.getSystemInfo({
    success: sysInfo => {
      let platform = sysInfo.platform
      plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
        // app版本字符串如：1.1.0
        // this.appInfo.version = wgtinfo.version
        // app名称
        // this.appInfo.name = wgtinfo.name
        let params = {
          appid: plus.runtime.appid,
          // app整数版本号，如110，一定要用versionCode做判断
          version: wgtinfo.versionCode,
          platform: platform
        }
        this.$minApi.findUpgradeApp(params).then(appRes => {
          if (appRes.appid) {
            uni.showModal({
              title: "下载更新提示",
              content: appRes.note,
              showCancel: false,
              confirmText: '确定',
              success: sucRes => {
                if (sucRes.confirm) {
                  plus.runtime.openURL(appRes.url)
                  // uni.downloadFile({
                  //     url: appRes.url,
                  //     success: res => {}
                  // })
                }
              }
            })
          } else {
            uni.showToast({
              title: '已经是最新版本了。',
              icon: 'none'
            })
          }
        })
      })
    }
  })
  //#endif
}
```

<span style="color:red">注意：一定要使用plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) =>())，回调函数返回的wgtinfo对象的versionCode做判断，wgtinfo.version是版本字符串，wgtinfo.name是app应用名称</span>

### 四、API调用方案

核心是调用uni.request，[参考代码](https://github.com/silianpan/uniapp-admin/blob/master/utils/MinRequest.js)

```js
request(options = {}) {
  options.baseURL = options.baseURL || this[config].baseURL
  options.dataType = options.dataType || this[config].dataType
  options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
  options.data = options.data
  options.header = { ...options.header,
    ...this[config].header
  }
  options.method = options.method || this[config].method

  options = { ...options,
    ...MinRequest[requestBefore](options)
  }

  return new Promise((resolve, reject) => {
    options.success = function(res) {
      resolve(MinRequest[requestAfter](res))
    }
    options.fail = function(err) {
      reject(MinRequest[requestAfter](err))
    }
    uni.request(options)
  })
}
```

### 五、消息推送方案

另见文章[《uni-app消息推送方案》](https://github.com/silianpan/uniapp-admin/blob/master/PUSH_MESSAGE.md)

### 六、问题解决

#### 6.1 怎么获取应用真正的名称和版本信息？

一定要使用plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) =>())，回调函数返回的wgtinfo对象的versionCode做判断，wgtinfo.version是版本字符串，wgtinfo.name是app应用名称

#### 6.2 APP端，模板中v-for不能调用方法，如：v-for="xxx in func(xxx)"，这种情况下，func方法不会调用。具体原理不太清楚，还请大佬能解释一下不？

解决办法：提前将数据格式化好，然后套上模板。

### 七、后续计划

- [x] 消息推送

大家也可以提出想要的模板或功能

### 八、效果

#### 开源不易，且用且珍惜

#### 赞助作者

<img src="http://silianpan.cn/wp-content/uploads/2019/10/b9c369443b192642f975be9020b3234e.png" width="120"/>
<img src="http://silianpan.cn/wp-content/themes/yusi1.0/img/weixin.gif" width="120" />

转载请注明：[溜爸 » 基于uni-app多平台管理系统模板uniapp-admin](http://silianpan.cn/index.php/2019/10/26/uniapp_admin/)
