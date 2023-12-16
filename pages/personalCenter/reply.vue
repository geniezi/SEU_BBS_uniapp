<template>
	<view class="comment-item">
		<!-- 第一行 -->
		<view class="user-info">
			<u-image :src="comment.userAvatar" width="40px" height="40px" shape="circle"></u-image>
			<text class="nickname">{{ comment.userName }}</text>
			<text class="post-time">{{ comment.postTime }}</text>
			<u-icon class="deleteIcon" @click="deleteComment" name="trash" size="20px"></u-icon>
		</view>

		<!-- 第二行 -->
		<view v-if="comment.replyTo" class="reply-info">
			<text class="gray-text line-clamp">|@{{ comment.replyTo.userName }}：{{ comment.replyTo.content }}</text>
			<!-- <text class=></text> -->
		</view>

		<!-- 第三行 -->
		<view class="comment-content">
			<text class="content-text line-clamp">{{ comment.content }}</text>
		</view>

		<!-- 第四行 -->
		<view class="main-post">
			<text class="main-post-text line-clamp">
				<text class="bold-text">主贴：</text>{{ comment.mainPostContent }}
			</text>
		</view>
	</view>
</template>


<script>
	export default {
		// props: {
		//   comment: Object, // 评论数据，包含用户头像、昵称、回帖时间等信息
		// },
		data() {
			return {
				// 示例数据，替换成你实际的数据
				comment: {
					userAvatar: "/static/avatar1.jpg",
					userName: "示例昵称",
					postTime: "示例回帖时间",
					replyTo: { //被回复的评论
						userName: "评论用户昵称",
						content: "评论文字内容啊啊啊啊啊啊啊啊啊啊啊啊",
					},
					content: "用户回帖的内容对对对对对对的点点滴滴哒哒哒哒哒哒哒哒哒", //自己的回复
					mainPostContent: "文字内容对对对对对对的点点滴滴哒哒哒哒哒哒哒哒哒哒哒哒", //主贴内容
					mainPostId: '',
				},
				showEllipsis: false, // 是否显示省略号
				// userId: '', // 路由传入
				// avatarUrl: '/static/avatar1.jpg', // 用户头像地址
				// username: 'yonghu', // 用户名
				// phoneNumber: '13333333333', // 手机号
				// //userId: '123456', // 用户ID
				// studentId: '09020202', // 学生证号
				// isVerified: true, // 是否认证
				// isMuted: false ,// 是否禁言
				// verifiedState:'',
				// mutedState:'',
			};
		},
		methods: {
			deleteComment() {
				// 处理删除评论的逻辑，调用接口等
				console.log('Delete comment:', this.comment.id);
				// 假设这里调用了删除接口，并成功删除后可以刷新页面或更新评论列表等
			},
		},
	};
</script>

<style lang="scss" scoped>
	.comment-item {
		padding: 20px;
		//border-bottom: 1px solid #eee;//间隔线！！！！！
	}

	.user-info {
		// display: flex;
		// align-items: center;
		display: flex;
		align-items: center;
		//justify-content: space-between; /* 让子元素之间平均分布 */
	}

	.nickname {
		margin-left: 20px;
		font-size: 15px;
	}

	.post-time {
		margin-left: 15px;
		margin-right: 45px;
		font-size: 13px;
		color: #999;
	}

	.deleteIcon {
		//margin-left: 20px;
		cursor: pointer;
	}

	.reply-info {
		margin-top: 12px;
		display: flex;
		align-items: center;
		color: #999;
		/* 灰色字体 */
		font-size: 15px;
	}

	// .reply-text {
	//   color: #999;

	// }

	.gray-text,
	.main-post-text {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.line-clamp {
		-webkit-line-clamp: 1;
		/* 设置显示的行数 */
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