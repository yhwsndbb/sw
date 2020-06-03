<template>
	<view class="AttendContent">
		<view class="AttendCard" @touchstart="onAttendStart" @touchmove="onAttendMove">
			<view class="" v-if="AttendInfoList.length!==0&&AttendLoad=='loading'" style="padding-top: 50rpx;">
				<uni-load-more :status="AttendLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
			</view>
			<view class="AttendList" v-for="(a,n) in AttendInfoList" :key='n'>
				<view class="AttendLogoBox">
					<image class="attimg" src="../../static/image/ilog.png" mode="widthFix"></image>
				</view>
				<view class="Attendname">
					{{a.StudentName}}
				</view>
				<view class="StatusBox">
					<view class="AttendStatus">
						<text v-if="a.AttendStatus=='异常'">未到</text>
					</view>
				</view>
			</view>
			<DataNo :DataList='AttendInfoList' @onLoading='onLoading'></DataNo>
		</view>
<!-- 		<view class="DataNo" v-if="AttendInfoList.length==0">
			<view class="">
				暂无数据
			</view>
			<view style="color: #007AFF;font-size: 28upx;" @click="onLoading">
				（点击刷新）
			</view>
		</view> -->
	</view>
</template>

<script>
	import DataNo from '@/components/DataNo.vue'
	import {uniLoadMore} from '@dcloudio/uni-ui'
	export default {
		components: {
			DataNo,
			uniLoadMore
		},
		data() {
			return {
				AttendInfoList:[],
				ClassroomLogId:'',
				attendStatus:'',
				ResourcesY:'',
				AttendLoad:'',
				AttendY:''
			}
		},
		methods: {
			onAttendStart(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.AttendY = e.touches[0].clientY
				}
			},
			onAttendMove(e) {
				console.log(e)
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.AttendY - moveY;
					var onPageY = e.touches[0].pageY;
					if(this.AttendY<100){
						if (disY == 355 || disY < 355) {
							this.$data.AttendLoad = "loading"
							this.GetAttendInfo()
						} else if (disY > 355) {
							this.$data.AttendLoad = ""
						}
					}
					
				}
			},
		onLoading(){
			var that = this
			uni.showLoading({
				title: '加载中',
				success() {
					that.GetAttendInfo()
				}
			});
			setTimeout(function() {
				uni.hideLoading();
			}, 2000);
		},
			//考勤人数详情
			GetAttendInfo(){
				var that=this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/AttendApp/GetAttendInfo',
					data: {
						classroomLogId:this.$data.ClassroomLogId,
						attendStatus:this.$data.attendStatus,
						studentName:'',
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let Res = res.data
						if (Res.Success == true) {
						this.$data.AttendInfoList=Res.Data
							setTimeout(function() {
								that.$data.AttendLoad = ""
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
			callMethods(obj) {
			  // obj.M[0].M, obj.M[0].A[0]
			  switch (obj.M[0].M) {
			    case 'pong':
			      console.log('Pong防止nginx中断连接');
			      break;
			    case 'xcxMessage':
			      console.log(obj.M[0].A[0]);
				  var messageList = obj.M[0].A[0]
				  if(messageList.MessageType==12){
					  this.GetAttendInfo()
				  }
			      break;
			  
			    default:
			      console.log(obj);
			  }
			},
		},
		onLoad(ops) {
			var that=this
			this.$data.ClassroomLogId=ops.ClassroomLogId
			this.$data.attendStatus=ops.attendStatus
			this.GetAttendInfo()
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
	.DataNo{
		margin: 300upx auto;
		text-align: center;
	}
	.AttendContent{
		padding:40upx
	}
	.AttendCard{
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 22px 0px rgba(106,119,133,0.13);
		border-radius:8px;
		min-height: 75vh;
		padding: 20rpx 40rpx;

	}
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
	}

</style>
