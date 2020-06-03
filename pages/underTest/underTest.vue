<template>
	<view class="underTest_content">
		<view class="test_info">
			<view class="submitted_content">
				<view class="submitted_num">
					{{TestingInfo.SumbitCount}}
				</view>
				<view class="submitted">
					已提交
				</view>
			</view>
			<view class="unsubmit_content">
				<view class="unsubmit_num">
					{{TestingInfo.NotSumbitCount}}
				</view>
				<view class="unsubmit">
					未提交
				</view>
			</view>
			<view class="test_time">
				剩余时间：1小时18分34秒
			</view>
		</view>
		<view class="test_student">
			<view class="text_list" v-for="(item,index) in  StudentList" :key="index">
				<view class="student_img">
					<image class="textLogo" src="../../static/image/ilog.png" mode="widthFix"></image>
					<text>{{item.StudentName}}</text>
				</view>
				<view class="test_status">
					<text v-if="item.IsSubmit" class="ove">已交</text>
					<text v-if="!item.IsSubmit" class=""></text>
				</view>
			</view>　
			<view class="test_bottom">
				<view class="test_btn endTest" @click="SaveTestingEnd(1)">
					结束测试
				</view>
				<view class="test_btn cancelTest" @click="SaveTestingEnd(2)">
					取消测试
				</view>
				<view class="test_btn statistical" @click="onShowStatisti">
					答题统计
				</view>
			</view>
		</view>
		 <view catchtouchmove="preventTouchMove" class="alert-mask" v-if="showStatisti"></view>
		<view class="statisticsCard" v-if="showStatisti">
			<image src="../../static/image/onClose.png" mode="widthFix" class="onClose" @click="CloseStatisti"></image>
			<view class="testChart">
				<mpvue-echarts ref="statistiChart" :echarts="echarts" @onInit="StatiChart" />
			</view>
		</view>
		
	</view>
</template>

