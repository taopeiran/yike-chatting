<template>
	<view class="content">
		<view style="height: var(--status-bar-height);"></view>
		
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image class="backIcon" src="../../static/images/common/left.png"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					详情
				</view>
			</view>
			<view class="top-bar-right pice"></view>
		</view>
		
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">
						头像
					</view>
					<view class="cont">
						<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row" @tap="modify('签名',user.intro,false)">
					<view class="title">
						签名
					</view>
					<view class="cont">
						{{user.intro}}
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">
						注册
					</view>
					<view class="cont">
						{{changeTime(user.signedTime)}}
					</view>
					<!-- <view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view> -->
				</view>
			</view>
			
			<view class="column heads">
				<view class="row head" @tap="modify('昵称',user.nickName,false)">
					<view class="title">
						昵称
					</view>
					<view class="cont">
						{{user.nickName}}
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">
						性别
					</view>
					<view class="cont">
						<picker :value="sexIndex" :range="array" @change="bindPickerChange" :disabled="!isme">
							<view class="uni-input">{{array[array.indexOf(user.gender)]}}</view>
						</picker>
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row">
					<view class="title">
						生日
					</view>
					<view class="cont">
						<picker mode="date" :value="user.birth" :start="startDate" :end="endDate" @change="bindDateChange" :disabled="!isme">
							<view>{{user.birth}}</view>
						</picker>
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row" @tap="modify('电话',user.phone,true)">
					<view class="title">
						电话
					</view>
					<view class="cont">
						{{user.phone}}
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="row" @tap="modify('邮箱',user.email,true)">
					<view class="title">
						邮箱
					</view>
					<view class="cont">
						{{user.email}}
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		
			<view class="column heads" v-if="isme">
				
				<view class="row" @tap="modify('密码',pwd,true)">
					<view class="title">
						密码
					</view>
					<view class="cont">
						******
					</view>
					<view class="more">
						<image src="../../static/images/common/right.png" mode="aspectFit"></image>
					</view>
				</view>
				
			</view>
		</view>
		
		<view class="exit" @tap="navigateSignin" v-if="isme">
			退出登录
		</view>
		
		<view class="modify" :style="{bottom:-+addHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify(modifyTitle,'')">
					取消
				</view>
				<view class="title">
					{{modifyTitle}}
				</view>
				<view class="define" @tap="modifySubmit">
					确定
				</view>
			</view>
			<view class="modify-main">
				<input v-if="ispwd" type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa;font-weight:400;"/>
				<textarea v-model="modifyData" class="modify-content"/>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from '../../commons/js/utils/date_time.js' 
	import {getDetail,getmarkname,isFriend,update,updatemarkname} from '../../api/api.js'
	
	const app = getApp()
	export default {
		data() {
			const currentDate = this.getDate({
				format:true
			})
			return {
				isme:true,
				isfriend:false,
				id:'',
				user:{
					imgurl:'',
					intro:'',
					gender:'',
					signedTime:'',
					nickName:'',
					birth:'',
					phone:'',
					email:''
					
				},
				//模拟数据
				dataarr:{
					name:'小明',
					sign:'你睡觉哦服啊办法',
					time: new Date(),
					sex:'男',
					birth:'1998-04-12',
					tell:'12345655353',
					mail:'123456@qq.com',
				},
				array:['男','女','未知'],
				sexIndex: 2 ,
				date: currentDate,
				tempFilePath: "",
				cropFilePath: "",
				animationData:{},
				addHeight: '',
				isModify:false,
				ispwd:false,										//是否需要密码修改
				modifyTitle:'',										//修改标题
				modifyData:'修改的内容',								//修改的内容
				pwd:'',												//密码
			};
		},
		components:{ImageCropper},
		computed:{
			startDate(){
				return this.getDate('start')
			},
			endDate(){
				return this.getDate('end')
			}
		},
		onLoad(option){
			const that = this
			this.id = option.id
			if(this.id != app.globalData.uid){
				this.isme = false
			}
			if(!this.isme){
				isFriend({
					uid: app.globalData.uid,
					fid: this.id
				}).then(res=>{
					if(res.status == 200){
						this.isfriend = true
					}else{
						this.isfriend = false
					}
				})
			}else{
				this.isfriend = true
			}
			getDetail({id:this.id}).then(res => {
				
				if(res.status == 200){
					const data = res.data
					that.user.email = data.email
					that.user.gender = data.gender == 'asexual' || data.gender == undefined ? '未知' : data.gender
					that.user.signedTime = data.gmt_created
					that.user.imgurl = app.globalData.server + '/user/' + data.imgurl
					that.cropFilePath = app.globalData.server + '/user/' + data.imgurl
					that.user.birth = data.birth ? data.birth : '1998-04-12'
					that.user.intro = data.introduction ? data.introduction : '该用户很懒，什么也没有留下。'
					that.user.phone = data.phone ? data.phone : '未设置'
					if(that.isme){
						that.user.nickName = data.name
					}else{
						let params = {
							uid: app.globalData.uid,
							fid: that.id
						}
						getmarkname(params).then(result=>{
							that.user.nickName = result.data[0].mark_name ? result.data[0].mark_name : data.name
						})
					}
					
				}else{
					uni.showToast({
						title:'连接超时',
						icon:"error",
						duration:2000
					})
				}
				console.log(res)
				console.log(this.user)
				
			})
		},
		onReady(){
			this.getElementStyle()
		},
		methods:{
			backOne(){
				uni.navigateBack({
					delta: 1
				})
			},
			//性别选择
			bindPickerChange(e){
				this.sexIndex = e.target.value
				this.user.gender = this.array[this.sexIndex]
			},
			// 生日选择
			bindDateChange(e){
				this.user.birth = e.target.value
			},
			//时间处理
			changeTime(date){
				return myfun.detailTime(date)
			},
			getDate(type){
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth()+1;
				let day = date.getDate();
				if(type === 'start'){
					year = year - 60;
				}else if(type === 'end'){
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month
				day = day > 9 ? day : '0' +day;
				return `${year}-${month}-${day}`;
			},
			//头像裁剪
			upload() {
				if(!this.isme){
					return
				}
			  uni.chooseImage({
				count: 1, //默认9
				sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ["album","camera"], //从相册选择
				success: (res) => {
				  this.tempFilePath = res.tempFilePaths.shift();
				},
			  });
			},
			confirm(e) {
				const that = this
				if(!this.isme){
					return
				}
			    this.tempFilePath = "";
			    this.cropFilePath = e.detail.tempFilePath;
		
			    //除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
			    //按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
			    //待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了
		
			    uni.uploadFile({
				  url: app.globalData.server + "/files/upload",
				  filePath: this.cropFilePath,
				  name: "file",
				  fileType: "image",
				  formData:{
					  url:'user',
					  name: new Date().getTime() + this.id
				  },
				  success: (uploadFileRes) => {
				    var backstr = uploadFileRes.data;
					console.log(backstr)
				    //自定义操作
					update({
						id:that.id,
						type:'imgurl',
						data:backstr
					}).then(res=>{
						console.log(res)
						if(res.status == 200){
							try{
								uni.setStorageSync('user',{id:app.globalData.uid,name:app.globalData.name,imgurl:backstr,token:app.globalData.token})
								app.globalData.imgurl = backstr
							}catch(e){
								console.log('数据存储失败')
							}
							uni.showToast({
								title:'上传成功',
								icon:"success",
								duration:2000
							})
						}else{
							uni.showToast({
								title:'上传失败',
								icon:"error",
								duration:2000
							})
						}
					})
				  },
		
				  fail(e) {
				    console.log("this is errormes " + e.message);
					uni.showToast({
						title:'上传失败',
						icon:"error",
						duration:2000
					})
				  },
			    });
		
			},
			cancel() {
			  console.log("canceled");
			  this.tempFilePath = "";
			},
			getElementStyle(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data=>{
					this.addHeight=data.height;
				}).exec();
			},
			//修改页面动画
			modify(type,data,ispwd){
				if(!this.isme && type !='昵称' || !this.isfriend){
					return
				}
				this.ispwd = ispwd;
				this.modifyTitle = type
				this.modifyData = data
				this.isModify = ! this.isModify
				var animation = uni.createAnimation({
					duration:300,
					timingFunction: 'ease',
				})
				this.getElementStyle()
				if(this.isModify){
					animation.bottom(0).step()
				}else{
					animation.bottom(-this.addHeight).step()
				}
				this.animationData = animation.export()
			},
			modifySubmit(){
				if(this.modifyTitle == '电话' || this.modifyTitle == '邮箱' || this.modifyTitle == '密码'){
					let type=''
					if(this.modifyTitle == '电话'){
						type = 'phone'
					}else if(this.modifyTitle == '邮箱'){
						type = 'email'
					}else if(this.modifyTitle == '密码'){
						type = 'psw'
					}
					let data = this.modifyData
					update({
						id: this.id,
						type:type,
						data: data,
						pwd: this.pwd
					}).then(res=>{
						console.log(res)
						if(res.status == 200){
							if(this.modifyTitle == '电话'){
								this.user.phone = data
							}else if(this.modifyTitle == '邮箱'){
								this.user.email = data
							}
							uni.showToast({
								title:'修改成功',
								icon:"success",
								duration:2000
							})
						}else{
							uni.showToast({
								title:'修改失败',
								icon:"error",
								duration:2000
							})
						}
					})
				}
				if(this.modifyTitle == '签名'){
					let type = 'introduction'
					let data = this.modifyData
					update({
						id: this.id,
						type: type,
						data: data
					}).then(res=>{
						console.log(res)
						if(res.status == 200){
							this.user.intro = data
							uni.showToast({
								title:'修改成功',
								icon:"success",
								duration:2000
							})
						}else{
							uni.showToast({
								title:'修改失败',
								icon:"error",
								duration:2000
							})
						}
					})
				}
				if(this.modifyTitle == '昵称'){
					let data = this.modifyData
					if(this.isme && this.isfriend){
						//自己的情况
						update({
							id:this.id,
							type:'name',
							data:data
						}).then(res=>{
							console.log(res)
							if(res.status == 200){
								this.user.nickName = data
								try{
									uni.setStorageSync('user',{id:app.globalData.uid,name:data,imgurl:app.globalData.imgurl,token:app.globalData.token})
									app.globalData.name = data
								}catch(e){
									console.log('数据存储失败')
								}
								uni.showToast({
									title:'修改成功',
									icon:"success",
									duration:2000
								})
							}else{
								uni.showToast({
									title:'修改失败',
									icon:"error",
									duration:2000
								})
							}
						})
					}else{
						//好友的情况
						updatemarkname({
							uid: app.globalData.uid,
							fid: this.id,
							name: data
						}).then(res=>{
							console.log(res)
							if(res.status == 200){
								this.user.nickName = data
								uni.showToast({
									title:'修改成功',
									icon:"success",
									duration:2000
								})
							}else{
								uni.showToast({
									title:'修改失败',
									icon:"error",
									duration:2000
								})
							}	
							
						})
						
						
					}
				}
				this.modify(this.modifyTitle,'',false)
				this.pwd = ''
			},
			navigateSignin(){
				try{
					uni.clearStorageSync()
					uni.reLaunch({
						url:'../signin/signin'
					})
				}catch(e){
					uni.showToast({
						icon:"error",
						title:'缓存错误',
						duration:2000
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
@import "../../commons/css/mycss.scss";
.top-bar{
	border-bottom: 1rpx solid $uni-border-color;
	background: rgba(255,255,255,.96);
	
	.top-bar-left{
		padding-top: 20rpx;
	}
}
.main{
	margin-top: 118rpx;
	display: flex;
	flex-direction: column;
	.column{
		display: flex;
		flex-direction: column;
		padding-top: 12rpx;
		width: 100%;
		border-bottom: 1rpx solid $uni-border-color;
		.row{
			display: flex;
			flex-direction: row;
			align-items: center;
			.title{
				flex: none;
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
				
			}
			.head{
				height: 148rpx;
				display: flex;
				align-items: center;
			}
			.cont{
				flex: auto;
				padding-left: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
				line-height: 112rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 112rpx;
			    
				.user-img{
					width: $uni-img-size-lg;
					height: $uni-img-size-lg;
					border-radius: $uni-border-radius-base;
				}
			}
			.more{
				flex: none;
				image{
					width: 80rpx;
					height: 28rpx;
				}
			}
			
		}
	}
}

.exit{
	padding-top: 160rpx;
	text-align: center;
	font-size: 32rpx;
	line-height: 88rpx;
	color: #FF5D5B;
	margin-bottom: 80rpx;
}

.modify{
	position: fixed;
	z-index: 1002;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #fff;
	
	.modify-header{
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid $uni-border-color;
		.close{
			line-height: 44rpx;
			padding-left: 32rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
		}
		.title{
			flex: auto;
			text-align: center;
			font-size: 40rpx;
			color: $uni-text-color;
			line-height: 88rpx;
		}
		.define{
			line-height: 44rpx;
			padding-right: 32rpx;
			font-size: $uni-font-size-lg;
			color: $uni-color-success;
		}
	}
	.modify-main{
		display: flex;
		flex-direction: column;
		padding: $uni-spacing-col-base;
		.modify-pwd{
			margin-bottom: $uni-spacing-col-base;
			padding: 0 20rpx;
			flex: 1;
			height: 88rpx;
			background-color: $uni-bg-color-grey;
			color: $uni-text-color;
			border-radius: $uni-border-radius-base;
			line-height: 88rpx;
			font-size: $uni-text-color;
		}
		.modify-content{
			box-sizing: border-box;
			width: 100%;
			padding: 16rpx 22rpx;
			height: 386rpx;
			background-color: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			line-height: 44rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
		}
	}
}
</style>
