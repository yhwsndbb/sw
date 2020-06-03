<template>
	<view class="resL_content">
		<view class="unisearch" style="margin-bottom: 10upx;">
			<uni-search-bar cancelButton='none' bgColor='#F0F1F3' placeholder="搜索关键字" :radius="100" @confirm="goSearch" @input='searchInput'></uni-search-bar>
		</view>
		<view class="ClassroomLog" @touchstart="onMakeRecordStart" @touchmove="onMakeRecordMove">
			<view class="" v-if="MakeRecordList.length!==0&&MakeRecordLoad=='loading'" style="padding-top: 50rpx;">
				<uni-load-more :status="MakeRecordLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
			</view>
			<view class="MakeList" v-for="(R,I) in MakeRecordList" :key='I' @click="onMakeInfo(R.ClassroomLogId)">
				<view class="MakeLeft">
					<view class="ClassRoom">
						{{R.ClassroomName}}
					</view>
					<view class="MakeTime">
						预约时间：{{R.CreateDatetime.substring(0, 16)}}
					</view>
				</view>
				<view class="MakeRight" :class="R.ReserveState==1||R.ReserveState==2?'green':'orange'">
					<view class="" v-if="R.ReserveState==1||R.ReserveState==2">
						预约成功
					</view>
					<view  v-if="R.ReserveState==5">
						已取消
					</view>
				</view>
			</view>
		</view>
		<view class="DataNo" v-if="MakeRecordList.length==0">
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
	import {
		uniSearchBar,uniLoadMore
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniSearchBar,
			uniLoadMore
		},
		data() {
			return {
				MakeRecordLoad:'',
				MakeRecordY:'',
				isSHow:true,
				MakeRecordList: [],
				currentPage: 1,
				pageSize: 10,
				searchValue: '',
				TotalPages: '',
				onPageY:''
			}
		},
		methods: {
			onMakeRecordStart(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.MakeRecordY = e.touches[0].clientY
					this.onPageY = e.touches[0].pageY
				}
			},
			onMakeRecordMove(e) {
				console.log(e)
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.MakeRecordY - moveY;
					// var onPageY = e.touches[0].pageY;
					if(this.onPageY<=100){
						if (disY == 355 || disY < 355) {
							this.$data.MakeRecordLoad = "loading"
							this.GetClassroomLogByPage()
						} else if (disY > 355) {
							this.$data.MakeRecordLoad = ""
						}
					}
					
				}
			},
			//查看预约详情信息
			onMakeInfo(ClassroomLogId){
				uni.navigateTo({
					url:'../MakeInfo/MakeInfo?ClassroomLogId='+ClassroomLogId
				})
			},
			onLoading(){
				this.GetClassroomLogByPage()
			},
			goSearch(){
				// uni.navigateTo({
				// 	url:'../searchTag/searchTag'
				// })
				this.GetClassroomLogByPage()
			},
			searchInput(e){
				this.$data.searchValue=e.value
				if(e.value==''){
					this.GetClassroomLogByPage()
				}
			},
			GetClassroomLogByPage() {
				var _that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetClassroomLogByPage',
					data: {
						currentPage: _that.$data.currentPage,
						pageSize: _that.$data.pageSize,
						searchValue: _that.$data.searchValue
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							var total = Math.ceil(result.RecordCount / _that.$data.pageSize)
							_that.$data.TotalPages = total
							var MakeArr = _that.$data.MakeRecordList
							var tempIndex = _that.$data.currentPage
							if (_that.$data.currentPage == 1) {
								MakeArr = result.Data
								console.log(MakeArr)
								tempIndex = 1
								uni.stopPullDownRefresh()
							} else {
								var lineList = res.data.Data
								MakeArr = MakeArr.concat(lineList)
								tempIndex = tempIndex + 1
							}
							_that.$data.MakeRecordList = MakeArr
							_that.$data.currentPage = tempIndex
							setTimeout(function() {
								_that.$data.MakeRecordLoad = ""
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
		},
		onReachBottom() {
			if (this.$data.currentPage < this.$data.TotalPages) {
				this.$data.currentPage++;
				this.GetClassroomLogByPage()


			} else {
				console.log('没有更多数据了')
			}
		},
		// 页面下拉刷新事件
		onPullDownRefresh() {
			this.$data.currentPage = 1;
			this.GetClassroomLogByPage()
		},
		onLoad(ops) {
			this.GetClassroomLogByPage()
		},
		onShow() {
			this.GetClassroomLogByPage()
		}

	}
</script>

<style lang="less" scoped>
	.ClassroomLog{
	
		.MakeList{
			background:#FFFFFF;
			box-shadow:0px 2px 22px 0px rgba(106,119,133,0.13);
			border-radius:6px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30upx;
			line-height: 60rpx;
			padding: 20rpx 40rpx;
			.MakeLeft{
				.ClassRoom{
					color:#40474E;
					font-size: 34upx;
				}
				.MakeTime{
					color: #929CA4;
					font-size: 25upx;
				}
			}
			.MakeRight{
				width:108upx;
				border-radius:22upx;
				color: #FFFFFF;
				font-size: 20upx;
				line-height: 40upx;
				text-align: center;
				padding: 0 6upx;
			}
			.orange {
				background: #FF9E18;
			}
			
			.green {
				background: #03C173;
			}
		}
	}
	.DataNo{
		margin: 300upx auto;
		text-align: center;
	}
	
	/deep/.uni-searchbar__box {
		border: none;
	}

	.resL_content {
		padding: 0 40upx;

	}
</style>
