<template>
	<view class="content">
		
		<view style="height: var(--status-bar-height);"></view>
		
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id=' + uid" class="top-bar-left" hover-class="none">
				<image class="headimg" :src="imgurl" mode="aspectFill"></image>
			</navigator>
			<view class="top-bar-center">
				<image src="../../static/images/index/huohuo@2x.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="navigateToSearch">
					<image src="../../static/images/index/search@2x.png"></image>
				</view>
				<view class="add" @tap="navigateToRequest">
					<image src="../../static/images/index/add@2x.png"></image>
				</view>
			</view>
		</view>
		
		<view class="main">
			
			<view class="friends" v-if="request.num">
				<view class="friend-list"  @tap="navigateToRequest()">
					<view class="friend-list-l">
						<text class="tip">{{request.num}}</text>
						<image src="../../static/images/index/addfriends.png"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">
								好友申请
							</view>
							<view class="time">
								{{request.time}}
							</view>
						</view>
						<view class="news">
							茫茫人海，相聚便是缘分
						</view>
					</view>
				</view>
			</view>
			
			
			<view class="friends">
				<view class="friend-list" v-for="(item , index) in friends" :key="item.id" @tap="navigateToChat(item)">
					<view class="friend-list-l">
						<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">
								{{item.name}}
							</view>
							<view class="time">
								{{item.time}}
							</view>
						</view>
						<view class="news">
							{{item.news}}
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import { dateTime as changeTime} from '../../commons/js/utils/date_time.js'
	import {getfriend,getlastmsg,unreadmsg} from '../../api/api.js'
	const app = getApp()
	export default {
		data() {
			return {
				friends:[],
				uid:'',
				imgurl:'',
				token:'',
				request:{
					num:0,
					time:''
				},
				alt:''
			}
		},
		onLoad() {
			this.alt = app.globalData.server + '/user/' + 'user.png'
			this.getStorages()
			this.uid = app.globalData.uid
			this.imgurl = app.globalData.server + '/user/' + app.globalData.imgurl
			this.token = app.globalData.token
			console.log(app.globalData)
			this.join(app.globalData.uid)
			this.socketTest()
		},
		onShow() {
			this.imgurl = app.globalData.server + '/user/' + app.globalData.imgurl
			this.getStorages()
			this.getFriends()
		},
		methods: {
			//获取缓存数据
			getStorages(){
				let value = {}
				try{
					const value = uni.getStorageSync('user')
					if(value){
						app.globalData.uid = value.id
						app.globalData.name = value.name
						app.globalData.token = value.token
						app.globalData.imgurl = value.imgurl
					}else{
						uni.navigateTo({
							url:'../signin/signin'
						})
					}
				}catch(e){
					uni.showToast({
						title:'获取缓存信息失败',
						icon:'error',
						duration:2000,
						complete() {
							uni.navigateTo({
								url:'../signin/signin'
							})
						}
					})
				}
			},
			getFriends(){
				this.friends = []
				getfriend({uid:app.globalData.uid,state:0}).then(async res=>{
					if(res.status == 200){
						this.friends = await Promise.all(res.data.map(async x=>{
							let name = x.markName ? x.markName : x.name
							let news = ''
							let time
							const result = await getlastmsg({
								uid:app.globalData.uid,
								fid:x.id
							})
							const unread = await unreadmsg({uid:app.globalData.uid,fid:x.id})
							return{
								id:x.id,
								name:name,
								imgurl:app.globalData.server + '/user/' + x.imgUrl,
								news:result.data.message,
								time: changeTime(result.data.time),
								tip:unread.data
							}
						})) 
					}else{
						// uni.showToast({
						// 	title:'网络超时',
						// 	icon:'error',
						// 	duration:2000
						// })
					}
				})
				getfriend({uid:app.globalData.uid,state:1}).then(res=>{
					if(res.status == 200){
						this.request.num = res.data.length
						if(res.data.length != 0){
							this.request.time = changeTime(new Date())
						}
						
					}
				})
				// this.friends = datas.friends()
				// this.friends.forEach( x => {
				// 	x.imgurl = '../../static/images/img/' + x.imgurl
				// 	x.time = changeTime(x.time)
				// })
			},
			navigateToSearch(){
				uni.navigateTo({
					url: '../search/search'
				})
			},
			navigateToRequest(){
				uni.navigateTo({
					url: '../friendrequest/friendrequest'
				})
			},
			navigateToChat(item){
				uni.navigateTo({
					url:'/pages/chatroom/chatroom?id='+item.id+'&name='+item.name+'&imgurl='+item.imgurl
				})
			},
			// socket模块
			join(uid){
				this.socket.emit('login',uid)
			},
			socketTest(){
				this.socket.on('msg',(msg)=>{
					console.log('msg'+msg)
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
		
		.top-bar-right{
			margin-top: -60rpx;
		}
	}
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	
	.main{
		padding: 108rpx 0 $uni-spacing-col-base 0;
		width: 100%;
	}
	
	.friend-list{
		height: 136rpx;
		padding: 20rpx $uni-spacing-col-base;
		width: 100%;
		&:active{
			background: $uni-bg-color-grey
		}
		
		.friend-list-l{
			position: relative;
			float: left;
			.tip{
				position: absolute;
				top: -8rpx;
				left: 68rpx;
				height: 36rpx;
				min-width: 36rpx;
				padding: 0 8rpx;
				background: $uni-color-warning;
				border-radius: 18rpx;
				z-index: 100;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-inverse;
				line-height: 36rpx;
				text-align: center;
			}
			image{
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-primary;
			}
		}
		
		.friend-list-r{
			padding-left: 128rpx;
			.top{
				overflow: hidden;
				.name{
					float: left;
					font-size:36rpx;
					font-weight: 400;
					color: rgba(39,40,50,1);
					line-height: 50rpx;
				}
				.time{
					float: right;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
				}
			}
			.news{
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(39,40,50,0.6);
				line-height: 40rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}
	}

</style>
