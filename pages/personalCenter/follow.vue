<template>
	<view class="follow-list">
		<view class="follow-header">
			我的关注（{{ followCount }}）
		</view>

		<view class="follow-item" v-for="(follow, index) in followList" :key="index">
			<u-image :src="follow.iconUrl" width="40px" height="40px" shape="circle"
				@click="goToUserHomePage(follow.id)"></u-image>
			<text class="nickname" @click="goToUserHomePage(follow.id)">{{ follow.username }}</text>

			<view class="buttonContainer">
				<view class="followButton">
					<u-button type="info" :text="getButtonText(follow.isFollowing)" shape="circle"
						@click="follow(index)">
					</u-button>
				</view>
			</view>
		</view>

		<u-loadmore :status="status" />

	</view>
</template>

<script>
	export default {
		onLoad(router) {
			this.userId = router.userId;
			this.followCount = router.followCount;
			this.getFollows();
		},
		data() {
			return {
				userId: '', // 路由传入
				followCount:'',
				followList: [], //后端获得的关注列表
				page: 1,
				status: "loading", // 初始状态为loading
			};
		},
		methods: {
			follow(index) {
				const follow = this.followList[index];

				// 调用后端接口进行关注/取消关注操作
				if (follow.isFollowing) //已经关注了，要取消关注
				{
					this.$myRequest({
							url: '/user/unfollow/' + follow.id,
							method: "POST",
						})
						.then(response => {
							follow.isFollowing = !follow.isFollowing;
							uni.showToast({
								title: '取关成功',
								//将值设置为 success 或者直接不用写icon这个参数
								icon: 'success',
								//显示持续时间为 2秒
								duration: 1000,
							});
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
							url: '/user/follow/' + follow.id,
							method: "POST",
						})
						.then(response => {
							follow.isFollowing = !follow.isFollowing;
							uni.showToast({
								title: '关注成功',
								//将值设置为 success 或者直接不用写icon这个参数
								icon: 'success',
								//显示持续时间为 2秒
								duration: 1000,
							});
						})
						.catch(error => {
							if (error.data.code == 500) {
								uni.$u.toast(error.data.message);
								return;
							}
						});
				}

				uni.showToast({
					title: follow.isFollowing ? '关注成功' : '取消关注成功',
					icon: 'success',
				});
			},
			getButtonText(isFollowing) {
				return isFollowing ? '取消关注' : '重新关注';
			},
			goToUserHomePage(userId) {
				uni.navigateTo({
					url: '/pages/personalCenter/userHomePage?id=' + encodeURIComponent(userId)
				});
			},
			getFollows() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/pageIdolFan?page=' + this.page + '&size=10&type=0&order=time_desc',
						method: "GET",
					})
					.then(response => {
						this.page = this.page + 1;
						const newfollows = response.data.data.records;
						// 加isFollowing状态
						const newFollowsWithIsFollowing = newfollows.map(follow => ({
							...follow,
							isFollowing: true
						}));

						this.followList = this.followList.concat(newFollowsWithIsFollowing); // 将新数据接在原有数据后面

						if (newfollows.length > 0 && newfollows.length == 10) //>0
						{
							this.status = "loadmore"; // 还可能有新数据，状态设为loading
						} else {
							this.status = "nomore"; //不够10个，取完了
						}
					})
					.catch(error => {
						if (error.data.code == 500) {
							this.status = "nomore";
							uni.$u.toast(error.data.message);
							return;
						}
					});
			},
			onReachBottom() {
				this.getFollows();
			},
		},
	};
</script>

<style lang="scss" scoped>
	.follow-list {
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 10px;
	}

	.follow-header {
		font-size: 14px;
		margin-bottom: 20px;
	}

	.follow-item {
		display: flex;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 10px;
		justify-content: space-between;
	}

	.follow-info {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nickname {
		font-size: 16px;
		flex: 1;
		margin-left: 20px;
	}

	.buttonContainer {
		display: flex;
		align-items: center;
		position: absolute;
		right: 10px;
	}

	.followButton {
		width: 85px;
	}
</style>