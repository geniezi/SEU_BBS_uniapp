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

		<u-divider></u-divider>
		<!-- 发帖、回帖、点赞、收藏、足迹 -->
		<view>
			<!-- <u-grid :border="false" col="4">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex" @click="click">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" :size="22"></u-icon>
					<text class="grid-text">{{listItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" /> -->
			<!-- @click="click"-->
			<!-- <u-tabs :list="list1" @change="tabChange">
				<u-tab-pane title="Tab 1">Content 1</u-tab-pane>
				  <u-tab-pane title="Tab 2">Content 2</u-tab-pane>
				  <u-tab-pane title="Tab 3">Content 3</u-tab-pane>
			</u-tabs> -->
			<u-sticky bgColor="#fff">
				<u-tabs :list="list1" lineColor="#2D983A" @change="tabChange">
					<!-- <u-tab title="Tab 2">Content 2</u-tab> -->
					<!-- <u-tab title="Tab 1">Content 1</u-tab>
			     <u-tab title="Tab 3">Content 3</u-tab>
			      -->

				</u-tabs>
			</u-sticky>


		</view>
		<!-- 第四行 -->
		<!-- <view class="rowLayout">
			<button class="logout-button" @click="handleLogout">退出登录</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list1: [{
					name: '发帖',
				}, {
					name: '回帖',
				}, {
					name: '点赞'
				}, {
					name: '收藏'
				}, {
					name: '足迹'
				}],
				// list: [{
				// 		name: 'photo',
				// 		title: '图片'
				// 	},
				// 	{
				// 		name: 'lock',
				// 		title: '锁头'
				// 	},
				// 	{
				// 		name: 'star',
				// 		title: '星星'
				// 	},
				// 	{
				// 		name: 'hourglass',
				// 		title: '沙漏'
				// 	},
				// 	{
				// 		name: 'home',
				// 		title: '首页'
				// 	},
				// 	{
				// 		name: 'star',
				// 		title: '音量'
				// 	},
				// ],

				avatarUrl: '',
				username: '',
				userId: '',
				followCount: 0,
				fansCount: 0,
				// isCredit: false,
				// isForbidden: false,
				//postCount: 30

			}
		},
		onShow() {
		    // 在页面显示时发起多个请求
		    this.getAllInfo();
		  },
		methods: {
			getAllInfo() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/getAllInfo/'+0,
						method: "GET",
					})
					.then(response => {
						this.userId = response.data.data.id;
						this.username = response.data.data.username;
						this.avatarUrl = response.data.data.iconUrl;
						this.followCount = response.data.data.followings;
						this.fansCount = response.data.data.followers;
						// this.isCredit = response.data.data.isCredit;
						// this.isForbidden = response.data.data.isForbidden;
					})
					.catch(error => {
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
					});
				
			},
			click(item) {
				console.log('item', item);
			},
			tabChange(index) {
				console.log('当前选中的选项卡索引：', index);
			},
			goToFollowingPage(userId) {
				uni.navigateTo({
					url: '/pages/personalCenter/follow?userId='+encodeURIComponent(userId)+'&followCount='+this.followCount
				});
			},
			goToFansPage(userId) {
				uni.navigateTo({
					url: '/pages/personalCenter/fans?userId='+encodeURIComponent(userId)+'&fansCount='+this.fansCount
				});
			},
			goToEditPage(userId) {
				uni.navigateTo({
					url: '/pages/personalCenter/edit?userId='+encodeURIComponent(userId)
				});
			},
			logout() {
				this.$myRequest({
					header: {
						'Authentication': uni.getStorageSync('Authentication')
					},
						url: '/login/logout',
						method: "POST",
						data: {}
					})
					.then(response => {
						uni.switchTab({
							url: '/pages/login/index',
							success: () => {
								uni.showToast({
									title: '登出成功',
									//将值设置为 success 或者直接不用写icon这个参数
									icon: 'success',
									//显示持续时间为 2秒
									duration: 1000,
								})
							},
							fail: (res) => {
								uni.showToast({
									title: '登出失败',
									//将值设置为 success 或者直接不用写icon这个参数
									icon: 'fail',
									//显示持续时间为 2秒
									duration: 1000,
								})
								//console.log('navigate failed', res);
							}
						})
						// //login从tabbar取出后用
						// // uni.navigateTo({
						// // 	url: '/pages/login/index',
						// // 	success: () => {
						// // 		uni.$u.toast('请登录后操作');
						// // 	},
						// // 	fail: (res) => {
						// // 		console.log('navigate failed', res);
						// // 	}
						// // });
						
					})
					.catch(error => {
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
					});
			},
			
			// click(name) {
			// 	console.log('点击了第'+name+'个');
			// 	uni.$u.toast('点击了第'+name+'个');
			// 	//this.$refs.uToast.success(`点击了第${name}个`)
			// },
			handleGridClick() {
				uni.showToast({
					title: '跳转到另一个页面',
					icon: 'none'
				})
			},
			handleLogout() {
				// 执行退出登录的逻辑
				uni.showToast({
					title: '退出登录成功',
					icon: 'success'
				})
			}
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
		//flex: 1;

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

	// .itemButtonLayout_1 {
	// 	margin: 15px 15px 0 0;
	// }

	// .itemButtonLayout_2 {
	// 	margin: 15px 0 0 0;
	// }

	.label {
		font-size: 14px;
		color: #999;
	}

	.count {
		margin-top: 20px;
		font-size: 16px;
		color: #333;
	}



	// .grid {
	// 	margin-bottom: 20rpx;
	// }

	// .grid-text {
	// 	font-size: 14px;
	// 	color: #909399;
	// 	padding: 10rpx 0 20rpx 0rpx;
	// 	/* #ifndef APP-PLUS */
	// 	box-sizing: border-box;
	// 	/* #endif */
	// }

	// .logout-button {
	// 	width: 100%;
	// 	height: 60rpx;
	// 	background-color: #ff0000;
	// 	color: #fff;
	// 	font-size: 28rpx;
	// 	border-radius: 10rpx;
	// }
</style>