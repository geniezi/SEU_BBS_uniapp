<template>
	<view class="chat-container">
		<view class="top-bar">
			<p class="chat-partner-name">{{ chatPartnerName }}</p>
		</view>
		<view class="message-container">
			<scroll-view class="scroll-view" scroll-y="true" ref="scrollView">
			<view v-for="message in messages" :key="message.id" class="message">
				<p class="message-time">{{ message.sendTime }}</p>
				<view v-if=isMyMessage(message.senderId) class="my-message">
					<view class="message-bubble green-background">
						{{ message.content }}
					</view>
					<img class="avatar-right" :src="myAvatar" alt="My Avatar" />
				</view>
				<view v-else class="other-message">
					<img class="avatar-left" :src="chatPartnerAvatar" alt="Partner Avatar" />
					<view class="message-bubble grey-background">
						{{ message.content }}
					</view>
				</view>
			</view>
			</scroll-view>
		</view>
		<view class="input-container">
			<input type="text" class="message-input" placeholder="输入消息..." v-model="messageInput"/>
			<button class="send-button" @click="sendMessage">发送</button>
		</view>
	</view>
</template>

<script>
	import {
		created
	} from '../../uni_modules/uview-ui/libs/mixin/mixin';
	export default {

mounted() {
  this.$nextTick(() => {
    uni.createSelectorQuery()
      .in(this)
      .select('.chat-container') // 替换成你的组件类名或选择器
      .boundingClientRect(data => {
        // 确保组件已经加载完毕后再设置滚动位置
        if (data) {
          const query = uni.createSelectorQuery().in(this)
          query.selectViewport().scrollOffset()
          query.exec(res => {
            const scrollHeight = data.height // 获取组件高度
            const scrollTop = data.top + scrollHeight // 计算滚动位置
            uni.pageScrollTo({
              scrollTop: scrollTop
            })
          })
        }
      })
      .exec()
  })
},

		data() {
			return {
				messageInput:'',
				chatPartnerID: '1728297677709512704',
				myID: '1729121929987756032',
				chatPartnerName: '张三',
				chatPartnerAvatar: '',
				myAvatar: '',
				messages: [{
						id: '',
						senderId: '',
						text: '',
						sendTime: ''
					},
					// 其他消息
				]
			};
		},
		


		//点击进入聊天窗口后，分页查询聊天记录,预加载名称、头像等资源
		created() {
			console.log("test created")

			this.$myRequest({
					header: {
						'Authentication': uni.getStorageSync('Authentication')
					},
					url: '/user/getNI/' + this.chatPartnerID,
					method: 'GET',
				})
				.then(response => {
					console.log("chatParter search succ")
					this.chatPartnerName = response.data.data.username;
					this.chatPartnerAvatar = response.data.data.iconUrl;
				});


			this.$myRequest({
					header: {
						'Authentication': uni.getStorageSync('Authentication')
					},
					url: '/user/getNI/' + this.myID,
					method: 'GET',
				})
				.then(res => {
					console.log("myinfo search succ")
					this.myAvatar = res.data.data.iconUrl;
				});

			this.$myRequest({
					header: {
						'Authentication': uni.getStorageSync('Authentication')
					},
					url: '/chat/pageMessage',
					method: 'GET',
					data: {
						"page": 0,
						"size": 10,
						"id": this.chatPartnerID
					},
				})
				.then(res => {
					console.log("chat record search succ")
					this.messages = res.data.data.records.reverse();
					console.log("接受record成功")
				});

			 


		},

		methods: {

			sendMessage() {
				console.log('test1')
				this.$myRequest({
					header: {
						'Authentication': uni.getStorageSync('Authentication')
					},
					url: '/chat/send',
					method: 'POST',
					data: {
						"receiverId": this.chatPartnerID,
						"content": this.messageInput,
						"picUrl": ''
					},
					success: (res) => {
						console.log("send succ")
					}
				});
				
				uni.reLaunch({
				    url: '/pages/module1/chat'
				})
				
				
			},

			isMyMessage(id) {
				if (id == this.myID)
					return true
				else
					return false
			},
			
			getMyAvatar(){
				
			},
			
			getChatPartnerAvater(){
				
			},
			
			





		},


	}
</script>

<style>
	/* 样式可以根据实际情况进行调整 */
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.top-bar {
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
		padding: 10px;
		background-color: #f0f0f0;
	}

	.chat-partner-name {
		/* 样式定义 */
		text-align: center;
		font-weight: bold;
	}

	.message-container {
		flex: 1;
		overflow-y: scroll;
		padding: 10px;
	}

	.message {
		margin-bottom: 10px;
		text-align: center;
	}

	.message-time {
		color: #999;
	}

	.my-message {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.other-message {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.avatar-left {
		/* 样式定义 */
		width: 50px;
		height: 50px;
		border-radius: 50%;
		/* Add your styles here */
	}

	.avatar-right {
		/* 样式定义 */
		width: 50px;
		height: 50px;
		border-radius: 50%;
		/* Add your styles here */
	}

	.message-bubble {
		padding: 8px;
		border-radius: 10px;
		margin: 5px;
		max-width: 70%;
	}

	.grey-background {
		background-color: #f0f0f0;
	}

	.green-background {
		background-color: #dcf8c6;
	}

	.input-container {
		display: flex;
		align-items: center;
		padding: 10px;
		background-color: #f0f0f0;
	}

	.message-input {
		flex: 1;
		padding: 8px;
		margin-right: 10px;
	}

	.send-button {
		/* 样式定义 */
	}
</style>