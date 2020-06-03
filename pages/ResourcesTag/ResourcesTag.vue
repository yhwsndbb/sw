<template>
	<view class="resL_content">
		<view class="searchBox">
			<view class="unisearch">
				<uni-search-bar cancelButton='none' bgColor='#F0F1F3' placeholder="搜索关键字" :radius="100" @confirm="goSearch" @input='searchInput'></uni-search-bar>
			</view>
		</view>
		<view class="" style="margin-bottom:90rpx;"></view>
		<view class="" style="margin-bottom:220rpx;" @touchstart="onResourcesStart" @touchmove="onResourcesMove">
			<view class="" v-if="ResourcesList.length!==0&&ResourcesLoad=='loading'" style="padding-top: 50rpx;">
				<uni-load-more :status="ResourcesLoad" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: ""}'></uni-load-more>
			</view>
			<view class="article_list" v-for="(item,index) in ResourcesList" :key="index">
				<view class="text_list" @click="OpenFile(item.ResourcesId,item.FileType)" :class="index==activeEdit?'activeEdit':''"
				 :data-index="index" @touchstart="onPanStart" @touchmove="onPanMove">
					<view class="textLogoBox">
					<image class="textLogo" v-if="item.FileSuffix=='txt'" src="../../static/image/txt.png" mode="widthFix"></image>
					<image class="textLogo" v-if="item.FileSuffix=='docx'" src="../../static/image/doc.png" mode="widthFix"></image>
					<image class="textLogo" v-if="item.FileSuffix=='xlsx'" src="../../static/image/xls.png" mode="widthFix"></image>
					<image class="textLogo" v-if="item.FileSuffix=='pdf'||item.FileSuffix=='pptx'|| item.FileSuffix=='ppt'" src="../../static/image/ppt.png" mode="widthFix"></image>
					<image class="textLogo" v-if="item.FileType==2 || item.FileType==7" src="../../static/image/pht.png" mode="widthFix"></image>
					<image class="textLogo" v-if="item.FileType==5" src="../../static/image/proble.png" mode="widthFix"></image>
					<image class="textLogo" v-if="item.FileType==3||item.FileType==6" src="../../static/image/video.png" mode="widthFix"></image>
					</view>
					<view class="textname">
						{{item.ResourcesName}}
					</view>
					<view class="arrowIMg">
						<image class="list_arrow" src="../../static/image/dot.png" mode="widthFix"></image>
					</view>
				</view>　
				<view class="edit-delete">
					<view class="ad-delete" @click="DeleteResources(item.ResourcesId)">
						<image src="../../static/image/del.png" mode="widthFix"></image>
						<view class="">
							删除
						</view>
					</view>
					<view class="ad-delete" @click="onEdit(item.ResourcesId,item.ResourcesType)">
						<image src="../../static/image/rechristen.png" mode="widthFix"></image>
						<view class="">
							重命名
						</view>
					</view>
					<view class="ad-delete" @click="onEditTag(item.ResourcesId,item.ResourcesType)">
						<image src="../../static/image/guanli.png" mode="widthFix"></image>
						<view class="">
							标签管理
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="editFileName" v-if="isEdit">
			<view class="edittitle">
				文件名修改
			</view>
			<view class="">
				<input @input="inputVal" class="textInpt" focus="true" type="text" value="" placeholder="请输入修改文件名"
				 placeholder-style="font-size:13px;color:#4A3C3C43;" />
			</view>
			<view class="editBtn">
				<view class="" @click="unhide">
					取消
				</view>
				<view style="border-left:1px solid #C0C0C0;" @click="RenameResources">
					确认
				</view>
			</view>
		</view>
	<DataNo :DataList='ResourcesList' @onLoading='onLoading'></DataNo>
	</view>
</template>

