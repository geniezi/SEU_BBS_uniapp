<template>
	<view>
		<image class="logo" src="/static/logo.png"></image>
		<view class="greeting">你好~</view>

		<view class="layout">
			<u-input placeholder="请输入手机号" border="bottom" v-model="phoneNumber">
				<u-text text="+86" slot="prefix" margin="0 46px 0 0" type="tips"></u-text>
			</u-input>
		</view>

		<view class="layout">
			<u-input placeholder="请输入验证码" border="bottom" v-model="verificationCode">
				<u-text text="验证码" slot="prefix" margin="0 30px 0 0" type="tips"></u-text>
				<template slot="suffix">
					<u-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取">
					</u-code>
					<u-button @tap="getCode" :text="label" type="success" size="mini" color="#2D983A">
					</u-button>
				</template>
			</u-input>
		</view>

		<view class="layout">
			<u-checkbox-group v-model="isChecked">
				<!-- 原组件警告，可无视 -->
				<u-checkbox shape="circle" activeColor="#2D983A" margin-left="50px" size="15px">
				</u-checkbox>
				<view class="tips">
					我已阅读并同意<p class="blue_text">用户协议</p>和<p class="blue_text">隐私条款</p>
				</view>
			</u-checkbox-group>
		</view>

		<view>
			<button class="login_button" @click="login">登&#32;&#32;录</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNumber: '',
				verificationCode: '',
				isChecked: [], // 是否选中单选框
				value: '',
				label: '',
			}
		},
		computed: {
			canLogin() {
				// 判断是否满足登录条件
				return this.isChecked.length && this.phoneNumber.length === 11 && this.verificationCode.length === 6;
			}
		},
		methods: {
			codeChange(text) {
				this.label = text;
			},
			getCode() {
				if (this.phoneNumber.length === 11) {
					if (this.$refs.uCode.canGetCode) {
						// 向后端请求验证码
						uni.showLoading({
							title: '正在获取验证码'
						})
						this.$myRequest({
								url: '/login/get_code',
								method: "POST",
								data: {
									"phone": this.phoneNumber
								}
							})
							.then(response => {
								// setTimeout(() => {
								// 	// 通知验证码组件内部开始倒计时
								// }, 0);
								uni.hideLoading();
								this.$refs.uCode.start();
								uni.$u.toast('验证码已发送');
							})
							// .catch(error => {
							// 	uni.hideLoading();
							// 	if (error.data.code == 500) {
							// 		if (error.data.message == 'Invalid phone number') {
							// 			uni.$u.toast('请输入正确格式的手机号');
							// 			return;
							// 		}
							// 	}
							// });


					} else {
						uni.$u.toast('倒计时结束后再发送');
					}
				} else {
					uni.$u.toast('请输入正确格式的手机号');
				}
			},
			login() {
				if (this.canLogin) {
					//跳转主界面 传参
					this.$myRequest({
							url: '/login/login',
							method: "POST",
							data: {
								"phone": this.phoneNumber,
								"code": this.verificationCode
							}
						})
						.then(response => {
							uni.showToast({
									title: '登录成功',
									//将值设置为 success 或者直接不用写icon这个参数
									icon: 'success',
									//显示持续时间为 2秒
									duration: 1000
								}),
								uni.setStorageSync('Authentication', response.data.data)
							//login的token存入本地
							console.log(response.data.data) //打印token测试
							uni.switchTab({
								url: '/pages/homePage/index'
							});

						})
						.catch(error => {
							if (error.data.code == 500) {
								if (error.data.message == 'Invalid phone number') {
									uni.$u.toast('请输入正确格式的手机号');
									return;
								}
								if (error.data.message == 'Invalid code') {
									uni.$u.toast('请输入正确格式的验证码');
									return;
								}
								if (error.data.message == 'Login failed') {
									uni.$u.toast('登录失败，请检查手机号与验证码');
									return;
								}
							}
						});
				} else {
					if (this.phoneNumber.length !== 11) {
						uni.$u.toast('请输入正确格式的手机号');
						return;
					}

					if (this.verificationCode.length !== 6) {
						uni.$u.toast('请输入正确格式的验证码');
						return;
					}

					if (!this.isChecked.length) {
						uni.$u.toast('请先阅读并同意用户协议及隐私条款');
						return;

					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.logo {
		height: 100rpx;
		width: 100rpx;
		margin-left: 50rpx;
		margin-top: 100rpx;
	}

	.greeting {
		font-size: 18px;
		margin-top: 20px;
		text-align: left;
		margin-left: 50rpx;
	}

	.layout {
		display: flex;
		align-items: center;
		margin-top: 20px;
		padding: 0 20px;
	}

	.tips {
		font-size: 12px;
		display: flex;
		flex-wrap: nowrap;
	}

	.blue_text {
		color: blue;
	}

	.login_button {
		margin-top: 20px;
		width: 283px;
		height: 40px;
		background-color: #2D983A;
		color: #FFFFFF;
		border: none;
		border-radius: 5px;
		font-size: 16px;
		text-align: center;
		line-height: 40px;
		cursor: pointer;
	}
</style>