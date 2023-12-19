<template>
<view class="brief-post">
		<!--基本信息-->
		<view class="post-header">
			<!-- 头像 昵称 时间 -->
			<u-image :src="iconUrl" width="30px" height="30px" shape="circle"
				@click="goToUserHomePage(userId)"></u-image> 
			<text class="nickname" @click="goToUserHomePage(userId)">{{ nickName }}</text>
			<text class="post-time">{{ commentTime }}</text> 

			<!-- 举报按钮-->
			<view class="report-container">
				<u-popup :show="show" mode="bottom" @close="close" @open="open">
					<view>
						<u-button @click="reportPost">举报</u-button>
					</view>
				</u-popup>
				<u-icon size="20" name="more-dot-fill" color="#999" @click="show = true">
				</u-icon>
			</view>
		</view>

		<view>
			<!-- 帖子内容 -->
			<view class="post-content">{{ content }}</view> 
		</view>

		<!-- 点赞、点踩、评论-->
		<view class="post-actions">
			<view class="action-item" @click="likePost">
				<u-icon :name="isLikedState ? 'thumb-up-fill' : 'thumb-up'" size="22px" :label="likeCount"></u-icon>
			</view>

			<view class="action-item" @click="dislikePost">
				<u-icon :name="isDislikedState ? 'thumb-down-fill' : 'thumb-down'" size="22px" :label="dislikeCount"></u-icon>
			</view>


			<view class="action-item">
				<u-popup :show="commentShow" mode="bottom" @close="closeComment" @open="openComment">
					<view>
						<u-textarea v-model="commentContent" placeholder="请输入内容"></u-textarea>
						<u-button icon="share-square" @click="sendComment">发送</u-button>
					</view>
				</u-popup>
				<u-icon name="chat" size="20px" @click="commentShow = true" :label="commentCount"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
export default {
		props: ['nickName', 'iconUrl', 'userId','commentId','postId', 'commentTime', 'content', 'likes', 'dislikes', 'comments', 'isLiked', "isDisliked"
		],
		data() {
			return {
				show: false,

				isLikedState: this.isLiked,
				isDislikedState: this.isDisliked,
				likeCount: this.likes,
				dislikeCount: this.dislikes,
				commentCount: this.comments,
				commentShow: false,
				commentContent: '',

			};
		},
		methods: {
			open() 
			{
				// console.log('open');
			},
			close() {
				this.show = false;
				// console.log('close');
			},
			openComment() {
				//this.commentShow = true;
			},
			closeComment() {
				this.commentShow = false;
			},
			reportPost() {
				// 处理举报帖子
				//this.isPopupVisible = false;
				// console.log(this.sectionArray[this.section])
				this.close();
				uni.$u.toast('举报成功');
			},
			likePost() {
				if (this.isLikedState) {
					// 取消点赞
					this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: '/post/interact',
							method: "POST",
							data: {
								"interaType": 1, //0点赞；1取消点赞；2点踩；3取消点踩；4收藏；5取消收藏
								"postId": this.postId, //不为空
								"commentId": this.commentId //互动帖子时传0，互动帖子时传值
							}
						})
						.then(response => {
							this.isLikedState = false;
							this.likeCount--;
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
							
							if(error.data.code == 401){
								this.goToLogin();
								return;
							}
						});
				} else {
					// 点赞
					this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: '/post/interact',
							method: "POST",
							data: {
								"interaType": 0, //0点赞；1取消点赞；2点踩；3取消点踩；4收藏；5取消收藏
								"postId": this.postId, //不为空
								"commentId": this.commentId //互动帖子时传0，互动帖子时传值
							}
						})
						.then(response => {
							this.isLikedState = true;
							this.likeCount++;
							if(this.isDislikedState){
								this.isDislikedState = false;//点赞成功自动取消点踩状态
								this.dislikeCount--;
							}
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
							
							if(error.data.status == 401){
								this.goToLogin();
								return;
							}
						});
				}
			},
			dislikePost() {
				// 帖子点踩逻辑
				if (this.isDislikedState) {
					// 取消点踩
					this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: '/post/interact',
							method: "POST",
							data: {
								"interaType": 3, //0点赞；1取消点赞；2点踩；3取消点踩；4收藏；5取消收藏
								"postId": this.postId, //不为空
								"commentId": this.commentId //互动帖子时传0，互动帖子时传值
							}
						})
						.then(response => {
							this.isDislikedState = false;
							this.dislikeCount--;
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
							
							if(error.data.status == 401){
								this.goToLogin();
								return;
							}
						});
				} else {
					// 点踩
					this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: '/post/interact',
							method: "POST",
							data: {
								"interaType": 2, //0点赞；1取消点赞；2点踩；3取消点踩；4收藏；5取消收藏
								"postId": this.postId, //不为空
								"commentId": this.commentId //互动帖子时传0，互动帖子时传值
							}
						})
						.then(response => {
							this.isDislikedState = true;
							this.dislikeCount++;
							if(this.isLikedState){
								this.isLikedState = false;//点踩成功自动取消点赞状态
								this.likeCount--;
							}
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
							
							if(error.data.status == 401){
								this.goToLogin();
								return;
							}
						});
				}
			},
			goToUserHomePage(userId){
				uni.navigateTo({
					url: '/pages/personalCenter/userHomePage?id='+encodeURIComponent(userId)
				});
			},
			goToLogin() {
				uni.switchTab({
					url: '/pages/login/index', 
					success: () => {
						uni.$u.toast('请登录后操作');
					},
					fail: (res) => {
						console.log('navigate failed', res);
					}
				})
				//login从tabbar取出后用
				// uni.navigateTo({
				// 	url: '/pages/login/index',
				// 	success: () => {
				// 		uni.$u.toast('请登录后操作');
				// 	},
				// 	fail: (res) => {
				// 		console.log('navigate failed', res);
				// 	}
				// });
			},
			sendComment() {
				// 完成评论的逻辑
				if(this.commentContent.length!=0)
				{this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/comment/add',
						method: "POST",
						data: {
							"postId": this.postId,
							"commentId": this.commentId,
							"content": this.commentContent
						}
					})
					.then(response => {
						this.commentCount++;
						this.closeComment();
						uni.$u.toast('回帖已发送');
						this.commentContent = '';
						//this.commentShow = false;
					})
					.catch(error => {
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
						
						if(error.data.status == 401){
							this.goToLogin();
							return;
						}
					});
				}
				else
				{
					uni.$u.toast('评论内容不能为空');
					return;
				}
			},
		},
	};
</script>

<style>
.brief-post {
		padding: 0 10px 20px 10px;
		background-color: #fff;
	}

	.post-header {
		display: flex;
		align-items: center;
	}

	.report-container {
		position: absolute;
		right: 10px;
		display: flex;
		align-items: center;
	}

	.photo {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}

	.nickname {
		margin-left: 15px;
		font-size: 13px;
		color: #333;
	}

	.post-time {
		margin-left: 10px;
		margin-top: 3px;
		margin-right: 0px;
		font-size: 12px;
		color: #999;
	}

	.post-content {
		margin-bottom: 10px;
		margin-left: 55px;
		margin-right: 25px;
		font-size: 12px;
		color: #333;
	}


	.tag-row {
		display: flex;
		justify-content: space-between;
		flex-basis: 100%;
	}

	.post-actions {
		display: flex;
		align-items: center;
		margin-left: 125px;
	}

	.action-item {
		display: flex;
		align-items: center;
		margin-right: 28px;
	}

	.count {
		font-size: 14px;
		color: #999;
		margin-left: 5px;
	}
</style>