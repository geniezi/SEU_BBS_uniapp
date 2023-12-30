<template>

	<view class="chat">
		<!-- 	<view class="top-bar">
				<p class="chat-partner-name">{{ chatPartnerName }}</p>
	</view>	 -->
		<scroll-view :style="{height: `${windowHeight-inputHeight}rpx`}" id="scrollview" scroll-y="true"
			:scroll-top="scrollTop" class="scroll-view">
			<!-- 聊天主体 -->
			<view id="msglistview" class="chat-body">



				<view v-for="message in messages" :key="message.id" class="message">
					<p class="message-time">{{ message.sendTime }}</p>
					<view v-if=isMyMessage(message.senderId) class="my-message">
						<view class="message-bubble green-background">
							{{ message.content }}
						</view>
						<img class="avatar-right" :src="myAvatar" @click="goToUserHomePage(getmyid())"
							alt="My Avatar" />
					</view>
					<view v-else class="other-message">
						<img class="avatar-left" :src="chatPartnerAvatar" @click="goToUserHomePage(getyourid())"
							alt="Partner Avatar" />
						<view class="message-bubble grey-background">
							{{ message.content }}
						</view>
					</view>
				</view>


			</view>
		</scroll-view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
			<view class="send-msg" :style="{bottom:`${keyboardHeight}rpx`}">
				<view class="uni-textarea">
					<textarea v-model="chatMsg" maxlength="300" confirm-type="send" @confirm="handleSend"
						:show-confirm-bar="false" :adjust-position="false" @linechange="sendHeight" @focus="focus"
						@blur="blur" auto-height></textarea>
				</view>
				<button @click="handleSend" class="send-btn">发送</button>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				page: 1,
				status: "loading", // 初始状态为loading
				timer: null,
				//键盘高度
				keyboardHeight: 0,
				//底部消息发送高度
				bottomHeight: 0,
				//滚动距离
				scrollTop: 0,
				userId: '',
				//发送的消息
				chatMsg: "",
				currentTime: '',
				//my
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
			}
		},
		updated() {
			//页面更新时调用聊天消息定位到最底部
			this.scrollToBottom();
		},
		computed: {
			windowHeight() {
				return this.rpxTopx(uni.getSystemInfoSync().windowHeight)
			},
			// 键盘弹起来的高度+发送框高度
			inputHeight() {
				return this.bottomHeight + this.keyboardHeight
			}
		},
		onShow() {
			this.page = 1; // 重置页码
			this.messages = []; // 清空原有数据
			this.status = "loading"; // 初始状态为loading
			this.timer = setInterval(() => {
				uni.hideLoading()
				this.getChatRecord();
				uni.hideLoading()
			}, 5000);
		},
		//onshow自动刷新



		onLoad(option) {

			this.chatPartnerID = option.id;
			this.getChatRecord()
			uni.onKeyboardHeightChange(res => {
				//这里正常来讲代码直接写
				//this.keyboardHeight=this.rpxTopx(res.height)就行了
				//但是之前界面ui设计聊天框的高度有点高,为了不让键盘和聊天输入框之间距离差太大所以我改动了一下。
				this.keyboardHeight = this.rpxTopx(res.height - 30)
				if (this.keyboardHeight < 0) this.keyboardHeight = 0;
			})
		},
		onUnload() {
			uni.offKeyboardHeightChange()
			console.log('onHide');
			clearInterval(this.timer);
			this.timer = null;
		},
		methods: {
			onPageScroll() {
				this.getChatRecord()
			},

			getmyid() {
				return this.myID
			},

			getyourid() {
				return this.chatPartnerID
			},

			getChatRecord() {
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
						"page": this.page,
						"size": 50,
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
						// this.page = this.page + 1;
						this.messages = response3.data.data.records.reverse();
						this.messages = this.messages.concat(newRecords);
						console.log("接受record成功");

						this.scrollToBottom(); // 在所有请求完成后滚动到底部
					})
					.catch(error => {
							console.log("error.data.message");
					});

			},

			getCurrentTime() {
				var date = new Date();
				this.currentTime = date.getFullYear() +
					"-" + (date.getMonth() + 1).toString().padStart(2, '0') +
					"-" + date.getDate().toString().padStart(2, '0') +
					"T" + date.getHours().toString().padStart(2, '0') +
					":" + date.getMinutes().toString().padStart(2, '0') +
					":" + date.getSeconds().toString().padStart(2, '0');
			},

			goToUserHomePage(userId) {
				const myId = getApp().globalData.myUserId; //为空就是没登录状态，就当看别人的

				if (userId == myId) { //看自己的主页，跳转个人中心
					uni.switchTab({
						url: '/pages/personalCenter/index',
					})
				} else {
					uni.navigateTo({
						url: '/pages/personalCenter/userHomePage?id=' + encodeURIComponent(userId)
					});
				}
			},

			isMyMessage(id) {
				if (id == this.chatPartnerID)
					return false
				else
					return true
			},

			focus() {
				this.scrollToBottom()
			},
			blur() {
				this.scrollToBottom()
			},
			// px转换成rpx
			rpxTopx(px) {
				let deviceWidth = wx.getSystemInfoSync().windowWidth
				let rpx = (750 / deviceWidth) * Number(px)
				return Math.floor(rpx)
			},
			// 监视聊天发送栏高度
			sendHeight() {
				setTimeout(() => {
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect()
					query.exec(res => {
						this.bottomHeight = this.rpxTopx(res[0].height)
					})
				}, 10)
			},
			// 滚动至聊天底部
			scrollToBottom(e) {
				setTimeout(() => {
					let query = uni.createSelectorQuery().in(this);
					query.select('#scrollview').boundingClientRect();
					query.select('#msglistview').boundingClientRect();
					query.exec((res) => {
						if (res[1].height > res[0].height) {
							this.scrollTop = this.rpxTopx(res[1].height - res[0].height)
						}
					})
				}, 15)
			},
			// 发送消息
			handleSend() {
				//如果消息不为空
				if (!this.chatMsg || !/^\s+$/.test(this.chatMsg)) {

					this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: '/chat/send',
							method: 'POST',
							data: {
								"receiverId": this.chatPartnerID,
								"content": this.chatMsg,
								"picUrl": ''
							}
						})
						.then(res => {
							this.getChatRecord()
							this.chatMsg = '';
							this.scrollToBottom()

						});
				} else {
					this.$modal.showToast('不能发送空白消息')
				}



				this.scrollToBottom()
			},
		}
	}
