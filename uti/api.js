// 请求服务器地址
const baseURL = 'http://116.63.36.72:30088/seu/bbs'
// 向外暴露一个方法 myRequest
export const myRequest = (options) => {
	//加载loading
	// uni.showLoading({
	// 	title: '加载中'
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			// 开发者服务器接口地址（请求服务器地址 + 具体接口名）
			url: baseURL + options.url,
			// 请求头:token
			header: {
				'Authentication': uni.getStorageSync('Authentication')
			},
			// 请求方式（若不传，则默认为 GET ）
			method: options.method || 'GET',
			// 请求参数（若不传，则默认为 {} ）
			data: options.data || {},
			// 请求成功
			success: (res) => {
				console.log(res)
				// if (res.data.status == 401) {
				// 	uni.navigateTo({
				// 		url: '/pages/login/index',
				// 	});
				// 	return;
				// }

				// 此判断可根据自己需要更改
				if (res.data.code !== 200) {
					reject(res)
				} else {
					resolve(res)

				}

			},
			// 请求失败
			fail: (err) => {
				uni.showToast({
					title: '请求接口失败！'
				})

				console.log(err)
				reject(err)
			},
			//请求结束之后，执行的回调函数（成功或失败都会执行）
			complete() {
				//隐藏loading
				uni.hideLoading()
			}
		})
	})
}