<script>
	import {
		uniSearchBar,uniLoadMore
	} from '@dcloudio/uni-ui'
	import DataNo from '@/components/DataNo.vue'
	const { request,showLoading,hideLoading} = require("../../static/request")
	export default {
		components: {
			uniSearchBar,
			DataNo,
			uniLoadMore
		},
		data() {
			return {
				TagId:'',
				fileType:'',
				ResourcesList: [],
				activeEdit: null,
				delBtnWidth: 400, //删除按钮宽度单位（rpx）
				startX: '',
				isEdit: false,
				currentPage: 1,
				pageSize: 10,
				searchValue: '',
				TotalPages: '',
				renameName: '',
				resourcesType: '',
				ResourcesY:'',
				ResourcesLoad:'',
				onPageY:''
			}
		},
		methods: {
			onResourcesStart(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置 clientY
					this.ResourcesY = e.touches[0].clientY
					this.onPageY = e.touches[0].pageY;
				}
			},
			onResourcesMove(e) {
				console.log(e)
				if (e.touches.length == 1) {
					var moveY = e.touches[0].clientY;
					var disY = this.ResourcesY - moveY;
					var onPageY = e.touches[0].pageY;
					if(this.$data.onPageY<210){
					              e.stopPropagation();//组织冒泡
					              
					              e.preventDefault();
					              // 正在loading的时候就不应该再次请求了
					              // disY为负数时，表示下拉刷新
					            if (disY < -80 && !this.$data.ResourcesLoad) { 
					              this.$data.ResourcesLoad = "loading"
					              this.GetResourcesByPage()
					            } else if (disY > 310) {
					              this.$data.ResourcesLoad = ""
					            }
					          }
					
					// if(this.onPageY<=150){
					// 	if (disY == 355 || disY < 355) {
					// 		this.$data.ResourcesLoad = "loading"
					// 		this.GetResourcesByPage()
					// 	} else if (disY > 355) {
					// 		this.$data.ResourcesLoad = ""
					// 	}
					// }
					
				}
			},
			onLoading(){
				var that = this
				uni.showLoading({
					title: '加载中',
					success() {
						that.GetResourcesByPage()
					}
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			},
			//标签管理
			onEditTag(ResourcesId,ResourcesType){
				uni.navigateTo({
					url:`../editTag/editTag?ResourcesId=${ResourcesId}&ResourcesType=${ResourcesType}`,
				})
				setTimeout(()=>{
					this.$data.activeEdit = null
				},4000) 
			},
			goSearch(){
				// uni.navigateTo({
				// 	url:'../searchTag/searchTag'
				// })
				this.GetResourcesByPage()
			},
			searchInput(e){
				this.$data.searchValue=e.value
				if(e.value==''){
					this.GetResourcesByPage()
				}
			},
			//重命名 
			RenameResources() {
				var _that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ResourcesApp/RenameResources',
					data: {
						resourcesId: _that.$data.resourcesId,
						resourcesType: _that.$data.resourcesType,
						renameName: _that.$data.renameName
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
								title: "修改成功",
								duration: 3000
							})
							_that.$data.isEdit = false

							_that.GetResourcesByPage()
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
			unhide() {
				this.$data.isEdit = false
				this.$data.activeEdit = null
			},
			onEdit(ResourcesId, ResourcesType) {
				this.$data.resourcesType = ResourcesType
				this.$data.resourcesId = ResourcesId
				this.$data.isEdit = true
			},
			inputVal(e) {
				this.$data.renameName = e.detail.value
			},
			//删除 
			DeleteResources(ResourcesId) {
				console.log(ResourcesId)
				var that = this
				wx.showModal({
					title: '提示',
					content: '确认要删除此课件吗？',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								method: 'GET',
								url: 'https://hk.joyfulboo.com/Campus/ResourcesApp/DeleteResources',
								data: {
									resourcesId: ResourcesId
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
											title: "删除成功",
											duration: 3000
										})
										that.GetResourcesByPage()
									} else {
										uni.showToast({
											title: result.Message,
											icon: 'none'
										})
										return false
									}
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			OpenFile(ResourcesId, FileType) {
				let _that = this
				if (FileType == 5) {
					uni.navigateTo({
						url: '../testInfo/testInfo?ResourcesId=' + ResourcesId
					})
				} else {
					uni.request({
						method: 'GET',
						url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/PreviewCoursewareOnline',
						data: {
							resourcesId: ResourcesId,
							isCurrent: false,
							classroomLogId: ''
						},
						header: {
							'content-type': "application/json",
							'Authorization': uni.getStorageSync('token'),
						},
						success: (res) => {
							console.log(res)
							let result = res.data
							if (result.Success == true) {
								// this.$data.CoursewareList=result.Data
								if (FileType == 1) {
									showLoading('加载中');
									wx.downloadFile({
										url: result.Data, //可以是后台传过来的路径
										success: function(res) {
											console.log(res)
											const filePath = res.tempFilePath
											wx.openDocument({
												filePath: filePath,
												success: function(res) {
													//成功
													hideLoading()
												}
											})
										}
									})
								} else if (FileType == 2) {
									var imgs = []
									imgs.push(result.Data)
									console.log(imgs)
									uni.previewImage({
										urls: imgs,
										current: imgs[0]
									})
								}  else if (FileType == 3) {
									uni.navigateTo({
										url:'../videoMP/videoMP?videoSrc=' + result.Data
									})
								}else if (FileType == 6) {
									var model = JSON.stringify(result.Data);
									uni.navigateTo({
										url:'../videoMP/videoMP?videoArr=' + model
									})
								} else if (FileType == 7) {
									_that.$data.playAudio = !_that.$data.playAudio
									let playAudio = _that.$data.playAudio
									if (playAudio) {
										wx.playBackgroundAudio({
											dataUrl: result.Data,
											title: '',
											coverImgUrl: ''
										})
									} else {
										wx.stopBackgroundAudio()
									}

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
				}
			},
			GetResourcesByPage() {
				var _that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ResourcesApp/GetResourcesByPage',
					data: {
						tagId: _that.$data.TagId,
						fileType: _that.$data.fileType,
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
							var resourcesList = _that.$data.ResourcesList
							var tempIndex = _that.$data.currentPage
							if (_that.$data.currentPage == 1) {
								resourcesList = result.Data
								console.log(resourcesList)
								tempIndex = 1
								uni.stopPullDownRefresh()
							} else {
								var lineList = res.data.Data
								resourcesList = resourcesList.concat(lineList)
								tempIndex = tempIndex + 1
							}
							_that.$data.activeEdit = null
							_that.$data.ResourcesList = resourcesList
							_that.$data.currentPage = tempIndex
							setTimeout(function() {
								_that.$data.ResourcesLoad = ""
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
			onPanStart(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX
				}
			},
			onPanMove(e) {
				if (e.touches.length == 1) {
					var moveX = e.touches[0].clientX;
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var index = e.currentTarget.dataset.index;
					if (disX == 120 || disX < 120) { //右滑动
						this.$data.activeEdit = null
						// txtStyle = "transform:translateX(0)";
					} else if (disX > 120) {
						this.$data.activeEdit = index
						// txtStyle = "transform:translateX(-" + disX + "px)";
						if (disX >= delBtnWidth) {
							this.$data.activeEdit = index
							// txtStyle = "transform:translateX(-" + delBtnWidth + "px)";
						}
					}
				}
			},
		},
		onReachBottom() {
			if (this.$data.currentPage < this.$data.TotalPages) {
				this.$data.currentPage++;
				this.GetResourcesByPage()


			} else {
				console.log('没有更多数据了')
				// uni.showToast({
				//   title: '没有更多数据了',
				//   icon: 'none'
				// });
			}
		},
		// 页面下拉刷新事件
		onPullDownRefresh() {
			this.$data.currentPage = 1;
			this.GetResourcesByPage()
		},
		onLoad(ops) {
			if(ops.FileType){
				this.$data.fileType=ops.FileType
			}
			if(ops.TagId){
				this.$data.TagId=ops.TagId
			}
			if(ops.searchValue){
				this.$data.searchValue=ops.searchValue
			}
			
			this.GetResourcesByPage()
		}

	}
</script>

<style lang="less" scoped>
	.addFileBox {
		// margin: 30rpx 0;
		z-index: 999;
		position: fixed;
		bottom: 3%;
		right: 14%;

		.addFileBth {
			width: 275px;
			height: 52px;
			background: rgba(3, 193, 115, 1);
			border-radius: 26px;
			color: #FFFFFF;
			margin: 0 auto;
			text-align: center;
			line-height: 100rpx;
		}
	}

	.editFileName {
		// margin: 100upx auto;
		z-index: 999;
		position: fixed;
		top: 32%;
		left: 16.5%;
		width: 520upx;
		height: 326upx;
		background: #F2F2F2;
		border-radius: 30upx;

		.edittitle {
			text-align: center;
			margin: 40upx 0 60upx 0;
			font-size: 34upx;
			color: #000;
		}

		.textInpt {
			margin: 40upx auto;
			width: 238px;
			background: #FFFFFFFF;
			border-radius: 12upx;
			border: 1px solid #F2F2F2;
			padding: 4upx 8upx
		}

		.editBtn {
			border-top: 1px solid #C0C0C0;
			display: flex;
			align-items: center;
			color: #007AFF;

			view {
				flex: 1;
				text-align: center;
				line-height: 88upx;
			}
		}
	}

	.activeEdit {
		transform: translateX(-400upx);
		transition: all 3s linear 1s
	}

	.article_list {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.edit-delete {
		position: absolute;
		bottom: -10%;
		right: 4%;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 300upx;
		text-align: center;
	}

	.ad-delete {
		font-size: 24upx;
		margin: 30upx 0;

		image {
			width: 60upx;
			height: 56upx;
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
		padding: 20upx 0;
		position: relative;
		width: 100%;
		z-index: 5;
		transition: left 0.2s ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		background-color: #FFFFFF;
		line-height: 100upx;
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



	.textLogo {
		width: 50upx;
		height: 50upx;
		vertical-align: middle;
	}


	/deep/.uni-searchbar__box {
		border: none;
	}

	.resL_content {
		padding: 0 40upx;

		.resf_card {
			margin: 30upx 0;
			padding: 28upx 0;
			line-height: 60upx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 2px 22px 0px rgba(106, 119, 133, 0.13);
			border-radius: 6px;
			color: #929CA4;
			font-size: 28upx;
			text-align: center;

			.resf_card_top {
				display: inline-block;
				// display: flex;
				// justify-content:center;
			}

			text {
				margin: 0 40upx;
			}
		}
	}
</style>
