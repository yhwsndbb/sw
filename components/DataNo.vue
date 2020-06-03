<template>
	<view>
		<view class="DataNo" v-if="DataList.length==0||DataList==null">
			<view class="">
				暂无数据
			</view>
			<view style="color: #007AFF;font-size: 28upx;" @click="onLoading">
				（点击刷新）
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			DataList: {
				type: Array
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			onLoading(){
				this.$emit('onLoading',)
			},
		}
	}
</script>

<style>
	.DataNo{
		margin: 300upx auto;
		text-align: center;
	}
</style>
