<template>
	<view>
		<view class="container">
			<!-- 头像、用户名、用户id -->
			<view class="rowLayout">
				<u-image :src="avatarUrl" width="60px" height="60px" shape="circle"></u-image>
				<view class="topBottomLayout">
					<text class="username">{{username}}</text>
					<text class="userid">id:{{userId}}</text>
				</view>
			</view>

			<!-- 关注、粉丝、发帖数量、私信按钮 -->
			<view class="rowLayout">
				<view class="itemLayout">
					<text class="count">{{followCount}}</text>
					<text class="label">关注</text>
				</view>
				<view class="itemLayout">
					<text class="count">{{fansCount}}</text>
					<text class="label">粉丝</text>
				</view>

				<view class="buttonContainer">
					<view class="itemButtonLayout_1">
						<u-button type="info" shape="circle" :text="buttonText" @click="follow"></u-button>
					</view>
					<view class="itemButtonLayout_2">
						<u-button type="info" shape="circle" icon="chat" @click="goToChat(userId)"></u-button>
					</view>
				</view>
			</view>
		</view>

		<u-divider></u-divider>
		<view class="tabContainer">
			<u-tabs :list="list1" lineColor="#2D983A"></u-tabs>
		</view>

        
		<!-- 发帖 -->
		<view v-if="posts.length!=0">
		<briefPost v-for="(post, index) in posts" :key="index" :nickName="post.userInfoVO.username"
			:postTime="post.postTime" :iconUrl="post.userInfoVO.iconUrl" :content="post.content"
			:image="post.mediaList[0]" :tags="post.tagList" :postId="post.id" :userId="post.userId" :title="post.title"
			:section="post.section" :likes="post.likes" :dislikes="post.dislikes" :collections="post.collections"
			:comments="post.comments" :isLiked="post.isLiked" :isDisliked="post.isDisliked"
			:isCollected="post.isCollected" :urls="post.mediaList"></briefPost>

		<u-loadmore :status="status" />

		<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>
		
		<view v-else>
			<u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png" text="暂无发帖">
			</u-empty>
		</view>

	</view>
</template>

<script>
	import briefPost from '@/pages/homePage/briefPost.vue';

	export default {
		components: {
			briefPost,
		},
		onLoad(router) {
			this.userId = router.id;

			this.getUserInfo();
			this.getUserPosts();
		},
		data() {
			return {
				list1: [{
					name: '发帖'
				}],

				avatarUrl: '',
				username: '',
				userId: '',
				followCount: '',
				fansCount: '',
				isFollowing: false, //是否关注这个人
				posts: [], //用户个人发帖
				page: 1,
				status: "loading", // 初始状态为loading
				scrollTop: 0,
				size: 5,
			}
		},
		computed: {
			buttonText() {
				return this.isFollowing ? '取消关注' : '关注';
			}
		},
		methods: {
			getUserInfo() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/getAllInfo/' + this.userId,
						method: "GET",
					})
					.then(response => {
						this.username = response.data.data.username;
						this.avatarUrl = response.data.data.iconUrl;
						this.followCount = response.data.data.followings;
						this.fansCount = response.data.data.followers;
						this.isFollowing = response.data.data.isFollowed;
					})
					.catch(error => {
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
					});
			},
			getUserPosts() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/post/pageOtherPost/' + this.userId + '?page=' + this.page + '&size=' + this.size,
						method: "GET",
					})
					.then(response => {
						this.page = this.page + 1;
						const newPosts = response.data.data.records;

						this.posts = this.posts.concat(newPosts); // 将新数据接在原有数据后面

						if (newPosts.length > 0 && newPosts.length == this.size) //>0
						{
							this.status = "loadmore"; // 还可能有新数据，状态设为loading
						} else {
							this.status = "nomore"; //不够10个，取完了
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
				this.getUserPosts();
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			goToChat(userId) {
				// 跳转私聊界面
				uni.navigateTo({
					url: '/pages/module1/chat?id=' + encodeURIComponent(userId),
				});
			},
			follow() {
				if (this.isFollowing) //已经关注了，要取消关注
				{
					this.$myRequest({
							url: '/user/unfollow/' + this.userId,
							method: "POST",
						})
						.then(response => {
							uni.showToast({
								title: '取关成功',
								icon: 'success',
								duration: 1000,
							});
							this.getUserInfo();
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
						});
				} else //关注
				{
					this.$myRequest({
							url: '/user/follow/' + this.userId,
							method: "POST",
						})
						.then(response => {
							uni.showToast({
								title: '关注成功',
								icon: 'success',
								duration: 1000,
							});
							this.getUserInfo();

						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
						});
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px 20px 0 20px;
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

	.tabContainer {
		padding: 0 0 20px 0;
	}
</style>