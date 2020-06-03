<template>
	<view class="prepareLessons_content">
		<view class="prepareLessons_title">
			智能备课
		</view>
		<view class="prepareLessons_card">
			<view class="card_list" v-for="(item,index) in prList" :key="index" @click="nextPage(index)">
				<view class="pl_title">
					<view class="pl_name">
						{{item.pl_name}}
					</view>
					<view class="pl_info">
						{{item.pl_info}}
					</view>
				</view>
				<view class="pl_logo">
					<image class="pl_img" :src="item.pl_img" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ClassroomCode:'',
				ClassStats:'',
				prList:[
					{
						pl_name:'课程库',
						pl_info:'管理与编辑课件',
						pl_img:'../../static/image/curriculum.png'
					},
					{
						pl_name:'资源库',
						pl_info:'课件与测试题管理',
						pl_img:'../../static/image/resource.png'
					},
					{
						pl_name:'课室预约',
						pl_info:'在线预约课室',
						pl_img:'../../static/image/order.png'
					},
					{
						pl_name:'中控管理',
						pl_info:'精细控制',
						pl_img:'../../static/image/control.png'
					}
				]
			}
		},
		methods: {
			nextPage(i){
				let URL = ''
				if(i==0){
					URL = '../curriculumLibrary/curriculumLibrary'
				}else if(i==1){
					URL='../resourceLibrary/resourceLibrary'
				}else if(i==2){
					URL='../makeClass/makeClass'
				}else if(i==3){
					if( this.$data.ClassStats!==2){
						uni.showToast({
							title: '课程还未开始，无法控制！',
							icon: 'none'
						})
						return
					}else{
						URL='../settings/settings?ClassroomCode='+this.$data.ClassroomCode
					}
				}
				uni.navigateTo({
					url:URL
				})
			},
			GetClassInfo() {
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/ClassroomLogApp/GetCurrentClass',
					data: {},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let Res = res.data
						if (Res.Success == true) {
							// this.$data.CurrentClass = Res.Data
						    this.$data.ClassStats = Res.Data.ClassStatus
						    this.$data.ClassroomCode = Res.Data.ClassroomCode
						} else {
							uni.showToast({
								title: Res.Message,
								icon: 'none'
							})
							return false
						}
					}
				})
			},
		},
		onLoad() {
			this.GetClassInfo()
		},
		onShow() {
			this.GetClassInfo()
		}
	}
</script>

<style lang="less" scoped>
.prepareLessons_content{
	padding: 0 40upx;
	color: #40474E;
	.prepareLessons_title{
		font-size: 48upx;
		line-height: 66upx;
		margin-bottom: 10upx;
		}
		.prepareLessons_card{
			.card_list{
				margin-top: 20upx;
				padding: 80upx 60upx 80upx 40upx;
				background-color: #F8F8F8;
				border-radius: 12upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.pl_logo{
					.pl_img{
						width: 100upx;
						height: 100upx;
					}
				}
				.pl_title{
					line-height: 52upx;
					.pl_name{
						font-size: 40upx;
					}
					.pl_info{
						color: #929CA4;
						font-size: 26upx;
					}
				}
			}
		}
}
</style>
