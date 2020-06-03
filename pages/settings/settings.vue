<template>
	<view class="settings_content">
		<view class="student_list" v-for="(item,index) in EquipmentList" :key="index">
			<view class="SettingList" v-if="item.Items.length!==0"  >
				<view class="text_list" @click="onShowItem(index)">
					<image class="textLogo" src="../../static/image/mubu.png" mode="widthFix"></image>
					<view class="textname">
						<view class="">
							{{item.Name}}
						</view>
					</view>
					<view class="imgBox" :checked='isShow.checked'>
						<image v-if="showIndex==index" class="arrow_bottom" src="../../static/image/arrow_bottom.png" mode="widthFix"></image>
						<image v-else class="arrow_bottom" src="../../static/image/arrow_top.png" mode="widthFix"></image>
					</view>
				</view>　
				<view class="" v-if="showIndex==index">
					<view class="hide_list" >
						<view class="textname">
							<view class="">
								全部
							</view>
						</view>
						<view class="" @click="BatchUpdateEquipmentStatus(item.Key,item.selected)">
							<image v-if="item.selected" class="list_arrow" src="../../static/image/close.png" mode="widthFix"></image>
							<image v-else class="list_arrow" src="../../static/image/close1.png" mode="widthFix"></image>
						</view>
						
					</view>
					<view class="hide_list" v-for="(S,I) in item.Items" :key="I">
						<view class="textname">
							<view class="">
								{{S.Core}}
							</view>
						</view>
						<view class="" @click="UpdateEquipmentStatus(S.Value,S.Core)">
							<image v-if="S.Value==2||S.Value==1" class="list_arrow" src="../../static/image/close.png" mode="widthFix"></image>
							<image v-else class="list_arrow" src="../../static/image/close1.png" mode="widthFix"></image>
						</view>
						
					</view>
				</view>
			</view>
		
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showIndex:-1,
				EquipmentList:[],
				ClassroomCode:'',
				sta:''
			}
		},
		methods: {
			// 批量修改教室设备状态
			BatchUpdateEquipmentStatus(key,selected){
				console.log('批量',key)
				let State = ''
				if (selected) {
					State = 'close'
				} else {
					State = 'open'
				}
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/BatchUpdateEquipmentStatus',
					data: {
						ClassroomCodes:this.$data.ClassroomCode,
						DeviceTypeCodes:key,
						DeviceState:State
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
								title: result.Message,
								icon: 'none'
							})
							this.GetEquipmentList()
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
			 // 单个修改教室设备状态
			UpdateEquipmentStatus(Value,Core){
				console.log('单个',Value)
				let deviceState = ''
				if (Value == 2||Value == 1) {
					deviceState = 'close'
				} else {
					deviceState = 'open'
				}
				uni.request({
					method: 'POST',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/UpdateEquipmentStatus',
					data: {
					ClassroomCodes:this.$data.ClassroomCode,
					DeviceTypeCodes:Core,
					DeviceState:deviceState
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
								title: result.Message,
								icon: 'none'
							})
							this.GetEquipmentList()
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
			//获取设备列表
			GetEquipmentList(){
				var self =this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/EquipmentApp/GetEquipmentList',
					data: {
						classroomCodes:this.$data.ClassroomCode
					},
					header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res)
						let result = res.data
						if (result.Success == true) {
						var Arr=result.Data[0].Data
						for(let J in Arr){
						var I =	Arr[J]
						var valArr = []
						for(let E in I.Items){
							valArr.push(I.Items[E].Value)
							if(valArr.indexOf('1')!==-1||valArr.indexOf('2')!==-1){
								 	Arr[J]['selected'] = true
							}else{
								Arr[J]['selected'] = false
							}
						}
						}
						this.$data.EquipmentList=Arr
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
		onShowItem(index){
			this.$data.showIndex = this.$data.showIndex == index ? -1 :index
		}

		},
		onLoad(ops) {
			this.$data.ClassroomCode=ops.ClassroomCode
			this.GetEquipmentList()
		}
	}
</script>

<style scoped lang="less">
	.arrow_bottom {
		width: 18upx;
		height: 20upx;
	}

	.student_list {
		color: #000000;
	}

	.student_content {
		background-color: #FFFFFF;
		margin-top: 40upx;
		font-size: 30upx;
		color: #40474E;
	}

	.list_arrow {
		width: 64upx;
		height: 64upx;
	}

	.text_list .textname {
		flex: 1;
		color: #40474E;
		font-size: 32upx;

		.status_display {
			color: #929CA4;
			font-size: 24upx;
		}
	}

	.hide_list {
		background-color: #F8F8F8;
		color: #40474E;
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx 80upx;
	}

	.text_list {
		padding: 32upx 80upx;
		line-height: 68rpx;
		border-bottom: #F8F8F8 solid 2upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		font-weight: 400;
		color: #40474E;

		.imgBox {
			// flex: 1;
			width: 10%;
			text-align: center;
		}

		.temperature {
			flex: 2;
			text-align: center;

			.temperatureNum {
				padding: 0 40upx;
				color: #929CA4;
				font-size: 42upx;
			}

			image {
				display: inline-block;
				width: 24upx;
				height: 34upx;
			}
		}
	}

	.text_list .textLogo {
		width: 44upx;
		height: 44upx;
		margin-right: 40upx;
	}

	.settings_content {
		// padding: 40upx 20upx;
	}
</style>
