<template>
	<view class="content">
		<view class="head_conten">
			<view class="left_head">
				<view class="text_top">您好 <text v-if="CurrentClass.ClassStatus==2||CurrentClass.ClassStatus==4">{{CurrentClass.TeacherName}}</text></view>
				<view class="text_bottom" v-if="CurrentClass.ClassStatus==2||CurrentClass.ClassStatus==4">
					<image class="img" src="../../static/image/class.png" mode="w"></image>
					<text v-if="CurrentClass.ClassStatus==2">正在上课</text>
					<text v-if="CurrentClass.ClassStatus==4">即将上课</text>
				</view>
				<view class="text_bottom" style="color: #929CA4;" v-else>
					<image class="img" src="../../static/image/classNo.png" mode="widthFix"></image>休息中
				</view>
			</view>
			<view class="right_head" @click="SetClassOverOrUp">
				<text v-if="CurrentClass.ClassStatus==2">下课</text>
				<text v-else>上课</text>
			</view>
		</view>
		<view class="class_info">
			<view class="info_top">
				<view class="info_top_left" v-if="CurrentClass.ClassStatus==2||CurrentClass.ClassStatus==4">
					{{CurrentClass.ChapterName}} <text>{{CurrentClass.StartTime.substring(11, 16)}}~{{CurrentClass.EndTime.substring(11, 16)}}</text>
					<view class="">
						{{CurrentClass.TeachClass}}
					</view>
				</view>
				<view class="info_top_left" v-else>
					暂无课堂信息
				</view>
				<view class="info_top_right" v-if="CurrentClass.ClassStatus==2||CurrentClass.ClassStatus==4">
					{{CurrentClass.ClassroomCode}}
				</view>
			</view>
			<view class="info_bottom">
				<view class="info_bottom_left" @click="goAttendInfo(CurrentClass.ClassroomLogId,1)">
					应到人数
					<text v-if="CurrentClass.ClassStatus==2">{{CurrentClass.TotalNum}}</text>
				</view>
				<view class="info_bottom_right" @click="goAttendInfo(CurrentClass.ClassroomLogId,2)">
					实到人数
					<text v-if="CurrentClass.ClassStatus==2">{{CurrentClass.RealNum}}</text>
				</view>
			</view>
		</view>
		<view class="courseware_content" v-show="CurrentClass.ClassStatus==2">
			<view class="end-cont-title">
				　　<view class="cont_title" @tap="change(0)" :class="{btna:btnnum == 0}">课件</view>
				　　<view class="cont_title" @tap="change(1)" :class="{btna:btnnum == 1}">问题讨论（{{RecordCount}}）</view>
				　　<view class="cont_title" @tap="change(2)" :class="{btna:btnnum == 2}">直播</view>
			</view>
				<view class="end-cont-notice" :class="{dis:btnnum == 0}" @touchstart="onLoadStart" @touchmove="onLoadMove">
					<view class="" v-if="CoursewareList.length!==0&&CoursewareLoad=='loading'">
						<uni-load-more :status="CoursewareLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
					</view>
					<DataNo :DataList='CoursewareList' @onLoading='CoursewareLoading'></DataNo>
					<view v-for="(E,inx) in CoursewareList" :key="inx">
						<view class="ChapterBox">
							<view class="ChapterName">{{E.ChapterName}}</view>
							<view class="ChapterImg" @click="addResource(CurrentClass.TeachClassId,E.ChapterId)">
								<image src="../../static/image/Show.png" mode="widthFix"></image>
							</view>
						</view>
						<view class="article_list" v-for="(item,index) in E.ResourcesList" :key="index">
							<view class="text_list" @click.stop="OnopenFile(item.ResourcesId,item.FileType,item.TestingLogId,E.ChapterId)" :class="index==activeEdit&&inx==ChapterIndex?'activeEdit':''"
							 :data-index="index" :data-chapter="inx" @touchstart="onPanStart" @touchmove="onPanMove">
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
									<image class="list_arrow" src="../../static/image/dot.png" mode="widthFix"></image>
								</view>
							</view>　
							<view class="edit-delete">
								<view class="ad-delete" @click="onShare(item.RelationId,item.IsShare)" v-if="item.FileType !== 5">
									<image src="../../static/image/share.png" mode="widthFix"></image>
									<view class="">
										分享
									</view>
								</view>
								<view class="ad-delete" @click="onDel(item.ResourcesId,E.ChapterId)">
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
					</view>
				</view>
				<view class="end-cont-notice" :class="{dis:btnnum == 1}" @touchstart="onIssueLogStart" @touchmove="onIssueLogMove">
					<view class="" v-if="IssueLogList.length!==0&&IssueLogLoad=='loading'">
						<uni-load-more :status="IssueLogLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
					</view>
					<DataNo :DataList='IssueLogList' @onLoading='IssueLoading'></DataNo>
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
				<view class="end-cont-notice" :class="{dis:btnnum == 2}">
					<view class="player-box">
						<view class="LiveBox">
							<video v-if="IsLive==1" id="myPlayer" :src="IsPlayURL" autoplay controlsn="false" enable-progress-gesture='false'
							 show-play-btn="false"></video>
							<cover-view class="liveImgBox" v-if="IsRecord==0||IsRecord==2" @click="OpenVideoPlayer">
								<cover-image class="liveImg" src="../../static/image/live.png" mode="widthFix"></cover-image>
							</cover-view>
							<cover-view v-if="IsRecord==1" class="IsRecordBox">
								<cover-image class="IsRecordImg" src="../../static/image/pause.png" mode="widthFix" @click="OpenVideoPlayer"></cover-image>
								<cover-view class="IsRecordTxt">录制中：{{formatSeconds(RecordDuration)}}</cover-view>
								<cover-image class="IsRecordImg" src="../../static/image/sotop.png" mode="widthFix" @click="OpenVideoPlayer"></cover-image>
							</cover-view>
							<cover-view class="on_offImgBox" @click="SetCPLiveStatus">
								<cover-image class="on_offImg" src="../../static/image/on_off.png" mode=""></cover-image>
								<text v-if="IsLive==0">开始直播</text>
								<text v-if="IsLive==1">关闭直播</text>
							</cover-view>
							<view class="bigImgBox" @click="requestFullScreen">
								<image class="bigImg" src="../../static/image/big.png" mode=""></image>
							</view>
							<view class="LiveUrl" @click="SwitchLive(LiveInfo)">
								<text v-if="LiveInfo==1">长鹏</text>
								<text v-if="LiveInfo==0">海康</text>
							</view>
							<view class="viewTransLate">
								<view :class="translateInfo === 0 ? 'LiveTransLate liveTranslateActive' : 'LiveTransLate'" @click="switchTranslate(0)">
									<text>学生全景</text>
								</view>
								<view :class="translateInfo === 1 ? 'LiveTransLate liveTranslateActive' : 'LiveTransLate'" @click="switchTranslate(1)">
									<text>教师特写</text>
								</view>
								<view :class="translateInfo === 6 ? 'LiveTransLate liveTranslateActive' : 'LiveTransLate'" @click="switchTranslate(6)">
									<text>课件视角</text>
								</view>
							</view>
							<view class="NoLive" v-if="IsLive==0">
								<image src="../../static/image/signal.png" mode="" class="signal" mode="widthFix"></image>
								无直播信号
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
			 <!-- <web-view :webview-styles="webviewStyles" src='../iframe/iframe'></web-view> -->
			 <!-- <web-view :webview-styles="webviewStyles" src='https://www.cnblogs.com/dalulu/p/9125291.html'></web-view> -->
		</view>

	</view>
