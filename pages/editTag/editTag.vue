<template>
	<view class="addResource_content">
		<view class="">
			<view class="tagBox selectedTag" v-for="(item,i) in RelaTagList" :key="i" @click="getTagInfo(item.TagId, i)">
				{{item.TagName}}
			</view>
		</view>
		<view class="addTag">
			<input class="tabInput" type="text" value="" placeholder="添加标签" focus="true" @input="tabInputVal" @confirm="AddResourcesTag" />
		</view>
		<view class="tagContent">
			<view class="">
				所有标签
			</view>
			<view class="tagBox " :class="it.is ?'selectedTag': ''" v-for="(it,ind) in tagList" :key="ind" @click="AddTag(ind,it.TagId)">
				{{it.TagName}}
			</view>
		</view>
		<view class="addFileBox">
			<view class="addFileBth" @click="submitThis">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniSearchBar
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniSearchBar
		},
		data() {
			return {
				selectedTag: null,
				RelaTagList: [],
				tagList: [],
				ChapterId: '',
				ClassId: '',
				addTagName: '',
				// 已有的标签id （可更改）
				resTags: [],
				// 已有的标签id （不可更改）
				tagsRes: [],
				// 所有的标签id （可更改）
				bankTags: [],
				// 所有的标签id （不可更改）
				newBankTags: [],
				// 新增的tag
				addTags: [],
				// 删除的tag
				deleteTags: []
			}
		},
		methods: {
			AddResourcesTag() {
				var that = this
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/ResourcesApp/AddResourcesTag',
					data: {
						ResourcesId: that.$data.ResourcesId,
						TagName: that.$data.addTagName,
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
								duration: 3000
							})
							// this.$data.tagList=result.Data
							that.GetTagList()
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
			tabInputVal(e) {
				this.$data.addTagName = e.detail.value
			},
			onResouresList() {
				uni.navigateTo({
					url: `../uploadResoures/uploadResoures?TagId=${''}&ChapterId=${this.$data.ChapterId}&ClassId=${this.$data.ClassId}`
				})
			},
			getTagInfo (tag,indexs) {
				if (this.$data.bankTags.indexOf(tag) !== -1) {
				  if (this.$data.addTags.indexOf(tag) !== -1) {
					this.$data.addTags.splice(this.$data.addTags.indexOf(tag), 1)
				  }
				} else {
				  this.$data.tagsBank.push(this.$data.RelaTagList[indexs])
				  this.$data.bankTags.push(tag)
				}
				this.$data.RelaTagList.splice(indexs, 1)
				let index
				for (let k in this.$data.tagsRes) {
				  if (this.$data.tagsRes[k] === tag) {
					this.$data.deleteTags.push(tag)
					index = k
					break
				  }
				}
				this.$data.resTags.splice(indexs, 1)
				this.$data.tagList[this.$data.newBankTags.indexOf(tag)].is = false
			},
			AddTag(index, TagId) {
				//arr.indexOf(find,start);
				// console.log(index, TagId)
				// var resTags = this.$data.RelaTagList
				// var AllTags = this.$data.tagList
				// for(let R in AllTags){
				// 	var indexTag = AllTags[index].TagId
				// 	for(let I in resTags){
				// 		console.log(resTags[I].TagId,'res')
				// 		var res = resTags[I].TagId
				// 	}
				// 	console.log(res)
				// 	if (res.indexOf(indexTag) == -1) {
				// 		console.log('不等于-1')
				// 		resTags.push(AllTags[index])
				// 	} else {
				// 		console.log('-11')
				// 		// resTags.splice(index,1)
				// 		return false;
				// 	}
				// }
				
				// ----------------------------------------------------------------------
				if(this.$data.resTags.indexOf(TagId) !== -1) {
					// 如果在已有标签数组中，就删除该id，并在页面上表现
					this.$data.resTags.splice(this.$data.resTags.indexOf(TagId), 1)
				  if (this.$data.tagsRes.indexOf(TagId) !== -1) {
					  // 如果不在已有标签数组中，表示删除，则push到删除数组中
					  if (this.$data.deleteTags.indexOf(TagId) == -1) {
						this.$data.deleteTags.push(TagId)
					  } else {
						this.$data.deleteTags.splice(this.$data.deleteTags.indexOf(TagId), 1)
					  }
						  
				  } else {
					  // 如果不在已有标签数组中，表示增加，则push到增加数组中
					  if (this.$data.addTags.indexOf(TagId) == -1) {
						this.$data.addTags.push(TagId)
					  } else {
						this.$data.addTags.splice(this.$data.addTags.indexOf(TagId), 1)
					  }
				  }
				  // 删除或更改上下两组对象
					for (let jk in this.$data.RelaTagList) {
						if (this.$data.RelaTagList[jk].TagId === TagId) {
							this.$data.RelaTagList.splice(jk, 1)
						}
					}
					for (let j in this.$data.tagList) {
						if (this.$data.tagList[j].TagId === TagId) {
							this.$data.tagList[j].is = false
							return
						}
					}
				}
				// -------------------------------------------------------------------------
				
				
				if (this.$data.resTags.indexOf(TagId) == -1) {
				  this.$data.resTags.push(TagId)
				  this.$data.RelaTagList.push(this.$data.tagList[this.$data.newBankTags.indexOf(TagId)])
				  this.$data.tagList[this.$data.newBankTags.indexOf(TagId)].is = true
				}
			  if (this.$data.tagsRes.indexOf(TagId) == -1) {
				  if (this.$data.addTags.indexOf(TagId) == -1) {
					this.$data.addTags.push(TagId)
				  }
					  
			  }
			  if (this.$data.deleteTags.indexOf(TagId) !== -1) {
				this.$data.deleteTags.splice(this.$data.deleteTags.indexOf(TagId), 1)
			  }
			},
			GetResourcesTag() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ResourcesApp/GetResourcesTag',
					data: {
						resourcesId:this.$data.ResourcesId,
						resourcesType:this.$data.ResourcesType
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							this.$data.tagList = result.Data.AllTagList
							for(let Id in this.$data.tagList){
								this.$data.tagList[Id]
							}
							this.$data.RelaTagList = result.Data.RelaTagList
							for (let i in this.$data.RelaTagList) {
							  this.$data.resTags.push(this.$data.RelaTagList[i].TagId)
							  this.$data.tagsRes.push(this.$data.RelaTagList[i].TagId)
							}
							for (let i in this.$data.tagList) {
							  this.$data.bankTags.push(this.$data.tagList[i].TagId)
							  this.$data.newBankTags.push(this.$data.tagList[i].TagId)
							  for (let k in this.$data.RelaTagList) {
								  if (this.$data.RelaTagList[k].TagId === this.$data.tagList[i].TagId) {
									  this.$data.tagList[i].is = true
								  }
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
			},
			submitThis () {
				let self = this.$data
				let addTags = [...new Set(self.addTags)]
				let deleteTags = [...new Set(self.deleteTags )]
				let newaddTags = []
				let newdeleteTags = []
				// for (let i in self.resTags) {
				for (let k in addTags) {
				  if (self.tagsRes.indexOf (addTags[k]) === -1) {
				    newaddTags.push(addTags[k])
				  }
				}
				for (let j in deleteTags) {
				  if (self.tagsRes.indexOf(deleteTags[j]) !== -1) {
				    newdeleteTags.push(deleteTags[j])
				    if (self.addTags.indexOf(deleteTags[j]) !== -1) {
				      newdeleteTags.splice(newdeleteTags.indexOf(deleteTags[j]), 1)
				    }
				  }
				}
				console.log(newaddTags)
				console.log(newdeleteTags)
				
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/ResourcesApp/SaveResourcesTag',
					data: {
						ResourcesId: self.ResourcesId,
						AddTagIds: newaddTags.toString(),
						DelTagIds:newdeleteTags.toString(),
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
								title: '保存成功',
								duration: 3000
							})
							setTimeout(()=>{
								wx.navigateBack({
									delta: 1,
								})
							},3000)
							
							
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
		onLoad(ops) {
			this.$data.ResourcesId = ops.ResourcesId
			this.$data.ChapterId = ops.ChapterId
			this.$data.ClassId = ops.ClassId
			this.$data.ResourcesType = ops.ResourcesType
			this.GetResourcesTag()
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
	.selectedTag {
		border: 2upx solid #03C173 !important;
		color: #03C173 !important;
	}

	.tabInput {
		background-color: #F0F1F3;
		width: 140rpx;
		padding: 20rpx 10rpx 20rpx 30rpx;
		border-radius: 50rpx;
		margin: 40rpx 0;
	}

	.tagBox {
		margin-top: 20upx;
		margin-right: 20upx;
		width: 180upx;
		height: 80upx;
		border-radius: 50upx;
		border: 2upx solid rgba(146, 156, 164, 1);
		text-align: center;
		line-height: 80upx;
		display: inline-block;
		font-size: 28upx;
		color: #40474E;

		&:first-child {
			margin-left: 0;
		}
	}

	.addResource_content {
		padding: 0 30upx;
	}

	/deep/.uni-searchbar__box {
		border: none;
		border-style: none !important;
	}
</style>
