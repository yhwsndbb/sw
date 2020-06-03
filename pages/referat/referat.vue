<template>
	<view class="referat_content">
		<view class="referat_header">
			<view class="class_name">
				{{ClassroomReport.ChapterName}}
			</view>
			<view class="class_grade">
				班级：<text>{{ClassroomReport.TeachClass}}</text>
			</view>
		</view>
		<view class="attendance_card">
			<view class="attendance_card_top">
				<view class="card_title">
					<view class="green"></view>
					考勤信息
				</view>
				<view class="lookInfo" @click="LookInfo(ClassroomReport.ClassroomLogId)">
					查看详情
					<view class="arrowBox">
						<cover-image class="arrowImg" src="../../static/image/list_arrow.png"></cover-image>
					</view>
				</view>
			</view>
			<view class="attendance_card_bottom">
				<view class="cartogram">
					<mpvue-echarts ref="ReportChart" :echarts="echarts" @onInit="ClassroomChart" />
				</view>
				<view class="number">
					<view class="due">
						<view class="green_dot"></view>
						<view class="right_num">
							应到
							<view class="">
								{{TotalNum}}
							</view>
						</view>

					</view>
					<view class="due">
						<view class="orange_dot"></view>
						<view>
							实到
							<view class="">
								{{RealNum}}
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
		<view class="student_content">
			<view class="">
				学生
			</view>
			<view class="student_list">
				　<view class="text_list" @click="onQuestion(ClassroomReport.ClassroomLogId,ClassroomReport.ChapterId,ClassroomReport.ChapterName,ClassroomReport.TeachClass)">
					<image class="textLogo" src="../../static/image/Com.png" mode="widthFix"></image>
					<view class="textname">
						学生问答
					</view>
					<image class="list_arrow" src="../../static/image/list_arrow.png" mode="widthFix"></image>
				</view>　
				<view class="text_list" @click="onTesting(ClassroomReport.ChapterId,ClassroomReport.ClassroomLogId)">
					<image class="textLogo" src="../../static/image/Shape1.png" mode="widthFix"></image>
					<view class="textname">
						课堂测试结果
					</view>
					<image class="list_arrow" src="../../static/image/list_arrow.png" mode="widthFix"></image>
				</view>　
			</view>
		</view>
		<view class="student_content">
			<view class="">
				教师已分享课件
			</view>
				<view class="article_list" v-for="(item,index) in ResourcesList" :key="index">
					<view class="text_list" @click="OnopenFile(item.ResourcesId,item.FileType,item.TestingLogId,ClassroomReport.ChapterId)">
						<view class="textLogoBox">
							<image class="textLogo" v-if="item.FileSuffix=='txt'" src="../../static/image/txt.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileSuffix=='docx'" src="../../static/image/doc.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileSuffix=='xlsx'" src="../../static/image/xls.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileSuffix=='pdf'||item.FileSuffix=='pptx'||item.FileSuffix=='ppt'" src="../../static/image/ppt.png"
							 mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileType==2 || item.FileType==7" src="../../static/image/pht.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileType==5" src="../../static/image/proble.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileType==3||item.FileType==6" src="../../static/image/video.png" mode="widthFix"></image>
						</view>
						<view class="textname">
							{{item.ResourcesName}}
						</view>
						<view class="arrowIMg">
							<image class="list_arrow" src="../../static/image/list_arrow.png" mode="widthFix"></image>
						</view>
					</view>　
				</view>　
		</view>
		<view class="memo">
			<input type="text" maxlength='100' :value="ClassroomReport.Remarks" placeholder="请输入课堂报告备注(最多100个字符)" @input="RemarksInput" @confirm="SaveClassroomReportRemark"/>
		</view>
		<view class="delBtn">
			<button type="primary">删除本次发布</button>
		</view>
		<!-- <view class="back_op">
			<image src="../../static/image/top.png" mode="widthFix"></image>
		</view> -->
	</view>
</template>

