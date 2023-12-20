<template>
	<view>
		<view v-if="isLoggedIn">
			<view class="container">
				<!-- 头像、用户名、用户id -->
				<view class="rowLayout">
					<u-image :src="avatarUrl" width="60px" height="60px" shape="circle"></u-image>
					<view class="topBottomLayout">
						<text class="username">{{username}}</text>
						<text class="userid">id:{{userId}}</text>
					</view>
				</view>

				<!-- 关注、粉丝、编辑个人资料、退出登录按钮 -->
				<view class="rowLayout">
					<view class="itemLayout" @click="goToFollowingPage(userId)">
						<text class="count">{{followCount}}</text>
						<text class="label">关注</text>
					</view>
					<view class="itemLayout" @click="goToFansPage(userId)">
						<text class="count">{{fansCount}}</text>
						<text class="label">粉丝</text>
					</view>

					<view class="buttonContainer">
						<view class="itemButtonLayout_1">
							<u-button type="info" shape="circle" text="编辑资料" @click="goToEditPage(userId)"></u-button>
						</view>
						<view class="itemButtonLayout_2">
							<u-button type="info" shape="circle" icon="arrow-leftward" @click="logout"></u-button>
						</view>
					</view>
				</view>
			</view>

			<u-divider></u-divider>

			<!-- 发帖、回帖、点赞、收藏、足迹 -->
			<u-sticky bgColor="#fff">
				<view class="tabContainer">
					<u-tabs :list="list1" lineColor="#2D983A" @change="tabChange"></u-tabs>
				</view>
			</u-sticky>

			<!-- 帖子展示 -->
			<briefPost
				v-if="selectedTabIndex === 0 || selectedTabIndex === 2 || selectedTabIndex === 3 || selectedTabIndex === 4 || selectedTabIndex === 5"
				v-for="(post, index) in posts" :key="index" :nickName="post.userInfoVO.username"
				:postTime="post.postTime" :iconUrl="post.userInfoVO.iconUrl" :content="post.content"
				:image="post.mediaList[0]" :tags="post.tagList" :postId="post.id" :userId="post.userId"
				:title="post.title" :section="post.section" :likes="post.likes" :dislikes="post.dislikes"
				:collections="post.collections" :comments="post.comments" :isLiked="post.isLiked"
				:isDisliked="post.isDisliked" :isCollected="post.isCollected" :urls="post.mediaList"></briefPost>

			<reply v-if="selectedTabIndex === 1" v-for="(reply, i) in replys" :key="i" @commentDeleted="refreshPage"
				:myAvatar="avatarUrl" :myUserName="username" :content="reply.content" :commentTime="reply.commentTime"
				:replyTo="reply.replyTo" :postId="reply.postId" :myCommentId="reply.id" :userId="reply.userId"
				:commentId="reply.commentId" :likes="reply.likes" :dislikes="reply.dislikes"></reply>

			<u-loadmore :status="status" />

			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

		<view v-else>
			<view class="container">
				<!-- 头像、用户名、用户id -->
				<view class="rowLayout">
					<u-image width="60px" height="60px" shape="circle"></u-image>
					<view class="topBottomLayout">
						<text class="username">欢迎~</text>
						<text class="userid">id:{{}}</text>
					</view>
				</view>

				<!-- 关注、粉丝、编辑个人资料、退出登录按钮 -->
				<view class="rowLayout">
					<view class="itemLayout">
						<text class="count">0</text>
						<text class="label">关注</text>
					</view>
					<view class="itemLayout">
						<text class="count">0</text>
						<text class="label">粉丝</text>
					</view>
					<view class="login-button">
						<u-button type="info" shape="circle" text="登录/注册" @click="goToLogin"></u-button>
					</view>
				</view>
			</view>

			<u-divider></u-divider>

			<view class="tabContainer">
				<u-tabs :list="list1" lineColor="#2D983A"></u-tabs>
			</view>

			<u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png">
			</u-empty>
		</view>
	</view>
</template>

