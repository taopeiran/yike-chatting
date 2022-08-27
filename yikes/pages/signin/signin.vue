<template>
	
	<view>
		<view style="height: var(--status-bar-height);"></view>
		<view class="top-bar">
			<view class="top-bar-right">
				<view class="text" @tap="signupNavigation">
					注册
				</view>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/signin_up/huohuo.png"></image>
		</view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好，欢迎来到 yike!</view>
			<view class="inputs">
				<input type="text" :value="body.user" placeholder="用户名/邮箱" @blur="getUser($event)"/>
				<input type="password" :value="body.psw" placeholder="密码" @blur="getPassword($event)"/>
			</view>
			<view class="tips" v-if="isshow">输入用户名或密码错误！</view>
		</view>
		<view class="submit">
			<view class="submit-button" @tap="login()">
				登录
			</view>
		</view>
	</view>
</template>

<script>
	import {signIn} from '../../api/api.js'
	
	const app = getApp()
	export default {
		data() {
			return {
				body:{
					user:'',
					psw:'',
				},
				token:'',
				isshow: false
			};
		},
		methods:{
			signupNavigation(){
				uni.navigateTo({
					url: '/pages/signup/signup'
				})
			},
			getUser(e){
				this.body.user = e.detail.value
			},
			getPassword(e){
				this.body.psw = e.detail.value
			},
			login(){
				console.log(111111)
				if(this.body.user && this.body.psw){
					const that = this	
					const params = {
						data:this.body.user,
						pwd:this.body.psw
					}
					console.log(this.body)
					signIn(params).then(res=>{
						if(res.status == 200){
							app.globalData.uid = res.data.id
							//存储用户信息
							try{
								uni.setStorageSync('user',{id:res.data.id,name:res.data.name,imgurl:res.data.imgurl,token:res.data.token})
							}catch(e){
								console.log('数据存储失败')
							}
							uni.navigateTo({
								url:'../index/index'
							})
							that.isshow = false
						}else if(res.status == 400){
							that.isshow = true
							that.body.psw = ''
						}else if(res.status == 500){
							uni.showToast({
								title:'服务器出错啦！',
								icon:'none',
								duration: 2000
							})
						}
					})
				}
			},
			test1(){
				uni.request({
					url:'http://10.163.139.12:3000/test',
					method:'GET',
					// data:{
					// 	// uid:'6247f2d69cfc575104430b1d', //小明
					// 	// fid:'6271170a61005e804e7a9d9d', // 小红
					// 	// state:0
					// 	// uid:'6276169693ecd3305c00e7d6',
					// 	// fid:'6247f2d69cfc575104430b1d',
					// 	// msg:'好友请求啦2'
					// },
					success(res){
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	@import "../../commons/css/mycss.scss";
	
	.top-bar{
		background: rgba(255,255,255,.96);
		border-bottom:1rpx solid $uni-border-color;
	}
	
	.logo{
		width: 100%;
		height: 226rpx;
		margin-top : 88rpx;
		// border: 1px solid red;
		text-align: center;
		
		image{
			width: 194rpx;
			height: 92rpx;
			margin-top: 80rpx;
		}
	}
	.main{
		padding-left: 60rpx;
		.title{
			font-size: 56rpx;
			color: $uni-text-color;
			font-weight: 500;
			margin-bottom: 14rpx;
		}
		.slogan{
			font-size: 40rpx;
			color: rgba(39,40,50,0.50);
			font-weight: 400;
			margin-bottom: 10rpx;
		}
		input{
			width: 636rpx;
			height: 86rpx;
			margin-top: 40rpx;
			line-height: 68rpx;
			font-size: 36rpx;
			border-bottom: 1px solid rgba(39,40,50,0.08);
		}
		.tips{
			// display: none;
			float: left;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 56rpx;
		}
	}
	.submit{
		margin-top: 118rpx;
		.submit-button{
			width: 520rpx;
			height: 96rpx;
			margin: 0 auto;
			text-align: center;
			background: rgb(255,228,49);
			line-height: 96rpx;
			font-size: $uni-font-size-lg;
			box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
			border-radius: 48rpx;
			font-weight: 500;
		}
	}
</style>
