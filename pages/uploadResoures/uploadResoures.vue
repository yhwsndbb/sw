<template>
	<div class="uploadResoures">
		<view class="searchBox">
			<view class="unisearch">
				<uni-search-bar bgColor='#F0F1F3' placeholder="搜索关键字" :radius="100" @confirm="search" @input='onSearcIpt'></uni-search-bar>
			</view>
		</view>
		<view class="" style="margin-bottom:60rpx;"></view>
		<view class="ulContent" v-for="(item, index) in bigList" :key="index">
			<ul>
				<li v-if="item.ResourceList.length!==0">
					<view class="classTitle" @click="onShowItem(index)" v-if="item.ResourceList.length!==0">
						<view class="">
							{{item.TagName}}
						</view>
						<image class="arrowImg" src="../../static/image/arrow_bottom.png" mode="widthFix" v-if="activeIndex==index"></image>
						<image class="arrowImg" src="../../static/image/arrow_top.png" mode="widthFix" v-else></image>
					</view>
					<view>
						<checkbox-group @change="checkboxChange">
							<label class="text_list" v-for="(s,ind) in item.ResourceList" :key='ind' v-if="activeIndex==index">
								<view class="textLogoBox">
									<image class="textLogo" v-if="s.FileSuffix=='txt'" src="../../static/image/txt.png" mode="widthFix"></image>
									<image class="textLogo" v-if="s.FileSuffix=='docx'" src="../../static/image/doc.png" mode="widthFix"></image>
									<image class="textLogo" v-if="s.FileSuffix=='xlsx'" src="../../static/image/xls.png" mode="widthFix"></image>
									<image class="textLogo" v-if="s.FileSuffix=='pdf'||s.FileSuffix=='pptx'||s.FileSuffix=='ppt'" src="../../static/image/ppt.png" mode="widthFix"></image>
									<image class="textLogo" v-if="s.FileType==2 || s.FileType==7" src="../../static/image/pht.png" mode="widthFix"></image>
									<image class="textLogo" v-if="s.FileType==3||s.FileType==6" src="../../static/image/video.png" mode="widthFix"></image>
									<image class="textLogo" v-if="s.FileType==5" src="../../static/image/proble.png" mode="widthFix"></image>
								</view>
								<view class="textname">
									{{s.ResourcesName}}
								</view>
								<view class="arrowIMg">
									<checkbox :value="s.ResourcesId" :checked="s.checked" />
								</view>
							</label>
						</checkbox-group>
					</view>　
				</li>
			</ul>
			<view class="DataNo" v-if="bigList.length==1">
				<DataNo :DataList='item.ResourceList' @onLoading='onLoading'></DataNo>
			</view>
		</view>
		<view class="btnBox">
			<view class="sbumitBtn">
			<!-- 	<view class="Nosubmit" @click="Nosubmit">
					取消
				</view> -->
				<view class="toSubmit" @click="SaveCoursewareResources">
					添加
				</view>
			</view>
		</view>

	</div>
</template>

<script>
	import {uniSearchBar} from '@dcloudio/uni-ui'
	import DataNo from '@/components/DataNo.vue'
	export default {
		components: {
			uniSearchBar,
			DataNo
		},
		data() {
			return {
				TagId:'',
				activeIndex: -1,
				ResourceList: [],
				bigList: [],
				ResourcesId:'',
				ChapterId:'',
				ClassId:'',
				searchValue:'',
			}
		},
		methods: {
			onLoading(){
				var that =this
				// that.$data.TagId = ''
				uni.showLoading({
				    title: '加载中',
					success() {
						that.GetTagResourcesList()
					}
				});
				setTimeout(function () {
				    uni.hideLoading();
				}, 2000);
			},
			search(){
				this.GetTagResourcesList()
			},
			onSearcIpt(e){
				this.$data.searchValue=e.value
				this.$data.TagId = this.$data.TagId
				this.GetTagResourcesList()
			},
			//保存课件关联资源/测试信息
			SaveCoursewareResources(){
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/SaveCoursewareResources',
					data: {
						ResourcesId:this.$data.ResourcesId,
						ChapterId:this.$data.ChapterId,
						ClassId: this.$data.ClassId,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							uni.showToast({
								title: '添加成功',
								duration:4000,
								success() {
									setTimeout(function () {
									   wx.navigateBack({
									     delta: 2
									   
									   })
									}, 2000);
									
								}
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
			Nosubmit(){
				uni.navigateTo({
					url:'../addResource/addResource'
				})
			},
			checkboxChange: function(e) {
				var items = this.$data.ResourceList
				let	values = e.detail.value;
				this.$data.ResourcesId=values.toString()
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (values.includes(item.value)) {
						this.$set(item, 'checked', true)
					} else {
						this.$set(item, 'checked', false)
					}
				}
			},
			GetTagResourcesList() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/GetTagResourcesList',
					data: {
						chapterId: this.$data.ChapterId,
						tagId: this.$data.TagId,
						classId: this.$data.ClassId,
						searchValue:this.$data.searchValue,
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							this.$data.bigList = result.Data
							for (let i in this.$data.bigList) {
								this.$data.ResourceList = this.$data.bigList[i].ResourceList
							}
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
			onShowItem(index) {
				this.$data.activeIndex = this.$data.activeIndex == index ? -1 : index
			}
		},
		onLoad(ops) {
			
			this.$data.ClassId = ops.ClassId
			this.$data.TagId = ops.TagId
			this.$data.ChapterId = ops.ChapterId
			this.GetTagResourcesList()
		}
	}
</script>

<style lang="less">
	.DataNo{
		margin: 300upx auto;
		text-align: center;
	}
	checkbox .wx-checkbox-input {
		border-radius: 50% !important;
		color: #ffffff !important;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		color: #fff;
		background: #39D696;
	}

	.wx-checkbox-input.wx-checkbox-input-checked {
		border: none !important;
	}
.btnBox{
	position: fixed;
	bottom: 1%;
}
	.sbumitBtn {
		width: 560rpx;
		text-align: center;
		line-height: 80upx;
		padding: 0 80upx;
		color: #929CA4;

		view {
			border-radius: 6px;
		}

		.Nosubmit {
			background-color: #F0F0F0;
		}

		.toSubmit {
			color: #FFFFFF;
			// opacity: 0.8;
			background-color: #03C173;
		}
	}

	.ulContent {
		padding:10rpx 40upx;
		// min-height: 76vh;
	}

	/deep/.uni-searchbar__box {
		border: none;
		border-style: none !important;
	}

	.bgc {
		background-color: #03C173 !important;
	}

	.uploadResoures {
		padding: 0 20upx;

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
	}


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
		width: 50upx;
		height: 50rpx;
		vertical-align: middle;
	}
</style>