</template>

<script>
	import {uniLoadMore} from '@dcloudio/uni-ui'
	import DataNo from '@/components/DataNo.vue'
	 const { request,showLoading,hideLoading} = require("../../static/request")
	export default {
		components: {
			DataNo,
			uniLoadMore
		},
		data() {
			return {
				ClassroomLogId:'',
				ClassStats:'',
				videoContextIndex: '',
				// videoUrl:'',
				videoUrl: 'https://zhks-1252354869.cos.ap-guangzhou.myqcloud.com/Video/vga_2020_04_23_152116.mp4',
				CurrentClass: {},
				ResourcesName: '',
				RelationId: '',
				ChapterId: '',
				ClassId: '',
				isEdit: false,
				activeEdit: null,
				ChapterIndex: null,
				delBtnWidth: 300, //删除按钮宽度单位（rpx）
				startX: '',
				playAudio: false,
				status: 1, //是否上课 0是休息 1 是上课
				btnTab: 0,
				btnnum: 0,
				CoursewareList: [],
				RenameName: '',
				IssueLogList: [],
				showInput: false,
				Content: '',
				ParentId: '',
				RecordCount: 0,
				IsLive: '',
				IsRecord: '',
				//计时器
				RecordDuration: '00:00:00',
				IsPlayURL: '',
				LiveInfo: 1, // 1 是长鹏 0 是海康
				CoursewareY:'',
				CoursewareLoad:'',
				IssueLogLoad:'',
				IssueLogY:'',
				CoursewarepageY:'',
				// userNo:999,
				 buttonClicked: false,
				 translateInfo: 0,
				 saveTransInfo: ''
			}
		},
		
		methods: {
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
				  if(messageList.MessageType==12){
					  //刷新实到人数
					  _self.GetCurrentClass()
					  
				  }else if(messageList.MessageType==0){
					  //自动刷新问答数据
					  _self.GetIssueLogList()
				  }
			      break;
			  
			    default:
			      console.log(obj);
			  }
			},
			onIssueLogStart(e) {
				console.log(e)
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.IssueLogY = e.touches[0].clientY
				}
			},
			onIssueLogMove(e) {
				console.log(e)
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.IssueLogY - moveY;
			
					if (disY == 110 || disY < 110) { 
						this.$data.IssueLogLoad = "loading"
						this.GetCoursewareList()
					} else if (disY > 110) {
						this.$data.IssueLogLoad = ""
					}
				}
			},
			onLoadStart(e) {
				console.log(e)
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.CoursewareY = e.touches[0].clientY
					this.CoursewarepageY = e.touches[0].pageY
					console.log(this.CoursewarepageY)
				}
			},
			onLoadMove(e) {
				console.log(e)
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.CoursewareY - moveY;
			if(this.CoursewarepageY<=350){
				if (disY == 110 || disY < 110) {
					this.$data.CoursewareLoad = "loading"
					this.GetCoursewareList()
				} else if (disY > 110) {
					this.$data.CoursewareLoad = ""
				}
			}else{
					this.$data.CoursewareLoad = ""
				}
					
				}
			},
			clickLoadMore(e){
				console.log(e)
			},
			IssueLoading() {
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
			CoursewareLoading() {
				var that = this
				uni.showLoading({
					title: '加载中',
					success() {
						that.GetCoursewareList()
					}
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			},
			// 切换直播地址
			SwitchLive(LiveInfo) {
				if (this.$data.IsLive == 0) {
					uni.showToast({
						title: '请先开启直播',
						icon: 'none'
					})
					return;
				} else {
					this.$data.LiveInfo = this.$data.LiveInfo == 0 ? 1 : 0
					LiveInfo = this.$data.LiveInfo
					if (LiveInfo == 1) {
						this.GetCPClassLiveInfo()
					} else if (LiveInfo == 0) {
						this.GetHKClassLiveInfo()
					}
					console.log(LiveInfo)
				}


			},
			// 切换视角
			switchTranslate (translateInfo) {
				if (this.$data.saveTransInfo === translateInfo) {
					return
				}
				if (this.$data.IsLive == 0) {
					uni.showToast({
						title: '请先开启直播',
						icon: 'none'
					})
					return;
				} else {
					this.$data.translateInfo = translateInfo
					this.$data.saveTransInfo = translateInfo
					uni.request({
						method: 'GET',
						url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/SetChannel',
						data: {
							switchChannel: translateInfo,
						},
						header: {
							'content-type': "application/json",
							'Authorization': uni.getStorageSync('token'),
						},
						success: (res) => {
							let result = res.data
							if (result.Success == true) {
								this.$data.IsPlayURL = result.Data.url
							} else {
								if(result.Message=='[-1]'){
									return false
								}else{
									uni.showToast({
										title: result.Message,
										icon: 'none'
									})
									return false
								}
							}
						}
					})
				}
			},
			//开启/关闭录播-长鹏
			OpenVideoPlayer() {
				this.$data.IsRecord = this.$data.IsRecord == 0 ? 1 : 0
				console.log(this.$data.IsRecord)
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/OpenVideoPlayer',
					data: {
						deviceState: this.$data.IsRecord,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '开启/关闭录播')
						let result = res.data
						if (result.Success == true) {
							// this.GetCPClassLiveInfo()
							this.GetVideoStatus()
						} else {
							if(result.Message=='[-1]'){
								return false
							}else{
								uni.showToast({
									title: result.Message,
									icon: 'none'
								})
								return false
							}
						}
					}
				})
			},
			//设置直播状态--长鹏
			SetCPLiveStatus() {
				this.$data.IsLive = this.$data.IsLive == 0 ? 1 : 0
				console.log(this.$data.IsLive)
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/SetCPLiveStatus',
					data: {
						deviceState: this.$data.IsLive,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '设置直播状态')
						let result = res.data
						if (result.Success == true) {
							this.GetCPClassLiveInfo()
							this.GetVideoStatus()
						} else {
							if(result.Message=='[-1]'){
								return false
							}else{
								uni.showToast({
									title: result.Message,
									icon: 'none'
								})
								return false
							}
						}
					}
				})
			},
			//获取直播录播状态
			GetVideoStatus() {
				let timeTem = ''
				var that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/GetVideoStatus',
					data: {},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '获取直播状态')
						let result = res.data
						if (result.Success == true) {

							this.$data.IsLive = result.Data.IsLive
							this.$data.IsRecord = result.Data.IsRecord
							this.$data.RecordDuration = result.Data.RecordDuration
							if (this.$data.IsRecord == 1) {
								timeTem = setTimeout(() => {
									that.GetVideoStatus(); //
								}, 1000);
							} else {
								clearTimeout(timeTem); //清除定时器
							}
						} else {
							if(result.Message=='[-1]'){
								return false
							}else{
								uni.showToast({
									title: result.Message,
									icon: 'none'
								})
								return false
							}
						}
					}
				})
			},
			requestFullScreen() {
				if (this.$data.IsLive == 0) {
					uni.showToast({
						title: '直播未开启，无法全屏',
						icon: 'none'
					})
					return;
				} else {
					this.$data.videoContextIndex.requestFullScreen({
						direction: 90
					});
				}
			},
			//获取课堂直播地址--长鹏
			GetCPClassLiveInfo() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/GetCPClassLiveInfo',
					data: {
						protocol: 'http',
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '直播地址CP')
						let result = res.data
						if (result.Success == true) {
							this.$data.IsPlayURL = result.Data.url
						} else {
							if(result.Message=='[-1]'){
								return false
							}else{
								uni.showToast({
									title: result.Message,
									icon: 'none'
								})
								return false
							}
						}
					}
				})
			},
			// 获取课堂直播地址--海康
			GetHKClassLiveInfo() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/GetHKClassLiveInfo',
					data: {
						protocol: 'http',
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res, '直播地址HK')
						let result = res.data
						if (result.Success == true) {
							this.$data.IsPlayURL = result.Data.url
						} else {
							if(result.Message=='[-1]'){
								return false
							}else{
								uni.showToast({
									title: result.Message,
									icon: 'none'
								})
								return false
							}
							
						}
					}
				})
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
						classroomLogId: this.$data.CurrentClass.ClassroomLogId,
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
			GetIssueLogList() {
				var that=this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/IssueApp/GetIssueLogList',
					data: {
						classroomLogId: this.$data.CurrentClass.ClassroomLogId,
						chapterId: this.$data.CurrentClass.ChapterId,
						classId: this.$data.CurrentClass.TeachClassId,
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
							this.$data.IssueLogList = result.Data
							this.$data.RecordCount = result.RecordCount
							setTimeout(function() {
								that.$data.IssueLogLoad = ""
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
			//发起测试
			AddTestingLog(ChapterId, ResourcesId) {
				var _that = this
				wx.showModal({
					title: '提示',
					content: '确定要发起测试?',
					success(res) {
						if (res.confirm) {
							uni.request({
								method: 'POST',
								data: {
									ChapterId: ChapterId,
									ResourcesId: ResourcesId,
									ClassId: _that.$data.CurrentClass.TeachClassId,
									ClassroomLogId: _that.$data.CurrentClass.ClassroomLogId,
								},
								url: 'https://hk.joyfulboo.com/Campus/TestingApp/AddTestingLog',
								header: {
									'content-type': "application/json",
									'Authorization': uni.getStorageSync('token'),
								},
								success: (res) => {
									console.log(res)
									let result = res.data
									_that.GetCoursewareList()
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			addResource(TeachClassId, ChapterId) {
				uni.navigateTo({
					url: `../addResource/addResource?ChapterId=${ChapterId}&ClassId=${TeachClassId}`
				})
			},
			inputVal(e) {
				console.log(e)
				this.$data.RenameName = e.detail.value
			},
			///课件列表
			GetCoursewareList() {
				var that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/GetCoursewareList',
					data: {
						chapterId: this.$data.CurrentClass.ChapterId,
						curriculumCode: this.$data.CurrentClass.CurriculumCode,
						classId: this.$data.CurrentClass.TeachClassId,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let Res = res.data
						if (Res.Success == true) {
							this.$data.CoursewareList = Res.Data
							this.$data.activeEdit = null
							setTimeout(function() {
								that.$data.CoursewareLoad = ""
							}, 2000);
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
			//考勤人数详情
			goAttendInfo(ClassroomLogId, attendStatus) {
				if(this.$data.ClassStats==2){
					uni.navigateTo({
						url: `../AttendInfo/AttendInfo?ClassroomLogId=${ClassroomLogId}&attendStatus=${attendStatus}`,
					})
				}
				

			},
			GetAttentByClassroomLog() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/AttendApp/GetAttentByClassroomLog',
					data: {
						classroomLogId: this.$data.CurrentClass.ClassroomLogId,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let Res = res.data
						if (Res.Success == true) {


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
			//上下课
			SetClassOverOrUp() {
				var self = this
				let ClassStatus = self.$data.ClassStats
				let ClassroomLogId = self.$data.ClassroomLogId
				var deviceState = ''
				var content = ''
				if (ClassroomLogId == null||ClassroomLogId == ''||ClassroomLogId == undefined) {
					uni.showToast({
						title: '课程还未开始',
						icon: 'none'
					})
					return;
				} else {
					if (ClassStatus == 2) {
						deviceState = 'close'
						content = '确定要下课吗？'
					} else {
						deviceState = 'open'
						content = '确定要上课吗？'
					}
					wx.showModal({
						title: '提示',
						content: content,
						success(res) {
							if (res.confirm) {
								uni.request({
									method: 'GET',
									url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/SetClassOverOrUp',
									data: {
										classroomLogId: ClassroomLogId,
										deviceState: deviceState,
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
												title: '请求成功',
												icon: 'none'
											})
											self.GetCurrentClass()

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
				}
			},
			//重命名
			RenameCourseware() {
				var _that = this
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/RenameCourseware',
					data: {
						RelationId: _that.$data.RelationId,
						RenameName: _that.$data.RenameName,
						ClassId: _that.$data.CurrentClass.TeachClassId,
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
							_that.GetCoursewareList()
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
			//分享
			onShare(RelationId, IsShare) {
				var self = this
				IsShare = !IsShare
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/SaveCoursewareShare',
					data: {
						RelationId: RelationId,
						ClassId: self.$data.CurrentClass.TeachClassId,
						IsShare: IsShare,
						IsCurrent: true,
						ClassroomLogId: self.$data.CurrentClass.ClassroomLogId,

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
								title: '分享成功',
							})
							self.GetCoursewareList()
							// this.$data.CoursewareList=Res.Data
							// this.$data.activeEdit = null
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
			//删除课件
			onDel(ResourcesId, ChapterId) {
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
									ChapterId: ChapterId,
									ClassId: _that.$data.CurrentClass.TeachClassId,
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
										_that.GetCoursewareList()
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
							_that.$data.activeEdit = null
						}
					}
				})
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
					var chapter = e.currentTarget.dataset.chapter;

					if (disX == 110 || disX < 110) { //右滑动
						this.$data.activeEdit = null
						// txtStyle = "transform:translateX(0)";
					} else if (disX > 110) {
						this.$data.activeEdit = index
						this.$data.ChapterIndex = chapter

						// txtStyle = "transform:translateX(-" + disX + "px)";
						if (disX >= delBtnWidth) {
							this.$data.activeEdit = index
							this.$data.ChapterIndex = chapter
							// txtStyle = "transform:translateX(-" + delBtnWidth + "px)";
						}
					}
				}
			},
			OnopenFile(ResourcesId, FileType, TestingLogId, ChapterId) {
				console.log('打开文件')
				let _that = this
				// this.buttonClicked(this);
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
							isCurrent: true,
							classroomLogId: _that.$data.CurrentClass.ClassroomLogId
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
			//获取当前课堂信息
			GetCurrentClass() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetCurrentClass',
					data: {},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res,"当前课堂信息")
						let Res = res.data
						if (Res.Success == true) {
							this.$data.CurrentClass = Res.Data
						    this.$data.ClassroomLogId = Res.Data.ClassroomLogId
						    this.$data.ClassStats = Res.Data.ClassStatus
							
							this.GetCoursewareList()
							this.GetIssueLogList()
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
			change(e) {
				this.btnnum = e
				console.log(this.btnnum)
				if (this.btnnum == 0) {
					this.GetCoursewareList()
				} else if (this.btnnum == 1) {
					this.GetIssueLogList()
				} else {
					this.switchTranslate(this.$data.translateInfo)
				}
			},
			changeTab(e) {
				this.btnTab = e
				console.log(this.btnTab)
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
			formatSeconds(value) {
				var secondTime = parseInt(value); // 秒
				var minuteTime = 0; // 分
				var hourTime = 0; // 小时
				if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
					//获取分钟，除以60取整数，得到整数分钟
					minuteTime = parseInt(secondTime / 60);
					//获取秒数，秒数取佘，得到整数秒数
					secondTime = parseInt(secondTime % 60);
					//如果分钟大于60，将分钟转换成小时
					if (minuteTime > 60) {
						//获取小时，获取分钟除以60，得到整数小时
						hourTime = parseInt(minuteTime / 60);
						//获取小时后取佘的分，获取分钟除以60取佘的分
						minuteTime = parseInt(minuteTime % 60);
					}
				}

				var result = (parseInt(hourTime) > 9 ? parseInt(hourTime) : '0' + parseInt(hourTime)) + ":" + (parseInt(minuteTime) >
					9 ? parseInt(minuteTime) : '0' + parseInt(minuteTime)) + ":" + (parseInt(secondTime) > 9 ? parseInt(secondTime) :
					'0' + parseInt(secondTime));
				return result;
			},
		
		},
		onLoad() {
			var that=this
			const videoContextIndex = wx.createVideoContext('myPlayer');
			this.$data.videoContextIndex = videoContextIndex;
			this.$data.videoContextIndex.play();
			this.GetCurrentClass()
			this.GetCPClassLiveInfo()
			this.GetVideoStatus()
			const token = uni.getStorageSync('token');
			if (!token) {
				// 跳转到授权登录页面
				uni.navigateTo({
					url: '/pages/login/login',
				});
			}
			
			var Timer = setInterval(() => {
					if(that.$data.ClassroomLogId == null||that.$data.ClassroomLogId == ''||that.$data.ClassroomLogId == undefined){
						console.log("2223")
						that.GetCurrentClass()
					}else{
						clearInterval(Timer)
					}
			}, 3000)
			
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
		},
		onShow() {
			var that=this
			this.GetCurrentClass()
			// setTimeout(() => {
			// 	console.log('22：');
			// 	that.GetCurrentClass(); 
			// }, 1000);
		},
		// onReady(){
		// 	let _that = this
		// 	_singalR.connection('https://hk.joyfulboo.com',userNo,null)
		// },

	}
</script>

<style lang="less" scoped>
	.webviewStyles{
		height: 100rpx;
		width: 300rpx;
	}
	.bigImgBox {

		position: absolute;
		bottom: 106rpx;
		right: 4%;

		.bigImg {
			width: 90rpx;
			height: 90rpx;
		}
	}

	.LiveUrl {
		padding: 0 20rpx;
		line-height: 55rpx;
		color: #FFFFFF;
		border-radius: 50rpx;
		position: absolute;
		background: rgba(59, 63, 69, 0.9);
		bottom: 119rpx;
		left: 3%;
		font-size: 24rpx;
	}
	.viewTransLate {
		position: absolute;
		bottom: 30rpx;
		left: 50%;
		transform: translate(-50%, 0);
		width: 66%;
		clear: both;
		height: 76rpx;
		background:rgba(59,63,69,0.9);
		display: flex;
		align-items: center;
		border-radius: 14rpx;
	}
	.LiveTransLate {
		line-height: 55rpx;
		color:#5B646D;
		font-size: 24rpx;
		flex-basis: 33%;
		border-right: 1px solid rgba(255,255,255,0.05);
		text-align: center;
	}
	.liveTranslateActive {
		color: #ffffff;
	}
	.LiveTransLate:last-child {
		border: 0;
	}

	.on_offImgBox {
		padding: 0 20rpx;
		line-height: 76rpx !important;
		color: #FFFFFF;
		border-radius: 50rpx;
		position: absolute;
		background: rgba(59, 63, 69, 0.9);
		top: 5%;
		right: 4%;
		font-size: 24rpx;

		.on_offImg {
			display: inline-block;
			margin-right: 10rpx;
			vertical-align: middle;
			width: 40rpx;
			height: 40rpx;
		}
	}

	.liveImgBox {
		position: absolute;
		top: 5%;
		left: 3%;

		.liveImg {
			width: 80rpx;
			height: 80rpx;
		}
	}

	.IsRecordBox {
		padding: 0 20rpx;
		line-height: 76rpx;
		color: #FFFFFF;
		border-radius: 50rpx;
		background: rgba(59, 63, 69, 0.9);
		font-size: 24rpx;
		position: absolute;
		top: 5%;
		left: 3%;

		.IsRecordImg {
			display: inline-block;
			vertical-align: middle;
			width: 34rpx;
			height: 34rpx;
		}

		.IsRecordTxt {
			display: inline;
			margin: 0 15rpx;
		}
	}

	.LiveBox {
		position: relative;
		height: 100%;
	}

	.player-box {
		position: relative;
		height: 740rpx;
		background: rgba(44, 49, 54, 1);
		box-shadow: 0px 1px 0px 0px rgba(241, 241, 241, 0.5);
		border-radius: 8px;

		video {
			width: 100%;
			height: 100%;
		}
	}

	.NoLive {
		width: 200rpx;
		margin: 0rpx auto;
		text-align: center;
		color: #4F5760;
		position: absolute;
		top: 32%;
		left: 36%;

		.signal {
			width: 100%;
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

	.ChapterBox {
		display: flex;
		justify-content: space-between;
		border-bottom: #F8F8F8 solid 2upx;
		padding: 30upx;

		.ChapterImg {
			image {
				width: 40rpx;
				height: 50rpx;
			}
		}

		.ChapterName {
			font-weight: 550;
		}
	}

	.editFileName {
		z-index: 999999;
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

	.cont_title {
		text-align: center;
		/* margin-right: 34upx; */
		margin-bottom: 24upx;
		padding: 0 40upx 12upx 40upx;
		color: #929CA4;
		font-size: 30upx;
		font-weight: 600;
	}

	.end-cont-title {
		/* display: inline-block; */
		display: flex;
		justify-content: space-between;
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

	.class_info .info_bottom .info_bottom_right {
		display: flex;
		flex-direction: column;
		text-align: left;
		flex: 1;
	}

	.class_info .info_bottom .info_bottom_left {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.class_info .info_bottom {
		margin-top: 40upx;
		display: flex;
	}

	.class_info .info_top .info_top_left {
		line-height: 48upx;
	}

	.class_info .info_top {
		padding-bottom: 24upx;
		display: flex;
		justify-content: space-between;
		border-bottom: rgba(255, 255, 255, 0.16) solid 2upx;
	}

	.content {
		padding: 30upx 38upx;
	}

	.head_conten {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #03C173;
		margin-bottom: 40upx;
	}

	.head_conten .text_top {
		font-size: 45upx;
		color: #40474E;
		font-weight: 550;
		margin-bottom: 12upx;
	}

	.head_conten .text_bottom {
		font-size: 23upx;
	}

	.head_conten .text_bottom .img {
		width: 40upx;
		height: 36rpx;
		// display: inline-block;
		vertical-align: middle;
		margin-right: 10upx;
	}

	.head_conten .right_head {
		width: 232upx;
		height: 80upx;
		border-radius: 46upx;
		border: 2upx solid rgba(3, 193, 115, 1);
		text-align: center;
		line-height: 80upx;
		font-size: 28upx;
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
