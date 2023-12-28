<template>
<view style="background-color: rgb(229,228,228);">
<view class="brief-post" >
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
				<u-icon :name="isLikedState ? 'thumb-up-fill' : 'thumb-up'" size="18px" :label="likeCount"></u-icon>
			</view>

			<view class="action-item" @click="dislikePost">
				<u-icon :name="isDislikedState ? 'thumb-down-fill' : 'thumb-down'" size="18px" :label="dislikeCount"></u-icon>
			</view>


			<view class="action-item">
				<u-popup :show="commentShow" mode="bottom" @close="closeComment" @open="openComment">
					<view>
						<u-textarea v-model="commentContent" placeholder="请输入内容"></u-textarea>
						<u-button icon="share-square" @click="sendComment">发送</u-button>
					</view>
				</u-popup>
				<u-icon name="chat" size="18px" @click="commentShow = true" :label="commentCount"></u-icon>
			</view>
		</view>
		<view v-if="parseInt(commentCount)>0" style="font-size: 12px;color: #00b331;" @click="replytoComment">
		点击展开{{commentCount}}条评论
		</view>
		<u-popup  :show="replyShow" mode="bottom" @close="closeReply" @open="openReply" border-radius="50" closeable="true">
			<view class="fixed-header" >
			<text class="discuss" >评论详情</text> 
			</view>
			<!-- <view style="scrool"> -->
			<scroll-view   :scroll-into-view="toView" scroll-y="true" style="height: 800rpx;" scroll-with-animation="true" @scrolltolower="getReply()" @scrolltoupper="reload()">
			
			<view class="brief-reply">
				<view class="reply-header" >
					<!-- 头像 昵称 时间 -->
					<u-image :src="iconUrl" width="30px" height="30px" shape="circle"
						@click="goToUserHomePage(userId)"></u-image> 
					<text class="reply_nickname" @click="goToUserHomePage(userId)">{{ nickName }}</text>
					<text class="reply_post-time">{{ commentTime }}</text> 
				
					<!-- 举报按钮-->
					<view class="reply-container">
						<u-popup :show="show" mode="bottom" @close="close" @open="open">
							<view>
								<u-button @click="reportPost">举报</u-button>
							</view>
						</u-popup>
						<u-icon size="18" name="more-dot-fill" color="#999" @click="show = true">
						</u-icon>
					</view>
				</view>
					<view >
						<!-- 帖子内容 -->
						<view class="reply_post-content">{{ content }}</view> 
					</view>
					
					<!-- 点赞、点踩、评论-->
					<view class="reply_post-actions" >
						<view class="reply_action-item" @click="likePost">
							<u-icon :name="isLikedState ? 'thumb-up-fill' : 'thumb-up'" size="18px" :label="likeCount"></u-icon>
						</view>
					
						<view class="reply_action-item" @click="dislikePost">
							<u-icon :name="isDislikedState ? 'thumb-down-fill' : 'thumb-down'" size="18px" :label="dislikeCount"></u-icon>
						</view>
					
					
						<view class="reply_action-item">
							<u-popup :show="commentShow" mode="bottom" @close="closeComment" @open="openComment">
								<view>
									<u-textarea v-model="commentContent" placeholder="请输入内容"></u-textarea>
									<u-button icon="share-square" @click="sendComment">发送</u-button>
								</view>
							</u-popup>
							<u-icon name="chat" size="18px" @click="commentShow = true" :label="commentCount"></u-icon>
						</view>
					
				</view>
				<view class="divider"/>
				<view class="comment-header" >
				<text class="discuss" >评论区</text> 
				</view>
				<view >
				<replyTemp v-for="(item, index) in replyList" :key="index" :nickName="replyUserInfoList[index].username"
					:commentTime="item.commentTime" :iconUrl="replyUserInfoList[index].iconUrl" :content="item.content"
					:postId="postId" :userId="item.userId" :likes="item.likes" :dislikes="item.dislikes" 
					:comments="item.commentNum" :isLiked="item.isLiked" :isDisliked="item.isDisliked" :commentId="item.id" :replyUserName="item.replyTo.mainUserName" :replyUserId="item.replyTo.mainCommentUserId">
					</replyTemp>
				</view>
				<u-loadmore :status="status" nomoreText="我也是有底线的"/>
				<!-- <u-back-top :scroll-top="scrollTop"></u-back-top> -->
			</view>
			</scroll-view>
			<!-- </view> -->
		</u-popup>
		<u-divider>大漠孤烟直</u-divider>
	</view>
</view>
</template>

