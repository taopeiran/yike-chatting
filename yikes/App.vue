<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			server:'http://10.163.252.185:3000',
			uid:'',
			name:'',
			token:'',
			imgurl:''
		}
	}
</script>

<style>
	/*每个页面公共css */
	*{
		box-sizing: border-box;
	}
</style>
