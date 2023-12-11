<template>
	<view class="brief-post">
		<!--基本信息-->
		<view class="post-header">
			<!-- 头像 昵称 时间 -->
			<u-image :src="iconUrl" width="40px" height="40px" shape="circle"></u-image> <!--:src="avatarUrl"-->
			<text class="nickname">{{ nickName }}</text> <!--{{ nickname }}  xlnx-x+C-->
			<text class="post-time">{{ postTime }}</text> <!---->

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

		<view @click="goToDetail">
			<!-- 帖子内容 -->
			<view class="post-content">{{ content }}</view> <!--{{ content }}-->

			<!-- 帖子配图 -->
			<view class="post-images" v-if="image !== '' && image !== null">
				<!-- 多张图 -->
				<!--<u-image v-for="(image, index) in images" :key="index" :src="image"></u-image>-->
				<u-image :src="image" width="160px" height="130px"></u-image>
			</view>

			<!-- 标签 -->
			<view class="post-tags">

				<u-tag v-for="tag in tags" :key="tag" :text="tag" bgColor="#f1f1f1" size="mini" icon="tags" plain
					borderColor="white"></u-tag>
				<!--{{ category }} -->
			</view>
		</view>

		<!-- 点赞、点踩、收藏、评论-->
		<view class="post-actions">
			<view class="action-item" @click="likePost">
				<u-icon :name="isLikedState ? 'thumb-up-fill' : 'thumb-up'" size="22px"></u-icon>
				<view class="count">{{ likeCount }}</view>
			</view>

			<view class="action-item" @click="dislikePost">
				<u-icon :name="isDislikedState ? 'thumb-down-fill' : 'thumb-down'" size="22px"></u-icon>
				<view class="count">{{ dislikeCount }}</view>
			</view>

			<view class="action-item" @click="collectPost">
				<u-icon :name="isCollectedState ? 'star-fill' : 'star'" size="20px"></u-icon>
				<view class="count">{{ collectCount }}</view>
			</view>

			<view class="action-item"><!--@click="commentPost"-->
				<u-popup :show="commentShow" mode="bottom" @close="closeComment" @open="openComment">
					<view>
						<u-textarea v-model="commentContent" placeholder="请输入内容"></u-textarea>
						<u-button icon="share-square" @click="sendComment">发送</u-button>
					</view>
				</u-popup>
				<u-icon name="chat" size="20px" @click="commentShow = true"></u-icon>
				<view class="count">{{ commentCount }}</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		props: ['nickName','iconUrl', 'userId', 
			'postId',  'title', 'postTime', 'content', 'image', 'tags','section',
			'likes', 'dislikes', 'collections','comments','isLiked',"isDisliked","isCollected"
		],
		data() {
			return {
				show: false,
				
				isLikedState: this.isLiked,
				isDislikedState: this.isDisliked,
				isCollectedState: this.isCollected,
				likeCount: this.likes,
				dislikeCount: this.dislikes,
				collectCount: this.collections,
				commentCount: this.comments,
				
				commentShow: false,
				commentContent: ''
			};
		},
		methods: {
			open() {
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
								"commentId": "0" //互动帖子时传0，互动帖子时传值
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
								"commentId": "0" //互动帖子时传0，互动帖子时传值
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
								"commentId": "0" //互动帖子时传0，互动帖子时传值
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
								"commentId": "0" //互动帖子时传0，互动帖子时传值
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
						});
				}
			},
			collectPost() {
				// 帖子收藏逻辑
				if (this.isCollectedState) {
					// 取消收藏
					this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: '/post/interact',
							method: "POST",
							data: {
								"interaType": 5, //0点赞；1取消点赞；2点踩；3取消点踩；4收藏；5取消收藏
								"postId": this.postId, //不为空
								"commentId": "0" //互动帖子时传0，互动帖子时传值
							}
						})
						.then(response => {
							this.isCollectedState = false;
							this.collectCount--;
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
						});
				} else {
					// 收藏
					this.$myRequest({
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							url: '/post/interact',
							method: "POST",
							data: {
								"interaType": 4, //0点赞；1取消点赞；2点踩；3取消点踩；4收藏；5取消收藏
								"postId": this.postId, //不为空
								"commentId": "0" //互动帖子时传0，互动帖子时传值
							}
						})
						.then(response => {
							this.isCollectedState = true;
							this.collectCount++;
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
						});
				}
			},
			sendComment() {
				// 完成评论的逻辑
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/comment/add',
						method: "POST",
						data: {
							"postId": this.postId,
							"commentId": 0,
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
							uni.$u.toast('评论失败');
							return;
						}
					});
			},
			goToDetail() {
				uni.switchTab({
					url: '/pages/module1/index', //路径要改，传postId
					success: () => {
						console.log(1);
						uni.$u.toast('跳转至详情页' + this.postId);
					},
					fail: (res) => {
						console.log('navigate failed', res);
					}
				})
			}
		}
	};
</script>

<style>
	.brief-post {
		padding: 10px;
		background-color: #fff;
	}

	.post-header {
		display: flex;
		align-items: center;
	}

	.photo {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.nickname {
		margin-left: 15px;
		font-size: 14px;
		color: #333;
	}

	.post-time {
		margin-left: 10px;
		margin-top: 3px;
		margin-right: 70px;
		font-size: 12px;
		color: #999;
	}

	.report-container {
		position: relative;
	}

	.post-content {
		margin-bottom: 10px;
		margin-left: 55px;
		margin-right: 25px;
		font-size: 14px;
		color: #333;
	}

	.post-images {
		display: flex;
		flex-wrap: wrap;
		margin-left: 55px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.post-tags {
		margin-bottom: 10px;
		margin-left: 55px;
		width: 80px;
		font-size: 12px;
		display: flex;
	}

	.post-actions {
		display: flex;
		align-items: center;
		margin-left: 55px;
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