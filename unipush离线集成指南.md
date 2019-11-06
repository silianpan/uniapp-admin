## 关于unipush离线集成的方法
### 准备
1. 通过官方途径申请UniPush账号，参考[使用指南](http://ask.dcloud.net.cn/article/35622)

2. [离线SDK](https://ask.dcloud.net.cn/article/103)

### 配置

* 依赖文件

将aps-unipush-release.aar拷贝到已有项目libs文件夹下。
	
* gradle配置

打开build.gradle，在defaultConfig添加manifestPlaceholders节点，如下图所示，将io.dcloud.HBuilder替换成自己的应用包名，将appid等信息替换成申请之后的appid等。
~~~
android {
    defaultConfig {
        manifestPlaceholders = [
                "plus.unipush.appid" : "pPyZWvH3Fa6PXba19ID0091",
                "plus.unipush.appkey" : "b7dOGlNPHR7pqwUxcXPVi44",
                "plus.unipush.appsecret": "IxVYAT9qws8dlNElacmSg12",
                "apk.applicationId":"io.dcloud.HBuilder"
        ]
    }
}
~~~

* 厂商配置
	
添加下列内容到androidmanifest.xml中（未申请平台无需添加）
~~~
        <meta-data
            android:name="MIPUSH_APPID"
            android:value="XM_${XIAOMI_APP_ID}" />
        <meta-data
            android:name="MIPUSH_APPKEY"
            android:value="XM_${XIAOMI_APP_KEY}" />
        <meta-data
            android:name="MEIZUPUSH_APPID"
            android:value="MZ_${MEIZU_APP_ID}" />
        <meta-data
            android:name="MEIZUPUSH_APPKEY"
            android:value="MZ_${MEIZU_APP_KEY}" />
        <meta-data
            android:name="com.huawei.hms.client.appid"
            android:value="${HUAWEI_APP_ID}" />
        <meta-data
            android:name="OPPOPUSH_APPKEY"
            android:value="OP_${OPPO_APP_KEY}" />
        <meta-data
            android:name="OPPOPUSH_APPSECRET"
            android:value="OP_${OPPO_APP_SECRET}" />
        <meta-data
            android:name="com.vivo.push.app_id"
            android:value="${VIVO_APP_ID}" />
        <meta-data
            android:name="com.vivo.push.api_key"
            android:value="${VIVO_APP_KEY}" />
~~~
		
修改build.gradle，添加对应平台申请的appkey或appid（键名必须统一，如XIAOMI_APP_ID比如同时存在于build.gradle文件和Androidmanifest.xml文件中），如下所示:

~~~
android {
    defaultConfig {
        manifestPlaceholders = [
                "plus.unipush.appid" : "pPyZWvH3Fa6PXba19ID0091",
                "plus.unipush.appkey" : "b7dOGlNPHR7pqwUxcXPVi45",
                "plus.unipush.appsecret": "IxVYAT9qws8dlNElacmSg12",
                "apk.applicationId":"io.dcloud.HBuilder",
				"XIAOMI_APP_ID":"ccccccccc"
        ]
    }
}
~~~

* dcloud_properties.xml配置

在properties中添加如下配置，features节点与services节点必须同时配置！

~~~
<properties>
	<features>
		<feature name="Push" value="io.dcloud.feature.aps.APSFeatureImpl">
			<module name="unipush" value="io.dcloud.feature.unipush.GTPushService"/>
		</feature>
	</features>	
	<services>
		<service name="push" value="io.dcloud.feature.aps.APSFeatureImpl"/>
	</services>
</properties>
~~~

* 其余配置

oppo集成UniPush时需在Androidmanifest.xml的入口activity中添加如下配置：

~~~
<activity
            android:name="io.dcloud.PandoraEntry">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
			/*oppo配置开始*/
            <intent-filter>
                <action android:name="android.intent.action.oppopush" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
			/*oppo配置结束*/
        </activity>
~~~

### 注意

* UniPush与个推及小米推送存在冲突，使用时请确保小米推送及个推相关文件已删除。
* 上述账号信息仅为展示使用，使用时需替换成自己申请的appkey等信息。
* 为了最大化的减少配置，权限及其他厂商配置统统放入aar中。