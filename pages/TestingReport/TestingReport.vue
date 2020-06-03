<template>
	<view class="TestingRepor">
		<view class="testList" v-for="(item,index) in TestingReportList" :key="index" @click="onTestInfo(item.TestingLogId)">
			<view class="testLogoBox">
				<image class="textLogo" src="../../static/image/a5.png" mode="widthFix"></image>
			</view>
			<view class="testname">
				{{item.ChapterName}}
			</view>
		</view>
		<DataNo :DataList='TestingReportList' @onLoading='TestingLoading'></DataNo>
	</view>
</template>
<script>
	import DataNo from '@/components/DataNo.vue'
	 
	export default {
		components: {
			DataNo,
			},
		data() {
			return {
				TestingReportList:[],
				ChapterId:'',
				ClassroomLogId:''
			}
		},
		methods: {
			TestingLoading() {
				var that = this
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
			GetTestingReportList() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/MessageLogApp/GetTestingReportList',
					data: {
						chapterId: this.$data.ChapterId,
						classroomLogId:this.$data.ClassroomLogId
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
		},
		onLoad(ops) {
			this.$data.ChapterId=ops.ChapterId
			if(ops.ClassroomLogId){
				this.$data.ClassroomLogId=ops.ClassroomLogId
			}
			this.GetTestingReportList()
			
		}
	}
</script>

<style lang="less" scoped>
	.TestingRepor{
		padding:10rpx 40rpx;
	}
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
			.textLogo {
				width: 50upx;
				height: 50upx;
				vertical-align: middle;
			}
		}
	}
</style>
