<template>
	<view>
        <editor id="editor" class="ql-container text-cyan radius"  @ready="onEditorReady" @input='contentChange' :read-only='false'></editor>
		<view class="addFileBox">
			<view class="addFileBth" @click="saveUpdate">
				保存修改
			</view>
		</view>
	</view>
</template>

<script>
	const {
		request,
		showLoading,
		hideLoading
	} = require("../../static/request")
	export default {
		data() {
			return {
				info: '123',
				id: ''
			}
		},
		methods: {
			getResInfo () {
				let _that = this
				uni.request({
					method: 'GET',
					url: 'https://hk.joyfulboo.com/Campus/CoursewareApp/PreviewCoursewareOnline',
					data: {
						resourcesId: _that.$data.id,
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
						showLoading('加载中');
						console.log('打开文件')
						wx.downloadFile({
							url: result.Data, //可以是后台传过来的路径
							success: function(res) {
								console.log(res)
								const filePath = res.tempFilePath
								wx.getFileSystemManager().readFile({
									filePath: filePath,
									encoding: 'utf-8',
									success: function(res) {
										console.log('readFile=' + res)
										console.log(res)
										var reg = new RegExp('/n', 'g')
										_that.$data.info = res.data
										//成功
										hideLoading()
									}
								})
							}
						})
					},
				})
			},
			//修改保存
			saveUpdate() {
				let _that = this;
				this.editorCtx.getContents({
					success(res){
						console.log(res);
						const File_Manager = wx.getFileSystemManager();//文件管理器,文件系统
						File_Manager.writeFileSync(`${wx.env.USER_DATA_PATH}/txtupdate2.txt`,res.text,'utf8');
						wx.uploadFile({
							method: 'GET',
							url:'https://hk.joyfulboo.com/Campus/ResourcesApp/CoverResources',
							filePath:`${wx.env.USER_DATA_PATH}/txtupdate2.txt`,
							name:'updatetxt',
							header:{
								'content-type':"multipart/form-data",
								'Authorization': uni.getStorageSync('token'),
							},
							formData:{
								'resourcesId': _that.$data.id,
							},
							success:res=>{
								uni.showToast({
									title:'修改保存成功',
									icon:'success',
									duration:2000,
									// success: function(){//保存成功返回
									// 	setTimeout(function(){
									// 		uni.navigateBack({
									// 		     delta: 1
									// 		   })
									// 	},1500)
									//   }
								})
							},
							fail:res=>{
								uni.showToast({
									title:'修改保存失败',
									icon:'none',
									duration:2000	
								})
							}
						})
					}	
				})
			},
			
			onEditorReady() {
			uni.createSelectorQuery().select('#editor').context((res) => {
				console.log(res)
				this.editorCtx =res.context;
				let content={
					html:this.$data.info
				}
					this.editorCtx.setContents(content);//设置富文本编辑器的内容
				}).exec()
			},
			contentChange(e){
				console.log(e.detail)
				this.$data.info = e.detail.html
			}
		},
		onLoad: function(options) {
			this.$data.id = options.id
			this.$data.info = uni.getStorageSync('txtInfo')
			// this.getResInfo()
	
		},
	}
</script>

<style>
editor {
	height: 1000rpx !important;
	margin: 0 20rpx;
}
	.addFileBox {
		// margin: 30rpx 0;
		z-index: 999;
		position: fixed;
		bottom: 3%;
		right: 14%;
	}

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
</style>
