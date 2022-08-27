<template>
	
	<view>
		<view style="height: var(--status-bar-height);"></view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="back">
				<image class="backIcon" src="../../static/images/common/left.png"></image>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/signin_up/huohuo.png"></image>
		</view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" class="name" placeholder="请取个名字" @blur="checkName"/>
					<view class="used" v-if="name.isUsed">已占用</view>
					<image src="../../static/images/signin_up/gou-blue.png" class="ok" v-if="name.isOk"></image>
				</view>
				<view class="inputs-div">
					<input type="emil" class="email" placeholder="请输入邮箱" @blur="checkEmail"/>
					<view class="used" v-if="email.isUsed">已占用</view>
					<view class="invalid" v-if="email.invalid">邮箱无效</view>
					<image src="../../static/images/signin_up/gou-blue.png" class="ok" v-if="email.isOk"></image>
				</view>
				<view class="inputs-div">
					<input :type="psw.type" class="psw" placeholder="这里输入6位或6位以上密码" @blur="checkPassword"/>
					<image :src="psw.picUrl" class="look eye" @tap="lookFunc"></image>
				</view>
				
			</view>
		</view>
		<view class="submit">
			<view :class="[{submitButton:ok},{submit1:!ok}]" @tap="signUp()">
				注册
			</view>
		</view>
	</view>
	
</template>

<script>
	import {judgeUser,addUser} from '@/api/api.js'
	export default {
		data() {
			return {
				name:{
					val:'',
					isUsed:false,
					isOk:false,
				},
				email:{
					val:'',
					isUsed:false,
					invalid:false,
					isOk:false,
				},
				psw:{
					val:'',
					isOk:false,
					picUrl:'../../static/images/signin_up/biyan.png',
					type:'password',
				}
			};
		},
		computed:{
			ok(){
				if(this.name.isOk == true && this.email.isOk == true && this.psw.isOk == true){
					return true
				}
				return false
			}
		},
		methods:{
			back(){
				uni.navigateTo({
					url: '../signin/signin'
				})
			},
			//密码是否可见
			lookFunc(){
				if(this.psw.type === 'password'){
					this.psw.type = 'text'
					this.psw.picUrl = '../../static/images/signin_up/lock.png'
				}else{
					this.psw.type = 'password'
					this.psw.picUrl = '../../static/images/signin_up/biyan.png'
				}
			},
			checkEmail(e){
				var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				var inputVal = e.detail.value
				
				if(inputVal.length > 0){
					this.email.val = inputVal
					
					if(reg.test(inputVal)){
						console.log('success')
						this.email.invalid = false
						this.email.isUsed = false
						this.email.isOk = false
					}else{
						this.email.invalid = true
						this.email.isUsed = false
						this.email.isOk = false
						return
					}
					
					//if 未被占用
					judgeUser({data:inputVal,type:'email'}).then(res=>{
						if(res.status == 200){
							if(res.data == 0){
								this.email.isUsed = false
								this.email.isOk = true
							}else{
								this.email.isUsed = true
								this.email.isOk = false
							}
						}else if(res.status == 500){
							uni.showToast({
								title: '服务器错误！',
								icon:'error',
								duration:2000
							})
						}
					})					
				
				}else{
					this.email.invalid = false
					this.email.isUsed = false
					this.email.isOk = false
					return
				}
			},
			checkName(e){
				var inputVal = e.detail.value
				
				if(inputVal.length > 0){
					this.name.val = inputVal
					
					//检查占用
					judgeUser({data:inputVal,type:'name'}).then(res=>{
						if(res.status == 200){
							if(res.data == 0){
								this.name.isUsed = false
								this.name.isOk = true
							}else{
								this.name.isUsed = true
								this.name.isOk = false
							}
						}else if(res.status == 500){
							uni.showToast({
								title: '服务器错误！',
								icon:'error',
								duration:2000
							})
						}
					})
					
				}else{
					this.name.isUsed = false
					this.name.isOk = false
					this.name.val = ''
					return
				}
				
			},
			checkPassword(e){
				var inputVal = e.detail.value
				if(inputVal.length >= 6){
					this.psw.val = inputVal
					this.psw.isOk = true
					console.log(this.name.isOk,this.email.isOk,this.psw.isOk,this.ok)
				}else{
					uni.showToast({
						title: '请输入六位或六位以上密码哦！',
						duration:2000,
						icon:"none"
					})
					this.psw.val = ''
					this.psw.isOk = false
					return
				}
			},
			signUp(){
				
				if(!this.ok){
					return
				}else{
					let params={
						name:this.name.val,
						mail:this.email.val,
						pwd:this.psw.val
					}
					addUser(params).then(res=>{
						console.log(res)
						if(res.status == 200){
							uni.showToast({
								title:'注册成功!',
								icon:'success',
								duration:3000
							})
							setTimeout(()=>{
								uni.navigateTo({
									url:'/pages/signin/signin'
								})
							},3000)
							
						}else if(res.status == 200){
							uni.showToast({
								title:'服务器错误!',
								icon:'error',
								duration:2000,
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	@import "../../commons/css/mycss.scss";
	
	.top-bar{
		background: rgba(255,255,255,.96);
		border-bottom:1rpx solid $uni-border-color;
		
		.top-bar-left{
			padding-left: 24rpx;
			padding-top: 20rpx;
			width: 88rpx;
			height: 88rpx;
		}
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
		input{
			width: 636rpx;
			height: 86rpx;
			margin-top: 40rpx;
			line-height: 68rpx;
			font-size: 36rpx;
			border-bottom: 1px solid rgba(39,40,50,0.08);
		}
		
		.inputs-div{
			width: 636rpx;
			position: relative;
			
			.ok{
				position: absolute;
				right: 0;
				top: 36rpx;
				width: 42rpx;
				height: 32rpx;
			}
			.eye{
				position: absolute;
				right: 0;
				top: 30rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
		
		.inputs .used,.invalid{
			position: absolute;
			right: 0;
			top: 0;
			font-size: $uni-font-size-base;
			font-weight: 500;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
	}
	.submit{
		margin-top: 118rpx;
		.submitButton{
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
		.submit1{
			width: 520rpx;
			height: 96rpx;
			margin: 0 auto;
			text-align: center;
			background: rgba(39,40,50,0.20);
			line-height: 96rpx;
			font-size: $uni-font-size-lg;
			border-radius: 48rpx;
			font-weight: 500;
		}
	}
</style>
