<template>
	<view>
		<view class="upload" @tap="upload()">
			上传图片
		</view>
		<image v-for="(item,index) in imgs" :src="item" mode="aspectFit" :key="index"></image>
		<button @tap="getUser">get all users</button>
	</view>
</template>

<script>
	import {searchUser} from '@/api/api.js'
	export default {
		data() {
			return {
				id: '6247f2d69cfc575104430b1d',
				imgs:[]
			};
		},
		methods:{
			getUser(){
				searchUser({data:'yike'}).then(res=>{
					console.log(res)
				})
			},
			upload(){
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						for(let i=0 ; i<tempFilePaths.length;i++){
							
							const uploadTask = uni.uploadFile({
								url: 'http://10.163.139.12:3000/files/upload', //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								name: 'file',
								formData: {
									url:'user',
									name: new Date().getTime() + this.id + i
								},
								success: (uploadFileRes) => {
									console.log(uploadFileRes.data)
									let path = 'user/' + uploadFileRes.data
									console.log('http://10.163.139.12:3000/'+path)
									this.imgs.push('http://10.163.139.12:3000/'+path)
									// console.log(this.imgs)
									// console.log(uploadFileRes.data);
								}
							});
							
							uploadTask.onProgressUpdate((res)=>{
								console.log('上传进度' + res.progress)
								console.log('已经上传的数据长度' + res.totalBytesSent)
								console.log('预计需要上传的数据总长度'+res.totalBytesExpectedToSend)
							})
						}
						
					},
					count:9,
					sizeType:['original','compressed'],
					sourceType:['album','camera']
				});
			}
		
		}
	}
</script>

<style lang="less" scoped>
.upload{
	padding-top: 40rpx;
	text-align: center;
}
</style>
