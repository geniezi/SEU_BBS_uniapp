<template>
	<view>
		<briefPost v-for="(post, index) in posts" :key="index" 
		:nickName="post.userInfoVO.username"
		:postTime="post.postTime"
		:iconUrl="post.userInfoVO.iconUrl"
		:content="post.content"
		:image="post.mediaList[0]"
		:tags="post.tagList"></briefPost>
		
		<!--" 
		:likeCount="posts.likeCount" 
		:collectCount="posts.collectCount"-->
		<!--<briefPost :avatar-url="post.avatarUrl" 
	:nickname="post.nickname" 
	:post-time="post.postTime" 
	:content="post.content" 
	:images="post.images" 
	:category="post.category" 
	:like-count="post.likeCount" 
	:collect-count="post.collectCount" 
	:is-liked="post.isLiked" 
	:is-collected="post.isCollected"></briefPost>-->

		

	</view>
</template>

<script>
	import briefPost from '@/components/home_Page/briefPost.vue';

	export default {
		components: {
			briefPost
		},
		data() {
			return {
				posts: [], // 从后端获取的发帖数据
				page: 0,
				currentTime:'',
			};
		},
		mounted(){
			this.getCurrentTime();
			this.getPosts();
		},
		methods: {
			getCurrentTime(){
				var date = new Date();
				this.currentTime = date.getFullYear()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate()
				+"T"+date.getHours().toString().padStart(2, '0') 
				+ ":" + date.getMinutes().toString().padStart(2, '0') 
				+ ":" + date.getSeconds().toString().padStart(2, '0');
				//this.currentTime = encodeURIComponent(this.currentTime);
			},
			getPosts() {
				this.$myRequest({
						url: '/post/pagePost?page=' + this.page + '&size=5&section=1&queryTime=' + this.currentTime,
						method: "GET",
					})
					.then(response => {
						this.page = this.page + 1;
						this.posts = response.data.data.records;
						console.log(this.posts);
					})
					.catch(error => {
						if (error.statusCode == 500) {
							uni.$u.toast(' 刷新失败');
							return;
							// if (error.data.message == ' ') {
							// 	uni.$u.toast(' ');
							// 	return;
							// }
						}
					});
			}
		}
	};
</script>