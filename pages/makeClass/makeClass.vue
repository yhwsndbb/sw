<template>
	<view class="makeClassContent">
		<view class="pickerLeft">
			<picker value="" mode="selector" @change="bindClassroomChange" :range="ClassroomList" :range-key="'ClassroomName'">
				<view class="">{{selectClassroom || ClassroomList[0].ClassroomName}}</view>
			</picker>
			<image class="argImg" src="../../static/image/arrow_bottom.png" mode=""></image>
		</view>
		<view class="courseware_content">
			<scroll-view class="'scrollContainer' " scroll-x="true" scroll-with-animation="true" @scroll="getleft">
				<view class="itemBg">
					<view class="end-cont-title">
						　　<view class="cont_title" v-for="(W,N) in WeekDataList" :key='N' @tap="Tabchange(N,W.Date)" :class="{btna:btnnum == N}">{{W.Week}}
							<view class="">
								{{W.Date.substring(5, 10).replace('-', '.')}}
							</view>
						</view>
					</view>
				</view>

			</scroll-view>
			<view class="curriculumList">
				<view class="" style="border-top: 2upx #F8F8F8 solid;;" v-for="(cur,index) in curriculumList" :key='index'>
					<view class="curriculumContent">
						<view class="curriculumTime">
							<view class="">
								第{{cur.SectionNum}}节
							</view>
							{{cur.StartTime.substring(10, 16)}}～{{cur.EndTime.substring(11, 16)}}
						</view>
						<view class="curriculumBtn" :class="[cur.IsCurrentReserve?'Reserve':'',!cur.IsCurrentReserve&&!cur.IsTimeOut?'mayReserve':'',!cur.IsCurrentReserve&cur.IsTimeOut?'endBtn':'']"
						 @click="onReserve(cur.IsCurrentReserve,cur.IsTimeOut,cur.ClassroomLogId,cur.SectionNum,cur.StartTime,cur.EndTime)">
							<view v-if="cur.IsCurrentReserve">已预约</view>
							<view v-if="!cur.IsCurrentReserve&&cur.IsTimeOut">已结束</view>
							<view v-if="!cur.IsCurrentReserve&&!cur.IsTimeOut">可预约</view>
						</view>
					</view>

				</view>
			</view>

		</view>
		<view class="ClassroomLog" v-if="ClassroomLogShow">
			<view class="formBox">
				<view class="formItme" @click="onClassCategory">
					<text style="color: #40474E;" v-if="ApplyCause!==''">{{ApplyCause}}</text>
					<text v-else>请选择上课类别</text>
				</view>
				<view class="formItme" @click="onChapter">
					 <text style="color: #40474E;" v-if="ChapterName!==''">{{ChapterName}}</text>
					 <text v-else>请选择预约章节</text>
				</view>
				<view class="formItme" @click="ClassTree">
					<text style="color: #40474E;" v-if="TeachClass!==''">{{TeachClass}}</text>
					<text v-else>请选择班级</text>
				</view>
				<view class="BtnContent">
					<view class="sbumitBtn" @click="SaveClassroomLog">
						提交
					</view>
					<view class="abolish" @click="abolish">
						取消
					</view>
				</view>
				<view class="classCategory" v-if="selectClass">
					<view class="" v-for="(C,index) in classCategoryList" :key='index' @click="selectCategory(C.CategoryName)">{{C.CategoryName}}</view>
				</view>
			</view>

		</view>
		<view class="addFileBox">
			<view class="addFileBth" @click="onMakeRecord">
				预约记录
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classCategoryList:[
					{CategoryName:'正常上课'},
					{CategoryName:'班级活动'},
					{CategoryName:'社团活动'},
					{CategoryName:'其他'},
					{CategoryName:'网课'},
				],
				ClassroomLogShow:false,//预约表单
				selectClass:false,//上课类别
				curriculumList: [],
				ClassroomList: [],
				WeekDataList: [],
				selectClassroom: '',
				btnnum: 0,
				reserveDate: '',
				ChapterName:'',
				ApplyCause:'',
				ClassroomLogId:'',
				classroomCode: '',
				CurriculumCode:'',
				ChapterId:'',
				TeachClass:"",
				TeachClassId:"",
				SectionNum:'',
				StartTime:"",
				EndTime:'',
				// ReserveDate:'',
				Remark:'',
			}
		},
		methods: {
			onMakeRecord(){
				uni.navigateTo({
					url:'../MakeRecord/MakeRecord'
				})
			},
			//提交预约
			SaveClassroomLog(){
				var that=this
				var self = this.$data
				if(self.ApplyCause==''){
					uni.showToast({
						title: '课程不能为空',
						icon: 'none'
					})
					return;
				}else if(self.ChapterName==''){
					uni.showToast({
						title: '章节不能为空',
						icon: 'none'
					})
					return;
				}else if(self.TeachClass==''){
					uni.showToast({
						title: '班级不能为空',
						icon: 'none'
					})
					return;
				}else{
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/SaveClassroomLog',
					data: {
					ClassroomLogId:null,  //课室预约记录ID-编辑时必填 ,
					ClassroomCode:self.classroomCode,  //课室编号-必填-网课时为随机房间号 ,
					CurriculumCode:self.CurriculumCode, //课程编号-申请事由为上课时必填 ,
					ChapterId: self.ChapterId,//章节ID-申请事由为上课时必填 ,
					TeachClass: self.TeachClass,//教学班级-申请事由为上课时必填 ,
					TeachClassId:self.TeachClassId, //班级ID-申请事由为上课时必填 ,
					ReserveDate:self.reserveDate, //预约时间 YYYY-MM-DD-申请事由非网课时必填 ,
					SectionNum:self.SectionNum,//节次（数字1-8）-申请事由非网课时必填 ,
					ApplyCause: self.ApplyCause,//申请事由-必填 ,
					Remark:self.Remark, //备注-选填 ,
					StartTime:self.StartTime, //预约开始时间 申请事由为网课时必填，其他时候填写无效 ,
					EndTime: self.EndTime,//预约结束时间 申请事由为网课时必填，其他时候填写无效
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
								title: '预约成功',
							})
							this.$data.ClassroomLogShow=false
							self.ApplyCause=''
							self.ChapterName=''
							self.TeachClass=''
							that.GetClassroomLogList()
						} else {
							uni.showToast({
								title: Res.Message,
								icon: 'none'
							})
							return false
						}
					}
				})
				
				}
			},
			abolish(){
				this.$data.ClassroomLogShow=false
				this.$data.ApplyCause=''
				this.$data.ChapterName=''
				this.$data.TeachClass=''
				this.$forceUpdate();
				console.log(this.$data.ApplyCause)
			},
			ClassTree(){
				uni.navigateTo({
					url:'../ClassTree/ClassTree'
				})
			},
			selectCategory(CategoryName){
				this.$data.ApplyCause=CategoryName
				this.$data.selectClass=!this.$data.selectClass
			},
			onChapter(){
				uni.navigateTo({
					url:'../classChapter/classChapter'
				})
			},
			onClassCategory(){
				this.$data.selectClass=!this.$data.selectClass
			},
			onReserve(IsCurrentReserve, IsTimeOut, ClassroomLogId,SectionNum,StartTime,EndTime) {
				var that = this
				if (!IsCurrentReserve & IsTimeOut) {
					uni.showToast({
						title: '当前课程不可预约！',
						icon: 'none'
					})
				} else if (IsCurrentReserve) {
					wx.showModal({
						title: '提示',
						content: '确定取消预约吗？',
						success(res) {
							console.log(res);
							
							if (res.confirm) {
								uni.request({
									method: 'GET',
									url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/CancelClassroomLog',
									data: {
										classroomLogId: ClassroomLogId
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
											that.GetClassroomLogList()
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
				} else if (!IsCurrentReserve && !IsTimeOut) {
					switch (SectionNum) {
						case "一":
							SectionNum = '1';
							break;
						case "二":
							SectionNum = '2';
							break;
						case "三":
							SectionNum = '3';
							break;
						case "四":
							SectionNum = '4';
							break;
						case "五":
							SectionNum = '5';
							break;
						case "六":
							SectionNum = '6';
							break;
						case "七":
							SectionNum = '7';
							break;
						case "八":
							SectionNum = '8';
							break;
						case "九":
							SectionNum = '9';
							break;
					}
					console.log(ClassroomLogId)
					this.$data.ClassroomLogId=ClassroomLogId
					console.log(this.$data.ClassroomLogId)
					this.$data.SectionNum=SectionNum
					this.$data.StartTime=StartTime
					this.$data.EndTime=EndTime
					// this.$data.ReserveDate=EndTime.substring(0,10)
					this.$data.ClassroomLogShow=true
				}
			},
			getleft(e) {
				console.log(e)
			},
			Tabchange(e, Date) {
				console.log(e,Date)
				this.btnnum = e
				this.$data.reserveDate = Date
				this.GetClassroomLogList()
				
			},
			bindClassroomChange(e) {
				console.log(e)
				var Item = this.$data.ClassroomList[e.detail.value]
				this.$data.selectClassroom = Item.ClassroomName
				this.$data.classroomCode = Item.ClassroomCore
				this.GetClassroomLogList()
			},
			//获取课室信息数据
			GetClassroomList() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetClassroomList',
					data: {},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let Res = res.data
						if (Res.Success == true) {
							this.$data.ClassroomList = Res.Data
							this.$data.classroomCode = Res.Data[0].ClassroomCore
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
			//获取未来一周时间
			GetWeekData() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetWeekData',
					data: {},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let Res = res.data
						if (Res.Success == true) {
							this.$data.WeekDataList = Res.Data
							this.$data.reserveDate = Res.Data[0].Date
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
			//获取课室预约列表数据
			GetClassroomLogList() {
				var self = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetClassroomLogList',
					data: {
						classroomCode: self.$data.classroomCode,
						reserveDate: self.$data.reserveDate
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let Res = res.data
						if (Res.Success == true) {
							this.$data.curriculumList = Res.Data
							
							for (let D in Res.Data) {
								var it = Res.Data[D]
								switch (it.SectionNum) {
									case "1":
										it.SectionNum = '一';
										break;
									case "2":
										it.SectionNum = '二';
										break;
									case "3":
										it.SectionNum = '三';
										break;
									case "4":
										it.SectionNum = '四';
										break;
									case "5":
										it.SectionNum = '五';
										break;
									case "6":
										it.SectionNum = '六';
										break;
									case "7":
										it.SectionNum = '七';
										break;
									case "8":
										it.SectionNum = '八';
										break;
									case "9":
										it.SectionNum = '九';
										break;
								}
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
			},
		},
		onLoad() {
			var self = this
			this.GetClassroomList()
			this.GetWeekData()
			// setInterval(this.get, 1000)
		var timer=	setInterval(() => {
				if(this.$data.WeekDataList.length!==0&&this.$data.classroomCode!==''){
					self.GetClassroomLogList()
					clearInterval(timer)
				}
			}, 1000)
		},
		onShow() {
			var that = this
			// 获取到上一页返回回来带的值
			    var pages = getCurrentPages();
			    var currPage = pages[pages.length - 1];
			    this.$data.ChapterId = currPage.data.ChapterId
			    this.$data.CurriculumCode = currPage.data.CurriculumCode
			    this.$data.ChapterName = currPage.data.ChapterName
			    this.$data.TeachClass = currPage.data.TeachClass
			    this.$data.TeachClassId = currPage.data.TeachClassId
				// this.GetClassroomLogList()
				var timers=	setInterval(() => {
						if(this.$data.WeekDataList.length!==0&&this.$data.classroomCode!==''){
							that.GetClassroomLogList()
							clearInterval(timers)
						}
					}, 1000)
		}
	}
</script>

<style lang="less" scoped>

	.ClassroomLog {
	
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 22px 0px rgba(106,119,133,0.13);
		border-radius: 16rpx;
		position: fixed;
		top: 22%;
		left: 5%;
		padding: 50upx;
		// position: relative;
		.classCategory{
			position: absolute;
			left: 0;
			top: 27%;
			width: 100%;
			background-color: #FFFFFF;
			box-shadow: 0px 2px 22px 0px rgba(106, 119, 133, 0.13);
			view{
				color: #929CA4;
				padding:20upx 80upx;
				border-bottom: 2upx #F8F8F8 solid;
			}
		}
		.inputBox {}

		.formItme {
			width: 520upx;
			border-radius: 52upx;
			border: 1px solid rgba(241, 241, 241, 1);
			margin-bottom: 20upx;
			padding-left: 40upx;
			font-size: 28upx;
			color: #929CA4;
			margin: 20upx auto;
			line-height: 88upx;
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

	.curriculumList {
		padding: 20upx 0;

		.curriculumContent {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 30upx;
			// line-height: 88upx;
			padding: 20upx 80upx;

			.curriculumBtn {
				width: 210upx;
				// height:36px;
				border-radius: 36upx;
				text-align: center;
				line-height: 74upx;

			}

			.Reserve {
				border: 1px solid #FF9E18;
				color: #FF9E18;
				background: rgba(255, 158, 24, 0.1);
			}

			.mayReserve {
				background: rgba(3, 193, 115, 0.1);
				border: 1px solid #03C173;
				color: #03C173;
			}

			.endBtn {
				background-color: #dedede;
				border: 1px solid #999;
				color: #555555;
			}

			.curriculumTime {
				color: #40474E;
				text-align: center;
			}
		}
	}

	.scrollContainer {
		width: 100%;
		// height: 134rpx;
		white-space: nowrap;
	}

	.cont_title {
		text-align: center;
		padding: 28upx 2upx 12upx 2upx;
		color: #929CA4;
		font-size: 28upx;
		margin: 0 20rpx;
	}

	.itemBg {
		display: inline-block;
	}

	.end-cont-title {
		display: flex;
		justify-content: space-between;
		border-bottom: 2upx #F8F8F8 solid;
		border-top: 2upx #F8F8F8 solid;
	}

	.end-cont-notice {
		display: none;
	}

	.btna {
		// color: #03C173;
		border-bottom: solid #03C173 4upx;
	}

	.dis {
		display: block;
	}

	.courseware_content {
		margin-top: 40upx;
	}



	.addFileBox {
		.addFileBth {
			width: 275px;
			height: 52px;
			background: #03C173;
			border-radius: 26px;
			color: #FFFFFF;
			margin: 20upx auto;
			text-align: center;
			line-height: 100rpx;
		}
	}

	.pickerLeft {
		padding: 30upx 40upx;
		color: #40474E;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 34upx;

		// position: absolute;
		// right: 4%;
		// top: 10%;
		.argImg {
			vertical-align: middle;
			width: 20rpx;
			height: 14rpx;
		}
	}
</style>
