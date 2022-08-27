<template>
	<view class="content">
		<view style="height: var(--status-bar-height);"></view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="backIcon" src="../../static/images/common/left.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="more-img" @tap="naviTo()">
					<image src="../../static/images/userhome/more.png"></image>
				</view>
			</view>
		</view>
		
		<view class="bg">
			<view class="bg-bai" :animation="animationData5"></view>
			<image class="bg-img" src="../../static/images/img/three.jpg" mode="aspectFill"></image>
		</view>
		
		<view class="main">
			<view class="user-header">
				<image :animation="animationData3" class="user-img" :src="usertemp.imgurl" mode="aspectFill"></image>
				<view class="gender" :style="{background:sexcolor}" :animation="animationData4">
					<image :src="genderimg"></image>
				</view>
			</view>
			
			<view class="user-info">
				<view class="name">
					{{usertemp.name}}
				</view>
				<view class="nick">
					昵称：{{usertemp.nickName}}
				</view>
				<view class="intro">
					{{usertemp.intro}}
				</view>
			</view>
		</view>
		
		<view class="bottom-bar" v-if="notme && !isfriend">
			<view class="btn1 bottom-btn" @tap="addFriendAnimation()">
				加为好友
			</view>
		</view>
		
		<view class="add-msg" :style="{height:addHeight+'px',bottom:-+addHeight+'px'}" :animation="animationData1">
			<view class="name">
				{{usertemp.name}}
			</view>
			<textarea ref="textarea" :value="myname+'请求加为好友~'" maxlength="120" class="add-main"></textarea>
		</view>
		
		<view class="add-btn" :animation="animationData2">
			<view class="cancel" @tap="addFriendAnimation()">
				取消
			</view>
			<view class="send" @tap="send">
				发送
			</view>
		</view>
		
	</view>
	
	
</template>

