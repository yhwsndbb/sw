<template>
	<view class="assistant_content">
		<view class="searchBox">
				<view class="unisearch">
					<uni-search-bar cancelButton='none' value='' bgColor='#F0F1F3' placeholder="搜索关键字" :radius="100" @confirm="confirmSearch" @input='SearchVal'></uni-search-bar>
				</view>
		</view>
		<view class="" style="margin-bottom:116rpx;"></view>
		<view @touchstart="messageStart" @touchmove="messageMove">
			<view class="" v-if="messageList.length!==0&&messageLoad=='loading'" style="padding-top: 50rpx;">
				<uni-load-more :status="messageLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
			</view>
			<view>
				<view class="DataNo" v-if="DataListNo">
					<view class="">
						暂无数据
					</view>
					<view style="color: #007AFF;font-size: 28upx;" @click="messageListLoading">
						（点击刷新）
					</view>
				</view>
			</view>
			<view  v-for="(K,index) in messageList" :key="index">
				<view class="CreateDate" v-if="K.MessageList.length!==0">
					<text>
						{{K.CreateDate}}
					</text>
				</view>
				<view class="article_list" v-for="(i,n) in K.MessageList" :key='n'>
					<view class="topic_card" @click="GetTestPaperInfo(i.MessageType,i.RelationId,i.MessageLogId,i.IsRead,index,n)" :class="[n==activeEdit&&index==dateIndex?'activeEdit':'',n==activeEdit&&i.MessageType==4&&index==dateIndex?'activeYu':'']"
					 :data-index="n" :data-CreateDate="index" @touchstart="onPanStart" @touchmove="onPanMove" >
						<view class="topic_card_top">
							<view class="topic_card_logo">
								<image v-if="i.MessageType==1" src="../../static/image/green.png" mode="widthFix"></image>
								<image v-if="i.MessageType==5||i.MessageType==6 ||i.MessageType==7 || i.MessageType==2" src="../../static/image/blue.png"
								 mode="widthFix"></image>
								<image v-if="i.MessageType==3" src="../../static/image/orange.png" mode="widthFix"></image>
								<image v-if="i.MessageType==4" src="../../static/image/pink.png" mode="widthFix"></image>
							</view>
							<view class="topic_card_title">
								<view class="topic_card_title_top">
									{{i.Title}}
								</view>
								<view class="topic_card_title_bottom" v-if="i.MessageType==5 ||i.MessageType==7||i.MessageType==2">
									<view class="">
										{{i.CreateDatetime}}
									</view>
								</view>
								<view class="topic_card_title_bottom" v-if="i.MessageType==3">
									章节测试已完成，可查看测试结果报告
								</view>
								<view class="topic_card_title_bottom" v-else-if="i.MessageType==6">
									<view class="">
										{{i.CreateDatetime}}
									</view>
								</view>
								<view class="topic_card_title_bottom" v-else-if="i.MessageType==4">
									<view class="">
										预约日期：{{i.CreateDatetime}}
									</view>
								</view>
								<!-- <view class="topic_card_title_bottom" v-else-if="i.MessageType!==3">
									<view class="">
										上课科目：{{i.Content.ChapterName}}
									</view>
									{{i.Content.ClassTime}} | {{i.Content.ClassroomName}}
								</view> -->
							</view>
							<view class="IsReadBox" v-if="!i.IsRead&&i.MessageType!==4">
								<view class="dot">
								</view>
							</view>
						</view>
						<view class="class_summarize" v-if="i.MessageType==2">
							<view class="class_summarize_title">
								您的课后智能总结：
							</view>
							<view class="">
								上课教师：{{i.Content.TeacherName}}
							</view>
							<view class="">
								上课科目：{{i.Content.ChapterName}}
							</view>
			
							<view class="">
								上课时间：{{i.Content.ClassTime}}
							</view>
						</view>
						<view class="topic_card_bottom" v-if="i.MessageType==1||i.MessageType==3">
							<view class="topic_card_bottom_class">
								班级：{{i.ClassName}}
							</view>
							<view class="topic_card_bottom_status" v-if="i.MessageType!==3">
								教师：<text>{{i.Content.TeacherName}}</text>
							</view>
							<view class="arrowbox">
								<cover-image class="arrowImg" src="../../static/image/list_arrow.png"></cover-image>
							</view>
						</view>
						<view class="topic_card_bottom" v-if="i.MessageType==2||i.MessageType==4">
							<view class="topic_card_bottom_class">
								班级：{{i.ClassName}}
							</view>
							<view class="arrowbox">
								<cover-image class="arrowImg" src="../../static/image/list_arrow.png"></cover-image>
							</view>
						</view>
			
					</view>
					<!-- 删除操作部分 -->
					<view class="edit-delete">
						<view class="ad-delete" @click="SaveMessageReadStatus(i.MessageLogId,i.IsRead,index,n)" v-if="i.MessageType !== 4">
							<image src="../../static/image/share.png" mode="widthFix"></image>
							<view class="">
								<text v-if="!i.IsRead&&i.MessageType!==4">标记已读</text>
								<text v-if="i.IsRead&&i.MessageType!==4">标记未读</text>
							</view>
						</view>
						<view class="ad-delete" @click="DeleteMessage(i.MessageLogId,index,n)">
							<image src="../../static/image/del.png" mode="widthFix"></image>
							<view class="">
								删除
							</view>
						</view>
					</view>
				</view>
			
			</view>
		</view>
		

	</view>
