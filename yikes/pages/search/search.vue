<template>
	<view class="content">
		
		<view style="height: var(--status-bar-height);"></view>
		
		<view class="top-bar">
			<view class="search-div">
				<input class="search" type="search" placeholder="搜索用户/群" 
				placeholder-style="color:#aaa;font-weight:400;" @input="search($event)" />
				<image class="search-icon" src="../../static/images/search/search.png"></image>
			</view>
			<view class="top-bar-right" @tap="backOne">
				<view class="text">
					取消
				</view>
			</view>
		</view>
		
		<view class="main">
						
			<view class="search-user result" v-if="userarr.length > 0">
				<view class="title">用户</view>
				<view class="list user" v-for="(item,index) in userarr" :key="index">
					<image :src="item.imgurl" class="head"  @tap="navigateToUserHome(item._id)"></image>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email" v-html="item.email"></view>
					</view>
					<view class="right-bt send" v-if="item.tip == 1">
						发消息
					</view>
					<view class="right-bt add" v-if="item.tip == 0" @tap="navigateToUserHome(item._id)">
						加好友
					</view>
				</view>
				
<!-- 					<view class="list user">
					<image src="../../static/images/img/three.jpg" class="head"></image>
					<view class="names">
						<view class="name">大力出奇迹</view>
						<view class="email">dalichuqiji@163.com</view>
					</view>
					<view class="right-bt add">
						加好友
					</view>
				</view> -->
				
			</view>
						
			<!-- <view class="search-qun result">
				<view class="title">群组</view>
				<view class="list qun">
					<image src="../../static/images/img/four.jpg" class="head"></image>
					<view class="names">
						<view class="name">大力出奇迹</view>
						<view class="email">dalichuqiji@163.com</view>
					</view>
					<view class="right-bt send">
						发消息
					</view>
				</view>
			</view> -->
						
		</view>
	</view>
</template>

<script>
	import datas from "../../commons/js/datas.js"
	import myfun from '../../commons/js/utils/bounce.js'
	import {searchUser, isFriend} from '../../api/api.js'
	
	const app = getApp()
	
	export default {
		data() {
			return {
				userarr:[],
			};
		},
		methods:{
			//获取关键词
			search:myfun.debounce(function(e){
				console.log(this)
				let searchContent = e.detail.value;
				if(searchContent.length > 0){
					this.userarr = []
					this.search_user(searchContent)
				}
			},500),
			//寻找匹配关键词的用户
			search_user(e){
				searchUser({data:e}).then(res=>{
					if(res.status == 200){
						const arr = res.data
						let exp = eval("/"+e+"/g");
						for(let i=0;i<arr.length;i++){
							if(arr[i]._id == app.globalData.uid){
								continue
							}
							this.isFriend(arr[i])
							arr[i].imgurl= app.globalData.server + '/user/'+arr[i].imgurl;
							arr[i].name=arr[i].name.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>")
							arr[i].email=arr[i].email.replace(exp,"<span style='color:#4AAAFF;'>"+e+"</span>")
							this.userarr.push(arr[i]);
						}
					}
				})
			},
			//判断是否是好友
			isFriend(e){
				e.tip = 0;
				const params = {
					uid: app.globalData.uid,
					fid: e._id
				}
				isFriend(params).then(res=>{
					if(res.status == 200){
						e.tip = 1
					}
				})
			},
			backOne(){
				uni.navigateBack({
					delta: 1
				})
			},
			navigateToUserHome(id){
				uni.navigateTo({
					url:'../userhome/userhome?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";

.top-bar{
	background: rgba(255,255,255,.96);
	border-bottom:1rpx solid $uni-border-color;
	
	.search-div{
		position: absolute;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		z-index: -1;
		padding: 14rpx 118rpx 14rpx $uni-spacing-col-base;
	}
	.search{
		padding: 0 60rpx 0 12rpx;
		height: 60rpx;
		background: $uni-bg-color-grey;
		border-radius: 10rpx;
	}
	.search-icon{
		position: absolute;
		right: 130rpx;
		top: 22rpx;
		width: 40rpx;
		height: 40rpx;
	}
}

.main{
	padding: 88rpx 32rpx 0 32rpx;

	.result{
		padding-top: 32rpx;
		
		.title{
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}
		
		.list{
			padding: 20rpx 0;
			width: 100%;
			height: 120rpx;
			&:active{
				background: $uni-bg-color-grey
			}
			
			.head{
				float: left;
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}
		
			
			.names{
				float: left;
				padding-left: $uni-spacing-col-base;
				.name{
					font-size: 36rpx;
					color: rgba(39,48,50,1);
					line-height: 50rpx;
				}
			}
			.right-bt{
				margin-top: 16rpx;
				float: right;
				width: 120rpx;
				height: 48rpx;
				font-size: 24rpx;
				border-radius: 24rpx;
				text-align: center;
				line-height: 48rpx;
				font-weight: 400;
			}
			.send{
				background: #FFE431;
				color: #272832;
			}
			.add{
				background: rgba(74,170,255,0.10);
				color: #4AAAFF;
			}
		}
	}
}
</style>
