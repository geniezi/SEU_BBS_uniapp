<template>
	<view class="comment-item">
		<!-- 头像、昵称、时间、删除按钮 -->
		<view class="user-info">
			<u-image :src="myAvatar" width="40px" height="40px" shape="circle"></u-image>
			<text class="nickname">{{ myUserName }}</text>
			<text class="post-time">{{ commentTime }}</text>
			<view class="deleteIcon">
				<u-icon @click="deleteComment" name="trash" size="20px" color="#999"></u-icon>
			</view>
		</view>

		<!-- 所回复的评论 -->
		<view v-if="replyTo.mainCommentContent" class="reply-info" @click="goToDetail">
			<text class="gray-text line-clamp">|@{{ replyTo.mainUserName }}：{{ replyTo.mainCommentContent }}</text>
		</view>

		<!-- 自己评论的内容 -->
		<view class="comment-content" @click="goToDetail">
			<text class="content-text line-clamp">{{ content }}</text>
		</view>

		<!-- 评论对应的主贴内容 -->
		<view class="main-post" @click="goToDetail">
			<text class="main-post-text line-clamp">
				<text class="bold-text">主贴：</text>{{ replyTo.mainPostContent }}
			</text>
		</view>
	</view>
</template>


<script>
	export default {
		props: ['myAvatar', 'myUserName', 'content', 'commentTime', 'replyTo', 'postId',
			'myCommentId', 'userId', 'commentId', 'likes', 'dislikes'
		],
		data() {
			return {
				showEllipsis: false, // 是否显示省略号
			};
		},
		methods: {
			deleteComment() {
				this.$myRequest({
						url: '/comment/delete/' + this.myCommentId,
						method: "DELETE",
					})
					.then(response => {
						uni.showToast({
							title: '评论已删除',
							icon: 'success',
							duration: 1000,
						});

						this.$emit('commentDeleted');
					})
					.catch(error => {
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
					});
			},
			goToDetail() {
				uni.navigateTo({
					url: '/pages/postPage/index?id=' + encodeURIComponent(this.postId), //路径要改
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.comment-item {
		padding: 0 15px 20px 15px;
		//border-bottom: 1px solid #eee;//间隔线
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.nickname {
		margin-left: 10px;
		font-size: 15px;
	}

	.post-time {
		margin-left: 10px;
		font-size: 13px;
		color: #999;
	}

	.deleteIcon {
		position: absolute;
		right: 20px;
		display: flex;
		align-items: center;
	}

	.reply-info {
		margin-top: 12px;
		display: flex;
		align-items: center;
		color: #999;
		font-size: 15px;
	}

	.gray-text,
	.main-post-text {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.line-clamp {
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.comment-content {
		margin-top: 10px;
	}

	.main-post {
		margin-top: 10px;
		background-color: #f5f5f5;
		padding: 15px 3px 15px 3px;
		border-radius: 5px;
		font-size: 14px;
	}

	.main-post-text {
		color: #666;
	}

	.bold-text {
		font-weight: bold;
	}
</style>