<script>
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'
	export default {
		components: {
			mpvueEcharts
		},
		data() {
			return {
				 showStatisti: false,
				echarts,
				TestingInfo: {},
				TestingLogId: '',
				StudentList: [],
				topicArr: [],
				RightRateList: []
			}
		},
		methods: {	
			CloseStatisti(){
				this.$data.showStatisti=false
			},
			onShowStatisti(){
				this.$data.showStatisti=true
			},
			StatiChart(e) {
				// this.GetStuTestingReport()
				var that = this
				let {
					canvas,
					width,
					height
				} = e;
				width = width - 20;
				//let canvas = this.$refs.pieChart.canvas;
				echarts.setCanvasCreator(() => canvas);
				const chart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
			
				canvas.setChart(chart)
				var option = {
					color: ['#03C173'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '1%',
						right: '1%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						// data: this.$data.topicArr,
						data: [3,5,8,65,43],
						axisTick: {
							// alignWithLabel: true
							show: false
						},
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						}
			
					}],
					yAxis: [{
							show: false,
							type: 'value',
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							splitLine: {
								show: false
							}
						},
			
					],
					series: [{
						name: '',
						type: 'bar',
						barWidth: '60%',
						data: [10, 52, 20, 34, 39, 30, 20],
						itemStyle: {
							normal: {
								label: {
									formatter: "{c}" + "%",
									show: true,
									position: "top",
									textStyle: {
										fontWeight: "bolder",
										fontSize: "12",
										color: "#929CA4"
									}
								},
							}
						},
					}]
				};
			
				chart.setOption(option)
				chart.setOption({
					xAxis: [{
						// data: this.$data.topicArr
						data: ['A','B',"C",'D',"E"]
					}],
					series: [{
						// data: this.$data.RightRateList,
						data:  [12,3,43,54,65],
						itemStyle: {
							normal: {
								label: {
									formatter: "{c}" + "%",
									show: true,
									position: "top",
									textStyle: {
										fontWeight: "bolder",
										fontSize: "12",
										color: "#929CA4"
									}
								},
							}
						},
					}]
				});
				this.$refs.statistiChart.setChart(chart);
				//return chart
			},
			// 获取答题正确率统计
			GetAnswerStatistics() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/TestingApp/GetAnswerStatistics',
					data: {
						testingLogId: this.$data.TestingLogId,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							let resArr = result.Data
							for (let i in resArr) {
								let Items = resArr[i]
								this.$data.topicArr.push(Items.Name)
								this.$data.RightRateList.push(Items.RightRate)
								console.log(this.$data.topicArr)
							}
							// this.$data.PassCount = result.Data.PassCount
							// this.$data.FailCount = result.Data.FailCount
							// this.$data.FailRate = result.Data.FailRate
							// this.$data.PassRate = result.Data.PassRate
							this.$refs.FailChart.init();

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
			SaveTestingEnd(Status) {
				var self = this
				let TestType = self.$data.TestingInfo.TestPaperType
				var content = ''
				if (Status == 1) {
					content = '确定要结束测试吗？',
						TestType = 2
				} else {
					content = '确定要取消测试吗？'
					TestType = 3
				}
				wx.showModal({
					title: '提示',
					content: content,
					success(res) {
						if (res.confirm) {
							uni.request({
								method: 'POST',
								url: 'https://hk.joyfulboo.com/Campus/TestingApp/SaveTestingEnd',
								data: {
									TestingLogId: self.$data.TestingLogId,
									TestingStatus: TestType,
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
											icon: 'none'
										})
										if (Status == 1) {
											setTimeout(() => {
												wx.navigateTo({
													url: '../testDetails/testDetails?TestingLogId=' + self.$data.TestingLogId
												})
											}, 1000)
										} else {
											setTimeout(() => {
												wx.navigateBack({
													delta: 1
												})
											}, 1000)
										}


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
			// 获取测试提交状态信息
			GetTestingStatusList() {
				var self = this
				uni.request({
					method: 'GET',
					data: {
						testingLogId: self.$data.TestingLogId
					},
					url: 'https://hk.joyfulboo.com/Campus/TestingApp/GetTestingStatusList',
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							self.$data.TestingInfo = result.Data
							self.$data.StudentList = result.Data.StudentList
						} else {
							uni.showToast({
								title: Res.Message,
								icon: 'none'
							})
							return false
						}
					}
				})
			},
			callMethods(obj) {
			  // obj.M[0].M, obj.M[0].A[0]
			  switch (obj.M[0].M) {
			    case 'pong':
			      console.log('Pong防止nginx中断连接');
			      break;
			    case 'xcxMessage':
			      console.log(obj.M[0].A[0]);
				  var messageList = obj.M[0].A[0]
				  if(messageList.MessageType==9){
					  //刷新测试提交状态信息
					  this.GetTestingStatusList()
				  }else if(messageList.MessageType==8){
					  //刷新答题统计
					  this.GetAnswerStatistics()
				  }
			      break;
			  
			    default:
			      console.log(obj);
			  }
			},
		},
		onLoad(ops) {
			var that=this
			this.$data.TestingLogId = ops.TestingLogId
			//获取测试提交状态信息
			this.GetTestingStatusList()
			this.GetAnswerStatistics()
			
			wx.onSocketMessage(function(res) {
			  try {
			    let jsonstr = String(res.data).replace(recordString, '');
			    if (jsonstr.indexOf('{}') > -1)
			      jsonstr = jsonstr.replace('{}', '');
			    if (jsonstr.length != 0) {
			      let obj = JSON.parse(jsonstr);
			      console.log('server return :', obj);
			      // obj.M[0].M, obj.M[0].A[0]
			      if('M' in obj){
			        if(obj.M.length >0){
			          that.callMethods(obj);
			        }
			      }
			    }
			  } catch (ex) {
			    console.log('异常：' + ex);
			    console.log('收到服务器内容：' + res.data);
			  }
			});
		}
	}
</script>

<style lang="less" scoped>
	.onClose{
		width: 100rpx;
		height: 80rpx;
		margin-bottom: 30rpx;
	}
	/* 弹窗蒙版 start */
	.alert-mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		z-index: 9000;
		opacity: 0.7;
	}
	.statisticsCard{
		text-align: center;
	position: absolute;
	top: 10%;
	left: 10%;
	z-index: 99999;
	}
	.testChart {
		width:335px;
		height:433px;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 22px 0px rgba(106,119,133,0.13);
		border-radius:8px;
	}

	.test_bottom {
		margin-top: 40upx;
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: center;
		line-height: 88upx;
		position: absolute;
		bottom: 2%;

		.test_btn {
			border-radius: 50upx;
			margin: 0 6rpx;
			padding: 0 36rpx;
		}

		.endTest {
			color: #888C9E;
			border: 2upx solid rgba(192, 195, 207, 1);
		}

		.cancelTest {
			color: #FF9E18;
			border: 2upx solid #FF9E18;
		}

		.statistical {
			color: #03C173;
			border: 2upx solid #03C173;
		}
	}

	.test_student {
		position: relative;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 4upx 44upx 0px rgba(106, 119, 133, 0.13);
		border-radius: 16upx;
		padding: 10upx 40upx;
		margin-top: 40upx;
		min-height: 70vh;
		padding-bottom: 140rpx;
	}

	.text_list .textname {
		flex: 1;
		color: #000000;
		font-size: 30upx;
	}

	.text_list {
		padding: 20upx 0;
		line-height: 96upx;
		border-bottom: #F8F8F8 solid 2upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		font-weight: 400;
		color: #40474E;

		.test_status {
			font-size: 22upx;
			color: #FFFFFF;

			.ove {
				text-align: center;
				padding: 8upx 24upx;
				width: 45px;
				height: 20px;
				background: rgba(3, 193, 115, 1);
				border-radius: 25px;
			}
		}
	}

	.text_list .textLogo {
		vertical-align: middle;
		width: 80upx;
		height: 80upx;
		border-radius: 100upx;
		overflow: hidden;
		margin-right: 20upx;
	}

	.underTest_content {
		padding: 40upx;

		.test_info {
			text-align: center;
			color: #929CA4;
			font-size: 32upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.test_time {
				line-height: 54upx;
				padding: 6upx 28upx;
				font-size: 26upx;
				background-color: #F3F3F3;
				border-radius: 50upx;
			}

			.unsubmit_content {
				.unsubmit_num {
					color: #000000;
				}

				.unsubmit {}
			}

			.submitted_content {
				.submitted_num {
					color: #FF9E18;
				}

				.submitted {}
			}
		}
	}
</style>
