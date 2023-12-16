<template>
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

		<u-divider></u-divider>
		<!-- 发帖 -->
		<view >
				<u-tabs class="tabContainer" :list="list1" lineColor="#2D983A"></u-tabs>
		</view>
		
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		
	</view>
</template>

<script>
	export default {
		onLoad(router) {
		    // query.id 包含页面跳转过来时携带的参数
		    this.userId = router.id;
			// uni.$u.toast('跳转到'+this.userId);
		    //console.log(this.userId);
		    // 调接口
			this.getUserInfo();
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
				//postsCount: 30,
				isFollowing: false, //是否关注这个人
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
						url: '/user/getAllInfo/'+this.userId,
						method: "GET",
					})
					.then(response => {
						//this.userId = response.data.data.id;
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
			goToChat(userId) {
				// 跳转私聊界面
				uni.navigateTo({
					url: '/pages/module1/chat?id='+encodeURIComponent(userId),
					
				});
			},
			follow() {
				if(this.isFollowing)//已经关注了，要取消关注
				{
					this.$myRequest({
							url: '/user/unfollow/'+this.userId,
							method: "POST",
						})
						.then(response => {
							//this.isFollowing = !this.isFollowing;
							uni.showToast({
								title: '取关成功',
								//将值设置为 success 或者直接不用写icon这个参数
								icon: 'success',
								//显示持续时间为 2秒
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
				else//关注
				{
					this.$myRequest({
							url: '/user/follow/'+this.userId,
							method: "POST",
						})
						.then(response => {
							//this.isFollowing = !this.isFollowing;
							uni.showToast({
								title: '关注成功',
								//将值设置为 success 或者直接不用写icon这个参数
								icon: 'success',
								//显示持续时间为 2秒
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
		padding: 20px;
	}

	.rowLayout {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		margin-right: 20px;
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
	
	.tabContainer{
		margin-top: 0;
	}
</style>