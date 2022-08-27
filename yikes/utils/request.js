const host = 'http://10.163.252.185:3000'

export function request(url, method, data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: host + url, // 接口地址
			data: data,
			method:method,
			success: function(res) {
				// 接口拦截
				if (res.statusCode == 404 || res.statusCode == 409 || res.statusCode == 500) {
					reject(res.data)
				} else {
					resolve(res.data);
				}
			},
		});
	});
}