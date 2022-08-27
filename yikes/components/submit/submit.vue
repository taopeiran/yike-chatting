<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<textarea id="textarea" :value="textareavalue" auto-height="true" adjust-position="true" @blur="bindTextAreaBlur" @input="heightChange"></textarea>
				<button @tap="send">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"submit",
		data() {
			return {
				textareavalue:''
			};
		},
		emits:['msgs','changeheight'],
		methods:{
			bindTextAreaBlur: function (e) {
				this.textareavalue = e.detail.value
			},
			send(){
				console.log(this.textareavalue)
				if(this.textareavalue != ''){
					this.$emit('msgs',this.textareavalue)
					this.textareavalue = ''
				}
			},
			heightChange(e){
				const query = uni.createSelectorQuery().in(this)
				query.select('.submit').boundingClientRect(data=>{
					this.$emit('changeheight',data.height)
				}).exec()
			}
		}
	}
</script>

<style lang="scss" scoped>
.submit{
	background-color: rgba(224,224,224,.96);
	border-top: 1rpx solid #eaeaea;
	width: 100%;
	min-height: 100rpx;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 100;
	padding: 20rpx;
	padding-bottom: calc(20rpx +  env(safe-area-inset-bottom));
	
	.submit-chat{
		display: flex;
		align-items: flex-end;
		justify-content: space-around;
		#textarea{
			box-sizing: border-box;
			background-color: #ffffff;
			border-radius: 20rpx;
			min-height: 60rpx;
			max-height: 320rpx;
			padding: 10rpx;
			width: 550rpx;
			font-size: 40rpx;
			line-height: 60rpx;
			overflow-y: scroll;
		}
		button{
			font-size: 40rpx;
			line-height: 80rpx;
			background-color: #00b658;
			height: 80rpx;
			flex: 1;
			margin-left: 20rpx;
		}
	}
}

</style>