<template>
	<view class="MAkeInfoContent">
		<view class="infoCard">
			<view class="cardTop">
				<image src="../../static/image/achieve.png" mode="widthFix"></image>
				<view style="padding-bottom: 30upx;">
					预约成功
				</view>
			</view>
			<view class="recordInfo">
				<view class="classRoomName">
					{{ClassroomLogInfo.ClassroomName}}
				</view>
				<view>
					预约时间：{{ClassroomLogInfo.CreateDatetime.substring(0, 16)}}
				</view>
				<view>
					使用时间：{{ClassroomLogInfo.StartTime.substring(0, 16)}}~{{ClassroomLogInfo.EndTime.substring(11, 16)}}
				</view>
				<view class="UserInfo">
					<view>
						姓名：{{ClassroomLogInfo.ReserveUserName}}
					</view>
					<view>
						工号：{{ClassroomLogInfo.ReserveUserNo}}
					</view>
					<view>
						联系方式：{{ClassroomLogInfo.Phone}}
					</view>
				</view>
				
			</view>
		</view>
		<view class="BtnContent">
			<view class="abolish" @click="abolish">
				取消
			</view>
			<view class="sbumitBtn" @click="confirm">
				确定
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				ClassroomLogId:'',
				ClassroomLogInfo:{},
			}
		},
		methods: {
			abolish(){
				var self =this.$data
				wx.showModal({
					title: '提示',
					content: '确定取消预约吗？',
					success(res) {
						if (res.confirm) {
							uni.request({
								method: 'GET',
								url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/CancelClassroomLog',
								data: {
									classroomLogId: self.ClassroomLogId
								},
								header: {
									'content-type': "application/json",
									'Authorization': uni.getStorageSync('token'),
								},
								success: (res) => {
									console.log(res)
									let Res = res.data
									if (Res.Success == true) {
										uni.showToast({
											title: '取消成功',
										})
										setTimeout(() => {
										  wx.navigateBack({
										    delta: 1 
										  })
										}, 1000)
									} else {
										uni.showToast({
											title: Res.Message,
											icon: 'none'
										})
										return false
									}
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			confirm(){
				wx.navigateBack({
				  delta: 1 
				})
			},
			GetClassroomLogInfo(){
				var _that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetClassroomLogInfo',
					data: {
						ClassroomLogId: _that.$data.ClassroomLogId,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							
							_that.$data.ClassroomLogInfo = result.Data
						} else {
							uni.showToast({
								title: result.Message,
								icon: 'none'
							})
							return false
						}
					}
				})
			},
		},
		onLoad(ops) {
			this.$data.ClassroomLogId=ops.ClassroomLogId
			this.GetClassroomLogInfo()
		},
		onShow() {
			this.GetClassroomLogInfo()
		}
	}
</script>

<style lang="less" scoped>
.MAkeInfoContent{
	padding: 40upx;
	.infoCard{
		background:#FFFFFF;
		box-shadow:0px 2px 14px 0px rgba(190,190,190,0.29);
		border-radius:8px;
		margin: 30upx auto;
		padding: 40upx;
		.cardTop{
			border-bottom:4upx #F8F8F8 dashed;
			text-align: center;
			margin-bottom: 30upx;
			image{
				width: 20%;
				// height: 50rpx;
			}
		}
		.recordInfo{
			color: #888C9E;
			font-size: 28upx;
			line-height: 50upx;
			.classRoomName{
				color: #03C173;
				font-size: 32upx;
			}
			.UserInfo{
				margin-top: 30upx;
			}
		}
	}
	
	.BtnContent {
		display: flex;
		align-items: center;
		padding-bottom: 20upx;
		view {
			width: 255upx;
			border-radius: 50upx;
			text-align: center;
			line-height: 88upx;
			margin: 20upx auto;
		}
	
		.sbumitBtn {
			background: #03C173;
			color: #FFFFFF;
		}
	
		.abolish {
			color: #929CA4;
			border: 2upx solid #C0C3CF;
			background-color: #FFFFFF;
		}
	}
}
</style>
