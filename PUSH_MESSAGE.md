---
title: "uni-app消息推送方案"
author: silianpan
date: 2019-11-05
output: word_document
---

## uni-app消息推送方案

### 一、引言

uni-app是支持消息推送的，参考如下文档：

[UniPush介绍](https://uniapp.dcloud.io/api/plugins/push)

[UniPush使用指南](https://ask.dcloud.net.cn/article/35622)

[UniPush开通指南](https://ask.dcloud.net.cn/article/35716)

[如何自定义推送通知的图标？](https://ask.dcloud.net.cn/article/35537)

[在 uni-app 中使用 UniPush](https://ask.dcloud.net.cn/article/35726)

### 二、效果

[开源项目uniapp-admin](https://github.com/silianpan/uniapp-admin)

<img src="http://silianpan.cn/wp-content/uploads/2019/11/1ec88629bb0ade29a374aa2b029abee8.png" width="400" align=center />

### 三、需求

不同角色的用户登陆App，收到不同的待办提醒。即谁处理这个待办任务，谁会收到这个提醒。**对不同角色的用户推送待办消息**

### 四、方案步骤

#### 4.1 查看个推文档

> 因为uni-app的推送是集成了个推，所以查看个推文档接入方案

因为后台是java语言，所以[查看java集成指南](http://docs.getui.com/getui/server/java/guide/)

* 下载服务端SDK开发工具包，下载地址为：http://www.getui.com/download/docs/getui/server/GETUI_JAVA_SDK_4.1.0.5.zip

* 导入"GETUI_SERVER_SDK\资源文件”目录下的所有jar包

```bash
# uni-push
mvn install:install-file -Dfile="gexin-rp-fastjson-1.0.0.3.jar" -DgroupId=com.gexin.platform -DartifactId=gexin-rp-fastjson -Dversion=1.0.0.3 -Dpackaging=jar
mvn install:install-file -Dfile="gexin-rp-sdk-base-4.0.0.30.jar" -DgroupId=com.gexin.platform -DartifactId=gexin-rp-sdk-base -Dversion=4.0.0.30 -Dpackaging=jar
mvn install:install-file -Dfile="gexin-rp-sdk-http-4.1.0.5.jar" -DgroupId=com.gexin.platform -DartifactId=gexin-rp-sdk-http -Dversion=4.1.0.5 -Dpackaging=jar
mvn install:install-file -Dfile="gexin-rp-sdk-template-4.0.0.24.jar" -DgroupId=com.gexin.platform -DartifactId=gexin-rp-sdk-template -Dversion=4.0.0.24 -Dpackaging=jar
mvn install:install-file -Dfile="protobuf-java-2.5.0.jar" -DgroupId=com.google.protobuf -DartifactId=protobuf-java -Dversion=2.5.0 -Dpackaging=jar
```

```xml
<!-- uni push -->
<dependency>
    <groupId>com.gexin.platform</groupId>
    <artifactId>gexin-rp-sdk-base</artifactId>
    <version>4.0.0.30</version>
</dependency>
<dependency>
    <groupId>com.gexin.platform</groupId>
    <artifactId>gexin-rp-sdk-template</artifactId>
    <version>4.0.0.24</version>
</dependency>
<dependency>
    <groupId>com.gexin.platform</groupId>
    <artifactId>gexin-rp-sdk-http</artifactId>
    <version>4.1.0.5</version>
</dependency>
<dependency>
    <groupId>com.gexin.platform</groupId>
    <artifactId>gexin-rp-fastjson</artifactId>
    <version>1.0.0.3</version>
</dependency>
<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>2.5.0</version>
</dependency>
```

#### 4.2 编写服务端简单demo

按照[UniPush开通指南](https://ask.dcloud.net.cn/article/35716)，开通UniPush，获取appId、appKey等，编写下面简单demo，客户端就会收到消息啦~

> 客户端接收消息代码，参考4.3

```java
public class AppPush {

    // STEP1：获取应用基本信息
    private static String appId = "";
    private static String appKey = "";
    private static String masterSecret = "";
    private static String url = "http://sdk.open.api.igexin.com/apiex.htm";

    public static void main(String[] args) throws IOException {

        IGtPush push = new IGtPush(url, appKey, masterSecret);

        Style0 style = new Style0();
        // STEP2：设置推送标题、推送内容
        style.setTitle("请输入通知栏标题");
        style.setText("请输入通知栏内容");
        // 注释采用默认图标
        // style.setLogo("push.png");  // 设置推送图标
        // STEP3：设置响铃、震动等推送效果
        style.setRing(true);  // 设置响铃
        style.setVibrate(true);  // 设置震动

        // STEP4：选择通知模板
        NotificationTemplate template = new NotificationTemplate();
        template.setAppId(appId);
        template.setAppkey(appKey);
        template.setStyle(style);
        // 点击消息打开应用
        template.setTransmissionType(1);
        // 传递自定义消息
        template.setTransmissionContent("自定义消息，可以是json
        字符串");


        // STEP5：定义"AppMessage"类型消息对象,设置推送消息有效期等推送参数
        List<String> appIds = new ArrayList<String>();
        appIds.add(appId);
        AppMessage message = new AppMessage();
        message.setData(template);
        message.setAppIdList(appIds);
        message.setOffline(true);
        message.setOfflineExpireTime(1000 * 600);  // 时间单位为毫秒

        // STEP6：执行推送
        IPushResult ret = push.pushMessageToApp(message);
        System.out.println(ret.getResponse().toString());
    }
}
```

#### 4.3 客户端App.vue添加消息处理逻辑

```js
/**
  * 处理推送消息
  */
handlePush() {
  // #ifdef APP-PLUS
  const _self = this
  const _handlePush = function(message) {
    // 获取自定义信息
    let payload = message.payload
    try {
      // JSON解析
      payload = JSON.parse(payload)
      // 携带自定义信息跳转应用页面
      uni.navigateTo({
        url: '/pages/xxx?data=' + JSON.stringify(payload)
      })
    } catch(e) {}
  }
  // 事件处理
  plus.push.addEventListener('click', _handlePush)
  plus.push.addEventListener('receive', _handlePush)
  // #endif
},
```

### 五、思考

应用确实接收到了消息，但是所有角色的用户都会接收到和自己不想关的待办任务消息。这是违背需求的！所以基于此，作者研究了服务端发送到客户端消息的原理：

> **实际上，消息不管是单推还是群推，推送的目标都是clientid，clientid标识每个客户端的身份**

问题来了，怎么获取客户端的clientid呢？

### 六、最终方案

#### 6.1 获取客户端clientid

经过查询资料，有一个api是getClientInfo方法，可以获取客户端信息，但是必须条件编译，因为是plus接口。

以下代码，用户登陆完成时，获取**客户端信息（appid,appkey,clientid）**、**用户信息（账户名、角色等）**、其他信息，向服务端提交api请求，保存**客户端clientid和角色**的关联信息。

```js
// 保存clientid到服务器
// #ifdef APP-PLUS
const clientInfo = plus.push.getClientInfo()
let pushUser = {
  clientid: clientInfo.clientid,
  appid: clientInfo.appid,
  appkey: clientInfo.appkey,
  userName: '用户名',
  userRole: '用户角色'
}
// 提交api请求，服务端保存客户端角色信息
Vue.prototype.$minApi.savePushUser(pushUser)
// #endif
```

#### 6.2 服务端接收客户端角色信息处理

**服务端接收到信息，根据自己的业务逻辑，保存或者更新**，作者的处理逻辑时已经保存的clientid，不在新增，更新角色信息。

clientid和角色关系，数据库表结构

![数据库表结构](http://silianpan.cn/wp-content/uploads/2019/11/7823380d3887a7d5132e12461fb646a3.png)

#### 6.3 服务端根据不同角色发送待办提醒

改进消息发送方式，采用个推[toList：简称“批量推”，指向制定的一批用户推送消息](http://docs.getui.com/getui/server/java/push/)

```java
/**
* @params pushMessage推送消息
* @params appPushList推送角色目标列表
*/
public static void pushMessage(PushMessage pushMessage, List<AppPush> appPushList) {
  IGtPush push = new IGtPush(url, appKey, masterSecret);

  Style0 style = new Style0();
  // STEP2：设置推送标题、推送内容
  style.setTitle(pushMessage.getTitle());
  style.setText(pushMessage.getContent());
//        style.setLogo("push.png"); // 设置推送图标
  // STEP3：设置响铃、震动等推送效果
  style.setRing(true);  // 设置响铃
  style.setVibrate(true);  // 设置震动

  // STEP4：选择通知模板
  NotificationTemplate template = new NotificationTemplate();
  template.setAppId(appId);
  template.setAppkey(appKey);
  template.setStyle(style);
  // 点击消息打开应用
  template.setTransmissionType(1);
  // 传递自定义消息
  template.setTransmissionContent(JSONUtil.toJsonStr(pushMessage));


  // STEP5：定义"AppMessage"类型消息对象,设置推送消息有效期等推送参数
  // 采用toList方案，定义ListMessage消息类型
//        List<String> appIds = new ArrayList<String>();
//        appIds.add(appId);
  ListMessage message = new ListMessage();
  message.setData(template);
//        message.setAppIdList(appIds);
  message.setOffline(true);
  message.setOfflineExpireTime(1000 * 600);  // 时间单位为毫秒

  String contentId = push.getContentId(message);
  // 获取推送目标
  List targets = new ArrayList();
  for (AppPush ap : appPushList) {
      Target target = new Target();
      target.setAppId(appId);
      target.setClientId(ap.getClientid());
      targets.add(target);
  }

  // STEP6：执行推送，不采用toApp方案，采用toList方案
//        IPushResult ret = push.pushMessageToApp(message);
  IPushResult ret = push.pushMessageToList(contentId, targets);
  System.out.println(ret.getResponse().toString());
}
```

PushMessage类是一个model

```java
public class PushMessage {
    private String title;
    private String content;
    // 用户角色
    private String userRole;
    // 其他对象

    // 省略，getter setter方法
}
```

AppPush类是数据库表映射类

```java
public class AppPush
  private String appid;//appid
  private String appkey;//appkey
  private String clientid;//clientid
  private String userName;//账户
  private String userRole;//用户角色
  // 其他对象

  // 省略，getter setter方法
}
```

### 七、自定义通知图标

在客户端manifest.json文件中的sdkConfigs中添加如下配置，图标自己添加

```json
/* SDK配置 */
"sdkConfigs" : {
    "push" : {
        "unipush" : {
"icons": {
  "push": {
    "ldpi": "unpackage/res/icons/48x48.png",
    "mdpi": "unpackage/res/icons/48x48.png",
    "hdpi" : "unpackage/res/icons/72x72.png",
    "xhdpi" : "unpackage/res/icons/96x96.png",
    "xxhdpi" : "unpackage/res/icons/144x144.png",
    "xxxhdpi" : "unpackage/res/icons/192x192.png"
  },
  "small": {
    "ldpi": "unpackage/res/icons/18x18.png",
    "mdpi": "unpackage/res/icons/24x24.png",
    "hdpi": "unpackage/res/icons/36x36.png",
    "xhdpi": "unpackage/res/icons/48x48.png",
    "xxhdpi": "unpackage/res/icons/72x72.png"
  }
}
}
    }
},
```

### 八、开源项目

[开源项目uniapp-admin](https://github.com/silianpan/uniapp-admin)

#### <center>开源不易，且用且珍惜！</center>

<br>
<center style="font-size:20px">赞助作者</center>
<br>
<center class="half">
<img src="http://silianpan.cn/wp-content/uploads/2019/10/b9c369443b192642f975be9020b3234e.png" width="240"/>

<img src="http://silianpan.cn/wp-content/themes/yusi1.0/img/weixin.gif" width="240" />
</center>