<script>
import replyTemp from '@/pages/postPage/replyTemp.vue';
export default {
		props: ['nickName', 'iconUrl', 'userId','commentId','postId', 'commentTime', 'content', 'likes', 'dislikes', 'comments', 'isLiked', "isDisliked"
		],
		components: {
			replyTemp,
			// "replyTemplate": () => import('@/pages/postPage/replyTemplate.vue'),
		},
		data() {
			return {
				show: false,
				toView: '',
				isLikedState: this.isLiked,
				isDislikedState: this.isDisliked,
				likeCount: this.likes,
				dislikeCount: this.dislikes,
				commentCount: this.comments,
				commentShow: false,
				commentContent: '',
				replyShow:false,
				order:"time_asc",
				page: 1,
				size: 25,
				status: "loading", // 初始状态为loading
				scrollTop: 0,
				replyList:[],
				replyUserInfoList:[],
			};
		},
		methods: {
			reload(){
			this.page = 1; // 重置页码
			this.replyList = []; // 清空原有数据
			this.replyUserInfoList=[];
			this.status = "loading"; // 初始状态为loading
			// this.getCurrentTime();
			this.getReply(); // 重新获取数据	
			},
			listTouch(e) {
			    if (!(this.$refs.contentScroll.scrollHeight > this.$refs.contentScroll.clientHeight)) e.preventDefault();
			},
			handleTouch(e) {
			    if (e.target.className == 'dialog-content' || e.target.className == 'title-content') e.preventDefault();
			},
			disabledScroll(){
				if(this.replyShow){
					return 
				}
			},
			onReachBottom() {
				this.getReply();
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			getReply() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/comment/pageComment?postId=' + this.postId + "&commentId="+this.commentId+"&order="+this.order+"&page="+this.page+"&size="+this.size,
						method: "GET",
					})
					.then(response => {
						console.log("开始获取评论区")
						this.page = this.page + 1;
						const newComments = response.data.data.records;
						this.replyList = this.replyList.concat(newComments); // 将新数据接在原有数据后面
						if (newComments.length > 0 && newComments.length == this.size) {
							this.status = "loadmore"; // 如果有新数据，状态设为loading
						} else {
							this.status = "nomore";
						}
						let arr = [];
						newComments.forEach(e => { 
						    arr.push(e.userId)
						})
						let request="/user/listNIByIds?"
						for(let i=0;i<arr.length;i++)
						{
							request=request+"id="+arr[i]
							if(i!=arr.length-1)
							{
								request=request+"&"
							}
						}
						console.log(request)
						this.$myRequest({
								header: {
									'Authentication': uni.getStorageSync('Authentication')
								},
								url: request,
								method: "GET",
							})
							.then(res=> {
								console.log("已经获取到用户信息")
								this.replyUserInfoList=this.replyUserInfoList.concat(res.data.data)
								console.log(this.replyList)
								console.log(this.replyUserInfoList)
								})
							.catch(error => {
								if (error.data.code == 500) {
									//uni.$u.toast(error.data.message);
									console.log(error.data.message);
									return;
								}
							});
							
					})
					.catch(error => {
						this.status = "nomore";
						if (error.data.code == 500) {
							//uni.$u.toast(error.data.message);
							console.log(error.data.message);
							return;
						}
					});
			},
			replytoComment(){
				this.replyShow=true
			},
			openReply()
			{
				// console.log('open');
				this.getReply();
			},
			closeReply() {
				this.replyShow = false;
				// console.log('close');
				this.page = 1; // 重置页码
				this.replyList = []; // 清空原有数据
				this.replyUserInfoList=[];
				this.status = "loading"; // 初始状态为loading
				
			},
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
	.fixed-header{
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding-bottom: 5px;
	},
	.replyShow{
		overflow: hidden;
		position: fixed;

	}
	.scrool{
				height: 800rpx; // 固定高度
				overflow-y: scroll; // 超出滚动
				 overscroll-behavior-y: contain; // 禁止滚动溢出
			
			}
	.discuss {
			margin-top: 5rpx;
			margin-left: 0px;
			font-size: 15px;
			color: #616161;
			width:100%;
			font-weight: bold;
		}
	.comment-header{
	display: flex;
	}
	.select-area{
	font-size: 8rpx;
	color: #616161;
	/* font-weight: bold; */
	height: ;
	}
	.divider{
		margin-top: 50rpx;
		margin-bottom: 30rpx;
		 background: #8a8a8a;
		 width: 100%;
		 height: 5rpx;
		}
	.brief-reply {
			padding: 0 10px 20px 10px;
			background-color: #fff;
			height: 100%;
		}
	
	.reply-header {
			display: flex;
			align-items: center;
		}
	
	.reply-container {
			position: absolute;
			right: 10px;
			display: flex;
			align-items: center;
		}
	.reply_nickname {
		margin-left: 15px;
		font-size: 13px;
		color: #333;
	}
	
	.reply_post-time {
		margin-left: 10px;
		margin-top: 3px;
		margin-right: 0px;
		font-size: 12px;
		color: #999;
	}
	
	.reply_post-content {
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-line;
		margin-bottom: 10px;
		margin-left: 55px;
		margin-right: 25px;
		font-size: 14px;
		color: #333;
	}
	
	
	.reply_tag-row {
		display: flex;
		justify-content: space-between;
		flex-basis: 100%;
	}
	
	.reply_post-actions {
		display: flex;
		align-items: center;
		margin-left: 135px;
	}
	
	.reply_action-item {
		display: flex;
		align-items: center;
		margin-right: 28px;
	}
	
	
.brief-post {
		/* overflow：hidden; */
		padding: 0 10px 20px 10px;
		background-color: #fff;
		height: 95%;
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
		margin-left: 0px;
		margin-top: 3px;
		margin-right: 0px;
		font-size: 12px;
		color: #999;
	}

	.post-content {
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-line;
		margin-bottom: 10px;
		margin-left: 45px;
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
		margin-left: 135px;
	}

	.action-item {
		display: flex;
		align-items: center;
		margin-right: 28px;
	}

	.count {
		font-size: 12px;
		color: #999;
		margin-left: 5px;
	}
</style>