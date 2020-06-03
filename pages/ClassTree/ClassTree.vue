<template>
	<div class="cuContainer">
		<sideTab :datas='CurriculumsList' @tabClick='tabClick'>
			<template v-for="(item, D) in CurriculumsList">
				<div class="tabItem" :key="D" v-if="slected === D&&CurriculumsList.length!==0">
				<view class="ulContent">
					<ul>
						<li v-for="(it, index) in item.Children" :key="index">
							<view class="classTitle" @click="onShowItem(index)">
								<view class="">
									{{it.Name}}
								</view>
								<image class="arrowImg" src="../../static/image/arrow_bottom.png" mode="widthFix" v-if="activeIndex==index"></image>
								<image class="arrowImg" src="../../static/image/arrow_top.png" mode="widthFix" v-else></image>
							</view>
							<view>
								<radio-group @change="radioChange">
									<label class="text_list" v-for="(s,ind) in it.Children" :key='ind' v-if="activeIndex==index">
										<view class="textname">
											{{s.Name}}
										</view>
										<view class="arrowIMg">
											<radio :value="[s.Name,s.Id]" :checked="s.checked" color="#39D696"/>
										</view>
									</label>
								</radio-group>
							</view>　
						</li>
					</ul>
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
				CurriculumsList:[],
				seleTerm:'',
				TermList:[],
				slected: 0,
				selectedDatas: [],
				activeIndex: -1,
				TeachClass:'',
				TeachClassId:'',
				
			}
		},

		created() {
			this.selectedDatas.push(this.$data.ChapterClassLog[0])
		},
		methods: {
			  radioChange: function (e) {
			    console.log('radio发生change事件，携带value值为：', e.detail.value)
				var valArr = e.detail.value
				var newArr = []
				newArr = valArr.split(",");
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.setData({
				  TeachClass: newArr[0],
				  TeachClassId:newArr[1],
				})
				setTimeout(() => {
				  wx.navigateBack({
				    delta: 1 //想要返回的层级
				  })
				}, 1000)
			  },
			onShowItem(index) {
				this.$data.activeIndex = this.$data.activeIndex == index ? -1 : index
			},
			tabClick(index) {
				this.slected = index
				// this.$data.CurriculumCode=this.$data.CurriculumsList[this.slected].CurriculumCode
				this.GetClassTree()
				// let arr = []
				// arr.push(this.$data.ChapterClassLog[index])
				// this.selectedDatas = arr
			},

			//获取班级信息
			GetClassTree() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassesApp/GetClassTree',
					data:{
						level:'subject',
						chapterId:'e6561742-3ced-4402-b8e2-1f2abced28e2',
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
			this.GetClassTree()
		}
	}
</script>

<style lang="less" scoped>	
	.list_arrow {
		width: 28upx;
		height: 20upx;
	}
	
	.text_list .textname {
		flex: 9;
		margin-left: 40upx;
		margin-right: 30upx;
		overflow: hidden;
	}
	
	.text_list {
		width: 100%;
		transition: left 0.2s ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		background-color: #FFFFFF;
		line-height: 130upx;
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
		}
	}
	
	.text_list .textLogo {
		width: 40upx;
	}
	.classTitle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10upx;
		border-bottom: #F8F8F8 solid 2upx;
		padding: 30upx 0;
		// margin-top: 30upx;
	
		.arrowImg {
			width: 20upx;
			height: 12upx;
		}
	}
	.ulContent {
		padding: 40upx;
		min-height: 76vh;
	}
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
