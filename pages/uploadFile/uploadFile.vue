<template>
	<view>
		<web-view :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				url: '',
				webUrl: '',
				classId: '',
				chapterId: '',
				tagid: ''
			}
		},
		methods: {
			
		},
		onShow () {
			this.$data.token = uni.getStorageSync('token')
			this.$data.webUrl = `https://wx.gdbkyz.com/test/fileUpload/index.html?name=${this.$data.url}&tagid=${this.$data.tagid}&classId=${this.$data.classId}&chapterId=${this.$data.chapterId}&${this.$data.token}`
			console.log(this.$data.webUrl)
		},
		onLoad (option) {
			console.log(option)
			this.$data.url = option.name
			if (option.classId) {
				this.$data.classId = option.classId
				this.$data.chapterId = option.chapterId
			}
			if (option.tagid) {
				this.$data.tagid = option.tagid
			}
		}
	}
</script>

<style>

</style>
