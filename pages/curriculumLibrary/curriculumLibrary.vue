<template>
	<div class="cuContainer">
		<view class="searchContent">
			<view class="unisearch">
				<uni-search-bar cancelButton='none' bgColor='#F0F1F3' placeholder="搜索关键字" :radius="100" @input="searchList"></uni-search-bar>
			</view>
		</view>
		<view class="" style="margin-bottom:110rpx;"></view>
		
		<view class="pickerLeft">
			<picker value=""  mode="selector" @change="bindTermChange" :range="TermList" :range-key="'Name'">
				<view class="">{{seleTerm|| '请选择年级'}}</view>
			</picker>
			<image class="argImg" src="../../static/image/arg.png" mode=""></image>
		</view>
		<sideTab :datas='CurriculumsList' @tabClick='tabClick'>
			<template v-for="(item, index) in CurriculumsList">
				<div class="tabItem" :key="index" v-if="slected === index&&CurriculumsList.length!==0">
					<classItem :ChapterClassLog='ChapterClassLog' @TocurriculumInfo='TocurriculumInfo'></classItem>
				</div>
			</template>
		</sideTab>

	</div>
</template>

<script>
	import sideTab from '@/components/sideTab'
	import classItem from '@/components/classItem.vue'
	import {
		uniSearchBar
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			sideTab,
			classItem,
			uniSearchBar
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
			}
		},

		created() {
			this.selectedDatas.push(this.$data.ChapterClassLog[0])
		},
		methods: {
			searchList(e){
				console.log(e)
				this.$data.searchVal=e.value
				this.GetCurriculumsList()
			},
			TocurriculumInfo(ChapterId,ClassId,ClassroomLogId,ChapterName){
				uni.navigateTo({
					url:`../curriculumInfo/curriculumInfo?ChapterId=${ChapterId}&ClassId=${ClassId}&ClassroomLogId=${ClassroomLogId}&ChapterName=${ChapterName}`
				})
			},
			bindTermChange(e){
				console.log(e)
				var Item = this.$data.TermList[e.detail.value]
				this.$data.seleTerm=Item.Name
				this.$data.term=Item.TermYearData.Term
				this.$data.year=Item.TermYearData.Year
				this.GetCurriculumsList()
			},
			tabClick(index) {
				this.slected = index
				this.$data.CurriculumCode=this.$data.CurriculumsList[this.slected].CurriculumCode
				this.GetCurriculumsList()
				let arr = []
				arr.push(this.$data.ChapterClassLog[index])
				this.selectedDatas = arr
			},
			GetTerm() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/CurriculumApp/GetTerm',
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							this.$data.TermList=result.Data
							this.$data.seleTerm=result.Data[0].Name
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
								this.$data.CurriculumCode=''
							}
							this.GetChapterClassLog()
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
			GetChapterClassLog() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/CurriculumApp/GetChapterClassLog',
					data:{
						curriculumCode:this.$data.CurriculumCode,
						chapterName:this.$data.searchVal, //查询条件
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							this.$data.ChapterClassLog=result.Data
			
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
			this.GetTerm()
			this.GetCurriculumsList()
		}
	}
</script>

<style lang="less" scoped>
	.searchContent{
		position: fixed;
		width:750rpx;
		top: 0;
		z-index: 999999;
	}
 /deep/.uni-searchbar__box {
		border: none;
		border-style: none !important;
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
