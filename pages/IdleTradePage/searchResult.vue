<template>
	<view>
		<view class="searchContainer">
			<u-search placeholder="请输入关键词" shape="square" v-model="keyword" :showAction="true"
			@search="searchKeyword" @custom="searchKeyword" :disabled="false"></u-search>
		</view>

		<view v-if="showSearchResults">
			<view class="space"></view>
			
		<view class="card-container">
		<commodityPost v-for="(post, index) in posts" :key="index" :nickName="post.userInfoVO.username"
			:iconUrl="post.userInfoVO.iconUrl" :userId="post.userId" :title="post.title"
			:url="post.url" :price="post.price" :postId="post.id"></commodityPost>
				</view>
		<u-loadmore :status="status" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>

		</view>

		<view v-else class="space2">
			<u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png" text="暂无搜索结果">
			</u-empty>
		</view>
	</view>

</template>

<script>
	import commodityPost from '@/pages/IdleTradePage/commodityPost.vue';

	export default {
		components: {
			commodityPost
		},
		data() {
			return {
				posts: [], // 从后端获取的发帖数据
				page: 1,
				size: 5,
				status: "loading", // 初始状态为loading
				scrollTop: 0,
				keyword: '', //带#搜的是tag
				showSearchResults: false,
			};
		},
		onShow() {
		},
		methods: {
			searchKeyword(){
				this.page=1;
				this.posts = []; 
				this.status = "loading"; 
				this.getSearchResult1();
			},
			getSearchResult1() {
				console.log(this.keyword+'函数里');
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
					url: '/post/searchSecondHandPost?page=' + this.page + '&size=' + this.size +
						'&keyword=' +encodeURIComponent(this.keyword)+'&section='+1,
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
						this.showSearchResults = this.posts.length > 0;
					})
					.catch(error => {
						this.status = "nomore";
						console.log(this.posts.length);
						if (error.data.code == 500 ) {
							if(error.statusCode==200 && this.posts.length == 0)
							{
								this.showSearchResults = false;
							}
							
							console.log(error.data.message);
							return;
						}
					});
			},
			onReachBottom() {
				this.getSearchResult();
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},

		}
	};
</script>

<style lang="scss" scoped>
	.searchContainer {
		margin: 5px 5px 0 5px;
	}

	.space {
		margin-top: 20px;
	}

	.space2 {
		margin-top: 100px;
	}
	.card-container{
		width: 100%;
		display: flex;
		  flex-wrap: wrap;
		  justify-content: space-between; /* 调整卡片之间的间距 */
		  /* 可根据需求自行调整样式 */
	}
</style>