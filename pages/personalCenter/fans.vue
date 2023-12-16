<template>
	<view class="fans-list">
		<view class="fans-header">
			我的粉丝（{{ fansCount }}）
		</view>

		<view class="fans-item" v-for="(fans, index) in fansList" :key="index">
			<u-image :src="fans.iconUrl" width="40px" height="40px" shape="circle" @click="goToUserHomePage(fans.id)"></u-image>
			<text class="nickname" @click="goToUserHomePage(fans.id)">{{ fans.username }}</text>
			
			<view class="buttonContainer">
				<view class="followButton">
					<u-button type="info" :text="getButtonText(fans.isFollowed)" shape="circle" @click="follow(index)">
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
			this.fansCount = router.fansCount;
			this.getFans();
		  },
		data() {
			return {
				userId: '', // 路由传入
				fansCount:'',
				fansList: [],
				page: 1,
				status: "loading", // 初始状态为loading
			};
		},
		methods: {
			follow(index) {
				const fans = this.fansList[index];
				// 调用后端接口进行关注/取消关注操作
				if(fans.isFollowed)//已经关注了，要取消关注
				{
					this.$myRequest({
							url: '/user/unfollow/'+fans.id,
							method: "POST",
						})
						.then(response => {
							fans.isFollowed = !fans.isFollowed;
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
				}
				else//关注
				{
					this.$myRequest({
							url: '/user/follow/'+fans.id,
							method: "POST",
						})
						.then(response => {
							fans.isFollowed = !fans.isFollowed;
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
					title: fans.isFollowed ? '关注成功' : '取消关注成功',
					icon: 'success',
				});
			},
			getButtonText(isFollowed) {
				return isFollowed ? '互相关注' : '回关';
			},
			goToUserHomePage(userId){
				uni.navigateTo({
					url: '/pages/personalCenter/userHomePage?id='+encodeURIComponent(userId)
				});
			},
			getFans() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/pageIdolFan?page=' + this.page + '&size=10&type=1&order=time_desc',
						method: "GET",
					})
					.then(response => {
						this.page = this.page + 1;
						const newfans = response.data.data.records;
			
						this.fansList = this.fansList.concat(newfans); // 将新数据接在原有数据后面
			
						if (newfans.length > 0 && newfans.length == 10) //>0
						{
							this.status = "loadmore"; // 还可能有新数据，状态设为loading
						} else
						{
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
				this.getFans();
			},
			
		},
	};
</script>

<style lang="scss" scoped>
	.fans-list {
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 10px;
	}

	.fans-header {
		font-size: 14px;
		margin-bottom: 20px;
	}

	.fans-item {
		display: flex;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 10px;
		justify-content: space-between;
	}

	.fans-info {
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