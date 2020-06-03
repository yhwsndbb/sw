<template>
	<view style="padding: 0 40upx;">
		<view class="courseware_content">
			<view class="end-cont-title">
				<view class="cont_title" @tap="change(0)" :class="{btna:btnnum == 0}">试题分析</view>
				　　<view class="cont_title" @tap="change(1)" :class="{btna:btnnum == 1}">按时提交</view>
				　　<view class="cont_title" @tap="change(2)" :class="{btna:btnnum == 2}">未提交</view>
			</view>
			<view class="end-cont-notice" :class="{dis:btnnum == 0}">
				<view class="Chartcard boxshadow">
					<view class="Chartcard_top">
						<view class="card_title">
							<view class="green"></view>
							测试结果分析
						</view>
					</view>
					<view class="testChart">
						<mpvue-echarts ref="testChart" :echarts="echarts" @onInit="TestingChart" />
					</view>
				</view>
				<view class="Chartcard boxshadow">
					<view class="Chartcard_top">
						<view class="card_title">
							<view class="green"></view>
							错题分析
						</view>
					</view>
					<view class="" style="color: #929CA4;font-size: 26upx;margin-left: 14upx;line-height:48upx;">
						正确率
					</view>
					<view class="testChart">
						<mpvue-echarts ref="FailChart" :echarts="echarts" @onInit="RateChart" />
					</view>
				</view>
				<!-- 　<view class="text_list">
					<view class="testChart">
						<mpvue-echarts ref="testChart" :echarts="echarts" @onInit="TestingChart" />
					</view>
				</view>　 -->
			</view>
			<view class="end-cont-notice boxshadow" :class="{dis:btnnum == 1}">
				<view class="text_list" v-for="(item,index) in onTimeList" :key="index">
					<view class="student_img">
						<image class="textLogo" src="../../static/image/ilog.png" mode="widthFix"></image>
					</view>
					<view class="textname">
						{{item.StudentName}}
					</view>
					<view class="">
						已提交
					</view>
				</view>
				<view class="DataNo" v-if="onTimeList.length==0">
					<view class="">
						暂无数据
					</view>
					<view style="color: #007AFF;font-size: 28upx;" @click="onLoading">
						（点击刷新）
					</view>
				</view>
			</view>
			<view class="end-cont-notice boxshadow" :class="{dis:btnnum == 2}">
				<view class="text_list" v-for="(item,index) in NoTimeList" :key="index">
					<view class="student_img">
						
						<image class="textLogo" src="../../static/image/ilog.png" mode="widthFix"></image>
						<!-- <image class="textLogo" :src="item.StudentHeadUrl" mode="widthFix"></image> -->
					</view>
					<view class="textname">
						{{item.StudentName}}
					</view>
					<view class="textNum">
						未提交
					</view>
				</view>
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
				FailCount: 0,
				FailRate: 0, //不合格
				PassRate: 0, //合格
				PassCount: 0,
				echarts,
				btnTab: 0,
				btnnum: 0,
				TestingLogId: '',
				NoTimeList: [],
				onTimeList: [],
				testList: [],
				submitStatus: false,
				topicArr: [],
				RightRateList: []
			}
		},
		methods: {
			RateChart(e) {
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
						data: this.$data.topicArr,
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
						data: this.$data.topicArr
					}],
					series: [{
						data: this.$data.RightRateList,
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
				this.$refs.FailChart.setChart(chart);
				//return chart
			},
			TestingChart(e) {
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
					// color: ['#03C173', '#FF9E18'],
					tooltip: {
						trigger: 'item',
						formatter: '',
						show: false
					},
					legend: {
						orient: 'vertical',
						left: 10,
						selectedMode: false,
						data: []
					},
					series: [{
						hoverAnimation: false,
						name: '',
						type: 'pie',
						silent: true,
						radius: ['60%', '100%'],
						avoidLabelOverlap: false,
						label: {
							position: 'inner',
							color: '#fff',
							align: 'right',
							verticalAlign: 'middle',
							// normal: {
							// 	show: false,
							// 	position: 'center'
							// },
							// emphasis: {
							// 	show: false,
							// 	textStyle: {
							// 		fontSize: '30',
							// 		fontWeight: 'bold'
							// 	}
							// }
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						itemStyle: {
							normal: {
								color: function(params) {
									// build a color map as your need.
									var colorList = [
										'#FF9E18', '#03C173',
									];
									return colorList[params.dataIndex]
								}
							}
						},
						data: [{
								value: this.$data.FailRate,
								name: '不及格'
							},
							{
								value: this.$data.PassRate,
								name: '及格'
							}
						]
					}]
				};

				chart.setOption(option)
				chart.setOption({
					series: [{
						data: [{
								value: this.$data.FailRate,
								name: '不及格'
							},
							{
								value: this.$data.PassRate,
								name: '及格'
							}
						]
					}]
				});
				this.$refs.testChart.setChart(chart);
				//return chart
			},
			//获取测试合格率
			GetTestResultAnalysis() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/TestingApp/GetTestResultAnalysis',
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
							this.$data.PassCount = result.Data.PassCount
							this.$data.FailCount = result.Data.FailCount
							this.$data.FailRate = result.Data.FailRate
							this.$data.PassRate = result.Data.PassRate
							this.$refs.testChart.init();

						} else {
							uni.showToast({
								title: result.Message,
								icon: 'none'
							})
							return false
						}
					}
				})
			}, //获取测试正确率
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
			GetTestingScoreList() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/TestingApp/GetTestingScoreList',
					data: {
						testingLogId: this.$data.TestingLogId,
						submitStatus: this.$data.submitStatus
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							var TestingScoreList = result.Data
							for (let i in TestingScoreList) {
								var items = TestingScoreList[i]
								if (!items.IsSubmit) {
									this.$data.NoTimeList.push(items)
								} else if (items.IsSubmit) {
									this.$data.onTimeList.push(items)
								}
							}

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
			change(e) {
				this.btnnum = e
				if (this.btnnum == 1) {
					this.$data.submitStatus = true
					this.GetTestingScoreList()
				} else if (this.btnnum == 2) {
					this.$data.submitStatus = false
					this.GetTestingScoreList()
				}
			},
		},
		onLoad(ops) {
			this.$data.TestingLogId = ops.TestingLogId
			this.GetTestingScoreList()
			this.GetTestResultAnalysis()
			this.GetAnswerStatistics()
		}
	}
