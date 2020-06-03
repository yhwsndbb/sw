<template>
	<div class="classItem">
		<ul>
			<li v-for="(item, index) in ChapterClassLog" :key="index">
				<view class="classTitle" @click="onShowItem(index)">
					<view class="">
						{{item.ClassName}}
					</view>
					<image class="arrowImg" src="../static/image/arrow_bottom.png" mode="widthFix" v-if="activeIndex==index"></image>
					<image class="arrowImg" src="../static/image/arrow_top.png" mode="widthFix" v-else></image>
				</view>
				<view class="class_content" v-for="(s,ind) in item.ChapterClassroomLogList" :key='ind'  v-if="activeIndex==index" @click="TocurriculumInfo(s.ChapterId,item.ClassId,s.ClassroomLogId,s.ChapterName)">
					<view class="left_content">
						<view class="topTitle">
							{{s.ChapterName}}
						</view>
						<view class="time">
							{{s.StartTime || ''}}
						</view>
					</view>
					<view class="right_content">
						<view class="status_box" :class="s.ClassStatus=='未开始'||s.ClassStatus=='上课中'?'bgc':''">
							{{s.ClassStatus}}
						</view>
						<view class="classAddress">
							{{s.ClassroomName||''}}
						</view>
					</view>
				</view>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			ChapterClassLog: {
				type: Array
			}
		},
		data() {
			return {
				activeIndex:-1
			}
		},
		methods:{
			TocurriculumInfo(ChapterId,ClassId,ClassroomLogId,ChapterName){
				this.$emit('TocurriculumInfo',ChapterId,ClassId,ClassroomLogId,ChapterName)
			},
			onShowItem(index){
				this.$data.activeIndex = this.$data.activeIndex == index ? -1 :index
			}
		}
	}
</script>

<style lang="less" scoped>
	.bgc{
		background-color: #03C173 !important;
	}
	.classItem {
		padding: 0 38upx;
		margin-bottom: 40upx;
		width: 390upx;
		.classTitle {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30upx;
			margin-top: 30upx;
			.arrowImg {
				width: 20upx;
				height: 12upx;
			}
		}

		.class_content {
			font-size:24upx;
			color:rgba(146,156,164,1);
			
			padding:20upx;
			display: flex;
			justify-content: space-between;
			margin-top: 20upx;
			border-radius: 6px;
			border: 1px solid rgba(248, 248, 248, 1);
			.right_content{
				flex: 1;
				.status_box{
					color: #FFF;
					font-size: 20upx;
					padding: 0 10upx;
					line-height: 40upx;
					background:rgba(255,158,24,1);
					border-radius:22upx;
					margin-bottom: 24upx;
				}
				.classAddress{
					
				}
			}
			.left_content {
				text-align: left;
				flex: 3;
				margin-right: 10upx;
				.topTitle{
					font-size:30upx;
					color:rgba(64,71,78,1);
					margin-bottom: 24upx;
				}
				.time{
					
				}
			}
		}
	}
</style>
