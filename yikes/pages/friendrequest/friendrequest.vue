<template>
	<view class="content">
		<view style="height: var(--status-bar-height);"></view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="backIcon" src="../../static/images/common/left.png"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					好友请求
				</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		
		<view class="main">
			<view class="requester" v-for="(item , index) in requesters" :key="index">
				<view class="requester-top">
					<view class="reject btn" @tap="cancel(item.id)">
						拒绝
					</view>
					<view class="header">
						<image class="header-img" :src="item.imgurl" mode="aspectFill" @tap="navigateDetail(item.id)"></image>
					</view>
					<view class="aggree btn" @tap="agree(item.id)">
						同意
					</view>
				</view>
				<view class="requester-center">
					<view class="title">
						{{item.name}}
					</view>
					<view class="time">
						{{item.time}}
					</view>
				</view>
				<view class="notice">
					<text>留言：</text>
					{{item.msg}}
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import { dateTime as changeTime} from '../../commons/js/utils/date_time.js'
	import {getfriend,getlastmsg,updatefriendstate,updatemsg,deletefriend} from '@/api/api.js'
	
	const app = getApp()
	export default {
		data() {
			return {
				requesters:[],
			};
		},
		onLoad() {
			this.getRequesters()
		},
		methods:{
			backOne(){
				uni.navigateBack({
					delta: 1
				})
			},
			//获取好友
			getRequesters(){
				getfriend({uid:app.globalData.uid,state:1}).then(async res=>{
					
					console.log(res)
					const result = await Promise.all(res.data.map(async x=>{
						const msgres = await getlastmsg({
							uid:app.globalData.uid,
							fid:x.id
						})
						console.log(msgres)
						return {
							id:x.id,
							imgurl: app.globalData.server + '/user/' + x.imgUrl,
							time:changeTime(msgres.data.time),
							name:x.name,
							msg:msgres.data.message
						}
					}))
					this.requesters = result
				})
			},
			agree(id){
				updatefriendstate({uid:app.globalData.uid,fid:id}).then(res=>{
					if(res.status == 200){
						uni.showToast({
							title:'加好友成功',
							icon:'success',
							duration:2000
						})
						this.getRequesters()
						updatemsg({uid:app.globalData.uid,fid:id}).then(res=>{
							console.log(res)
						})
					}else{
						uni.showToast({
							title:'加好友失败',
							icon:'error',
							duration:2000
						})
					}
				})
			},
			navigateDetail(id){
				uni.navigateTo({
					url:'../userhome/userhome?id='+id
				})
			},
			cancel(id){
				deletefriend({
					uid:app.globalData.uid,
					fid:id
				}).then(res=>{
					if(res.status == 200){
						uni.showToast({
							title:'删除成功',
							icon:'success',
							duration:2000
						})
						this.getRequesters()
						updatemsg({uid:app.globalData.uid,fid:id}).then(res=>{
							console.log(res)
						})
					}else{
						uni.showToast({
							title:'删除失败',
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
.top-bar{
	border-bottom: 1rpx solid $uni-border-color;
	background: rgba(255,255,255,.96);
}
.top-bar-left{
	padding-top: 16rpx;
}
.main{
	padding: 108rpx $uni-spacing-col-base;
	.requester{
		background-color: #FFFFFF;
		box-shadow: 0 24rpx 64rpx -8rpx rgba(0,0,0,.1);
		border-radius: $uni-border-radius-base;
		margin: 112rpx 20rpx;
		padding: $uni-spacing-col-base;
		.requester-top{
			display: flex;
			.btn{
				flex: none;
				width: 160rpx;
				height: 64rpx;
				text-align: center;
				line-height: 64rpx;
				font-size: $uni-font-size-lg;
				border-radius: 40rpx;
				background-color: #3F536E;
			}
			.header{
				margin-top: -104rpx;
				flex: auto;
				text-align: center;
				.header-img{
					background-color: $uni-color-primary;
					border-radius: 50%;
					width: 144rpx;
					height: 144rpx;
				}
			}
			.reject{
				color: $uni-color-warning;
				background-color: rgba(255,93,91,.1);
			}
			.aggree{
				color: $uni-text-color;
				background-color: $uni-color-primary;
			}
		}
		.requester-center{
			text-align: center;
			padding-top: 18rpx;
			.title{
				font-size: 36rpx;
				font-weight: 500rpx;
				color: $uni-text-color;
				line-height: 50rpx;
			}
			.time{
				font-size: $uni-font-size-sm;
				color: #808080;
				line-height: 34rpx;
			}
		}
		.notice{
			padding: $uni-spacing-row-sm $uni-spacing-col-base;
			background-color: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 40rpx;
		}
	}
}
</style>
