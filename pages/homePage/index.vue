<template>
	<view>
		<u-button class="refreshButton" text="123" @click="onScrollToUpper" size="mini">轻触重置</u-button>

		<view class="space"></view>

		<briefPost v-for="(post, index) in posts" :key="index" :nickName="post.userInfoVO.username"
			:postTime="post.postTime" :iconUrl="post.userInfoVO.iconUrl" :content="post.content"
			:image="post.mediaList[0]" :tags="post.tagList" :postId="post.id" :userId="post.userId" :title="post.title"
			:section="post.section" :likes="post.likes" :dislikes="post.dislikes" :collections="post.collections"
			:comments="post.comments" :isLiked="post.isLiked" :isDisliked="post.isDisliked"
			:isCollected="post.isCollected" :urls="post.mediaList"></briefPost>

		<u-loadmore :status="status" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>

	</view>
</template>

<script>
	import briefPost from '@/pages/homePage/briefPost.vue';

	export default {
		components: {
			briefPost
		},
		data() {
			return {
				posts: [], // 从后端获取的发帖数据
				page: 1,
				currentTime: '',
				size: 5,
				status: "loading", // 初始状态为loading
				scrollTop: 0,
			};
		},
		mounted() {
			this.getCurrentTime();
			this.getPosts();
		},
		methods: {
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
						url: '/post/pagePost?page=' + this.page + '&size=' + this.size + '&section=0&queryTime=' + this
							.currentTime,
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
		}
	};
</script>

<style lang="scss" scoped>
	/deep/.refreshButton {
		width: 100%;
		height: 1%;
		border: none;
	}

	.space {
		margin-top: 20px;
	}
</style>