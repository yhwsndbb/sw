<template>
	<view class="questionAsk_content">
		<view class="questionAsk_header" v-if="IssueLogList.length!==0">
			<view class="class_name">
				{{ChapterName}}
			</view>
			<view class="class_grade">
				班级：<text>{{TeachClass}}</text>
			</view>
		</view>
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
		<view class="DataNo" v-if="IssueLogList.length==0">
			<view class="">
				暂无数据
			</view>
			<view style="color: #007AFF;font-size: 28upx;" @click="onLoading">
				（点击刷新）
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				IssueLogList: [],
				showInput: false,
				Content: '',
				ParentId: '',
				RecordCount:'',
				ClassroomLogId:'',
				ChapterId:'',
				TeachClassId:'',
				ChapterName:'',
				TeachClass:'',
			}
		},
		methods: {
			onLoading(){
				this.GetIssueLogList()
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
			GetIssueLogList() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/IssueApp/GetIssueLogList',
					data: {
						classroomLogId: this.$data.ClassroomLogId,
						chapterId: this.$data.ChapterId,
						classId: this.$data.TeachClassId,
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
		},
		onLoad(ops) {
			this.$data.ClassroomLogId = ops.ClassroomLogId
			this.$data.ChapterId=ops.ChapterId
			this.$data.ChapterName=ops.ChapterName
			this.$data.TeachClass=ops.TeachClass
			this.GetIssueLogList()
		}
	}
</script>

<style lang="less">
	.problem_content .problem_card {
		margin-top: 20upx;
		padding: 40upx 40upx 20upx 40upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 22px 0px rgba(106, 119, 133, 0.13);
		border-radius: 12upx;

		.answer_info {
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
			font-size: 20upx;
			text-align: center;
			line-height: 40upx;
			width: 36px;
			height: 20px;

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

	.problem_content {
		margin-top: 10upx;
	}

	.questionAsk_content {
		padding: 30upx 38upx;

		.questionAsk_header {
			display: flex;
			justify-content: space-between;
			align-items: center;

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
