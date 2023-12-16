<template>
	<view class="profile-edit">
		<!-- 用户头像 -->
		<view class="avatar">
			<u-image :src="avatarUrl" width="80px" height="80px" shape="circle" @click="changeAvatar"></u-image>
		</view>

		<!-- 用户名 -->
		<view class="form-item">
			<u-input placeholder="请输入用户名" border="bottom" v-model="username" suffixIcon="edit-pen">
				<u-text text="用户名" slot="prefix" margin="0 46px 0 0" type="tips"></u-text>
			</u-input>
		</view>

		<!-- 手机号 -->
		<view class="form-item">
			<u-input placeholder="请输入手机号" border="bottom" v-model="phoneNumber"suffixIcon="edit-pen">
				<u-text text="手机号" slot="prefix" margin="0 46px 0 0" type="tips"></u-text>
			</u-input>
		</view>

		<!-- ID（不可更改） -->
		<view class="form-item">
			<u-input placeholder="用户ID" border="bottom" v-model="userId" readonly>
				<u-text text="用户ID" slot="prefix" margin="0 46px 0 0" type="tips"></u-text>
			</u-input>
		</view>

		<!-- 学生证号 -->
		<view class="form-item">
			<u-input placeholder="请输入学生证号" border="bottom" v-model="studentId" suffixIcon="edit-pen">
				<u-text text="学生证号" slot="prefix" margin="0 33px 0 0" type="tips"></u-text>
			</u-input>
		</view>

		<!-- 是否认证（不可更改） -->
		<view class="form-item">
			<u-input placeholder="认证状态" border="bottom" v-model="verifiedState" readonly>
				<u-text text="是否认证" slot="prefix" margin="0 33px 0 0" type="tips"></u-text>
			</u-input>
		</view>

		<!-- 是否禁言（不可更改） -->
		<view class="form-item">
			<u-input placeholder="禁言状态" border="bottom" v-model="mutedState" readonly>
				<u-text text="是否禁言" slot="prefix" margin="0 33px 0 0" type="tips"></u-text>
			</u-input>
		</view>

		<!-- 保存修改按钮 -->
		<view class="save-btn" @click="saveChanges">保存修改</view>
	</view>
</template>

<script>
	export default {
		onLoad(router) {
			// query.id 包含页面跳转过来时携带的参数
			this.userId = router.userId;
			uni.$u.toast('跳转到' + this.userId + '页面');
			//console.log(this.userId);
			// 调接口获取数据
		},

		data() {
			return {
				userId: '', // 路由传入
				avatarUrl: '/static/avatar1.jpg', // 用户头像地址
				username: 'yonghu', // 用户名
				phoneNumber: '13333333333', // 手机号
				//userId: '123456', // 用户ID
				studentId: '09020202', // 学生证号
				isVerified: true, // 是否认证
				isMuted: false ,// 是否禁言
				verifiedState:'',
				mutedState:'',
			};
		},
		created() {
		    // 在组件创建时获取 isVerified 数据，并根据其值赋值给 verifiedState
		    this.getVerifiedState();
			this.getMutedState();
		  },
		
		computed:{
			
		},
		methods: {
			changeAvatar() {
				// 向后端发请求换头      
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						// 选择成功，获取临时文件路径
						const tempFilePaths = res.tempFilePaths;
						// 将临时文件路径赋值给头像地址
						this.avatarUrl = tempFilePaths[0];
					},
					fail: (err) => {
						// 选择失败，处理错误
						console.error('选择图片失败', err);
					},
				});
			},
			getVerifiedState(){
				this.verifiedState=this.isVerified ? '已认证' : '未认证';
			},
			getMutedState(){
				this.mutedState=this.isMuted ? '已禁言' : '未禁言';
			},
			// 保存修改按钮点击事件
			saveChanges() {
				// 在这里向后端发送请求提交修改
				// 请根据实际情况使用 uni-app 的网络请求或其他方法
				// 例如 uni.request({url: 'your_api_url', data: {...}, method: 'POST'})
			}
		}
	};
</script>

<style>
	.profile-edit {
		padding: 20px;
	}

	.avatar {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15px;
		margin-bottom: 15px;
		overflow: hidden;
		cursor: pointer;
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.save-btn {
		text-align: center;
		background-color: #2D983A;
		color: #fff;
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 20px;
	}
</style>