</script>



<style lang="scss" scoped>
	$chatContentbgc: #C2DCFF;
	$sendBtnbgc: #00b331;

	view,
	button,
	text,
	input,
	textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	//my code
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
		white-space: normal;
		/* 设置文字换行方式为 normal */
		word-wrap: break-word;
		/* 设置文字换行时自动断行 */
		display: -webkit-box;
		/* 使用旧版的 Flexbox 语法，用于控制多行文本的显示 */
		-webkit-box-orient: vertical;
		/* 垂直方向排列 */
		// overflow: hidden;
		// /* 超出部分隐藏 */
		// text-overflow: ellipsis;
		// /* 显示省略号 */
		// -webkit-line-clamp: 3;
		// /* 设置最大显示行数 */
		word-break: break-all;
		/* 单词内换行 */
		text-align: left;
		/* 文本左对齐 */
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



	/* 聊天消息 */
	.chat {
		.scroll-view {
			::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
				color: transparent;
			}

			// background-color: orange;
			background-color: #F6F6F6;

			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;
				// background-color:skyblue;

				.self {
					justify-content: flex-end;
				}

				.item {
					display: flex;
					padding: 23rpx 30rpx;
					// background-color: greenyellow;

					.right {
						background-color: $chatContentbgc;
					}

					.left {
						background-color: #FFFFFF;
					}

					// 聊天消息的三角形
					.right::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						left: 100%;
						top: 10px;
						border: 12rpx solid transparent;
						border-left: 12rpx solid $chatContentbgc;
					}

					.left::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						top: 10px;
						right: 100%;
						border: 12rpx solid transparent;
						border-right: 12rpx solid #FFFFFF;
					}

					.content {
						position: relative;
						max-width: 486rpx;
						border-radius: 8rpx;
						word-wrap: break-word;
						padding: 24rpx 24rpx;
						margin: 0 24rpx;
						border-radius: 5px;
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
					}

					.avatar {
						display: flex;
						justify-content: center;
						width: 78rpx;
						height: 78rpx;
						background: $sendBtnbgc;
						border-radius: 8rpx;
						overflow: hidden;

						image {
							align-self: center;
						}

					}
				}
			}
		}

		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			height: 177rpx;
			background: #F4F5F7;
			transition: all 0.1s ease;


			.send-msg {
				display: flex;
				align-items: flex-end;
				padding: 16rpx 30rpx;
				width: 100%;
				min-height: 177rpx;
				position: fixed;
				bottom: 0;
				background: #EDEDED;
				transition: all 0.1s ease;
			}

			.uni-textarea {
				padding-bottom: 70rpx;

				textarea {
					width: 537rpx;
					min-height: 75rpx;
					max-height: 500rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					color: #333333;
					line-height: 43rpx;
					padding: 5rpx 8rpx;
				}
			}

			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 70rpx;
				margin-left: 25rpx;
				width: 128rpx;
				height: 75rpx;
				background: $sendBtnbgc;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 28rpx;
			}
		}
	}
</style>