<template>
	<view class="content">
		<view style="height: var(--status-bar-height);"></view>
		<view class="l-top-bar">
			<view style="height: var(--status-bar-height);"></view>
			<view class="top-bar-center">
				<view class="title">
					{{fuser.name}}
				</view>
			</view>
			<view class="top-bar-left" @tap="backOne">
				<image class="backIcon" style="margin-top: 20rpx;" src="../../static/images/common/left.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="friend-img">
					<image  :src="fuser.imgurl" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<scroll-view class="chat" scroll-with-animation="true" scroll-y="true" :scroll-into-view="scrollToView">
			<view class="chat-main" :style="{paddingBottom:inputheight+'px'}">
				<view class="chat-ls" v-for="(item,index) in messages" :key="index" :id="'msg' + item.tip">
					<view class="chat-time" v-if="item.time != ''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.id != uuser.id">
						<image class="user-img" :src="fuser.imgurl" mode="aspectFit"></image>
						<view class="message">
							<view class="text">
								{{item.message}}
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.id == uuser.id">
						<image class="user-img" :src="uuser.imgurl" mode="aspectFit"></image>
						<view class="message">
							<view class="text">
								{{item.message}}
							</view>
						</view>
					</view>
					
				</view>
				
				
			</view>
			<view class="paddingtop"></view>
		</scroll-view>
		<submit @msgs="messagesend" @changeheight="inputHeightChange"></submit>
	</view>
</template>

<script>
	import submit from '../../components/submit/submit.vue'
	import datas from '@/commons/js/datas.js'
	import myfun from '../../commons/js/utils/date_time.js'
	import {updatemsg,chatmsg,insertmsg} from '../../api/api.js'
	const app=getApp()
	export default {
		data() {
			return {
				messages:[],
				oldTime: new Date(),
				scrollToView:'',
				inputheight:60.5,
				fuser:{
					id:'',
					name:'',
					imgurl:''
				},
				uuser:{
					id:'',
					name:'',
					imgurl:''
				},
				nowtip:0
			}
		},
		onLoad(option) {
			// console.log(option)
			this.fuser.id=option.id
			this.fuser.name=option.name
			this.fuser.imgurl=option.imgurl
			this.uuser.id=app.globalData.uid
			this.uuser.name=app.globalData.name
			this.uuser.imgurl=app.globalData.server + '/user/' + app.globalData.imgurl
			updatemsg({uid:this.uuser.id,fid:this.fuser.id}).then(res=>{
				// console.log(res)
			})
		},
		onShow() {
			this.messages=[]
			this.getMsg()
			this.receiveSocket()
		},
		components:{submit},
		methods: {
			backOne(){
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取聊天数据
			getMsg(){
				chatmsg({
					uid:this.uuser.id,
					fid:this.fuser.id
				}).then(res=>{
					console.log(res)
					let msgs = []
					if(res.status==200){
						msgs = res.data.map(x=>{
							console.log(x)
							return {
								id:x.user_id,
								message:x.message,
								types:x.type,
								time: x.gmt_created,
								tip:this.nowtip++
							}
						})
						console.log(msgs);
					}
					return msgs
				}).then(msgs=>{
					console.log(msgs);
					msgs.forEach((x,index)=>{
						if(index < msgs.length-1){
							let t = myfun.spaceTime(this.oldTime,x.time)
							if(t){
								this.oldTime = t
							}
							x.time = t
						}
					
					this.messages.unshift(x)
					})
					console.log(this.messages);
					this.$nextTick(()=>{
						this.scrollToView = 'msg' + this.messages[this.messages.length-1].tip
					})
				})
			},
			// 处理时间
			changeTime(date){
				return myfun.dateTime(new Date(date))
			},
			messagesend(e){
				// console.log(e)
				let len = this.messages.length
				let data = {
					id:this.uuser.id,
					message:e,
					types:0,
					time: new Date(),
					tip: len
				}
				this.messages.push({
					id:this.uuser.id,
					message:e,
					types:0,
					time: '',
					tip: len
				})
				
				this.sendSocket(data)
				insertmsg({
					uid:this.uuser.id,
					fid:this.fuser.id,
					msg:e,
					type:0,
				}).then(res=>{
					
				})
				
				this.$nextTick(()=>{
					this.scrollToView = 'msg' + len
				})
			},
			//发送socket
			sendSocket(e){
				this.socket.emit('msg',e,this.uuser.id,this.fuser.id)
			},
			// 接收socket
			receiveSocket(){
				console.log(111)
				this.socket.on('msg',(e)=>{
					console.log(e)
					e.time=''
					this.messages.push(e)
					this.gobottom()
					updatemsg({uid:this.uuser.id,fid:this.fuser.id}).then(res=>{
					 
					})
				})
				
			},
			inputHeightChange(e){
				console.log(e)
				this.inputheight =  e
				this.gobottom()
			},
			//滚动到底部
			gobottom(){
				this.scrollToView = ''
				this.$nextTick(()=>{
					let len = this.messages.length-1
					this.scrollToView = 'msg' + this.messages[len].tip
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
page{
	height: 100%;
}
.content{
	height: 100%;
	background-color: rgba(224, 224, 224, 1)
}
.l-top-bar{
	position: fixed;
	z-index: 1000;
	top: 0;
	left: 0;
	width: 100%;
	height: 88rpx;
	border-bottom: 1rpx solid #eaeaea;
	background-color: rgba(224, 224, 224,.96);
	
	
	.top-bar-left{
		float: left;
		padding-left: $uni-spacing-col-base;

		.backIcon{
			width: 48rpx;
			height: 48rpx;
		}
		
	}
	
	.top-bar-center{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		line-height: 88rpx;
		text-align: center;
		font-size: 40rpx;
		color: $uni-text-color;
	}
	
	.top-bar-right{
		float: right;
		
		.friend-img{
			margin-top: 10rpx;
			margin-right: 32rpx;
			
			image{
				width: 65rpx;
				height: 65rpx;
				border-radius: 10rpx;
			}
		}
	}
}

.chat{
	height: 100%;
	.chat-main{
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 100rpx;
		// padding-bottom: 120rpx;
		display: flex;
		flex-direction: column;
		
		.chat-ls{
			.chat-time{
				font-size: 24rpx;
				color: rgba(39, 40, 50, .3);
				line-height: 34rpx;
				text-align: center;
				padding: 20rpx 0;
			}
			.msg-m{
				display: flex;
				padding: 20rpx 0;
				
				.user-img{
					width: 80rpx;
					height: 80rpx;
					border-radius: 15rpx;
				}
				.message{
					max-width: 480rpx;
					background-color: #ffffff;
					border-radius: 20rpx;
					
					.text{
						font-size: 32rpx;
						padding: 18rpx 24rpx;
						line-height: 44rpx;
						word-break: break-all;
					}
				}
			}
			
			.msg-left{
				flex-direction: row;
				.message{
					margin-left: 16rpx;
					background-color: #ffffff;
					border-top-left-radius: 0;
				}
			}
			
			.msg-right{
				flex-direction: row-reverse;
				.message{
					margin-right: 16rpx;
					background-color: #ffff00;
					border-top-right-radius: 0;
				}
			}
		}
	}
}
.paddingtop{
	height: var(--status-bar-height);
	width: 100%;
}
</style>