<script>
	import briefPost from '@/pages/homePage/briefPost.vue';
	import reply from '@/pages/personalCenter/reply.vue';

	export default {
		components: {
			briefPost,
			reply,
		},
		data() {
			return {
				list1: [{
					name: '发帖',
				}, {
					name: '回帖',
				}, {
					name: '点赞'
				}, {
					name: '点踩'
				}, {
					name: '收藏'
				}, {
					name: '足迹'
				}],
				avatarUrl: '',
				username: '',
				userId: '',
				followCount: 0,
				fansCount: 0,
				selectedTabIndex: 0, // 保存当前选中的选项卡索引

				posts: [], // 从后端获取的发帖数据
				replys: [], //后端获取回帖
				page: 1,
				type: 1,
				size: 5,
				status: "loading", // 初始状态为loading
				scrollTop: 0,
				isLoggedIn: true,
			}
		},
		// onShow() {
		// 	this.getAllInfo();
		// 	// const isLoggedIn = getApp().globalData.isUserLoggedIn;
		// 	// if (isLoggedIn) {
		// 	// 	this.getAllInfo();
		// 	// 	//this.getPosts();
		// 	// 	}
		// 	// } else {
		// 	// 	uni.navigateTo({
		// 	// 		url: '/pages/login/index',
		// 	// 	});
		// 	// }
		// },
		onShow() {
            this.page = 1;
            this.posts = [];
            this.replys = [];
            this.status = "loading";
			this.getAllInfo();
		},
		methods: {
			getAllInfo() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/getAllInfo/' + 0,
						method: "GET",
					})
					.then(response => {
						this.userId = response.data.data.id;
						this.username = response.data.data.username;
						this.avatarUrl = response.data.data.iconUrl;
						this.followCount = response.data.data.followings;
						this.fansCount = response.data.data.followers;
						console.log("jfdklsfjdklf")
						this.isLoggedIn = true;
						//个人信息获取成功再查帖子
						if(this.selectedTabIndex ==1)
						{
							this.getReplyPosts();
						}
						else{
							this.getPosts(); //位置？
						}
						
					})
					.catch(error => {
						this.isLoggedIn = false;
						if (error.data.code == 500) {
							console.log(error.data.message);
							return;
						}
					});
			},
			tabChange(index) {
				this.selectedTabIndex = index.index;

				this.page = 1;
				this.posts = [];
				this.replys = [];
				this.status = "loading";

				switch (this.selectedTabIndex) {
					case 0: //发帖
						this.type = 1;
						this.getPosts();
						break;
					case 1: //回帖
						this.getReplyPosts();
						//console.log(this.replys);
						break;
					case 2: //点赞
						this.type = 2;
						this.getPosts();
						break;
					case 3: //点踩
						this.type = 3;
						this.getPosts();
						break;
					case 4: //收藏
						this.type = 4;
						this.getPosts();
						break;
					case 5: //足迹
						this.type = 5; //改成对应
						this.getPosts();
						break;
					default:
						this.type = 1;
						this.getPosts();
						break;
				}
			},
			getPosts() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/post/pagePersonalPost?page=' + this.page + '&size=' + this.size + '&type=' + this.type,
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
			getReplyPosts() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/comment/pagePersonalReply?page=' + this.page + '&size=' + this.size,
						method: "GET",
					})
					.then(response => {
						this.page = this.page + 1;
						const newReplys = response.data.data.records;
						this.replys = this.replys.concat(newReplys); // 将新数据接在原有数据后面
						if (newReplys.length > 0 && newReplys.length == this.size) {
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
			onReachBottom() {
				if (this.selectedTabIndex === 0 || this.selectedTabIndex === 2 ||
					this.selectedTabIndex === 3 || this.selectedTabIndex === 4 || 
					this.selectedTabIndex === 5) {
					this.getPosts(); // 使用 getPosts 函数更新内容
				} else if (this.selectedTabIndex === 1) {
					this.getReplyPosts(); // 使用 getReplies 函数更新内容
				}
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			refreshPage() {
				this.page = 1;
				this.replys = [];
				this.status = "loading";
				this.getReplyPosts();
			},
			goToFollowingPage(userId) {
				uni.navigateTo({
					url: '/pages/personalCenter/follow?userId=' + encodeURIComponent(userId) + '&followCount=' +
						this.followCount
				});
			},
			goToFansPage(userId) {
				uni.navigateTo({
					url: '/pages/personalCenter/fans?userId=' + encodeURIComponent(userId) + '&fansCount=' + this
						.fansCount
				});
			},
			goToEditPage(userId) {
				uni.navigateTo({
					url: '/pages/personalCenter/edit?userId=' + encodeURIComponent(userId)
				});
			},
			logout() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/login/logout',
						method: "POST",
					})
					.then(response => {
						getApp().globalData.isUserLoggedIn = false; //改全局变量
						uni.removeStorageSync('Authentication')
						// uni.switchTab({
						// 	url: '/pages/login/index',
						// 	success: () => {
						// 		uni.showToast({
						// 			title: '登出成功',
						// 			icon: 'success',
						// 			duration: 1000,
						// 		})
						// 	},
						// 	fail: (res) => {
						// 		uni.showToast({
						// 			title: '登出失败',
						// 			icon: 'fail',
						// 			duration: 1000,
						// 		})
						// 	}
						// })
						// //login从tabbar取出后用
						uni.navigateTo({
							url: '/pages/login/index',
							success: () => {
								uni.showToast({
									title: '登出成功',
									icon: 'success',
									duration: 1000,
								})
							},
							fail: (res) => {
								uni.showToast({
									title: '登出失败',
									icon: 'fail',
									duration: 1000,
								})
							}
						});

					})
					.catch(error => {
						if (error.data.statusCode == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
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
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px 20px 0 20px;
	}

	.tabContainer {
		padding: 0 0 20px 0;
	}

	.rowLayout {
		display: flex;
		align-items: center;
	}

	.topBottomLayout {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 20px;
	}

	.username {
		font-size: 20px;
		color: #333;
		font-weight: bold;
	}

	.userid {
		font-size: 12px;
		color: #999;
		margin-top: 10rpx;
	}

	.itemLayout {
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 40px 0 0;
	}

	.buttonContainer {
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
	}

	.itemButtonLayout_1 {
		width: 80px;
		margin: 17px 16px 0 0;
	}

	.itemButtonLayout_2 {
		margin-right: 0;
		margin-top: 17px;
	}

	.label {
		font-size: 14px;
		color: #999;
	}

	.count {
		margin-top: 20px;
		font-size: 16px;
		color: #333;
	}

	.login-button {
		position: absolute;
		right: 20px;
		display: flex;
		align-items: center;
		margin-top: 17px;
	}
</style>