---
title: "跨平台（uni-app）文件在线预览解决方案"
author: silianpan
date: 2019-10-23
output: word_document
---

## 跨平台（uni-app）文件在线预览解决方案

1024刚过，也祝愿各位码友在今后生活中，身体健康，事事顺心，再无Bug。

### 一、前言

> 之前写过一篇文章关于上传目录文件：[uni-app系统目录文件上传（非只图片和视频）解决方案](http://silianpan.cn/index.php/2019/09/22/uniapp_file_upload/)，这次来解决文件预览问题。

&emsp;&emsp;[uni-app](https://uniapp.dcloud.io/) 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、H5、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉）等多个平台。在做业务系统时，不可避免会遇到**文件在线预览**的需求。这里的文件包括**PDF、Word、Excel、PPT、图片**等。而在线预览不是下载后再用本地软件或浏览器打开预览，而是直接通过**文件流**的形式查看。本方案主要解决**在线预览问题**，以及**在uni-app开发过程中遇到一系列问题**。

&emsp;&emsp;如果有欠缺的地方，或者有更好的方案，还望各位码友**多提意见，多多交流**，文章最后可以加我。

> 文件预览，首先会想到pdf预览，前端做pdf预览，首先也会想到[pdf.js](https://github.com/mozilla/pdf.js)，那我们就从[pdf.js](https://github.com/mozilla/pdf.js)说起。


[开源项目uniapp-admin](https://github.com/silianpan/uniapp-admin)

### 二、PDF预览

> pdf.js开源地址和在线例子
> [Github](https://github.com/mozilla/pdf.js)
> [Online Demo](https://mozilla.github.io/pdf.js/web/viewer.html)

#### 2.1 使用方法一

* 下载插件包，[下载地址](https://mozilla.github.io/pdf.js/getting_started/#download)
<img src="http://silianpan.cn/wp-content/uploads/2019/10/492801aebd43986df78941f03c912c79.png" width="240" align=center />

* 解压，拷贝build和web目录到项目**hybrid->html**目录下，参考[uni-app中web-view用法](https://uniapp.dcloud.io/component/web-view)
<img src="http://silianpan.cn/wp-content/uploads/2019/10/b5ed0c0b06379c37a294d571728473bb.png" width="240" align=center />

* 新建vue组件**file-preview.vue**
  * **viewerUrl**：前端本地**viewer.html**页面地址
  * **fileUrl**：文件流访问地址，参考《**三、文件流服务**》

```js
<template>
	<view>
		<web-view :src="allUrl"></web-view>
	</view>
</template>

<script>
	import globalConfig from '@/config'
	export default {
		data() {
			return {
				viewerUrl: '/hybrid/html/web/viewer.html',
				// viewerUrl: globalConfig.baseUrl + '/pdf/web/viewer.html',
				allUrl: ''
			}
		},
		onLoad(options) {
			let fileUrl = encodeURIComponent(
				globalConfig.baseUrl + '/api/attachment?name=' + options.name + '&url=' + options.url)
			this.allUrl = this.viewerUrl + '?file=' + fileUrl
		}
	}
</script>
```

* 效果
  * h5端
  显示正常
  ![](http://silianpan.cn/wp-content/uploads/2019/10/b4f6ea827000afc84939d0fcc0a309c3.png)
  * Android端
  显示模糊，并且**中文显示不全**，其中模糊问题是模拟器原因；但是中文显示问题是真，调试出现两个警告。第二个警告**pdf.js默认不显示电子签章(数字签名)问题**，查了很多资料也没解决，各位码友有遇到过并且解决了吗？
  <img src="http://silianpan.cn/wp-content/uploads/2019/10/13bd0bc4eca43f65e77c1cfe641056db.png" width="360" align=center />
  ![](http://silianpan.cn/wp-content/uploads/2019/10/e8da9ee0c8fa754d592b13f9bd9e45e0.png)
  * iOS端
  出现**跨域问题**，并且调试出现无法访问pdf.js国际化文件
  <img src="http://silianpan.cn/wp-content/uploads/2019/10/32cc3e59ea14d7261c11a8b92a0d0478.png" width="360" align=center />
  ![](http://silianpan.cn/wp-content/uploads/2019/10/05d5c60aaed1873b2a278e91b2fce94d.png)

* 解决
基于Android和iOS预览出现的各种问题，最根本原因是viewer.html文件放到前端导致加载资源文件丢失问题。针对这个问题，我就在想能不能直接放在spring后端作为静态资源访问文件呢？于是有了下面的方法。

#### 2.2 使用方法二

* 在基于**spring mvc**的后端代码中，将插件包的**build和web**文件夹放到**webapp**下面（新建pdf文件夹），spring boot架构的后端项目同理，放到静态资源目录
<img src="http://silianpan.cn/wp-content/uploads/2019/10/1984ff0a6031134fe90b0d7f7d1ba0a8.png" width="400" align=center />

* 在xml文件中配置**静态文件访问**
![](http://silianpan.cn/wp-content/uploads/2019/10/9a58d71e06aff7864d103abe4753e233.png)

* 修改前端组件file-preview.vue中的**viewerUrl**，其中globalConfig.baseUrl为**代理后端地址的baseUrl**。如**Vue中proxyTable**或**nginx代理**
```js
viewerUrl: globalConfig.baseUrl + '/pdf/web/viewer.html'
```

* 修改后效果
  * iOS端
  <img src="http://silianpan.cn/wp-content/uploads/2019/10/0a6f5e98338eb32483b15dea74030f87.png" width="360" align=center />
  * Android端
  模糊是模拟器原因，在真机上测试通过
  <img src="http://silianpan.cn/wp-content/uploads/2019/10/feb95c232a5f71688030ac343d7d8abf.png" width="360" align=center />

### 三、文件流服务

#### 3.1 方法一：tomcat配置

配置tomcat的config目录下的**server.xml**，在最后的&lt;server&gt;&lt;/server&gt;中间添加如下：
> **port=8090** 文件访问服务端口
> **docBase="/root/"** 文件存储目录
> 服务器上文件会存储到/root/fileData/目录下
> 文件访问地址为：<http://ip地址:8090/fileData/文件名>

```xml
<Service name="fileData">  
    <!--分配8089端口 -->  
    <!-- <Connector port="8090" protocol="HTTP/1.1" connectionTimeout="20000" URIEncoding="GBK" redirectPort="8443" /> -->
    <Connector port="8090" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />
    <Engine name="fileData" defaultHost="localhost">  
    <!--name为项目访问地址 此配置的访问为http://localhost:8080 appBase配置tomcat下wabapps下的路径-->     
    <Host name="localhost" appBase="webapps"  
        unpackWARs="true" autoDeploy="true" xmlValidation="false" xmlNamespaceAware="false">  
        <!--资源地址-->  
        <Context path="" docBase="/root/" debug="0" reloadable="false"/>  
    </Host>  
    </Engine>
</Service>
```

#### 3.2 方法二：写代码获取服务器文件进行转换

直接上代码
> 读取目录文件，转换为**二进制流**
> 前端组件file-preview.vue中**fileUrl**为 **/api/attachment**

核心代码

```java
ios = new FileInputStream(sourceFile);
os = response.getOutputStream();
int read = 0;
byte[] buffer = new byte[1024 * 1024];
while ((read = ios.read(buffer)) != -1) {
    os.write(buffer, 0, read);
}
os.flush();
```

完整代码

```java
@RequestMapping(value = "/api/attachment", method = RequestMethod.GET)
    public void getFileBytes(@RequestParam("name") String name, @RequestParam("url") String url, HttpServletRequest request, HttpServletResponse response) {
        response.reset();
        response.setContentType("application/octet-stream");
        response.setCharacterEncoding("utf-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + name);

        AttachmentVO attachmentVO = new AttachmentVO();
        FileInputStream ios = null;
        OutputStream os = null;
        try {
            name = CharsetUtils.toUTF_8(name);
            url = CharsetUtils.toUTF_8(url);

            attachmentVO.setUrl(url);
            attachmentVO.setName(name);
            File sourceFile = getDictionaryFile(attachmentVO, request);
            if (null == sourceFile) {
//                throw new HttpResponseException(300, "附件不存在！");
                return;
            }

            /**
             * 判断文件类型
             */
            /* 获得文件名后缀 */
            String ext = "";
            if (!"".equals(url) && url.contains(".")) {
                ext = url.substring(url.lastIndexOf(".") + 1, url.length()).toUpperCase();
            }
            /* 根据文件类型不同进行预览 */
            /* 预览pdf */
            if ("PDF".equals(ext)) {
                response.setContentType("application/pdf");
            }

            /**
             * 将文件写入输出流,显示在界面上,实现预览效果
             */
            ios = new FileInputStream(sourceFile);
            os = response.getOutputStream();
            int read = 0;
            byte[] buffer = new byte[1024 * 1024];
            while ((read = ios.read(buffer)) != -1) {
                os.write(buffer, 0, read);
            }
            os.flush();
        } catch (Exception e) {
            e.printStackTrace();
            try {
                if (null != ios) {
                    ios.close();
                }
                if (null != os) {
                    os.close();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
```

### 四、office文件（Word、Excel、PPT）预览

> 原理：
> 搭建**OpenOffice**服务，将文件转换为pdf，在使用pdf.js预览

#### 4.1 搭建openOffice服务

* 下载[Apache_OpenOffice](https://sourceforge.net/projects/openofficeorg.mirror/files/)

* 解压

```bash
tar xzvfm Apache_OpenOffice_xxx.tar.gz
cd zh-CN/RPMS
rpm -ivh *rpm
```

* 运行

```bash
# 127.0.0.1只能本机使用该服务
/opt/openoffice4/program/soffice "-accept=socket,host=127.0.0.1,port=8100;urp;" -headless -nofirststartwizard &
# 0.0.0.0远程ip能使用
/opt/openoffice4/program/soffice "-accept=socket,host=0.0.0.0,port=8100;urp;" -headless -nofirststartwizard &
```

#### 4.2 集成java

* 在pom.xml添加jar包

```xml
<!-- openoffice start -->
<dependency>
    <groupId>org.openoffice</groupId>
    <artifactId>juh</artifactId>
    <version>4.1.2</version>
</dependency>
<dependency>
    <groupId>org.openoffice</groupId>
    <artifactId>jurt</artifactId>
    <version>4.1.2</version>
</dependency>
<dependency>
    <groupId>org.openoffice</groupId>
    <artifactId>ridl</artifactId>
    <version>4.1.2</version>
</dependency>
<dependency>
    <groupId>org.openoffice</groupId>
    <artifactId>unoil</artifactId>
    <version>4.1.2</version>
</dependency>
<dependency>
    <groupId>com.artofsolving</groupId>
    <artifactId>jodconverter</artifactId>
    <version>2.2.2</version>
</dependency>
<!-- openoffice end -->
```

<span style="color:red">注意</span>：[jodconverter](https://sourceforge.net/projects/jodconverter/files/)需要单独下载**2.2.2版本**，之前的版本都不行，而且**maven中央仓库没有2.2.2版本**。然后再单独导入。下载地址：<https://sourceforge.net/projects/jodconverter/files/>

单独导入

```bash
mvn install:install-file -Dfile="jodconverter-2.2.2.jar" -DgroupId=com.artofsolving -DartifactId=jodconverter -Dversion=2.2.2 -Dpackaging=jar
```

* 转换代码

核心代码

```java
connection = new SocketOpenOfficeConnection(openofficeHost, openofficePort);
connection.connect();
DocumentConverter converter = new StreamOpenOfficeDocumentConverter(connection);
converter.convert(sourceFile, pdfFile);
```

完整代码

```java
/* 利用openOffice将office文件转换为pdf格式, 然后预览doc, docx, xls, xlsx, ppt, pptx */
if ("DOC".equals(ext) || "DOCX".equals(ext) || "XLS".equals(ext) || "XLSX".equals(ext) || "PPT".equals(ext) || "PPTX".equals(ext)) {
    /* filePath在数据库中是不带文件后缀的, 由于jodConverter必须要识别后缀,所以将服务器中的文件重命名为带后缀的文件 */
    // File docFileWithExt = new File(filePath + "." + ext.toLowerCase()); //带后缀的文件
    // docFile.renameTo(docFileWithExt);
    /* 转换之后的文件名 */
    String filePath = sourceFile.getPath();
    File pdfFile;
    if (filePath.contains(".")) {
        pdfFile = new File(filePath.substring(0, filePath.lastIndexOf(".")) + ".pdf");
    } else {
        pdfFile = new File(filePath + ".pdf");
    }

    /* 判断即将要转换的文件是否真实存在 */
    if (sourceFile.exists()) {
        /* 判断该文件是否已经被转换过,若已经转换则直接预览 */
        if (!pdfFile.exists()) {
            OpenOfficeConnection connection;
            /* 打开OpenOffice连接 */
            try {
                connection = new SocketOpenOfficeConnection(openofficeHost, openofficePort);
                connection.connect();
            } catch (java.net.ConnectException e) {
                log.warn("openOffice未连接，正在重新连接...");

                // 启动OpenOffice的服务
                String command = openofficeInstallPath + "program/soffice -headless -accept=\"socket,host=127.0.0.1,port=8100;urp;\" -nofirststartwizard";
                Runtime.getRuntime().exec(command);

                Thread.sleep(1000);

                connection = new SocketOpenOfficeConnection(8100);
                connection.connect();

                log.warn("openOffice重新连接成功!!!");
            }

            try {
                // DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
                DocumentConverter converter = new StreamOpenOfficeDocumentConverter(connection);
                converter.convert(sourceFile, pdfFile);
                connection.disconnect();

//                            filePath = pdfFile.getPath(); // 文件转换之后的路径
                sourceFile = pdfFile;
                response.setContentType("application/pdf");
            } catch (OpenOfficeException e) {
                e.printStackTrace(); // 读取转换文件失败
                log.info("读取转换文件失败!!!");
                return;
            } finally { // 发生exception时, connection不会自动切断, 程序会一直挂着
                try {
                    if (connection != null) {
                        connection.disconnect();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } else {
//                        filePath = pdfFile.getPath(); // 文件已经转换过
            sourceFile = pdfFile;
            response.setContentType("application/pdf");
        }
    } else {
        log.info("需要预览的文档在服务器中不存在!!!");
        // 文件不存在，直接返回
        return;
    }
}
```

### 五、图片预览

#### 5.1 后端文件流

```java
/* 预览图片 */
if ("PNG".equals(ext) || "JPEG".equals(ext) || "JPG".equals(ext)) {
    response.setContentType("image/jpeg");
}
/* 预览BMP格式的文件 */
if ("BMP".equals(ext)) {
    response.setContentType("image/bmp");
}
/* 预览GIF格式的文件 */
if ("GIF".equals(ext)) {
    response.setContentType("image/gif");
}
```

#### 5.2 前端预览

> 采用uni-app的[uni.previewImage](https://uniapp.dcloud.io/api/media/image)接口
> **fileUrl**：为**文件流访问地址**

```js
// 预览图片
uni.previewImage({
  urls: [fileUrl],
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
```

### 附：完整文件流代码

```java
@RequestMapping(value = "/api/attachment", method = RequestMethod.GET)
public void getFileBytes(@RequestParam("name") String name, @RequestParam("url") String url, HttpServletRequest request, HttpServletResponse response) {
    response.reset();
    // 解决IFrame拒绝的问题，无效
//        response.setHeader("X-Frame-Options", "SAMEORIGIN");
    response.setContentType("application/octet-stream");
    response.setCharacterEncoding("utf-8");
    response.setHeader("Content-Disposition", "attachment;filename=" + name);

    AttachmentVO attachmentVO = new AttachmentVO();
    FileInputStream ios = null;
    OutputStream os = null;
    try {
        name = CharsetUtils.toUTF_8(name);
        url = CharsetUtils.toUTF_8(url);

        attachmentVO.setUrl(url);
        attachmentVO.setName(name);
        File sourceFile = getDictionaryFile(attachmentVO, request);
        if (null == sourceFile) {
//                throw new HttpResponseException(300, "附件不存在！");
            return;
        }

        /**
          * 判断文件类型
          */
        /* 获得文件名后缀 */
        String ext = "";
        if (!"".equals(url) && url.contains(".")) {
            ext = url.substring(url.lastIndexOf(".") + 1, url.length()).toUpperCase();
        }
        /* 根据文件类型不同进行预览 */
        /* 预览图片 */
        if ("PNG".equals(ext) || "JPEG".equals(ext) || "JPG".equals(ext)) {
            response.setContentType("image/jpeg");
        }
        /* 预览BMP格式的文件 */
        if ("BMP".equals(ext)) {
            response.setContentType("image/bmp");
        }
        /* 预览GIF格式的文件 */
        if ("GIF".equals(ext)) {
            response.setContentType("image/gif");
        }
        /* 预览pdf */
        if ("PDF".equals(ext)) {
            response.setContentType("application/pdf");
        }

        /* 利用openOffice将office文件转换为pdf格式, 然后预览doc, docx, xls, xlsx, ppt, pptx */
        if ("DOC".equals(ext) || "DOCX".equals(ext) || "XLS".equals(ext) || "XLSX".equals(ext) || "PPT".equals(ext) || "PPTX".equals(ext)) {
            /* filePath在数据库中是不带文件后缀的, 由于jodConverter必须要识别后缀,所以将服务器中的文件重命名为带后缀的文件 */
            // File docFileWithExt = new File(filePath + "." + ext.toLowerCase()); //带后缀的文件
            // docFile.renameTo(docFileWithExt);
            /* 转换之后的文件名 */
            String filePath = sourceFile.getPath();
            File pdfFile;
            if (filePath.contains(".")) {
                pdfFile = new File(filePath.substring(0, filePath.lastIndexOf(".")) + ".pdf");
            } else {
                pdfFile = new File(filePath + ".pdf");
            }

            /* 判断即将要转换的文件是否真实存在 */
            if (sourceFile.exists()) {
                /* 判断该文件是否已经被转换过,若已经转换则直接预览 */
                if (!pdfFile.exists()) {
                    OpenOfficeConnection connection;
                    /* 打开OpenOffice连接 */
                    try {
                        connection = new SocketOpenOfficeConnection(openofficeHost, openofficePort);
                        connection.connect();
                    } catch (java.net.ConnectException e) {
                        log.warn("openOffice未连接，正在重新连接...");

                        // 启动OpenOffice的服务
                        String command = openofficeInstallPath + "program/soffice -headless -accept=\"socket,host=127.0.0.1,port=8100;urp;\" -nofirststartwizard";
                        Runtime.getRuntime().exec(command);

                        Thread.sleep(1000);

                        connection = new SocketOpenOfficeConnection(8100);
                        connection.connect();

                        log.warn("openOffice重新连接成功!!!");
                    }

                    try {
                        // DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
                        DocumentConverter converter = new StreamOpenOfficeDocumentConverter(connection);
                        converter.convert(sourceFile, pdfFile);
                        connection.disconnect();

//                            filePath = pdfFile.getPath(); // 文件转换之后的路径
                        sourceFile = pdfFile;
                        response.setContentType("application/pdf");
                    } catch (OpenOfficeException e) {
                        e.printStackTrace(); // 读取转换文件失败
                        log.info("读取转换文件失败!!!");
                        return;
                    } finally { // 发生exception时, connection不会自动切断, 程序会一直挂着
                        try {
                            if (connection != null) {
                                connection.disconnect();
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                } else {
//                        filePath = pdfFile.getPath(); // 文件已经转换过
                    sourceFile = pdfFile;
                    response.setContentType("application/pdf");
                }
            } else {
                log.info("需要预览的文档在服务器中不存在!!!");
                // 文件不存在，直接返回
                return;
            }
        }

        /**
          * 将文件写入输出流,显示在界面上,实现预览效果
          */
        ios = new FileInputStream(sourceFile);
        os = response.getOutputStream();
        int read = 0;
        byte[] buffer = new byte[1024 * 1024];
        while ((read = ios.read(buffer)) != -1) {
            os.write(buffer, 0, read);
        }
        os.flush();
    } catch (Exception e) {
        e.printStackTrace();
        try {
            if (null != ios) {
                ios.close();
            }
            if (null != os) {
                os.close();
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```

### 六、开源项目

[开源项目uniapp-admin](https://github.com/silianpan/uniapp-admin)

<br>
<center style="font-size:20px">赞助作者</center>
<center><img src="http://silianpan.cn/wp-content/uploads/2019/10/b9c369443b192642f975be9020b3234e.png" width="240" align=center /><center>
<br>

<center><img src="http://silianpan.cn/wp-content/themes/yusi1.0/img/weixin.gif" width="240" align=center /><center>
