<template class="app">
	<view class="login_content" style="background:url('https://zhks-1252354869.cos.ap-guangzhou.myqcloud.com/Other/67d89f79-b883-4cf8-8561-8d40b6d957b0.png');background-size: 100% 100%;
		background-repeat: no-repeat">
		<!-- <image class="banner" src="../../static/banner.png" mode="widthFix"></image> -->
		<view class="login_title">
			<view class="titleOne">
				广州中医药大学
			</view>
			<view class="headline">
				智慧课室
			</view>
			<view class="students">
				教师端
			</view>
		</view>
		<view class="formBox">
			<view class="formInp">
				<image src="../../static/image/student.png" mode="widthFix"></image>
				<input class="studentBtn" placeholder="用户名" v-model="loginName" placeholder-style="color: #FFFFFF;" />
			</view>
			<view class="formInp">
				<image src="../../static/image/student.png" mode="widthFix"></image>
				<input class="studentBtn" placeholder="学号" v-model="studentNo" placeholder-style="color: #FFFFFF;" />
			</view>
			<view class="formInp">
				<image src="../../static/image/password.png" mode="widthFix"></image>
				<input class="studentBtn" type="password" placeholder="密码" v-model="passWord" placeholder-style="color: #FFFFFF;" />
			</view>
			<button class="login" type="primary" @click="login">登录</button>
		</view>
		<view class="Other">
			其他登录方式
			<view class="" style="position: relative;">
				<image class="face" src="../../static/image/face.png" mode=""></image>

				<button style="color: #FFFFFF;" class="faceBtn" type="primary">人脸识别</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				studentNo: '',
				loginName: '',
				passWord: '',
			}
		},
		methods: {
			login() {
				var that = this
				if (!that.$data.loginName) {
					Toast.fail('请输入用户名');
					return
				} else if (!that.$data.studentNo) {
					Toast.fail('请输入学号');
					return
				} else if (!that.$data.passWord) {
					Toast.fail('请输入密码');
					return
				} else {
					uni.login({
						success(res) {
							console.log(res,"22")
							if (res.code) {
								console.log(res)
								uni.request({
									method: 'POST',
									url: 'https://hk.joyfulboo.com/Campus/WeiXin/OnLogin',
									data: {
										LoginCode: res.code,
										UserNo: that.$data.studentNo,
										LoginName: that.$data.loginName,
										PassWord: that.$data.passWord,
										UserType: "T"
									},
									header: {
										'content-type': "application/json"
									},
									success: (res) => {
										console.log(res)
										let result = res.data
										if (result.Success == true) {

											uni.showToast({
												title: '登录成功',
												icon: 'success',
												duration: 2000,
												success() {
													uni.setStorageSync('token', result.Data.Token)
													uni.setStorageSync('UserInfo', result.Data)
													uni.switchTab({
														url: '../index/index'
													})
												}
											});

										} else {
											uni.showToast({
												title: result.Message,
												icon: 'none'
											})
											return false
										}
									}
								})
							} else {
								console.log('登录失败！' + res.errMsg)
							}
						}

					})
				}

			}
		},
	}
</script>

<style scoped lang="less">
	.banner {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		// z-index: 1;
	}

	.Other {
		color: #FFFFFF;
		font-size: 26upx;
		text-align: center;
		margin-top: 122upx;
		padding-bottom: 80upx;
	}

	.faceBtn {
		line-height: 104upx;
		margin-top: 20upx;
		width: 499upx;
		height: 104upx;
		background: #03C173;
		border-radius: 50upx;
		border: 1px solid rgba(245, 247, 251, 1);
	}

	.face {
		z-index: 99;
		top: 26%;
		left: 32%;
		position: absolute;
		display: inline-block;
		width: 50upx;
		height: 50upx;
	}

	.formInp {
		color: #FFFFFF;
		position: relative;

		image {
			top: 26%;
			left: 24%;
			position: absolute;
			width: 50upx;
			height: 50upx;
		}
	}

	.formBox {
		margin-top: 100upx;

		.studentBtn {
			color: #FFFFFF;
			padding-left: 130upx;
			margin: 20upx auto;
			display: block;
			width: 370upx;
			height: 104upx;
			// background: #03C173;
			border-radius: 50upx;
			border: 1px solid rgba(245, 247, 251, 1);
		}

		.login {
			width: 499upx;
			height: 104upx;
			line-height: 104upx;
			background: #FFFFFF;
			color: #03C173;
			border-radius: 52upx;
		}


	}

	.login_title {
		padding-top: 346upx;
		margin-bottom: 300upx;
		// padding-bottom: 300upx;
		// position: absolute;
		// top: 30%;
		// left: 20%;
		text-align: center;

		.students {
			color: #03C173;
			margin: 0 auto;
			width: 132px;
			height: 60upx;
			line-height: 56upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 18px;
		}

		.titleOne {
			height: 30px;
			font-size: 22px;
			font-weight: 400;
			line-height: 30px;
		}

		.headline {
			font-size: 106upx;
			height: 73px;
			font-size: 53px;
			font-weight: 600;
			line-height: 123upx;
			// margin-bottom: 20upx;
		}
	}

	.login_content {
		position: relative;
		color: #FFFFFF;
		// height: 100vh;
		min-height: 100vh;
		// width: 100vw;
		// background: url(../../static/banner.png);
		// background-size: 100% 100%;
		// background-repeat: no-repeat
	}
</style>