</template>

<script>
	import {uniSearchBar,uniLoadMore} from '@dcloudio/uni-ui'
	const { request} = require("../../static/request")  
	
	const signalR = require('../../static/websocketFive.js');
	const app = getApp()
	let userInfo = uni.getStorageSync('UserInfo');
	let userNo = userInfo.UserNo
	let _singalR=new signalR.signalR()
	export default {
		components: {
			uniSearchBar,
			uniLoadMore,
		},
		data() {
			return {
				DataListNo:false,
				activeEdit: null,
				dateIndex: null,
				sVal: '',
				schooltime: '',
				messageList: [],
				PageSize: 10,
				CurrentPage: 1,
				TotalPages: 1,
				SearchValue: '',
				TotalPages: 1,
				delBtnWidth: 300, //删除
				startX: '',
				ReadCount: '',
				messageLoad:'',
				messageY:'',
			}
		},
		methods: {
			messageListLoading() {
				var that = this
				uni.showLoading({
					title: '加载中',
					success() {
						that.$data.messageList=[]
						that.GetMessageLogList()
					}
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			},
			messageStart(e) {
				console.log(e)
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.messageY = e.touches[0].clientY
				}
			},
			messageMove(e) {
				console.log(e)
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var moveX = e.touches[0].clientX;
							   var onPageY = e.touches[0].pageY;
							   		var disY = this.messageY - moveY;
							    if(this.messageY <=100){
							   	if (disY == 455 || disY < 455) {
							   		this.$data.messageLoad = "loading"
							   		this.GetMessageLogList()
							   	} else if (disY > 455) {
							   		this.$data.messageLoad = ""
							   	}
								} else{
							   		this.$data.messageLoad = ""
							   	}
						   }
			},
			SearchVal(e){
				this.$data.SearchValue=e.value
				this.$data.messageList=[]
				this.GetMessageLogList()
				if(e.value==""){
					this.$data.SearchValue=e.value
					this.$data.messageList=[]
					this.GetMessageLogList()
				}
			},
			confirmSearch() {
				this.$data.messageList=[]
				this.GetMessageLogList()
			},
			//删除消息报告数据
			DeleteMessage(messageLogId,index,n){
				  request({
				       url: '/MessageLogApp/DeleteMessage',
				     data: {
				     		messageLogId:messageLogId,
				     	},
				    }).then(res => {
				    console.log(res)
				    let result = res.data
				    if (result.Success == true) {
				    	this.$data.messageList[index].MessageList.splice(n,1)
				    	this.$data.activeEdit=null
				    uni.showToast({
				    	title: '删除成功',
				    })
				    // this.$data.CurrentPage = 1
				    // this.GetMessageLogList()
				    } else {
				    	uni.showToast({
				    		title: result.Message,
				    		icon: 'none'
				    	})
				    	return false
				    }
				    })
			},
			//保存消息阅读状态
			SaveMessageReadStatus(messageLogId,isRead,index,n){
				console.log(this.$data.CurrentPage)
				var IsRead = !isRead
				
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/MessageLogApp/SaveMessageReadStatus',
					data: {
						messageLogId:messageLogId,
						isRead:IsRead
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res,'保存消息阅读状态')
						let result = res.data
						if (result.Success == true) {
						this.$data.messageList[index].MessageList[n].IsRead=!this.$data.messageList[index].MessageList[n].IsRead
						this.$data.activeEdit=null
						// this.$data.CurrentPage = 1
						// this.GetMessageLogList()
						this.GetMessageReadCount()
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
			SaverInfoStatus(messageLogId,isRead){
				console.log(this.$data.CurrentPage)
				var IsRead = !isRead
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/MessageLogApp/SaveMessageReadStatus',
					data: {
						messageLogId:messageLogId,
						isRead:IsRead
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res,'保存消息阅读状态')
						let result = res.data
						if (result.Success == true) {
						// this.$data.CurrentPage = 1
						// this.GetMessageLogList()
						this.GetMessageReadCount()
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
			// 进入消息列表详情
			GetTestPaperInfo(MessageType, RelationId,MessageLogId,IsRead,index,n) {
				if(MessageType!==4&&!IsRead){
					this.SaverInfoStatus(MessageLogId,IsRead,index,n)
					if(!this.$data.messageList[index].MessageList[n].IsRead){
						 this.$data.messageList[index].MessageList[n].IsRead=true
					}
				}
				if (MessageType == 2) {
					// 课堂报告详情
					uni.navigateTo({
						url: '../referat/referat?MessageLogId='+MessageLogId
					})
				} else if (MessageType == 4) {
					// 预约
					uni.navigateTo({
						url: '../MakeInfo/MakeInfo?ClassroomLogId=' + RelationId
					})
				} else if (MessageType == 3) {
					// 测试
					uni.navigateTo({
						url: '../testDetails/testDetails?TestingLogId=' + RelationId
					})
				}
			},
			// 获取消息列表数据
			GetMessageLogList() {
				var _that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/MessageLogApp/GetMessageLogList',
					data: {
						currentPage: _that.$data.CurrentPage,
						pageSize: _that.$data.PageSize,
						searchValue: _that.$data.SearchValue,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res);
						if (res.data.Success) {
							// if(res.data.Data.length==0){
							// 	_that.$data.DataListNo=true
							// }else{
							// 	_that.$data.DataListNo=false
							// }
							var total = Math.ceil(res.data.RecordCount / _that.$data.PageSize)
							_that.$data.TotalPages = total
							// var MessageList = res.data.Data
							var MessageList = _that.$data.messageList
							var tempIndex = _that.$data.CurrentPage
							if (_that.$data.CurrentPage == 1) {
								MessageList = res.data.Data
								
								tempIndex = 1
								for (let i in MessageList) {
									let oneItem = MessageList[i]
									for (let m in oneItem.MessageList) {
										let messItem = oneItem.MessageList[m]
										this.$data.ReadCount = 0
										if (!messItem.IsRead) {
											this.$data.ReadCount = this.$data.ReadCount + 1
										}
										if (messItem.Content) {
											messItem.Content = JSON.parse(messItem.Content)
										}
										if (messItem.CreateDatetime) {
											if (messItem.MessageType == 4) {
												messItem.CreateDatetime = messItem.CreateDatetime.substring(5, 16)
												messItem.CreateDatetime = messItem.CreateDatetime.replace('-', '月')
												messItem.CreateDatetime = messItem.CreateDatetime.replace(' ', '日　')
											} else {
												messItem.CreateDatetime = messItem.CreateDatetime.substring(5, 10)
												messItem.CreateDatetime = messItem.CreateDatetime.replace('-', '月')
												messItem.CreateDatetime = messItem.CreateDatetime + '日'
											}

										}
									}
								}
								uni.stopPullDownRefresh()
							} else {
								var MessList = res.data.Data
								for (let i in MessList) {
									let oneItem = MessList[i]
									for (let m in oneItem.MessageList) {
										let ms = oneItem.MessageList[m]
										if (!ms.IsRead) {
											this.$data.ReadCount = this.$data.ReadCount + 1
										}
										if (ms.Content) {
											ms.Content = JSON.parse(ms.Content)
										}
										if (ms.CreateDatetime) {
											if (ms.MessageType == 4) {
												ms.CreateDatetime = ms.CreateDatetime.substring(5, 16)
												ms.CreateDatetime = ms.CreateDatetime.replace('-', '月')
												ms.CreateDatetime = ms.CreateDatetime.replace(' ', '日　')
											} else {
												ms.CreateDatetime = ms.CreateDatetime.substring(5, 10)
												ms.CreateDatetime = ms.CreateDatetime.replace('-', '月')
												ms.CreateDatetime = ms.CreateDatetime + '日'
											}
										}
									}
								}
								MessageList = MessageList.concat(MessList)
								tempIndex = tempIndex + 1
								
							}
							_that.messageList = MessageList
							_that.$data.CurrentPage = tempIndex
							_that.$data.activeEdit=null
							if(_that.messageList.length==0){
								_that.$data.DataListNo=true
							}else{
								_that.$data.DataListNo=false
							}
							setTimeout(function() {
								_that.$data.messageLoad = ""
							}, 2000);
						}
					}
				})
			},
			onSearchValue(e) {
				this.$data.SearchValue = e.value
				this.GetMessageLogList()
				this.$forceUpdate();
				// console.log(this.$data.sVal)

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
					var moveY = e.touches[0].clientY;
					// if(moveY){
						var disX = this.startX - moveX;
							var delBtnWidth = this.delBtnWidth;
							var index = e.currentTarget.dataset.index;
							var date = e.currentTarget.dataset.createdate;
							if (disX == 100 || disX < 100) { //右滑动
								this.$data.activeEdit = null
								this.$data.dateIndex = null
								
								// txtStyle = "transform:translateX(0)";
							} else if (disX > 100) {
								this.$data.activeEdit = index
								this.$data.dateIndex = date
						
								// txtStyle = "transform:translateX(-" + disX + "px)";
								if (disX >= delBtnWidth) {
									this.$data.activeEdit = index
									this.$data.dateIndex = date
									// txtStyle = "transform:translateX(-" + delBtnWidth + "px)";
								}
							// }
						}
					}
				
			},
			GetMessageReadCount() {
				var that = this
				let ReadCount = ''
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/MessageLogApp/GetMessageReadCount',
					data: {},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							ReadCount = result.Data.toString()
							uni.setTabBarBadge({
								index: 0,
								text: ReadCount
							})
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

		onLoad() {
			this.GetMessageLogList()
			this.$forceUpdate();
			this.GetMessageReadCount()
			// 	// 获取 token
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.navigateTo({
					url: '/pages/login/login',
				});
			}
		},
		onShow() {
			var that = this
			// this.$data.CurrentPage = 1;
			// this.GetMessageLogList()
			this.$forceUpdate();
			this.GetMessageReadCount()
		},
		onPullDownRefresh: function() {
			console.log('eeee')
			this.$data.CurrentPage = 1;
			this.GetMessageLogList();
		},
		onReachBottom() {
			var _self = this
			if (this.$data.CurrentPage < this.$data.TotalPages) {
				this.$data.CurrentPage++;
				this.GetMessageLogList()
			} else {
				uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				});

			}

		},
		onReady(){
			let _that = this
			_singalR.connection('https://hk.joyfulboo.com',userNo,null)
		},
	}
