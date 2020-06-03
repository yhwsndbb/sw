<template>
	<view class="analyze_content">
		<view class="" style="text-align: center;margin-bottom: 20upx;">
			题目总数量:{{QuestionData.TotalCount}}
		</view>
		<view class="topic_content cardBgc">
			<view class="singleChoice">
				{{QuestionList[id].TypeStr || '选择题'}}
			</view>
			<view class="topic_info">
				<view class="">
					{{QuestionList[id].Topic || ''}}
				</view>
			<view class="option" v-for="(item,index) in QuestionList[id].Items" :key='index'>
				<view class="optionTitle">
					<image class="optionImg" :src="QuestionList[id].RightAnswer==1||QuestionList[id].StudentAnswer==1?'../../static/image/A3.png':'../../static/image/A1.png'" mode="widthFix" v-if="item.Id==1"></image>
					<image class="optionImg" :src="QuestionList[id].RightAnswer==2||QuestionList[id].StudentAnswer==2?'../../static/image/B3.png':'../../static/image/B1.png'" mode="widthFix" v-if="item.Id==2"></image>
					<image class="optionImg" :src="QuestionList[id].RightAnswer==2||QuestionList[id].StudentAnswer==3?'../../static/image/C3.png':'../../static/image/C1.png'" mode="widthFix" v-if="item.Id==3"></image>
					<image class="optionImg" :src="QuestionList[id].RightAnswer==4||QuestionList[id].StudentAnswer==4?'../../static/image/D3.png':'../../static/image/D1.png'"  mode="widthFix" v-if="item.Id==4"></image>
				</view>
				<view class="optionName">
					{{item.Content}}
				</view>
				
			</view> 
			
			</view>
		</view>
		<view class="topicAnalysis cardBgc">
			<view class="content_title">
				<view class="green"></view>
				题目解析
			</view>
			<view class="topicAnalysis_info">
				{{QuestionList[id].Explain || ''}}
			</view>
		</view>
		<view class="operation">
			<view class="left_btn" @click="lastQuestion">
				<image class="list_arrow" src="../../static/image/left.png" mode=""></image>
				向左滑动上一题
			</view>
			<view class="right_btn" @click="nextQuestion">
				向右滑动下一题
				<image class="list_arrow" src="../../static/image/right.png" mode=""></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:0,
				ResourcesId:'',
				QuestionList:[],
				QuestionData:{},
				
			}
		},
		methods: {
			nextQuestion: function () {
			    var that = this;
			    if (that.$data.id < that.QuestionList.length-1) {
					that.$data.id=that.$data.id + 1
			      // this.setData({
			      //   id: that.data.id + 1
			      // });
			    }
			  },
			  lastQuestion: function () {
			    var that = this;
			    if (that.$data.id > 0) {
			     
			        that.$data.id=that.$data.id - 1
			     
			    }
			  },
			GetTestingQuestionInfo() {
					// 获取
					uni.request({
						method: 'GET',
						url: 'https://hk.joyfulboo.com/Campus/TestingApp/GetTestingQuestionInfo',
						data: {
							testPaperId:this.$data.ResourcesId,
						},
						header: {
							'content-type': "application/json",
							'Authorization': uni.getStorageSync('token'),
						},
						success: (res) => {
							console.log(res)
							let result = res.data
							if (result.Success == true) {
								this.$data.QuestionData=result.Data.TestPaperData
							this.$data.QuestionList=result.Data.QuestionList
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
		onShow() {
			this.GetTestingQuestionInfo()
		},
		onLoad(ops) {
			this.$data.ResourcesId = ops.ResourcesId
			this.$forceUpdate();
			this.GetTestingQuestionInfo()
		}
	}
</script>

<style scoped lang="less">
	.operation{
		display: flex;
		justify-content: space-between;
		color: #C3CCD4;
		font-size: 30upx;
		padding: 80upx 36upx;
		.list_arrow {
			margin: 0 20upx;
			width:14upx;
			height: 16upx;
		}
		}
	.topicAnalysis{
		padding: 40upx 20upx 80upx 40upx;
		.topicAnalysis_info{
			font-size: 32upx;
		}
	}
	.content_title {
		line-height: 88upx;
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
	.cardBgc{
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 22px 0px rgba(106,119,133,0.13);
		border-radius:12upx;
		margin-bottom: 30upx;
		}
.analyze_content{
	padding:40upx;
	color: #40474E;
	font-size: 34upx;
	.topic_content{
		padding: 48upx 0;
		.option{
			margin-top: 40upx;
			.optionName{
				display: inline-block;
				color: #40474E;
				font-size: 30upx;
				
			}
			.optionTitle{
				display: inline-block;
				vertical-align: middle;
				margin-right: 20upx;
				.optionImg{
					width: 72upx;
					height: 72upx;
				}
			}
		}
		.topic_info{
			padding: 40upx;
		}
		.singleChoice{
			padding-left: 20upx;
			color: #FFFFFF;
			font-size: 24upx;
			width:106upx;
			line-height: 48upx;
			background:#FF9E18;
			border-radius:0px 200upx 200upx 0px;
		}
	}
}
</style>