<script>
	import {getDetail,getmarkname,isFriend,applyfriend} from '../../api/api.js'
	const app = getApp()
	
	export default {
		data() {
			return {
				sexcolor: 'red',
				addHeight: '',
				myname:'李四',
				animationData1:{},	//动画
				animationData2:{},
				animationData3:{},
				animationData4:{},
				animationData5:{},
				isadd:false,
				notme:true,
				isfriend:false,
				id:'',
				genderimg:'',
				usertemp:{
					imgurl:'',
					intro:'',
					gender:'',
					signedTime:'',
					name:'',
					nickName:'',
					birth:'',
					phone:'',
					email:''
					
				},
				user:{
					name:'张三',
					nick:'张大爷',
					intro:'夜，结束了一天的喧嚣后安静下来，伴随着远处路灯那微弱的光。风，毫无预兆地席卷整片旷野，撩动人的思绪万千。'
				},
				
			}
		},
		onLoad(option) {
			const that = this
			console.log(option.id,app.globalData.uid)
			this.id = option.id
			this.myname = app.globalData.name
			if(option.id == app.globalData.uid){
				this.notme = false
			}
			getDetail({id:this.id}).then(res => {
				if(res.status == 200){
					const data = res.data
					that.usertemp.email = data.email
					that.usertemp.gender = data.gender == 'asexual' || data.gender == undefined ? 'asexual' : data.gender
					that.usertemp.signedTime = data.gmt_created
					that.usertemp.imgurl = app.globalData.server + '/user/' + data.imgurl
					that.usertemp.birth = data.birth ? data.birth : '1998-04-12'
					that.usertemp.intro = data.introduction ? data.introduction : '该用户很懒，什么也没有留下。'
					that.usertemp.phone = data.phone ? data.phone : '未设置'
					that.usertemp.name = data.name
					if(!that.notme){
						that.usertemp.nickName = data.name
					}else{
						let params = {
							uid: app.globalData.uid,
							fid: that.id
						}
						getmarkname(params).then(result=>{
							that.usertemp.nickName = result.data[0].mark_name ? result.data[0].mark_name : data.name
						})
					}
					
				}else{
					uni.showToast({
						title:'连接超时',
						icon:"error",
						duration:2000
					})
				}
				if(that.usertemp.gender == 'asexual' || that.usertemp.gender == undefined){
					that.genderimg = '../../static/images/userhome/genderless-line.png'
				}else if(that.usertemp.gender == 'male'){
					that.genderimg = '../../static/images/userhome/gender-male.png'
				}else if(that.usertemp.gender == 'female'){
					that.genderimg = '../../static/images/userhome/gender-female.png'
				}
				console.log(res)
				console.log(this.usertemp)
			})
			isFriend({
				uid:app.globalData.uid,
				fid:this.id
			}).then(res=>{
				if(res.status == 200){
					this.isfriend = true
				}else{
					this.isfriend = false
				}
			})
		},
		onShow() {
			if(!this.notme){
				this.usertemp.imgurl = app.globalData.server + '/user/' + app.globalData.imgurl
				this.usertemp.name = app.globalData.name
				this.usertemp.nickName = app.globalData.name
			}
			
			if(this.isfriend){
				let params = {
					uid: app.globalData.uid,
					fid: this.id
				}

				getmarkname(params).then(result=>{
					this.usertemp.nickName = result.data[0].mark_name ? result.data[0].mark_name : data.name
				})
			}
			
		},
		onReady(){
			this.getElementStyle();
		},
		methods: {
			backOne(){
				uni.navigateBack({
					delta: 1
				})
			},
			getElementStyle(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data=>{
					this.addHeight=data.height-186;
				}).exec();
			},
			//添加好友动画
			addFriendAnimation(){
				this.isadd = ! this.isadd
				var animation1 = uni.createAnimation({
					duration: 300,
					timingFunction:"ease"
				})
				var animation2= uni.createAnimation({
					duration: 300,
					timingFunction:"ease"
				})
				var animation3= uni.createAnimation({
					duration: 300,
					timingFunction:"ease"
				})
				var animation4= uni.createAnimation({
					duration: 1,
					timingFunction:"ease"
				})
				var animation5= uni.createAnimation({
					duration: 1,
					timingFunction:"ease"
				})
				if(this.isadd){
					animation1.bottom(0).step();
					animation2.bottom(0).step();
					animation3.width(120).height(120).top(40).step();
					animation4.opacity(0).step();
					animation5.backgroundColor('rgba(255,228,49,0.6)').step();
				}else{
					animation1.bottom(-this.addHeight).step();
					animation2.bottom(-100).step();
					animation3.width().height().top(0).step();
					animation4.opacity(1).step();
					animation5.backgroundColor('rgba(255,255,255,0)').step();
				}
				this.animationData1 = animation1.export();
				this.animationData2 = animation2.export();
				this.animationData3 = animation3.export();
				this.animationData4 = animation4.export();
				this.animationData5 = animation5.export();
			},
			naviTo(){
				uni.navigateTo({
					url:'../userdetails/userdetails?id='+this.id,
				})
			},
			send(){
				const textarea = this.$refs.textarea
				console.log(textarea.value)
				applyfriend({
					uid: app.globalData.uid,
					fid: this.id,
					msg: textarea.value
				}).then(res=>{
					console.log(res)
					if(res.status == 200){
						uni.showToast({
							title:'发送成功！',
							icon:'success',
							duration:2000
						})
					}else{
						uni.showToast({
							title:'发送失败！',
							icon:'error',
							duration:2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
.top-bar-left{
	padding-top: 16rpx;
}
.bg{
	z-index: -2;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	
	.bg-bai{
		width: 100%;
		height: 100%;
		// background-color: #eee;
	}
	
	.bg-img{
		opacity: 0.4;
		position: absolute;
		top: -20rpx;
		left: -20rpx;
		z-index: -1;
		width: 110%;
		height: 110%;
		filter: blur(16px)
	}
}

.main{
	text-align: center;
	padding-top: 148rpx;
	.user-header{
		z-index: 3;
		width: 412rpx;
		height: 412rpx;
		position: relative;
		margin: 0 auto;
		.user-img{
			top: 0;
			width: 400rpx;
			height: 400rpx;
			border-radius: 48rpx;
			border: 6rpx solid rgba(255,255,255,1);
			box-shadow: 0 36rpx 40rpx 8rpx rgba(39,40,50,.1);
		}
		.gender{
			position: absolute;
			bottom: 22rpx;
			right: 22rpx;
			opacity: 1;
			// background-color: red;
			width: 64rpx;
			height: 64rpx;
			border-radius: 32rpx;
			image{
				z-index: 1;
				margin: 16rpx;
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
	.user-info{
		padding-top: 42rpx;
		.name{
			font-size: 52rpx;
			color: #272832;
			font-weight: 400;
			line-height: 74rpx;
		}
		.nick{
			font-size: 28rpx;
			color: #272832;
			font-weight: 400;
			line-height: 40rpx;
		}
		.intro{
			padding: 20rpx 100rpx;
			font-size: 28rpx;
			color: #272832;
			line-height: 48rpx;
			font-weight: 300;
		}
	}
}

.bottom-bar{
	position: fixed;
	bottom: 0;
	left: 0;
	
	
	.bottom-btn{
		margin: 0 $uni-spacing-col-base;
		background-color: $uni-color-primary;
	}
}

.add-msg{
	position: fixed;
	padding: 0 56rpx;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	// height: 1252rpx;
	border-radius: 40px 40px 0px 0px;
	background-color: #FFFFFF;
	
	.name{
		padding-top: 168rpx;
		font-size: 52rpx;
		color: #272832;
		padding-bottom: 40rpx;
	}
	
	.add-main{
		padding: 18rpx 22rpx;
		box-sizing: border-box;
		width: 100%;
		height: 420rpx;
		background: #F3F4F6;
		border-radius: 20px;
		font-size: 32rpx;
		color: $uni-text-color;
	}
}

.add-btn{
	position: fixed;
	bottom: -140rpx;
	left: 0;
	width: 100%;
	height: 104rpx;
	display: flex;
	padding: 12rpx $uni-spacing-col-base;
	.cancel{
		flex: auto;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		width: 172rpx;
		height: 80rpx;
		background: rgba(39,40,50,0.10);
		border-radius: $uni-border-radius-sm;
	}
	.send{
		margin-left: $uni-spacing-col-base;
		flex:auto;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		width: 480rpx;
		height: 80rpx;
		background-color: $uni-color-primary;
		border-radius: $uni-border-radius-sm;
	}
}
</style>
