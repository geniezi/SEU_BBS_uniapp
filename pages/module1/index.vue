<template>
	<view>
		<u-button class="refreshButton" text="123" @click="onScrollToUpper" size="mini">轻触刷新</u-button>
		<view class="message-list" v-if="getStatus()==200">
			<view v-for="(message, index) in messages" :key="index" class="message-item"
				@click="goToChat(message.opposeId)">
				<!-- <img class="avatar":src='avatar' v-if="searchSenderName(message.opposeId)" alt="Avatar"> -->
				<!-- searchSenderName(message.opposeId) -->
				<view class="avatar">
					<img class="avatar" :src='getIconUrlById(message.opposeId)' alt="Avatar">
				</view>
				<view class="content">
					<view class="sender">{{ getUsernameById(message.opposeId)}}</view>
					<view class="text" v-if="message.picId==0">{{ message.content }}</view>
					<view class="text" v-if="message.picId!=0">{{ "[图片]" }}</view>
					<view class="time">{{ replaceTWithSpace(message.sendTime) }}</view>
				</view>

				<view v-if="message.isUnread" class="red-dot"></view>

			</view>
		</view>

	</view>
</template>

<script>
	export default {
		onShow() {
		this.getChatList();
		if(this.haveLogin==1){
		this.startTimer();
		}
		},

		onUnload() {
			uni.offKeyboardHeightChange()
			console.log('onHide');
			clearInterval(this.timer);
			this.timer = null;
		},

		data() {
			return {
				haveLogin:0,
				avatar: '',
				username: '',
				status: 0,
				timer: null,
				ListInfo: [],
				messages: [{
					opposeId: "",
					content: "",
					picId: 0,
					isUnread: false,
					sendTime: "",
				}],
			}
		},
		onLoad() {

		},

		mounted() {

			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.selectViewport().scrollOffset()
				query.exec(res => {
					uni.pageScrollTo({
						scrollTop: res[0].scrollHeight // 页面总高度
					})
				})
			})
			console.log("mouted")
		},

		methods: {
			startTimer(){
				this.timer = setInterval(() => {
					this.getChatList()
				}, 5000);
			},
			
			
			getChatList() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/chat/pagePeople',
						method: 'GET',
						data: {
							"page": 0,
							"size": 20,
						},
					})
					.then(res => {
						console.log("chat people search succ");
						this.messages = res.data.data.records;
						this.status = res.data.code;
						console.log(this.status)

						// 在这里进行第二个请求，确保在第一个请求完成后执行
						const opposeIds = this.messages.map(message => message.opposeId);
						console.log(opposeIds);
						const urlWithIds = '/user/listNIByIds?id=' + opposeIds.join('&id=');
						console.log("url is" + urlWithIds);

						return this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: urlWithIds,
							method: 'GET'
						});
					})
					.then(response => {
						this.ListInfo = response.data.data;
						console.log("list search succ1");
						console.log(this.ListInfo);
						this.haveLogin=1;
					})
					.catch(error => {
						if (error.statusCode === 401) {
							console.error("Unauthorized Error occurred:", error);
							setTimeout(() => {
								this.haveLogin=0;
								this.goToLogin();
							}, 1000);
						} else {
							// Handle other errors here
							console.error("Error occurred:", error);
						}
					});

			},


			replaceTWithSpace(dateTimeString) {
				return dateTimeString.replace('T', ' ');
			},

			goToLogin() {
				// uni.switchTab({
				// 	url: '/pages/login/index',
				// 	success: () => {
				// 		uni.$u.toast('请登录后操作');
				// 	},
				// 	fail: (res) => {
				// 		console.log('navigate failed', res);
				// 	}
				// })
				//login从tabbar取出后用
				uni.navigateTo({
					url: '/pages/login/index',
					success: () => {
						uni.$u.toast('请登录后操作');
					},
					fail: (res) => {
						console.log('navigate failed', res);
					}
				});
			},
			onScrollToUpper() {
				uni.reLaunch({
					url: '/pages/module1/index'
				})
			},

			test(ccc) {
				console.log(123)
				console.log(ccc)
			},

			getStatus() {
				return this.status;
			},



			// 根据 ID 查找 username
			getUsernameById(id) {
				const foundData = this.ListInfo.find(item => item.id === id);
				return foundData ? foundData.username : null; // 如果找到匹配的ID则返回对应的username，否则返回null或默认值
			},

			// 根据 ID 查找 iconUrl
			getIconUrlById(id) {
				const foundData = this.ListInfo.find(item => item.id === id);
				return foundData ? foundData.iconUrl : null; // 如果找到匹配的ID则返回对应的iconUrl，否则返回null或默认值
			},

			searchListInfo() {
				const messages = this.messages;
				console.log(messages)
				// 提取 messages 中所有的 opposeId 组成数组
				const opposeIds = messages.map(message => message.opposeId);
				console.log(opposeIds)
				// 将数组转换为包含多个 id 的 URL 形式
				const urlWithIds = '/user/listNIByIds?id=' + opposeIds.join('&id=');
				console.log("url is" + urlWithIds)
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: urlWithIds,
						method: 'GET',

					})
					.then(response => {

						this.ListInfo = response.data.data;
						console.log("list search succ1")
						console.log(this.ListInfo)
					});
			},

			searchSenderAvatar(senderid) {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/getNI/' + senderid,
						method: 'GET',
					})
					.then(response => {
						console.log("chatParter avatar search succ")
						return response.data.data.iconUrl;
					});
			},



			goToChat(userId) {
				// 跳转到聊天界面，userId为用户ID
				uni.navigateTo({
					url: '/pages/module1/chat?id=' + encodeURIComponent(userId),

				});
				console.log(userId)
			}

		}
	}
</script>

<style>
	/* 	.content {
		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	} */
	.red-dot {
		display: inline-block;
		width: 15px;
		height: 15px;
		background-color: red;
		border-radius: 50%;
		margin-left: 50px;
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
		width: 65px;
		height: 65px;
		border-radius: 50%;
		/* Add your styles here */
	}

	.content {
		margin-left: 8%;
		/* Add your styles here */
	}

	.sender {
		font-weight: bold;
		font-size: 20px;
		/* Add your styles here */
	}

	.text {
		font-size: 19px;
		/* Add your styles here */
	}

	.time {
		font-size: 14px;
		color: gray;
		/* Add your styles here */
	}
</style>