<template>
	<view class="addResource_content">
		<view class="unisearch" @click="onResouresList">
<uni-search-bar  bgColor='#F0F1F3' placeholder="搜索关键字" :radius="100" @confirm="search" @input='searchTag' ></uni-search-bar>
		</view>
		<view class="tagContent">
			<view class="">
				所有标签
			</view>
			<view class="tagBox" v-for="(item,i) in tagList" :key="i" @click="getTagInfo(item.TagId)">
{{item.TagName}}
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
				tagList:[],
				ChapterId:'',
				ClassId:''
			}
		},
		methods: {
			
			onResouresList(){
				uni.navigateTo({
					url:`../uploadResoures/uploadResoures?TagId=${''}&ChapterId=${this.$data.ChapterId}&ClassId=${this.$data.ClassId}`
				})
			},
			
			getTagInfo(TagId){
				uni.navigateTo({
					url:`../uploadResoures/uploadResoures?TagId=${TagId}&ChapterId=${this.$data.ChapterId}&ClassId=${this.$data.ClassId}`
				})
			},
			GetTagList(){
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ResourcesApp/GetTagList',
					data: {},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
							this.$data.tagList=result.Data
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
		onLoad(ops) {
			
			this.$data.ChapterId=ops.ChapterId
			this.$data.ClassId=ops.ClassId
			this.GetTagList()
		}
	}
</script>

<style lang="less" scoped>
	.tagContent{
		.tagBox{
			margin-top: 20upx;
			margin-right:20upx;
			padding: 0 26rpx;
			border-radius:50upx;
			border:2upx solid rgba(146,156,164,1);
			text-align: center;
			line-height:80rpx;
			display: inline-block;
			font-size: 28upx;
			color: #40474E;
			&:first-child{
				margin-left: 0;
			}
		}
	}
.addResource_content{
	padding: 0 30upx;
}
 /deep/.uni-searchbar__box {
		border: none;
		border-style: none !important;
	}
</style>
