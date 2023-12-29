<template>
	<view class="team-post">

		<view class="team-photo" @click="goToDetail(postId)"><!--组队图-->
			<u-image class="image" :src="url" :width="screenWidth/2-10" height="225px"></u-image>
		</view>

		<text class="team-description" >{{title}}</text>

		<view class="team-info" @click="goToDetail(postId)">
			<u-image :src="iconUrl" width="20px" height="20px" shape="circle"
				@click="goToUserHomePage(userId)"></u-image>
			<text class="nickname" @click="goToUserHomePage(userId)">{{ nickName }}</text>
			<text class="numberOfPeople" v-if="limitNum-exist!=0" >{{"差"}}{{limitNum-exist}}{{"人"}}</text>
			<text class="numberOfPeople" v-if="limitNum-exist==0" >{{"已满员"}}</text>
		</view>

	</view>
</template>

<script>
	export default {
		props: [
			'nickName', 'iconUrl', 'userId', 'url', 'title', 'limitNum','exist','postId'
		],

		created() {
			uni.getSystemInfo({
				success: (res) => {
					// 箭头函数保持了正确的 this 上下文，指向 Vue 实例
					this.screenWidth = res.windowWidth;
					console.log("宽度是 " + res.windowWidth);
				}
			});
		},

		data() {
			return {
				screenWidth: 0,
			};
		},



		methods: {
			
			getNumPeo(x,y){
				return x-y;
			},
			getWidth() {
				return this.screenWidth
			},

			goToDetail(postId) {
				uni.navigateTo({
					url: '/pages/postPage/index?id=' + encodeURIComponent(postId), //路径要改
				});
				uni.$u.toast('跳转帖子详情' + postId);
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
			goToUserHomePage(userId) {
				const myId = getApp().globalData.myUserId; //为空就是没登录状态，就当看别人的

				if (userId == myId) { //看自己的主页，跳转个人中心
					uni.switchTab({
						url: '/pages/personalCenter/index',
					})
				} else {
					uni.navigateTo({
						url: '/pages/personalCenter/userHomePage?id=' + encodeURIComponent(userId)
					});
				}
			},



		}
	};
</script>


<style lang="scss" scoped>
	.team-post {
		padding: 2px 2px 10px 2px;
		background-color: #fff;
		border: 1px solid lightgray;
		border-radius: 5px;
	}

	.team-photo {
		display: flex;
		flex-wrap: wrap;
		height: 225px;
		/* 假设父容器高度为200px */
		margin-top: 5px;
		margin-bottom: 10px;
		overflow: hidden;
		/* 控制溢出隐藏 */
	}

	.image {
		// width: 320px;
		/* 图像宽度自适应 */
		height: 225px;
		/* 图像高度自适应 */

	}

	.team-description {
		font-size: 15px;
		font-weight: bold;
		color: #333;
		margin-top: 2px;

	}

	.team-info {
		margin-top: 5px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.numberOfPeople {
		font-size: 11px;
		color: black;
		font-weight: bold;
		margin-left: auto;
	}

	.nickname {
		margin-left: 7px;
		font-size: 11px;
		color: #333;
	}

	.post-time {
		margin-left: 10px;
		margin-top: 3px;
		margin-right: 70px;
		font-size: 12px;
		color: #999;
	}
</style>