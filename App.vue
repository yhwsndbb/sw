<script>
	export default {

		onLaunch: function() {
			console.log('App Launch')
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */

	/deep/.uni-searchbar__box {
			border: none;
		}
	.searchBox{
		position: fixed;
		width:90%;
		top: 0;
		z-index: 999999;
	}
	.DataNo{
		margin: 300upx auto;
		text-align: center;
	}
	.input-section {
		position: fixed;
		display: flex;
		align-items: center;
		height: 110rpx;
		bottom: 0rpx;
		left: 30rpx;
		right: 0rpx;
		z-index: 500;
		background: #fff;
	}
	
	.input_input {
		background: #fff;
		margin-top: 12rpx;
		z-index: 500;
		width: 580rpx;
		height: 110rpx;
		padding-left: 35rpx;
		border: #F8F8F8 solid 2upx;
		border-radius: 20upx;
	}
	
	.send_btn {
		width: 110rpx;
		height: 66rpx;
		position: absolute;
		top: 24rpx;
		right: 30rpx;
		background: #03C173;
		z-index: 550;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.send_btn_text {
		display: flex;
		font-size: 32rpx;
		font-family: 'PingFang';
		color: #fff;
		z-index: 560;
	}
	
	.problem_content {
		margin-top: 10upx;
		.problem_card {
			margin-top: 20upx;
			padding: 40upx 40upx 20upx 40upx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 2px 22px 0px rgba(106, 119, 133, 0.13);
			border-radius: 12upx;
		
			.answer_info {
				margin: 20upx 0;
				padding: 30upx 20upx;
				font-size: 28upx;
				color: #929CA4;
				background: rgba(246, 246, 246, 1);
				border-radius: 6px;
			}
		
			.problem_card_bottom {
				color: #03C173;
				font-size: 28upx;
				text-align: center;
				margin-top: 20upx;
			}
		
			.problem_card_info {
				font-size: 28upx;
				color: #40474E;
				padding: 20upx 0;
				border-bottom: 2upx solid #F8F8F8;
			}
		
			.problem_status {
				color: #FFFFFF;
				font-size: 24upx;
				text-align: center;
				line-height: 42upx;
				width: 48px;
				height: 46px;
		
				.problem_status_open {
					background: #03C173;
					border-radius: 22upx;
				}
		
				.problem_status_hide {
					background-color: #FF9E18;
					border-radius: 22upx;
				}
			}
		
			.problem_card_top {
				display: flex;
				justify-content: space-between;
				align-items: center;
		
				.problem_card_top_user {
					display: flex;
					align-items: center;
					justify-content: space-between;
		
					.userTime {
						font-size: 24upx;
						color: #929CA4;
					}
		
					.userName {
						font-size: 30upx;
						color: #40474E;
					}
		
					.userLogo {
						width: 88upx;
						height: 88upx;
						border-radius: 50%;
						overflow: hidden;
						text-align: center;
						margin-right: 20upx;
		
						image {
							width: 100%;
							vertical-align: middle;
						}
					}
				}
			}
		}
	}
</style>