<script>
	import * as echarts from 'echarts'
	import mpvueEcharts from 'mpvue-echarts'
	const { request,showLoading,hideLoading} = require("../../static/request")
	export default {
		components: {
			mpvueEcharts
		},
		data() {
			return {
				echarts,
				IssueCount:0,
				StudentCount:0,
				ClassroomReport:{},
				MessageLogId:'',
				ResourcesList: [],
				Remark:'',
				playAudio: false,
				ClassroomLogId:'',
				RealNum:0,
				TotalNum:0
			}
		},
		methods: {
			onTesting(ChapterId,ClassroomLogId){
				uni.navigateTo({
					url:`../TestingReport/TestingReport?ChapterId=${ChapterId}&ClassroomLogId=${ClassroomLogId}`
				})
			},
			OnopenFile(ResourcesId, FileType, TestingLogId, ChapterId) {
				let _that = this
				if (FileType == 5) {
					uni.request({
						method: 'GET',
						data: {
							testingLogId: TestingLogId
						},
						url: 'https://hk.joyfulboo.com/Campus/TestingApp/GetTestingStatus',
						header: {
							'content-type': "application/json",
							'Authorization': uni.getStorageSync('token'),
						},
						success: (res) => {
							console.log(res)
							// hideLoading()
							let result = res.data
							if (result.Success == true) {
								//点击测试时先判断状态是否未发起，若未发起则发起测试，已发起则进入测试看板页面
								uni.navigateTo({
									url: '../underTest/underTest?TestingLogId=' + TestingLogId
								})
								if (result.Data == 1) {
									//则进入测试看板页面
								} else {
									_that.AddTestingLog(ChapterId, ResourcesId)
								}
			
							} else {
								_that.AddTestingLog(ChapterId, ResourcesId)
								return false
							}
			
						}
					})
				} else {
					uni.request({
						method: 'GET',
						url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/PreviewCoursewareOnline',
						data: {
							resourcesId: ResourcesId,
							isCurrent: false,
							classroomLogId: ''
						},
						header: {
							'content-type': "application/json",
							'Authorization': uni.getStorageSync('token'),
						},
						success: (res) => {
							console.log(res)
							let result = res.data
							if (result.Success == true) {
								// this.$data.CoursewareList=result.Data
								if (FileType == 1) {
									showLoading('加载中')
									wx.downloadFile({
										url: result.Data, //可以是后台传过来的路径
										success: function(res) {
											console.log(res)
											const filePath = res.tempFilePath
											wx.openDocument({
												filePath: filePath,
												success: function(res) {
													//成功
													hideLoading()
												}
											})
										}
									})
								} else if (FileType == 2) {
									var imgs = []
									imgs.push(result.Data)
									console.log(imgs)
									uni.previewImage({
										urls: imgs,
										current: imgs[0]
									})
								} else if (FileType == 3) {
									uni.navigateTo({
										url: '../videoMP/videoMP?videoSrc=' + result.Data
									})
								} else if (FileType == 4) {
									wx.downloadFile({
										url: result.Data, //可以是后台传过来的路径
										success: function(res) {
											console.log(res)
											const filePath = res.tempFilePath
											wx.getFileSystemManager().readFile({
												filePath: filePath,
												encoding: 'utf-8',
												success: function(resdata) {
													console.log('readFile=' + resdata)
													console.log(resdata)
													var reg = new RegExp('/n', 'g')
													// _that.$data.info = resdata.data.replace(reg, '↵')
													let str = resdata.data.replace(/\n/g, '<br/>')
													uni.setStorageSync('txtInfo', str)
													uni.navigateTo({
														url: '../txt/txt?id=' + ResourcesId
													})
													//成功
													hideLoading()
												}
											})
										}
									})
								} else if (FileType == 6) {
									var model = JSON.stringify(result.Data);
									uni.navigateTo({
										url: '../videoMP/videoMP?videoArr=' + model
									})
								} else if (FileType == 7) {
									_that.$data.playAudio = !_that.$data.playAudio
									let playAudio = _that.$data.playAudio
									if (playAudio) {
										wx.playBackgroundAudio({
											dataUrl: result.Data,
											title: '',
											coverImgUrl: ''
										})
									} else {
										wx.stopBackgroundAudio()
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
				}
			},
			onQuestion(ClassroomLogId,ChapterId,ChapterName,TeachClass){
				console.log(ChapterName,TeachClass)
				uni.navigateTo({
					url: `../questionAsk/questionAsk?ClassroomLogId=${ClassroomLogId}&ChapterId=${ChapterId}&ChapterName=${ChapterName}&TeachClass=${TeachClass}`,
				})
			},	
			LookInfo(ClassroomLogId){
				uni.navigateTo({
					url: `../AttendInfo/AttendInfo?ClassroomLogId=${ClassroomLogId}&attendStatus=${3}`,
				})
			},
			DeleteMessage(){
				var _that = this
				wx.showModal({
					title: '提示',
					content: '确定要删除?',
					success(res) {
						if (res.confirm) {
							uni.request({
								method: 'GET',
								data: {
									messageLogId: _that.$data.ClassroomReport.MessageLogId,
								},
								url: 'https://hk.joyfulboo.com/Campus/MessageLogApp/DeleteMessage',
								header: {
									'content-type': "application/json",
									'Authorization': uni.getStorageSync('token'),
								},
								success: (res) => {
									let result = res.data
									uni.showToast({
										title: '删除成功',
									})
									setTimeout(() => {
									  wx.navigateBack({
									    delta: 1 //想要返回的层级
									  })
									}, 1000)
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			SaveClassroomReportRemark(){
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/SaveClassroomReportRemark',
					data: {
						MessageLogId:this.$data.ClassroomReport.MessageLogId,
						Remark: this.$data.Remark,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
				this.GetClassroomReport()
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
			RemarksInput(e){
				var value = e.detail.value;
				var length = parseInt(value.length);
				console.log(length)
				this.$data.Remark=value
				 if  (length >= 100) {
					 uni.showToast({
					 	title: '字数超出',
					 	icon: 'none',
						duration:3000
					 })
				      	return;
				   	 }
			},
			ClassroomChart(e) {
				var that = this
				let {
					canvas,
					width,
					height
				} = e;
				width = width - 20;
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
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						itemStyle: {
							normal: {
								color: function(params) {
									var colorList = [
										 '#03C173','#FF9E18',
									];
									return colorList[params.dataIndex]
								}
							}
						},
						data: [{
								value: that.StudentCount,
								name: ''
							},
							{
								value: that.IssueCount,
								name: ''
							}
						]
					}]
				};
				chart.setOption(option)
				chart.setOption({
					series: [{
						data: [{
								value: that.StudentCount,
								name: ''
							},
							{
								value:that.IssueCount,
								name: ''
							}
						]
					}]
				});
				this.$refs.ReportChart.setChart(chart);
				//return chart
			},
			GetClassroomReport() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetClassroomReport',
					data: {
						messageLogId: this.$data.MessageLogId,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
						this.$data.ClassroomReport=result.Data
						this.$data.ClassroomLogId=result.Data.ClassroomLogId
						this.$data.ResourcesList=result.Data.ResourcesList
						this.$data.IssueCount=result.Data.IssueCount
						this.$data.StudentCount=result.Data.StudentCount
						this.GetAttentByClassroomLog()
						this.$refs.ReportChart.init();
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
			GetAttentByClassroomLog() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/AttendApp/GetAttentByClassroomLog',
					data: {
						classroomLogId: this.$data.ClassroomLogId,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						let Res = res.data
						console.log(res)
						if (Res.Success == true) {
			this.$data.RealNum=Res.Data.RealNum
			this.$data.TotalNum=Res.Data.TotalNum
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

		},
		onLoad(ops) {
			var self=this
			this.$data.MessageLogId=ops.MessageLogId
			this.GetClassroomReport()
			// self.GetAttentByClassroomLog()
			var Timer = setInterval(() => {
				if (self.$data.ClassroomLogId !== "") {
					self.GetAttentByClassroomLog()
					clearInterval(Timer)
				}
			}, 1000)
		}
	}
</script>

<style lang="less">
	.article_list {
		.text_list {
			padding: 40upx 0;
			width: 100%;
			background-color: #FFFFFF;
			line-height: 60upx;
			border-bottom: #F8F8F8 solid 2upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30upx;
			color: #40474E;
	
			.textLogoBox {
				flex: 1;
			}
	
			.arrowIMg {
				flex: 1;
	
				.list_arrow {
				width: 14upx;
				height: 16upx;
				}
			}
	
			.textname {
				flex: 9;
				margin-left: 40upx;
				margin-right: 30upx;
				overflow: hidden;
			}
	
			.textLogo {
				width: 50upx;
				height: 50upx;
				vertical-align: middle;
			}
		}
	
		.edit-delete {
			position: absolute;
			bottom: -10%;
			right: 4%;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			align-items: center;
			// width: 260upx;
			text-align: center;
			// margin-left: 40upx;
		}
	
		.ad-delete {
			font-size: 24upx;
			margin: 30upx 14rpx;
	
			image {
				width: 60upx;
				height: 56upx;
			}
		}
	}
	.testChart {
		height: 420upx;
		padding: 40upx 0;
	}
	.back_op {
		width: 92upx;
		height: 92upx;
		position: fixed;
		bottom: 200upx;
		right: 40upx;

		image {
			width: 100%;
		}
	}

	.delBtn button {
		margin: 40upx auto;
		width: 275px;
		height: 52px;
		background: #FF9E18;
		border-radius: 26px;
	}

	.memo {
		margin-top: 40upx;
		padding: 25upx 24upx;
		color: #929CA4;
		font-size: 30upx;
		// text-indent:1em;
		box-shadow: 0px 1px 0px 0px rgba(241, 241, 241, 0.5);
		border-radius: 8px;
		background-color: #F1F1F1;
	}

	.student_list {
		color: #000000;
	}

	.student_content {
		background-color: #FFFFFF;
		margin-top: 40upx;
		font-size: 30upx;
		color: #40474E;
	}

	.list_arrow {
		width: 14upx;
		height: 16upx;
	}

	.text_list .textname {
		flex: 1;
		margin-left: 40upx;
	}

	.text_list {
		padding: 0 20upx;
		line-height: 100upx;
		border-bottom: #F8F8F8 solid 2upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		font-weight: 400;
		color: #40474E;
	}

	.text_list .textLogo {
		width: 40upx;
	}

	.attendance_card_bottom {
		font-size: 28upx;
		color: #929CA4;
		display: flex;
		align-items: center;
		padding: 40upx 0;

		.cartogram {
			flex: 2;
height: 300upx;
			image {
				width: 300upx;
				height: 320upx;
			}
		}

		.number {
			flex: 1;

			.due {
				.green_dot {
					margin-top: 10upx;
					margin-right: 10upx;
					width: 20upx;
					height: 20upx;
					background: #03C173;
					border-radius: 100upx;
				}

				.orange_dot {
					margin-top: 10upx;
					margin-right: 10upx;
					width: 20upx;
					height: 20upx;
					border-radius: 100upx;
					background: #FF9E18;
				}

				margin-top: 40upx;
				display: flex;
			}
		}
	}

	.attendance_card {
		margin-top: 20upx;
		padding: 30upx 30upx 0upx 30upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 22px 0px rgba(106, 119, 133, 0.13);
		border-radius: 12upx;

		.lookInfo {
			display: flex;
			align-items: center;
			font-size: 24upx;
			color: #929CA4;

			.arrowBox .arrowImg {
				margin-left: 20upx;
				width: 14upx;
				height: 22upx;
			}

		}

		.attendance_card_top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.card_title {
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

	.referat_content {
		padding: 30upx 38upx;

		.referat_header {
			display: flex;
			justify-content: space-between;

			.class_name {
				font-size: 30upx;
				color: #40474E;
			}

			.class_grade {
				color: #7F889E;
				font-size: 26upx;
			}
		}
	}
</style>
