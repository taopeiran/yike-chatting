module.exports = {
	//搜索延迟作用
	//防抖
	debounce(fn,t){
		let delay = t || 500;
		let timer;
		return function(){
			let args = arguments;
			if(timer){
				clearTimeout(timer)
			}
			timer = setTimeout(()=>{
				timer = null
				fn.apply(this, args)
			}, delay)
		}
	}
}