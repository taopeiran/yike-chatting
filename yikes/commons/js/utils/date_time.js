module.exports = {
	spaceTime(old,now){
		old = new Date(old)
		now = new Date(now)
		// console.log(old,now)
		var told = old.getTime()
		var tnow = now.getTime()
		if(told > (tnow + 1000 * 60 * 5)){
			return now
		}else{
			return ''
		}
	},
	checkSpaceTime(old,now){
		old = new Date(old)
		now = new Date(now)
		var told = old.getTime()
		var tnow = now.getTime()
		if(told < (tnow + 1000 * 60 * 5)){
			return true
		}else{
			return false
		}
	},
	//首页时间转换
	dateTime(e){
		
		let old = new Date(e);
		let now = new Date();
		//old具体时间
		let od = old.getTime();
		let oh = old.getHours();
		let om = old.getMinutes();
		let oY = old.getFullYear();
		let oM = old.getMonth()+1;
		let oD = old.getDate();
		//new具体时间
		let nd = now.getTime();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth()+1;
		let nD = now.getDate();
		
		if(oD === nD && oM === nM && oY === nY){
			oh=putzero(oh);
			om=putzero(om);
			return oh+':'+om;
		}else if(oD === nD-1 && oM === nM && oY === nY){
			oh=putzero(oh);
			om=putzero(om);
			return '昨天  '+oh+':'+om;
		}else {
			oh=putzero(oh);
			om=putzero(om);
			return oY + '/' + oM + '/' +oD + '  '+oh+':'+om;
		}
	},
	//详细时间
	detailTime(e){
		
		let old = new Date(e);
		//old具体时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth()+1;
		let D = old.getDate();
		if(M<10){
			M = '0'+M
		}
		if(m<10){
			m = '0'+m
		}
		if(D<10){
			D = '0'+D
		}
		if(h<10){
			h = '0'+h
		}
		
		return Y+'-'+M+'-'+D+' '+h+':'+m;
		
	}
};

let putzero = (n) => {
	if(n<10){
		return n = '0' + n;
	}
	return n
}