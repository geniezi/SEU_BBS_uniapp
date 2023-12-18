<template>
<view class="brief-post">
		<!--基本信息-->
		<view class="post-header">
			<!-- 头像 昵称 时间 -->
			<u-image :src="iconUrl" width="40px" height="40px" shape="circle" @click="goToUserHomePage(userId)"></u-image> <!--:src="avatarUrl"-->
			<text class="nickname" @click="goToUserHomePage(userId)">{{ nickName }}</text> <!--{{ nickname }}  xlnx-x+C-->
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

		<view>
			<!-- 帖子内容 -->
			<view class="post-title">{{ title }}</view> 
			<view class="post-content">{{ content }}</view> <!--{{ content }}-->

			<!-- 帖子配图 -->
<!-- 			<view class="post-images" v-if="image !== '' && image !== null" @click.stop> -->
				<!-- 多张图 -->
<!-- 				<u-image v-for="(image, index) in images" :key="index" :src="image"></u-image>
					<u-image :src="image" width="160px" height="130px"></u-image> 
					<u-album :urls="urls"></u-album>
			</view> -->
<!-- 			<view class="img_box" v-if="images.length>0">
					<view class="img_item" v-for="(image, index) in images" :key="index">
						<u-image bindtap="preview"  class="img_item_i" src="image" mode="aspectFill"></u-image>
					</view> -->
					<!-- <view class="img_item" style=" display: flex;justify-content: center;align-items: center;">
						<image wx:if="{{imgList.length<9}}" class="add_icon" style="width:30%;height:30%;display:flex;justify-content:center;align-item:center" bindtap="upload" mode="aspectFill" src="点击上传的图标地址"></image>
			
					</view> -->
