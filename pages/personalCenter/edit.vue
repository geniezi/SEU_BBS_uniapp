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

		<!-- 手机号 （不可更改）-->
		<view class="form-item">
			<u-input placeholder="请输入手机号" border="bottom" v-model="phoneNumber" readonly>
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
			<u-input placeholder="请输入学生证号" border="bottom" v-model="studentNumber" suffixIcon="edit-pen">
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
			this.userId = router.userId;
			this.getAllInfo();
		},
		data() {
			return {
				userId: '', // 路由传入
				avatarUrl: '', // 用户头像地址
				username: '', // 用户名
				phoneNumber: '', // 手机号
				studentNumber: '', // 学生证号
				isCredit: false, // 是否认证
				isForbidden: false, // 是否禁言
				verifiedState: '',
				mutedState: '',

				imgarr: [],
				uploadimg: [],
				resarr: [],
				tempUrl: '',
			};
		},
		created() {
			this.getVerifiedState();
			this.getMutedState();
		},

		computed: {

		},
		methods: {
			getAllInfo() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/getAllInfo/' + 0,
						method: "GET",
					})
					.then(response => {
						this.username = response.data.data.username;
						this.avatarUrl = response.data.data.iconUrl;
						this.phoneNumber = response.data.data.phone;
						this.studentNumber = response.data.data.studentNumber;
						this.isCredit = response.data.data.isCredit;
						this.isForbidden = response.data.data.isForbidden;
						this.tempUrl = response.data.data.iconUrl;
					})
					.catch(error => {
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
					});

			},
			changeAvatar() {
				var _this = this;
				// 换头      
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						this.resarr = res.tempFilePaths;
						let data = this.resarr[0];
						uni.uploadFile({
							url: 'http://116.63.36.72:30088/seu/bbs/upload/icon',
							filePath: data,
							name: 'file',
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							success: (res) => {
								let result = JSON.parse(res.data);
								console.log(result)
								if (result.code == 200) {
									this.tempUrl = this.avatarUrl;
									this.avatarUrl = result.data;
									this.saveChanges();
								} else {
									console.log('文件上传不成功')
								}
							},
						});
					},
				});
			},
			getVerifiedState() {
				this.verifiedState = this.isCredit ? '已认证' : '未认证';
			},
			getMutedState() {
				this.mutedState = this.isForbidden ? '已禁言' : '未禁言';
			},
			saveChanges() {
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/user/update',
						method: "PUT",
						data: {
							"username": this.username,
							"studentNumber": this.studentNumber,
							"iconUrl": this.avatarUrl,
						}
					})
					.then(response => {
						uni.$u.toast('保存成功');
					})
					.catch(error => {
						this.avatarUrl = this.tempUrl;
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
					});
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