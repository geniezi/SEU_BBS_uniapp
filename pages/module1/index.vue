<template>
<view>
	
<!-- 	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view> -->
	
	  <view class="message-list">
		  
	    <view v-for="(message, index) in messages" :key="index" class="message-item" @click="goToChat(1)">
	      <view class="avatar">
	        <img :src="message.avatar" alt="Avatar">
	      </view>
	      <view class="content">
	        <view class="sender">{{ message.sender }}</view>
	        <view class="text">{{ message.text }}</view>
	        <view class="time">{{ message.time }}</view>
	      </view>
		  
		  
	    </view>
	  </view>
	  
</view>
</template>

<script>
	export default {
		data() {
			return {
				messages: [
				        {
				          avatar: "/static/avatar1.jpg",
				          sender: "cmh",
				          text: "Hello!",
				          time: "10:00 AM"
				        },
				        {
				          avatar: "/static/avatar2.jpg",
				          sender: "gzy",
				          text: "Hi there!",
				          time: "10:05 AM"
				        },
						{
						  avatar: "/static/avatar1.jpg",
						  sender: "cmh",
						  text: "Hello!",
						  time: "10:00 AM"
						},
						{
						  avatar: "/static/avatar2.jpg",
						  sender: "gzy",
						  text: "Hi there!",
						  time: "10:05 AM"
						},
						{
						  avatar: "/static/avatar1.jpg",
						  sender: "cmh",
						  text: "Hello!",
						  time: "10:00 AM"
						},
						{
						  avatar: "/static/avatar2.jpg",
						  sender: "gzy",
						  text: "Hi there!",
						  time: "10:05 AM"
						},
						{
						  avatar: "/static/avatar1.jpg",
						  sender: "cmh",
						  text: "Hello!",
						  time: "10:00 AM"
						},
						{
						  avatar: "/static/avatar2.jpg",
						  sender: "gzy",
						  text: "Hi there!",
						  time: "10:05 AM"
						},
						{
						  avatar: "/static/avatar1.jpg",
						  sender: "cmh",
						  text: "Hello!",
						  time: "10:00 AM"
						},
						{
						  avatar: "/static/avatar2.jpg",
						  sender: "gzy",
						  text: "Hi there!",
						  time: "10:05 AM"
						},
						{
						  avatar: "/static/avatar1.jpg",
						  sender: "cmh",
						  text: "Hello!",
						  time: "10:00 AM"
						},
						{
						  avatar: "/static/avatar2.jpg",
						  sender: "gzy",
						  text: "Hi there!",
						  time: "10:05 AM"
						},
						{
						  avatar: "/static/avatar1.jpg",
						  sender: "cmh",
						  text: "Hello!",
						  time: "10:00 AM"
						},
				        // Add more messages as needed
					]	
						
}
		},
		onLoad() {

		},
		methods: {

 goToChat(userId) {
      // 跳转到聊天界面，userId为用户ID
	  uni.showToast({
	  	title: '登录成功',
	  	//将值设置为 success 或者直接不用写icon这个参数
	  	icon: 'success',
	  	//显示持续时间为 2秒
	  	duration: 1000
	  })
      // this.$router.push(`/pages/module1/chat/${userId}`);
	  this.$router.push(`/pages/module1/chat`);
    }

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.message-list {
	  /* Add your styles here */
	}
	
	.message-item {
	  display: flex;
	  align-items: center;
	  padding: 10px;
	  /* Add your styles here */
	}
	
	.avatar img {
	  width: 50px;
	  height: 50px;
	  border-radius: 50%;
	  /* Add your styles here */
	}
	
	.content {
	  margin-left: 10px;
	  /* Add your styles here */
	}
	
	.sender {
	  font-weight: bold;
	  /* Add your styles here */
	}
	
	.text {
	  /* Add your styles here */
	}
	
	.time {
	  font-size: 12px;
	  color: gray;
	  /* Add your styles here */
	}
	

</style>