<!-- 			</view> -->
			<view class="qz_imgs"  v-if="images.length==1"
			
			v-for="(image,index) in images" :key="index"  @click="preview(index)">
			           <image style=" max-height: 320rpx;object-fit: cover;border-radius:3px;float: left;margin: 5px;" :src="image" mode="heightFix"/>
			</view>
			
			<view class="qz_imgs"  >
				<view   v-if="images.length==2"  v-for="(image,index) in images" :key="index" @click="preview(index)">
						<image  style="width:220rpx;height:220rpx;object-fit: cover;border-radius:3px;float: left;margin: 5px;" :src="image"  mode="aspectFill"/>
				</view>
			</view>
			<view class="qz_imgs"  v-if="images.length>=3"  >
			        <!-- <view   v-if="images.length>=3"  v-for="(image,index) in images" :key="index">
			                <image  style="width:212rpx;height:212rpx;object-fit: cover;border-radius:3px;float: left;margin: 5px;" :src="image"  mode="aspectFill"/>
			         </view> -->
					 <u-album :urls="images"></u-album>
			</view>

			<!-- 标签 -->
			<view class="post-tags">
				<u-tag v-if="this.section>0" :text="this.sectionArray[this.section]" bgColor="#f1f1f1" color="red" size="mini" icon="tags" plain
					borderColor="white"></u-tag>
				<!-- <u-tag text="一丘之貉" mode="dark" /> -->
				<u-tag v-for="tag in tags" :key="tag" :text="tag" bgColor="#f1f1f1" size="mini" icon="tags" plain
					borderColor="white"></u-tag>
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

			<view class="action-item">
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
		<!-- 评论区 -->
		<view style="background-color: azure; "> 
		
		<text class="discuss" >评论区</text>
		
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
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.postId = decodeURIComponent(options.id);
		    console.log(this.postId);
			this.$myRequest({
					header: {
						'Authentication': uni.getStorageSync('Authentication')
					},
					url: '/post/getPost/' + this.postId.toString(),
					method: "GET",
				})
			.then(response => {
						this.userId=response.data.data.userId
						this.nickName=response.data.data.userInfoVO.username
						this.postTime=response.data.data.postTime
						this.iconUrl=response.data.data.userInfoVO.iconUrl
						this.title=response.data.data.title
						this.content=response.data.data.content
						this.likes=response.data.data.likes
						this.dislikes=response.data.data.dislikes
						this.collections=response.data.data.collections
						this.comments=response.data.data.comments
						this.likeCount=this.likes
						this.dislikeCount=this.dislikes
						this.collectCount=this.collections
						this.commentCount=this.comments
						this.isLiked=response.data.data.isLiked
						this.isDisliked=response.data.data.isDisliked
						this.isCollected=response.data.data.isCollected
						this.isLikedState=this.isLiked
						this.isDislikedState=this.isDisliked
						this.isCollectedState=this.isCollected
						this.tags=response.data.data.tagList
						this.section=response.data.data.section
						this.images=response.data.data.mediaList
					})
					.catch(error => {
						if (error.data.code == 500) {
							this.status = "nomore";
							return;
							// if (error.data.message == ' ') {
							// 	uni.$u.toast(' ');
							// 	return;
							// }
						}
					});
		},
		data() {
			return {
				show: false,
				isLiked: false,
				isDisliked:false,
				isCollected:false,
				likes:"",
				dislikes:'',
				collections:'',
				comments:'',
				postId:"",
				isLikedState: false,
				isDislikedState: false,
				isCollectedState: false,
				likeCount: 0,
				dislikeCount: 0,
				collectCount: 0,
				commentCount: 0,
				Sectionarray: ['所有帖子', '二手交易', '组队',  '身边趣事', '时事新闻'],
				section:0,
				userId:'',
				nickName:"",
				postTime:'',
				iconUrl:'',
				commentShow: false,
				commentContent: '',
				title:'',
				content:'',
				tags:[],
				images:[],
				commentList:[],
				page: 1,
				currentTime: '',
				size: 25,
				status: "loading", // 初始状态为loading
				scrollTop: 0,
			};
		},
		mounted() {
			this.getCurrentTime();
			this.getComments();
		},
		methods: {
			onReachBottom() {
				this.getPosts();
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			onScrollToUpper() {
				this.page = 1; // 重置页码
				this.posts = []; // 清空原有数据
				this.status = "loading"; // 初始状态为loading
				this.getCurrentTime();
				this.getPosts(); // 重新获取数据
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
			getComments() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/post/pagePost?page=' + this.page + '&size=' + this.size + '&section=0&queryTime=' + this
							.currentTime,
						method: "GET",
					})
					.then(response => {
						this.page = this.page + 1;
						const newPosts = response.data.data.records;
						this.posts = this.posts.concat(newPosts); // 将新数据接在原有数据后面
						if (newPosts.length > 0 && newPosts.length == this.size) {
							this.status = "loadmore"; // 如果有新数据，状态设为loading
						} else {
							this.status = "nomore";
						}
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
			preview(i){
				// 预览图片
				uni.previewImage({
				    urls: this.images,
					current:i,
				    longPressActions: {
				        itemList: [ '保存图片'],
				        success: function(data) {
				            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				        },
				        fail: function(err) {
				            console.log(err.errMsg);
				        }
				    }
				});
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
				console.log(this.sectionArray[this.section])
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
							
							if(error.data.status == 401){
								this.goToLogin();
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
							
							if(error.data.status == 401){
								this.goToLogin();
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
	
	
.qz_imgs{
        position: relative;
        display: flex;
        overflow: hidden;

}

.img_box{
  display: flex;
  flex-wrap: wrap;
  margin: 20rpx;
  width: 100%;
}
.img_item_i{
  display: block;
  width: 100%;
  height: 100%;
}
 .closeImv {
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  width: 50rpx;
  height: 50rpx;
}

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
		width:60%
	}
	.discuss {
		margin-left: 0px;
		font-size: 13px;
		color: #616161;
		width:60%;
		font-weight: bold;
	}
	.post-time {
		margin-left: 0px;
		margin-top: 3px;
		margin-right: 0px;
		font-size: 12px;
		width: 20%;
		color: #999;
	}

	.report-container {
		padding-right: 10px;
		position: relative;
	}

	.post-content {
		margin-bottom: 10px;
		margin-left: 5px;
		margin-right: 5px;
		font-size: 14px;
		color: #333;
	}
	.post-title {
		margin-bottom: 10px;
		margin-left: 5px;
		margin-right: 5px;
		font-size: 18px;
		color: #101010;
		font-weight: bold;
	}

	.post-images {
		display: flex;
		flex-wrap: wrap;
		margin-left: 5px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.post-tags {
		margin-bottom: 10px;
		margin-left: 5px;
		width: 80px;
		font-size: 12px;
		display: flex;
	}

	.post-actions {
		display: flex;
		align-items: center;
		margin-left: 5px;
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