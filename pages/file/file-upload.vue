<template>
	<view>
		<web-view src="/hybrid/html/index.html" @message="handleMessage"></web-view>
	</view>
</template>

<script>  
    export default {  
        methods: {  
            handleMessage(evt) {
				let msg = '@message传递数据：' + JSON.stringify(evt.detail.data)
				uni.showModal({
					content: msg,
					showCancel: false
				});
                console.log(msg);
				// todo 写入到store中
            }
        }  
    }  
</script>