</script>

<style lang="less" scoped>
	.DataNo{
		margin: 300upx auto;
		text-align: center;
	}
	.article_list {
		position: relative;
		// overflow: hidden;
		// display: flex;
		// align-items: center;
	}

	.activeEdit {
		transform: translateX(-300rpx);
		transition: all 3s linear 1s
	}

	.activeYu {
		transform: translateX(-160rpx);
		transition: all 3s linear 1s
	}

	.edit-delete {
		position: absolute;
		top: 30%;
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
		font-size: 28upx;
		margin: 30upx 14rpx;

		image {
			width: 60upx;
			height: 56upx;
		}
	}
	.CreateDate {
		margin: 10upx auto;
		color: #999;
		text-align: center;
		font-size: 28rpx;
		line-height: 22upx;
		text {
			// background-color: #363636;
			// opacity: 0.3;
			// border-radius: 20upx;
			// padding: 5upx 30upx;

		}
	}

	.class_summarize {
		line-height: 42upx;
		// margin-top: 36upx;
		color: #929CA4;
		font-size: 25upx;
		padding-left: 120rpx;
	}

	.topic_card_bottom {
		padding-top: 20upx;
		margin-top: 20upx;
		border-top: solid 2upx #F8F8F8;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26upx;
		color: #929CA4;

		.arrowbox {
			.arrowImg {
				width: 45%;
			}
		}
	}

	.topic_card {
		position: relative;
		z-index: 999;
		transition: left 0.2s ease-in-out;
		// white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 40rpx 0;
		padding: 30upx 30upx 30upx 30upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 2px 2px rgba(106, 119, 133, 0.13);
		border-radius: 12upx;

		.IsReadBox {
			.dot {
				width: 20rpx;
				height: 20rpx;
				background-color: red;
				border-radius: 55%;
			}
		}

		.topic_card_top {
			line-height: 46upx;
			display: flex;

			// justify-content: space-between;
			.topic_card_hint {
				flex: 1;
				width: 108upx;
				height: 40upx;
				background: #FF9E18;
				border-radius: 22upx;
				color: #FFFFFF;
				font-size: 20upx;
				text-align: center;
				line-height: 40upx;
				// margin-left: 46upx;
				// margin-top: 10upx;
			}

			.topic_card_title {
				flex: 3;

				.topic_card_title_top {
					font-size: 34upx;
					color: #40474E;
				}

				.topic_card_title_bottom {
					font-size: 28upx;
					color: #929CA4;
				}
			}

			.topic_card_logo {
				// flex: 1;
				margin-right: 36upx;
				width: 100upx;
				height: 100upx;

				image {
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
	}

	/deep/.uni-searchbar__box {
		border: none;
	}
.searchBox{
	position: fixed;
	width: 87%;
	top: 0;
	z-index: 999999;

}
	.assistant_content {
		padding: 0 40upx;
	}
</style>
