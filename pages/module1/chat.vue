<template>
	<view class="chat-container">

		<view class="top-bar">
			<p class="chat-partner-name">{{ chatPartnerName }}</p>
		</view>
		<view class="message-container" ref="chatContainer">
<uni-scroll-view :scroll-top="scrollTop" >
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
  </uni-scroll-view>
		</view>

		<view class="input-container">
			<input type="text" class="message-input" placeholder="输入消息..." v-model="messageInput" />
			<button class="send-button" @click="sendMessage">发送</button>
		</view>
	</view>
</template>

<script>
	import {
		created
	} from '../../uni_modules/uview-ui/libs/mixin/mixin';
	export default {
		
		//新页面接收后：
		onLoad(option) {
		    this.chatPartnerID = option.id;
		    
		      // 发起三个异步请求
		      const request1 = this.$myRequest({
		        header: {
		          'Authentication': uni.getStorageSync('Authentication')
		        },
		        url: '/user/getNI/' + this.chatPartnerID,
		        method: 'GET',
		      });
		    
		      const request2 = this.$myRequest({
		        header: {
		          'Authentication': uni.getStorageSync('Authentication')
		        },
		        url: '/user/getNI/' + 0,
		        method: 'GET',
		      });
		    
		      const request3 = this.$myRequest({
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
		      });
		    
		      // 等待三个异步请求完成后再执行后续逻辑
		      Promise.all([request1, request2, request3])
		        .then(([response1, response2, response3]) => {
		          console.log("chatParter search succ");
		          this.chatPartnerName = response1.data.data.username;
		          this.chatPartnerAvatar = response1.data.data.iconUrl;
		          this.myAvatar = response2.data.data.iconUrl;
		          this.messages = response3.data.data.records.reverse();
		          console.log("接受record成功");
		    
		          this.scrollToBottom(); // 在所有请求完成后滚动到底部
		        })
		        .catch(error => {
		          console.error("Error fetching data:", error);
		        });
				
				Promise.all([request1, request2, request3])
        .then(([response1, response2, response3]) => {
          // 处理请求返回的数据

          this.scrollToBottom(); // 在所有请求完成后滚动到底部
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
		},

		mounted() {
			    this.$nextTick(() => {
			      setTimeout(() => {
			        this.scrollToBottom();
			      }, 100);
			    });
		},

		data() {
			return {
				
				scrollIntoView: '', // 滚动到的位置
				scrollTop: 9999, // 滚动条位置

				messageInput: '',
				chatPartnerID: '',
				myID: '',
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
		// created() {
		// 	console.log("test created")
		// 	console.log(this.chatPartnerID)
		// 	this.$myRequest({
		// 			header: {
		// 				'Authentication': uni.getStorageSync('Authentication')
		// 			},
		// 			url: '/user/getNI/' + this.chatPartnerID,
		// 			method: 'GET',
		// 		})
		// 		.then(response => {
		// 			console.log("chatParter search succ")
		// 			this.chatPartnerName = response.data.data.username;
		// 			this.chatPartnerAvatar = response.data.data.iconUrl;
		// 		});


		// 	this.$myRequest({
		// 			header: {
		// 				'Authentication': uni.getStorageSync('Authentication')
		// 			},
		// 			url: '/user/getNI/' + this.myID,
		// 			method: 'GET',
		// 		})
		// 		.then(res => {
		// 			console.log("myinfo search succ")
		// 			this.myAvatar = res.data.data.iconUrl;
		// 		});

		// 	this.$myRequest({
		// 			header: {
		// 				'Authentication': uni.getStorageSync('Authentication')
		// 			},
		// 			url: '/chat/pageMessage',
		// 			method: 'GET',
		// 			data: {
		// 				"page": 0,
		// 				"size": 10,
		// 				"id": this.chatPartnerID
		// 			},
		// 		})
		// 		.then(res => {
		// 			console.log("chat record search succ")
		// 			this.messages = res.data.data.records.reverse();
		// 			console.log("接受record成功")
		// 		});




		// },

		methods: {
			
			attachScrollListener() {
			    const chatContainer = this.$refs.chatContainer;
			    chatContainer.$on('scrolltoupper', () => {
			      // 当滚动到顶部时触发加载更多的消息
			      console.log('Reached to the top, load more messages...');
			      // 在这里写触发加载更多消息的逻辑
			      // 调用加载更多消息的方法
			      this.loadMoreMessages();
			    });
			  },
			
			scrollToBottom() {
			    const selector = '.message-container';
			    
			          uni.createSelectorQuery()
			            .select(selector)
			            .boundingClientRect(rect => {
			              if (rect) {
			                const scrollTop = rect.height+500;
			                console.log("Container Height:", scrollTop); // Add this line to check the container height
			                uni.pageScrollTo({
			                  selector,
			                  scrollTop,
			                  duration: 300
			                });
			              }
			            })
			            .exec();
				  
					  
			    },

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
						}
					})
					.then(res => {
						console.log("send succ")
						uni.navigateTo({
							url: '/pages/module1/chat?id='+encodeURIComponent(this.chatPartnerID),
							
						});
					});

			this.scrollToBottom();

			},

			isMyMessage(id) {
				if (id == this.chatPartnerID)
					return false
				else
					return true
			},

			getMyAvatar() {

			},

			getChatPartnerAvater() {

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