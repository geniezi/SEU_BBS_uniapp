<template>
	<view>
		<!-- <u-button class="refreshButton" text="123" @click="onScrollToUpper" size="mini">轻触重置</u-button> -->
		<view class="searchContainer">
			<u-search placeholder="请输入关键词" shape="square" disabled="true"
			v-model="keyword" :showAction="false" @click="goToSearch"></u-search>
		</view>
		<view class="card-container">
		<teamPost v-for="(post, index) in posts" :key="index" :nickName="post.userInfoVO.username"
			:iconUrl="post.userInfoVO.iconUrl" :userId="post.userId" :title="post.title"
			:url="post.url" :limitNum="post.limitNum" :exist="post.exist" :postId="post.id" ></teamPost>
 
		<u-loadmore :status="status" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>
	</view>
</template>

<script>
	import teamPost from '@/pages/teamPage/teamPost.vue';

	export default {
		components: {
			teamPost
		},
		data() {
			return {
				screenWidth:0,
				posts: [], // 从后端获取的发帖数据
				page: 1,
				currentTime: '',
				size: 5,
				status: "loading", // 初始状态为loading
				scrollTop: 0,
				needRefresh: false,
				section: 2,
			};
		},
		onLoad() {
			this.page = 1; // 重置页码
			this.posts = []; // 清空原有数据
			this.status = "loading"; // 初始状态为loading
			this.getCurrentTime();
			this.getPosts();
			
		},
		onTabItemTap(e) {
			if (this.needRefresh) {
				this.page = 1; // 重置页码
				this.posts = []; // 清空原有数据
				this.status = "loading"; // 初始状态为loading
				this.getCurrentTime();
				this.getPosts(); // 重新获取数据
			} else {
				this.needRefresh = true
			}
		},
		onHide() {
			this.needRefresh = false
		},
		methods: {
			goToSearch() {
				uni.navigateTo({
					url: '/pages/homePage/searchResult'
				});
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
			getPosts() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/post/pagePost?page=' + this.page + '&size=' + this.size +
							'&section=' + this.section + '&queryTime=' + this.currentTime,
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
			goToSearch() {
				uni.navigateTo({
					url: '/pages/homePage/searchResult'
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.searchContainer {
		margin: 5px 5px 5px 5px;
	}

	.card-container{
		width: 100%;
		display: flex;
		  flex-wrap: wrap;
		  justify-content: space-between; /* 调整卡片之间的间距 */
		  /* 可根据需求自行调整样式 */
	}
</style>