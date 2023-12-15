<template>
	<view class="fans-list">
		<view class="fans-header">
			我的粉丝（{{ fansList.length }}）
		</view>

		<view class="fans-item" v-for="(fans, index) in fansList" :key="index">
			<u-image :src="fans.avatar" width="40px" height="40px" shape="circle" @click="goToUserHomePage(fans.id)"></u-image>
			<text class="nickname" @click="goToUserHomePage(fans.id)">{{ fans.nickname }}</text>
			
			<view class="buttonContainer">
				<view class="followButton">
					<u-button type="info" :text="getButtonText(fans.isFollowing)" shape="circle" @click="follow(index)">
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
				fansList: [{
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
				const fans = this.fansList[index];
				fans.isFollowing = !fans.isFollowing;
				
				// 调用后端接口进行关注/取消关注操作
				
				uni.showToast({
					title: fans.isFollowing ? '关注成功' : '取消关注成功',
					icon: 'success',
				});
			},
			getButtonText(isFollowing) {
				return isFollowing ? '互相关注' : '回关';
			},
			goToUserHomePage(userId){
				uni.navigateTo({
					url: '/pages/personalCenter/userHomePage?id='+encodeURIComponent(userId)
				});
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