</script>

<style scoped lang="less">
	.Chartcard {
		.testChart {
			height: 420upx;
			padding: 40upx 0;
		}

		.Chartcard_top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.card_title {
				padding-top: 20upx;
				display: flex;
				align-items: center;
				font-size: 34upx;
				font-weight: 500;
				color: #40474E;

				.green {
					width: 6upx;
					height: 34upx;
					background: #03C173;
					border-radius: 4upx;
					margin-right: 10upx;
				}
			}
		}
	}

	.DataNo {
		margin: 430upx auto;
		text-align: center;
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

		.textNum {
			font-size: 32upx;
			color: #40474E;
		}
	}

	.student_img {}

 .textLogo {
		vertical-align: middle;
		width: 80upx;
		height: 80upx;
		border-radius: 100upx;
		overflow: hidden;
		margin-right: 20upx;
	}

	.cont_title {
		color: #929CA4;
		font-size: 28upx;
		font-weight: 600;
		padding-bottom: 20upx;
	}

	.end-cont-title {
		display: flex;
		justify-content: space-between;
		border-bottom: #F8F8F8 solid 2upx;
		margin: 0 52upx;
	}

	.end-cont-notice {
		display: none;
		padding-bottom: 40upx;
	}

	.boxshadow {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 4upx 44upx 0px rgba(106, 119, 133, 0.13);
		border-radius: 16upx;
		padding: 10upx 40upx;
		margin-top: 40upx;
	}

	.btna {
		font-size: 36upx;
		color: #03C173;
		border-bottom: solid #03C173 4upx;
	}

	.dis {
		display: block;
	}

	.courseware_content {
		margin-top: 40upx;
	}
</style>
