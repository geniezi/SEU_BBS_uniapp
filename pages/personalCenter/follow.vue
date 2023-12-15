<template>
	<view class="follow-list">
		<view class="follow-header">
			我的关注（{{ followList.length }}）
		</view>

		<view class="follow-item" v-for="(follow, index) in followList" :key="index">
			<u-image :src="follow.avatar" width="40px" height="40px" shape="circle" @click="goToUserHomePage(follow.id)"></u-image>
			<text class="nickname" @click="goToUserHomePage(follow.id)">{{ follow.nickname }}</text>
			
			<view class="buttonContainer">
				<view class="followButton">
					<u-button type="info" :text="getButtonText(follow.isFollowing)" shape="circle" @click="follow(index)">
					</u-button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		onLoad(router) {
		    // query.id 包含页面跳转过来时携带的参数
		    this.userId = router.userId;
			uni.$u.toast('跳转到'+this.userId+'页面');
		    //console.log(this.userId);
		    // 调接口
		  },
		data() {
			return {
				userId: '', // 路由传入
				//isFollowingPage:'', // 判断是关注列表还是粉丝列表，路由传入
				followList: [{
						id: '1',
						avatar: '/static/avatar1.jpg',
						nickname: '11111111111',
						isFollowing: true
					},
					{
						id: '2',
						avatar: '/static/avatar2.jpg',
						nickname: '用户2',
						isFollowing: false
					},
					// 替换成从后端取
				],
			};
		},
		methods: {
			follow(index) {
				const follow = this.followList[index];
				follow.isFollowing = !follow.isFollowing;
				
				// 调用后端接口进行关注/取消关注操作
				
				uni.showToast({
					title: follow.isFollowing ? '关注成功' : '取消关注成功',
					icon: 'success',
				});
			},
			getButtonText(isFollowing) {
				return isFollowing ? '取消关注' : '关注';
			},
			goToUserHomePage(userId){
				uni.navigateTo({
					url: '/pages/personalCenter/userHomePage?id='+encodeURIComponent(userId)
				});
			}
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
		//margin-right: 80px;
	}

	.buttonContainer {
		// display: flex;
		// justify-content: flex-end;
		// align-items: flex-start;
		display: flex;
		align-items: center;
	}

	.followButton {
		width: 85px;
	}
</style>