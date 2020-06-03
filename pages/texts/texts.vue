<template>
	<view>
		<button type="primary" @tap='getSignalR'>访问signalR</button>
				<button type="primary" @tap='openWebSocket'>打开websocket</button>
				<input type="text" v-model="msg" placeholder="请输入消息"/>
				<button type="primary" @tap='sendMsg()'>发送</button>
		 
				<view>
					<view v-for="item in result">
						<text>{{item}}</text>
					</view>
				</view>

	</view>
</template>

<script>
	const signalR = require('../../static/websocketFive.js');
	const app = getApp()
	let _singalR=new signalR.signalR()
		export default {
			data() {
				return {
					result: [],
					socketOpen:false,
					msg:"",
					websocketData: {},
					
					
				}
			},
			onLoad() {
				_this = this;
				// 创建SocketTask
			},
			// onReady() {
			// 	let _that=this
			// 	_singalR.connection('https://hk.joyfulboo.com',200,null)
			// },
			methods: {
				getSignalR() {
					let url = 'https://hk.joyfulboo.com'
					uni.request({
						url: url, 
						data: {
							// text: 'uni.request'
						},
						header: {
						'content-type': "application/json",
						'Authorization': uni.getStorageSync('token'),
						},
						success: (res) => {
							console.log(res);
							_this.websocketData = res.data;
							_this.result.push( 'request success');
						}
					});
				},
				openWebSocket() {
					let token = encodeURIComponent(_this.websocketData.ConnectionToken)
					let url = ''
					console.log(url)
					uni.connectSocket({
						url: url
					});
					uni.onSocketOpen(function(res) {
						console.log(res);
						_this.socketOpen = true;
						console.log('WebSocket连接已打开！');
						_this.result.push("WebSocket连接已打开！");
					});
					uni.onSocketError(function(res) {
						console.log(res);
						_this.result.push('WebSocket连接打开失败，请检查！')
						console.log('WebSocket连接打开失败，请检查！');
					});
	 
					uni.onSocketMessage(function(res) {
						_this.result.push('收到服务器内容：' + res.data );
	 
						console.log('收到服务器内容：' + res.data);
					});
					
				},
				
				sendMsg(){
					if(!_this.socketOpen)
						return;
						
					uni.sendSocketMessage({
						data: _this.msg
					});
				}
			}
		}

</script>

<style>

</style>
