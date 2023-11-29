import tim from './tim/tim.js'
import {
	store
} from '../store/index'

import {baseUrl} from './http.js'

export let loginTim = (id = store.state.userInfo.user_id + '', sig = store.state.userInfo.userSig) => {
	return new Promise((resolve, reject) => {
		let promise = tim.tim.login({
			userID: id + '',
			userSig: sig
		});
		promise.then((res) => {
			resolve(res)
			console.log('tim登陆结果111', res);
			//登录成功后 更新登录状态
			this.$store.commit("toggleIsLogin", true);
			//tim 返回的用户信息
			this.$store.commit("getTimUserInfo", res.data);
		}).catch((err) => {
			console.warn('TIM login error:', err); // 登录失败的相关信息
		});
	})

}

/**
 *  count-- 可选张数
 * 	arr-- 最终结果   [{img1:'全路径',img2:'半路径'},{img1:'全路径',img2:'半路径'}]
 */
export let upload = (count=1) => {
	console.log(count);
	return new Promise((resolve, reject) => {
		uni.chooseImage({
				count:count,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: function (res) {
					uni.showLoading({
						title: '上传中'
					})
					let imgarr = res.tempFilePaths
					let arr=[]
					imgarr.forEach(item=>{
						uni.uploadFile({
							url: baseUrl + '/api/common/upload', //仅为示例，非真实的接口地址
							filePath: item,
							name: 'file',
							success: (res) => {
								uni.hideLoading()
								let obj={
									img1:JSON.parse(res.data).data.fullurl,
									img2:JSON.parse(res.data).data.url
								}
								arr.push(obj)
								if(arr.length == imgarr.length){
									resolve(arr)
								}
							},
							fail:()=>{
								uni.showToast({
									title:'上传失败',
									icon:'none'
								})
							}
						});
					})
					
				}
			});
		
	})
}