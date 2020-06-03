<template>
	<div class="cuContainer">
	<!-- 	<view class="pickerLeft">
			<picker value=""  mode="selector" @change="bindTermChange" :range="TermList" :range-key="'Name'">
				<view class="">{{seleTerm|| '请选择年级'}}</view>
			</picker>
			<image class="argImg" src="../../static/image/arg.png" mode=""></image>
		</view> -->
		<sideTab :datas='CurriculumsList' @tabClick='tabClick'>
			<template v-for="(item, index) in CurriculumsList">
				<div class="tabItem" :key="index" v-if="slected === index&&CurriculumsList.length!==0">
					<view class="ChapterList" v-for="(J,I) in item.ChapterList" :key='J' @click="onChapterLog(J.ChapterId,item.CurriculumCode,J.ChapterName)">
						{{J.ChapterName}}
					</view>
				</div>
			</template>
		</sideTab>

	</div>
</template>

<script>
	import sideTab from '@/components/sideTab'
	import classItem from '@/components/classItem.vue'

	export default {
		components: {
			sideTab,
			classItem,
		},
		data() {
			return {
				ChapterClassLog:[],
				CurriculumsList:[],
				term:'',
				year:'',
				seleTerm:'',
				TermList:[],
				tabDatas: ['计算机', '大学英语'],
				slected: 0,
				selectedDatas: [],
				searchVal:'',
				CurriculumCode:'',
				ChapterId:'',
			}
		},

		created() {
			this.selectedDatas.push(this.$data.ChapterClassLog[0])
		},
		methods: {
		onChapterLog(ChapterId,CurriculumCode,ChapterName){
			console.log(ChapterId,CurriculumCode)
			// 返回上一页携带参数
			        let pages = getCurrentPages();
			        let prevPage = pages[pages.length - 2];
					// prevPage.$data.ChapterId=ChapterId
					// prevPage.$data.CurriculumCode=CurriculumCode
			        prevPage.setData({
			          CurriculumCode: CurriculumCode,
					  ChapterId:ChapterId,
					  ChapterName:ChapterName
			        })
			        setTimeout(() => {
			          wx.navigateBack({
			            delta: 1 //想要返回的层级
			          })
			        }, 1000)
		},
			tabClick(index) {
				this.slected = index
				this.$data.CurriculumCode=this.$data.CurriculumsList[this.slected].CurriculumCode
				this.GetCurriculumsList()
				let arr = []
				arr.push(this.$data.ChapterClassLog[index])
				this.selectedDatas = arr
			},

			//获取课程章节信息
			GetCurriculumsList() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/CurriculumApp/GetCurriculumsList',
					data:{
						curriculumName:this.$data.searchVal,
						year:this.$data.year,
						term:this.$data.term,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							this.$data.CurriculumsList=result.Data
							
							if(result.Data.length!==0){
								this.$data.CurriculumCode=result.Data[this.slected].CurriculumCode
							}else{
								this.$data.CurriculumCode==''
							}
							// this.GetChapterClassLog()
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
			this.GetCurriculumsList()
		}
	}
</script>

<style lang="less" scoped>
	.ChapterList{
		text-align: left;
		color: #40474E;
		border-bottom: 2upx #F8F8F8 solid;
		line-height: 98upx;
		padding-left: 40upx;
	}
	.cuContainer {
		.unisearch {
			padding: 0upx 40upx;
		}
		.pickerLeft{
			padding: 30upx 40upx;
			color:#03C173;
			display: flex;
			align-items: center;
			// position: absolute;
			// right: 4%;
			// top: 10%;
			.argImg{
				vertical-align: middle;
				margin-left: 20rpx;
				width: 18rpx;
				height: 14rpx;
			}
		}
		
	}
</style>
