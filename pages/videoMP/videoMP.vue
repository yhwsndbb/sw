<template>
	<view>
		 <video id="myVideo" :src="videoUrl" autoplay controls enable-play-gesture>
		 </video>
		 <scroll-view class="'scrollContainer' " scroll-x="true" scroll-with-animation="true" @scroll="getleft" v-if="videoArr.length>0">
		 	<view class="itemBg">
		 		<view class="coverView">
		 			<view class="imageBox" v-for="(V,D) in videoArr" :key='D' @click="getVideoSrc(V.Url)">
		 							 <image :src="V.Thumbnail"></image>
		 							 <view>{{V.ChannelName}}</view>
		 			</view>
		 		</view>
		 	</view>
		 </scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoContext:'',
				videoArr:[],
				videoUrl:'',
			}
		},
		methods: {
			getleft(e) {
				console.log(e)
			},
			getVideoSrc(Url){
				this.$data.videoUrl=Url
				this.$data.videoContext.play()
			}
		},
		  onReady (res) {
		    this.$data.videoContext = wx.createVideoContext('myVideo')
			 this.$data.videoContext.play()
		  },
		  onLoad(options) {
			  if(options.videoSrc){
				this.$data.videoUrl= options.videoSrc
			  }
			  if(options.videoArr){
				  var list = JSON.parse(options.videoArr)
				  this.$data.videoArr=list
				  this.$data.videoUrl=list[0].Url
			  }
			
		  }
	}
</script>

<style lang="less" scoped>
	.itemBg {
		display: inline-block;
	}
	.scrollContainer {
		position: absolute;
		white-space: nowrap;
		bottom: 10%;
		left: 10%;
		width: 80%;
		background-color: #555555;
		border-radius: 20upx;
	}

.coverView{
	display: flex;
	justify-content: space-between;
	font-size: 20upx;
	text-align: center;
	color: #FFFFFF;
	padding: 0 10upx;
	.imageBox{
		margin:20upx 10upx;
	}
	image{
		width: 200rpx;
		height: 100rpx;
		margin-bottom: 10upx;
	}
}
video{
	width: 100vw;
	height: 100vh;
}
</style>
