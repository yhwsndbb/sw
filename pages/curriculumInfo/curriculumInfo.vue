<template>
	<view class="content">
		<view class="courseware_content">
			<view class="titleA">
				<view class="end-cont-title">
					　　<view class="cont_title" @tap="change(0)" :class="{btna:btnnum == 0}">课件</view>
					　　<view class="cont_title" @tap="change(1)" :class="{btna:btnnum == 1}">测试报告</view>
					　　<view class="cont_title" @tap="change(2)" :class="{btna:btnnum == 2}">课堂问答</view>
					　　<view class="cont_title" @tap="change(3)" :class="{btna:btnnum == 3}">课堂考勤</view>
				</view>
			</view>
		
			<view class="end-cont-notice" :class="{dis:btnnum == 0}" @touchstart="onLoadStart" @touchmove="onLoadMove">
				<view class="" v-if="CoursewareList.length!==0&&loading=='loading'">
					<uni-load-more :status="loading" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
				</view>
				<view class="addFile">
					<view class="addFile_bth" @click="UploadCourseware">
						添加文件（本地）
					</view>
					<view class="addFile_bth" @click="addResource">
						添加文件（资源库）
					</view>
				</view>
				<view class="article_list" v-for="(item,index) in CoursewareList" :key="index">
					<view class="text_list" @click="OnopenFile(item.ResourcesId,item.FileType)" :class="index==activeEdit?'activeEdit':''"
					 :data-index="index" @touchstart="onPanStart" @touchmove="onPanMove">
						<view class="textLogoBox">
							<image class="textLogo" v-if="item.FileSuffix=='txt'" src="../../static/image/txt.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileSuffix=='docx'" src="../../static/image/doc.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileSuffix=='xlsx'" src="../../static/image/xls.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileSuffix=='pdf'||item.FileSuffix=='pptx'||item.FileSuffix=='ppt'" src="../../static/image/ppt.png"
							 mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileType==2 || item.FileType==7" src="../../static/image/pht.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileType==3||item.FileType==6" src="../../static/image/video.png" mode="widthFix"></image>
							<image class="textLogo" v-if="item.FileType==5" src="../../static/image/proble.png" mode="widthFix"></image>
						</view>

						<view class="textname">
							{{item.ResourcesName}}
						</view>
						<view class="arrowIMg">
							<image class="list_arrow" src="../../static/image/dot.png" mode="widthFix"></image>
						</view>
					</view>　
					<view class="edit-delete">
						<view class="ad-delete" @click="onDel(item.ResourcesId)">
							<image src="../../static/image/del.png" mode="widthFix"></image>
							<view class="">
								删除
							</view>
						</view>
						<view class="ad-delete" @click="onEdit(item.RelationId)">
							<image src="../../static/image/rechristen.png" mode="widthFix"></image>
							<view class="">
								重命名
							</view>
						</view>
					</view>
				</view>
				<DataNo :DataList='CoursewareList' @onLoading='onCoursLoading'></DataNo>
			</view>
			<view class="end-cont-notice" :class="{dis:btnnum == 1}" @touchstart="onTestStart" @touchmove="onTestMove">
				<view class="" v-if="TestingReportList.length!==0&&testLoading=='loading'">
					<uni-load-more :status="testLoading" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
				</view>
				<!-- //测试报告 -->
				<view class="testList" v-for="(item,index) in TestingReportList" :key="index" @click="onTestInfo(item.TestingLogId)">
					<view class="testLogoBox">
						<image class="textLogo" src="../../static/image/a5.png" mode="widthFix"></image>
					</view>
					<view class="testname">
						{{item.ChapterName}}
					</view>
				</view>
				<DataNo :DataList='TestingReportList' @onLoading='onTestingLoading'></DataNo>
			</view>
			<view class="end-cont-notice" :class="{dis:btnnum == 2}" @touchstart="onIssueStart" @touchmove="onIssueMove">
				<view class="" v-if="IssueLogList.length!==0&&IssueLoad=='loading'">
					<uni-load-more :status="IssueLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
				</view>
				<!-- 课堂问答 -->
				<DataNo :DataList='IssueLogList' @onLoading='onIssueLoading'></DataNo>
				<view class="problem_content">
					<view class="problem_card" v-for="(item,index) in IssueLogList" :key='index'>
						<view class="problem_card_top">
							<view class="problem_card_top_user">
								<view class="userLogo">
									<image src="../../static/image/ilog.png" mode="widthFix"></image>
								</view>
								<view class="userName">
									{{item.CreaterName}}
									<view class="userTime">
										{{timeChangeover(item.CreateDatetime)}}
									</view>
								</view>
							</view>
							<view class="problem_status" @click="SaveIssueLogStatus(item.IsPublish,item.Id)">
								<view class="problem_status_open" v-if="item.IsPublish">
									公开
								</view>
								<view class="problem_status_hide" v-if="!item.IsPublish">
									隐藏
								</view>
							</view>
						</view>
						<view class="problem_card_info">
							<view class="">
								{{item.Content}}
							</view>
							<view class="answer_info" v-if="item.ChildList">
								<view class="" v-for="(K,I) in item.ChildList" :key="I">
									{{K.CreaterName}}：{{K.Content}}
								</view>
							</view>
						</view>
						<view class="problem_card_bottom" @click="onShowInput(item.Id)">
							回答
						</view>
					</view>
				</view>
				<view class="input-section" v-if="showInput">
					<input class='input_input' :value="Content" focus="auto" placeholder="请输入内容" @input='bindInputMsg' @blur="onHideInput"
					 confirm-type="send" />
					<view style="height:110rpx;width:170rpx;display:flex; align-items: center;justify-content: center;">
						<view class="send_btn">
							<text class="send_btn_text" @click="SaveIssueLog">发送</text>
						</view>
					</view>
				</view>
			</view>
			<view class="end-cont-notice" :class="{dis:btnnum == 3}" @touchstart="onAttendStart" @touchmove="onAttendMove">
				<view class="" v-if="AttendInfoList.length!==0&&AttendLoad=='loading'">
					<uni-load-more :status="AttendLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
				</view>
				<!-- 考勤列表 -->
				<DataNo :DataList='AttendInfoList' @onLoading='AttendLoading'></DataNo>
				<view class="AttendList" v-for="(a,n) in AttendInfoList" :key='n'>
					<view class="AttendLogoBox">
						<image class="attimg" src="../../static/image/ilog.png" mode="widthFix"></image>
					</view>

					<view class="Attendname">
						{{a.StudentName}}
					</view>
					<view class="StatusBox">
						<view class="AttendStatus">
							{{a.AttendStatus}}
						</view>
					</view>
				</view>
			</view>
			<view catchtouchmove="preventTouchMove" class="alert-mask" v-if="isEdit"></view>
			<view class="editFileName" v-if="isEdit">
				<view class="edittitle">
					文件名修改
				</view>
				<view class="">
					<input @input="inputVal" class="textInpt" focus="true" type="text" value="" placeholder="请输入修改文件名"
					 placeholder-style="font-size:13px;color:#4A3C3C43;" />
				</view>
				<view class="editBtn">
					<view class="" @click="unhide">
						取消
					</view>
					<view style="border-left:1px solid #C0C0C0;" @click="RenameCourseware()">
						确认
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		uniLoadMore
	} from '@dcloudio/uni-ui'
	import DataNo from '@/components/DataNo.vue'
	const { request,showLoading,hideLoading} = require("../../static/request")
	export default {
		components: {
			DataNo,
			uniLoadMore
		},
		data() {
			return {
				showInput: false,
				ResourcesName: '',
				RelationId: '',
				isEdit: false,
				activeEdit: null,
				delBtnWidth: 300, //删除按钮宽度单位（rpx）
				startX: '',
				showInfoText: false,
				ChapterId: '',
				ClassId: '',
				ClassroomLogId: '',
				btnTab: 0,
				btnnum: 0,
				currentPage: 1,
				pageSize: 10,
				CoursewareList: [],
				playAudio: false,
				TestingReportList: [],
				AttendInfoList: [],
				IssueLogList: [],
				Content: '',
				ParentId: '',
				LoadStartY: '',
				LoadStartPageY: '',
				loading: '',
				testLoading: '',
				testStartY: '',
				testStartPageY: '',
				AttendLoad: '',
				AttendStartY: '',
				AttendStartPageY:'',
				IssueLoad: '',
				IssueStartY: '',
				IssueStartPageY: '',
			}
		},

		methods: {
			onIssueStart(e) {
				if (e.touches.length == 1) {
					this.IssueStartY = e.touches[0].clientY
					this.$data.IssueStartPageY = e.touches[0].pageY;
				}
			},
			onIssueMove(e) {
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.IssueStartY - moveY;
					var onPageY = e.touches[0].pageY;
					if(this.$data.IssueStartPageY<200){
					if (disY == 350 || disY < 350) {
						this.$data.IssueLoad = "loading"
						this.GetIssueLogList()
						// txtStyle = "transform:translateX(0)";
					} else if (disY > 350) {
						this.$data.IssueLoad = ""
					}}
				}
			},
			onAttendStart(e) {
				if (e.touches.length == 1) {
					this.AttendStartY = e.touches[0].clientY
					this.$data.AttendStartPageY = e.touches[0].pageY;
				}
			},
			onAttendMove(e) {
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.AttendStartY - moveY;
					if(this.$data.AttendStartPageY<200){
					if (disY == 350 || disY < 350) {
						this.$data.AttendLoad = "loading"
						this.GetAttendInfo()
						// txtStyle = "transform:translateX(0)";
					} else if (disY > 350) {
						this.$data.AttendLoad = ""
					}}
				}
			},
			onTestStart(e) {
				console.log(e)
				if (e.touches.length == 1) {
					this.testStartY = e.touches[0].clientY
					this.$data.testStartPageY = e.touches[0].pageY;
				}
			},
			onTestMove(e) {
				console.log(e)
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.testStartY - moveY;
					var onPageY = e.touches[0].pageY;
					if(this.$data.testStartPageY<200){
					if (disY == 350 || disY < 350) {
						this.$data.testLoading = "loading"
						this.GetTestingReportList()
						// txtStyle = "transform:translateX(0)";
					} else if (disY > 350) {
						this.$data.testLoading = ""
					}}
				}
			},
			onLoadStart(e) {
				console.log(e)
				if (e.touches.length == 1) {
					this.LoadStartY = e.touches[0].clientY
					this.$data.LoadStartPageY = e.touches[0].pageY;
				}
			},
			onLoadMove(e) {
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.LoadStartY - moveY;
					var onPageY = e.touches[0].pageY;
					// if(this.$data.LoadStartPageY<200){
					// if (disY == 350 || disY < 350) {
					// 	e.stopPropagation(); //组织冒泡

					// 	e.preventDefault();
					// 	this.$data.loading = "loading"
					// 	this.GetCoursewareByPage()
					// 	// txtStyle = "transform:translateX(0)";
					// } else if (disY > 350) {
					// 	e.stopPropagation(); //组织冒泡

					// 	e.preventDefault();
					// 	this.$data.loading = ""
					// }
					// }
					
					if (this.$data.LoadStartPageY < 210) {
						e.stopPropagation(); //组织冒泡
					
						e.preventDefault();
						// 正在loading的时候就不应该再次请求了
						// disY为负数时，表示下拉刷新
						if (disY < -80 && !this.$data.loading) {
							this.$data.loading = "loading"
							this.GetCoursewareByPage()
						} else if (disY > 310) {
							this.$data.loading = ""
						}
					}
				}
			},
			AttendLoading() {
				console.log("AttendLoading")
				var that = this
				uni.showLoading({
					title: '加载中',
					success() {
						that.GetIssueLogList()
					}
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			},
			onIssueLoading() {
				console.log("onIssueLoading")
				var that = this
				uni.showLoading({
					title: '加载中',
					success() {
						that.GetIssueLogList()
					}
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			},
			onCoursLoading() {
				var that = this
				uni.showLoading({
					title: '加载中',
					success() {
						that.GetCoursewareByPage()
					}
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			},
			onTestingLoading() {
				var that = this
				// that.$data.TagId = ''
				uni.showLoading({
					title: '加载中',
					success() {
						that.GetTestingReportList()
					}
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			},
			//修改问答状态
			SaveIssueLogStatus(IsPublish, ID) {
				var status = !IsPublish
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/IssueApp/SaveIssueLogStatus',
					data: {
						IssueLogId: ID,
						IsPublish: status,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '修改问答状态')
						let result = res.data
						if (result.Success == true) {
							uni.showToast({
								title: '更改状态成功',
								duration: 3000
							})
							this.GetIssueLogList()
							// _that.$data.RecordCount=res.data.RecordCount
							// this.$data.IssueLogList = res.data.Data
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
			//保存回答数据
			SaveIssueLog() {
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/IssueApp/SaveIssueLog',
					data: {
						classroomLogId: this.$data.ClassroomLogId,
						ParentId: this.$data.ParentId,
						Content: this.$data.Content,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '保存回答数据')
						let result = res.data
						if (result.Success == true) {
							uni.showToast({
								title: '发送成功',
								duration: 3000
							})
							this.$data.Content = ''
							this.GetIssueLogList()
							// _that.$data.RecordCount=res.data.RecordCount
							// this.$data.IssueLogList = res.data.Data
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
			bindInputMsg(e) {
				this.$data.Content = e.detail.value
			},
			//点击出现输入框 
			onShowInput: function(id) {
				this.$data.showInput = true
				this.$data.ParentId = id
			},
			//隐藏输入框 
			onHideInput: function() {
				setTimeout(() => {
					this.$data.showInput = false
				}, 5000);

			},

			//获取问答列表
			GetIssueLogList() {
				var that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/IssueApp/GetIssueLogList',
					data: {
						classroomLogId: this.$data.ClassroomLogId,
						chapterId: this.$data.ChapterId,
						classId: this.$data.ClassId,
						currentPage: 1,
						pageSize: 10,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '问答列表')
						let result = res.data
						if (result.Success == true) {
							// _that.$data.RecordCount=res.data.RecordCount
							this.$data.IssueLogList = res.data.Data
							setTimeout(function() {
								that.$data.IssueLoad = ""
							}, 2000);
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
			//获取考勤数据
			GetAttendInfo() {
				var that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/AttendApp/GetAttendInfo',
					data: {
						classroomLogId: this.$data.ClassroomLogId,
						attendStatus: '1',
						studentName: '',
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '考勤列表')
						let result = res.data
						if (result.Success == true) {
							this.$data.AttendInfoList = result.Data
							setTimeout(function() {
								that.$data.AttendLoad = ""
							}, 2000);
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
			onTestInfo(TestingLogId) {
				uni.navigateTo({
					url: '../testDetails/testDetails?TestingLogId=' + TestingLogId
				})
			},
			addResource() {
				uni.navigateTo({
					url: `../addResource/addResource?ChapterId=${this.$data.ChapterId}&ClassId=${this.$data.ClassId}`
				})
			},
			inputVal(e) {
				console.log(e)
				this.$data.RenameName = e.detail.value
			},
			RenameCourseware() {
				var _that = this
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/RenameCourseware',
					data: {
						RelationId: this.$data.RelationId,
						RenameName: this.$data.RenameName,
						ClassId: this.$data.ClassId
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							uni.showToast({
								title: "修改成功",
								duration: 3000
							})
							_that.$data.isEdit = false
							_that.$data.activeEdit = null
							_that.GetCoursewareByPage()
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
			unhide() {
				this.$data.isEdit = false
			},
			onEdit(RelationId) {
				this.$data.RelationId = RelationId
				this.$data.isEdit = true
			},
			//删除课件
			onDel(ResourcesId) {
				var _that = this
				wx.showModal({
					title: '提示',
					content: '确认要删除此课件吗？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								method: 'POST',
								url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/DeleteCourseware',
								data: {
									ResourcesId: ResourcesId,
									ChapterId: this.$data.ChapterId,
									ClassId: this.$data.ClassId
								},
								header: {
									'content-type': "application/json",
									'Authorization': uni.getStorageSync('token'),
								},
								success: (res) => {
									console.log(res)
									let result = res.data
									if (result.Success == true) {
										uni.showToast({
											title: "删除成功",
											duration: 3000
										})
										_that.GetCoursewareByPage()
									} else {
										uni.showToast({
											title: result.Message,
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
			//上传文件
			UploadCourseware() {
				var that = this
				
				uni.navigateTo({
					url:`../uploadFile/uploadFile?name=https://hk.joyfulboo.com/Campus/CoursewareApp/UploadCourseware&classId=${that.$data.ClassId}&chapterId=${that.$data.ChapterId}`
				})
				// wx.chooseImage({
				// 	count: 1, // 默认9
				// 	sizeType: ['original', 'compressed'],
				// 	sourceType: ['album', 'camera'],
				// 	success: function(res) {
				// 		console.log(res)
				// 		var tempFilePaths = res.tempFilePaths;
				// 		console.log(tempFilePaths)
				// 		wx.uploadFile({
				// 			url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/UploadCourseware',
				// 			filePath: tempFilePaths[0],
				// 			name: 'file',
				// 			header: {
				// 				"content-Type": "multipart/form-data",
				// 				'Authorization': uni.getStorageSync('token'),
				// 			},
				// 			formData: {
				// 				'classId': that.$data.ClassId,
				// 				'chapterId': that.$data.ChapterId
				// 			},
				// 			success(res) {
				// 				console.log(res);
				// 				const data = res.data
				// 				if (res.statusCode == 200) {
				// 					uni.showToast({
				// 						title: '上传成功',
				// 						duration: 3000
				// 					})
				// 					that.GetCoursewareByPage()
				// 				}
				// 				//do something
				// 			}
				// 		})

				// 	}
				// })
			},
			onPanStart(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX
				}
			},
			onPanMove(e) {
				if (e.touches.length == 1) {
					var moveX = e.touches[0].clientX;
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var index = e.currentTarget.dataset.index;
					if (disX == 110 || disX < 110) { //右滑动
						e.stopPropagation(); //组织冒泡

						e.preventDefault();
						this.$data.activeEdit = null
						// txtStyle = "transform:translateX(0)";
					} else if (disX > 110) {
						e.stopPropagation(); //组织冒泡

						e.preventDefault();
						this.$data.activeEdit = index
						// txtStyle = "transform:translateX(-" + disX + "px)";
						if (disX >= delBtnWidth) {
							this.$data.activeEdit = index
							// txtStyle = "transform:translateX(-" + delBtnWidth + "px)";
						}
					}
				}
			},
			OnopenFile(ResourcesId, FileType) {
				let _that = this
				if (FileType == 5) {
					uni.navigateTo({
						url: '../testInfo/testInfo?ResourcesId=' + ResourcesId
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
								if (FileType == 1) {
									showLoading('加载中');
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
			//获取课件列表
			GetCoursewareByPage() {
				var that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/GetCoursewareByPage',
					data: {
						chapterId: this.$data.ChapterId,
						currentPage: this.$data.currentPage,
						pageSize: this.$data.pageSize,
						classId: this.$data.ClassId
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '课件列表')
						let result = res.data
						if (result.Success == true) {
							this.$data.CoursewareList = result.Data
							setTimeout(function() {
								that.$data.loading = ""
								that.$data.activeEdit = null
								
							}, 2000);
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
			GetTestingReportList() {
				var that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/MessageLogApp/GetTestingReportList',
					data: {
						chapterId: this.$data.ChapterId,
						classroomLogId: this.$data.ClassroomLogId
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							this.$data.TestingReportList = result.Data
							setTimeout(function() {
								that.$data.testLoading = ""
							}, 2000);
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
				if (this.btnnum == 0) {
					this.GetCoursewareByPage()
				} else if (this.btnnum == 1 && this.$data.ClassroomLogId !== "") {
					this.GetTestingReportList()
				} else if (this.btnnum == 2 && this.$data.ClassroomLogId !== "") {
					this.GetIssueLogList()
				} else if (this.btnnum == 3 && this.$data.ClassroomLogId !== "") {
					this.GetAttendInfo()
				}
			},
			changeTab(e) {
				this.btnTab = e
			},
		
			timeChangeover(time) {
				var result;
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var halfamonth = day * 15;
				var month = day * 30;
				var now = new Date().getTime();
				time = time.replace(/-/g, '/');
				var dateTimeStamp = Date.parse(time);
				var diffValue = now - dateTimeStamp;
				if (diffValue < 0) {
					return;
				}
				var monthC = diffValue / month;
				var weekC = diffValue / (7 * day);
				var dayC = diffValue / day;
				var hourC = diffValue / hour;
				var minC = diffValue / minute;
				if (monthC >= 1) {
					if (monthC <= 12) {
						result = "" + parseInt(monthC) + "月前";
					} else {
						result = "" + parseInt(monthC / 12) + "年前";
					}
				} else if (weekC >= 1) {
					result = "" + parseInt(weekC) + "周前";
				} else if (dayC >= 1) {
					result = "" + parseInt(dayC) + "天前";
				} else if (hourC >= 1) {
					result = "" + parseInt(hourC) + "小时前";
				} else if (minC >= 1) {
					result = "" + parseInt(minC) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
			},
			callMethods(obj) {
				var _self=this
			  // obj.M[0].M, obj.M[0].A[0]
			  switch (obj.M[0].M) {
			    case 'pong':
			      console.log('Pong防止nginx中断连接');
			      break;
			    case 'xcxMessage':
			      console.log(obj.M[0].A[0]);
				  var messageList = obj.M[0].A[0]
				   if(messageList.MessageType==0){
					  //自动刷新问答数据
					  _self.GetIssueLogList()
				  }
			      break;
			  
			    default:
			      console.log(obj);
			  }
			},
		},
		onLoad(ops) {
			var self = this
			console.log(ops)
			this.$data.ClassId = ops.ClassId
			this.$data.ChapterId = ops.ChapterId
			this.$data.ClassroomLogId = ops.ClassroomLogId
			this.$data.ChapterName = ops.ChapterName
			wx.setNavigationBarTitle({
				title: ops.ChapterName
			})
			this.GetCoursewareByPage()

			var Timer = setInterval(() => {
				if (self.$data.ClassroomLogId !== "") {
					console.log("2223")
					self.GetAttendInfo()
					self.GetIssueLogList()
					self.GetTestingReportList()
					clearInterval(Timer)
				}
			}, 1000)
			
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
			          self.callMethods(obj);
			        }
			      }
			    }
			  } catch (ex) {
			    console.log('异常：' + ex);
			    console.log('收到服务器内容：' + res.data);
			  }
			});
		},
		onShow() {
			this.GetCoursewareByPage()
		}
	}
</script>

<style lang="less" scoped>
	.AttendList {
		display: flex;
		align-items: center;
		line-height: 100upx;
		border-bottom: #F8F8F8 solid 2upx;
		padding: 10upx 0;

		.AttendLogoBox {
			flex: 2;

			.attimg {
				width: 80upx;
				height: 80upx;
				vertical-align: middle;
			}
		}

		.Attendname {
			flex: 8;
		}
	}

	.StatusBox {
		flex: 2;
	}

	.AttendStatus {
		width: 45px;
		height: 20px;
		background: #FF9E18;
		color: #fff;
		border-radius: 11px;
		line-height: 39upx;
		text-align: center;
		font-size: 24upx;
	}



	// .problem_content {
	// 	margin-top: 10upx;
	// 	.problem_card {
	// 		margin-top: 20upx;
	// 		padding: 40upx 40upx 20upx 40upx;
	// 		background: rgba(255, 255, 255, 1);
	// 		box-shadow: 0px 2px 22px 0px rgba(106, 119, 133, 0.13);
	// 		border-radius: 12upx;

	// 		.answer_info {
	// 			margin: 20upx 0;
	// 			padding: 30upx 20upx;
	// 			font-size: 28upx;
	// 			color: #929CA4;
	// 			background: rgba(246, 246, 246, 1);
	// 			border-radius: 6px;
	// 		}

	// 		.problem_card_bottom {
	// 			color: #03C173;
	// 			font-size: 28upx;
	// 			text-align: center;
	// 			margin-top: 20upx;
	// 		}

	// 		.problem_card_info {
	// 			font-size: 28upx;
	// 			color: #40474E;
	// 			padding: 20upx 0;
	// 			border-bottom: 2upx solid #F8F8F8;
	// 		}

	// 		.problem_status {
	// 			color: #FFFFFF;
	// 			font-size: 24upx;
	// 			text-align: center;
	// 			line-height: 42upx;
	// 			width: 48px;
	// 			height: 46px;

	// 			.problem_status_open {
	// 				background: #03C173;
	// 				border-radius: 22upx;
	// 			}

	// 			.problem_status_hide {
	// 				background-color: #FF9E18;
	// 				border-radius: 22upx;
	// 			}
	// 		}

	// 		.problem_card_top {
	// 			display: flex;
	// 			justify-content: space-between;
	// 			align-items: center;

	// 			.problem_card_top_user {
	// 				display: flex;
	// 				align-items: center;
	// 				justify-content: space-between;

	// 				.userTime {
	// 					font-size: 24upx;
	// 					color: #929CA4;
	// 				}

	// 				.userName {
	// 					font-size: 30upx;
	// 					color: #40474E;
	// 				}

	// 				.userLogo {
	// 					width: 88upx;
	// 					height: 88upx;
	// 					border-radius: 50%;
	// 					overflow: hidden;
	// 					text-align: center;
	// 					margin-right: 20upx;

	// 					image {
	// 						width: 100%;
	// 						vertical-align: middle;
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	.testList {
		display: flex;
		align-items: center;
		line-height: 100upx;
		border-bottom: #F8F8F8 solid 2upx;

		.testname {
			white-space: nowrap;
			overflow: hidden;
			flex: 8;
		}

		.testLogoBox {
			flex: 1;
		}
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

	.editFileName {
		// margin: 100upx auto;
		z-index: 99999;
		position: fixed;
		top: 32%;
		left: 16.5%;
		width: 520upx;
		height: 326upx;
		background: #F2F2F2;
		border-radius: 30upx;

		.edittitle {
			text-align: center;
			margin: 40upx 0 60upx 0;
			font-size: 34upx;
			color: #000;
		}

		.textInpt {
			margin: 40upx auto;
			width: 238px;
			background: #FFFFFFFF;
			border-radius: 12upx;
			border: 1px solid #F2F2F2;
			padding: 4upx 8upx
		}

		.editBtn {
			border-top: 1px solid #C0C0C0;
			display: flex;
			align-items: center;
			color: #007AFF;

			view {
				flex: 1;
				text-align: center;
				line-height: 88upx;
			}
		}
	}

	.textLogo {
		width: 50upx;
		height: 50upx;
		vertical-align: middle;
	}

	.article_list {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;

		.activeEdit {
			transform: translateX(-300upx);
			transition: all 3s linear 1s
		}

		.text_list {
			padding: 20upx 0;
			position: relative;
			width: 100%;
			z-index: 5;
			transition: left 0.2s ease-in-out;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			background-color: #FFFFFF;
			line-height: 100upx;
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
					width: 28upx;
					height: 20upx;
				}
			}

			.textname {
				flex: 9;
				margin-left: 40upx;
				margin-right: 30upx;
				overflow: hidden;
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
			width: 190upx;
			text-align: center;
			// margin-left: 40upx;
		}

		.ad-delete {
			font-size: 24upx;
			margin: 30upx 0;

			image {
				width: 60upx;
				height: 56upx;
			}
		}
	}





	.addFile {
		padding: 40upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: center;
		line-height: 80upx;

		.addFile_bth {
			width: 320upx;
			border-radius: 50upx;
			border: 1px solid rgba(146, 156, 164, 1);
			font-size: 28upx;
			color: rgba(146, 156, 164, 1);
		}
	}

	.classInfo {
		position: relative;
		padding: 24upx 0;
		border-bottom: 2upx solid #F8F8F8;
		font-size: 26upx;
		color: rgba(146, 156, 164, 1);
		line-height: 42upx;
		text-align: justify;

		.infoText {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
			-webkit-line-clamp: 2;
			overflow: hidden;
			padding-right: 2em;
		}

		.unfold {
			z-index: 999;
			text-align: right;
			width: 116upx;
			color: #03C173;
			position: fixed;
			padding-left: 20px;
			right: 5%;
			top: 17.5%;
		}
	}




	.cont_title {
		text-align: center;
		/* margin-right: 34upx; */
		padding: 0 30upx 28upx 30upx;
		color: #929CA4;
		font-size: 30upx;
		font-weight: 600;
		width: 90%;
	}
	.titleA{
		position: fixed;
		top: 0%;
		background: #FFFFFF;
		width: 100%;
	}
	.end-cont-title {
		/* display: inline-block; */
		display: flex;
		justify-content: space-between;
		border-bottom: 2upx #F8F8F8 solid;
	}

	.end-cont-notice {
		display: none;
	}

	.btna {
		color: #03C173;
		border-bottom: solid #03C173 4upx;
	}

	.dis {
		display: block;
	}

	.courseware_content {
		margin-top: 40upx;
	}


	.content {
		padding: 30upx 38upx;
	}



	.class_info {
		/* height: 274upx; */
		background: linear-gradient(270deg, rgba(3, 193, 115, 1) 0%, rgba(0, 179, 105, 1) 100%);
		box-shadow: 0px 4upx 8upx 0px rgba(3, 193, 115, 0.33);
		border-radius: 16upx;
		color: rgba(255, 255, 255, 1);
		font-size: 26upx;
		padding: 40upx;
	}
</style>
