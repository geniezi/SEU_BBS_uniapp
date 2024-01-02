<template>
	<view>
		<u-input placeholder="请输入标题" border="bottom" v-model="title" maxlength="20">
			<!-- <u-text text="+86" slot="prefix" margin="0 46px 0 0" type="tips"></u-text> -->
		</u-input>
		<view class="plr">
			<textarea value="editorCtx" v-model="message" maxlength="1000" placeholder="输入内容（最多1000字）" class="w100"
				style="height: 430rpx;" />
		</view>
		<u-divider></u-divider>
		<view class="item-box flex flex-wrap u-m-l-36 u-m-r-10">
			<!-- <view class="item upload u-m-t-20 relative" > -->
			<view class="item upload u-m-t-20 relative"  v-for="(item,i) in imgarr" :key="i" v-show="imgarr.length!=0">
			
				<image :src="item" v-if="" mode="widthFix"  @click="preview(i)"></image>
				<image @click="del(i)" src="https://seu-bbs.obs.cn-east-3.myhuaweicloud.com/bbs/static/84b9309c-ac20-401a-9f2d-7aeb6ae78dc8.png" class="absolute"
					style="width: 32rpx;height: 32rpx;top: 5rpx;right: 5rpx;" v-if=""></image>
			</view>
			<!-- </view> -->
			<view class="item upload u-m-t-20" @click="getimg" v-show="imgarr.length < 9">
				<image src="https://seu-bbs.obs.cn-east-3.myhuaweicloud.com/bbs/static/4f56bfb5-4c6c-4cbf-a5c2-af3bde9568ad.png" v-if=""></image>
			</view>

		</view>

		<!-- 		<view class="editor-wrapper" style="background-color: #F8F8F8;">
					<editor id="editor" class="ql-container"  @focus="handleFocus" @blur="handleBlur" @input="handleInput"
						placeholder="开始输入..." showImgSize showImgToolbar showImgResize @statuschange="onStatusChange"
						:read-only="readOnly" @ready="onEditorReady">
					</editor>
				</view> -->

		<!-- 				<view class="bottom_opert bottom_safe" :style="{ bottom: bottomHeight }">
				</view> -->
		<!-- 					<div class="text_info" style="float: right;color: #8a8a8a;font-size: 5%;display: flex;">
						{{ textLength > 0 ? textLength+"/1000" : "最多1000字" }}
					</div> -->
		<!-- <view class="more_opt">
						<view class="more_item" @click="handleChooseCate">{{
		            resultCateListult.length == 0
		              ? "选择分类"
		              : `已选择${resultCateListult.length}个分类`
		          }}
						</view> -->
		<!-- <view class="more_item" @click="handleChooseAvil">
							{{ resultVailInfo.resultName ? resultVailInfo.resultName : "谁可看" }}
						</view> -->
		<!-- </view> -->

		<!-- <view class="tool-bar">
						<view class="bottom_item" @click="handleFontOptShows"> 文字 </view>
						<view class="bottom_item" @click="handeleUploadImg"> 上传图片 </view>
						<view class="bottom_item" @click="handleUndo"> 撤销 </view>
		 
						<view class="bottom_item" @click="handeleRedu"> 恢复 </view>
					</view> -->
		<u-divider></u-divider>
		<view class="existing_label">
			<view class="u-page__tag-item" v-for="(item, index) in allTags" :key="index">
				<u-tag shape="circle" :text="item.name" :bgColor="item.checked ? '#00ff7f':'#FFFFFF'"
					:color="item.checked ? '#FFFFFF':'#00b331'" :name="index" @click="chooseTag(index,item)"
					borderColor='#00ff7f' :closable='tagClosable' @close="closelabelTag">
				</u-tag>

			</view>
			<view class="u-page__tag-item" v-for="(item, index) in Tags" :key="index">
				<u-tag shape="circle" :text="item.name" :bgColor="item.checked ? '#00ff7f':'#FFFFFF'"
					:color="item.checked ? '#FFFFFF':'#00b331'" :name="index" @click="addTag()" borderColor='#00ff7f'
					:closable='tagClosable' @close="closelabelTag" style="width: 4rpx;">
				</u-tag>
				<modal v-if="areaShow" title="新增标签" confirm-text="保存" cancel-text="取消" @cancel="cancelAdd"
					@confirm="confirmAdd">
					<input type="text" v-model="areaTxt" placeholder="限填8个字" class="intxt" maxlength="8" />
				</modal>
			</view>
		</view>



		<picker @change="bindPickerChange" :value="SectionIndex" :range="Sectionarray" range-key="name">
			<view style="padding: 20rpx;background-color: #F8F8F8;color: #2D983A;">
				发布板块：&#32;&#32;&#32;&#32;{{ Sectionarray[SectionIndex].name }}</view>
		</picker>
		<view v-if="SectionIndex==1" style="display: flex;font-style:bold;color: #2D983A;">
		<!-- <u-text text="价格"  style="width: 50%;" margin="0 30px 0 0" type="tips"></u-text> -->
		￥金额：
		<input  type="digit" style="margin-left: 20rpx;" placeholder="请输入交易物品价格" border="bottom" @input="priceCheck" v-model="price">
		</input>
		</view>
		<view v-if="SectionIndex==2" style="display: flex;font-style:bold;color: #2D983A;font-size: 14px;">
		<!-- <u-text text="价格"  style="width: 50%;" margin="0 30px 0 0" type="tips"></u-text> -->
		已有人数：
		<input  type="digit" style="margin-right: 10px; font-size: 14px;" placeholder="请输入" border="bottom" @input="click_e" v-model="exist">
		</input>
		/最大人数：
		<input  type="digit" style="margin-left: font-size: 14px;" placeholder="请输入" border="bottom" @input="click_l" v-model="limit">
		</input>
		
		</view>
		<u-divider></u-divider>
		<button size="default" type="default"
			style="margin-top: 20px;width: 283px;height: 40px;background-color: #2D983A;color: #FFFFFF;border: none;border-radius: 5px;font-size: 16px;text-align: center;line-height: 40px;cursor: pointer;"
			hover-class="is-hover" @click="post">发布帖子</button>
	</view>

	<!-- 	<u-picker :show="fontshow" :columns="fontList" keyName="label" :defaultIndex="defaultIndex"
					@confirm="hadleFontConfirm" @cancel="fontshow = false"> -->
	<!-- 字体类处理 -->

	<!-- 				<u-popup safeAreaInsetBottom :show="fontshow" mode="bottom" @close="fontListClose">
					<div class="content" round>
						<div class="content_item" v-for="(item,index) in fontList" :class="{activeItem:item.id ==currentId }"
							@click="hadleFontConfirm(item)">
							{{item.label}}
						</div>
					</div>
				</u-popup> -->
	</view>
</template>

<script>
	import {
		pathToBase64
	} from '../../js_sdk/mmmm-image-tools/index.js'
	export default {
		// created() {
		//   this.imgarr = [];
		// },
		data() {
			return {
				title:'',
				textLength: 0,
				currentId: '',
				editorCtx: '',
				fontshow: false,
				// teamUp: false,
				// trade:false,
				price:"",
				exist:"",
				limit:"",
				Sectionarray: [{
					name: '所有帖子'
				}, {
					name: '二手交易'
				}, {
					name: '组队'
				}, {
					name: '身边趣事'
				}, {
					name: '时事新闻'
				}],
				SectionIndex: 0,
				bottomHeight: '',
				message: '',
				// result:'',
				imgarr: [],
				uploadimg:[],
				resarr: [],
				address: '请选择',
				longitude: '',
				latitude: '',
				allTags: [{
						name: '开心',
						checked: false
					},
					{
						name: '玉玉了',
						checked: false
					},
					{
						name: '愉悦',
						checked: false
					},
					{
						name: 'I ♥ SEU',
						checked: false
					},
				],
				Tags: [{
					name: '+',
					checked: false
				}, ],
				tag: [],
				areaShow: false,
				areaTxt: '',
			}
		},
		computed: {
			canPost() {
				// 判断是否满足发帖条件
				return this.title.length !=0 && this.message.length !=0;
			}
		},
		onNavigationBarButtonTap() {
			if (!this.message.trim()) {
				uni.showToast({
					title: '请输入文字内容',
					icon: 'none'
				})
			} else if (this.imgarr.length == 0) {
				uni.showToast({
					title: '请上传图片',
					icon: 'none',
					
				})
			} else {
				let img = []
				this.imgarr.forEach(item => {
					img.push(item.img2)
				})
				this.$http('/api/dynamic/addDynamic', {
					content: this.message,
					img: img.join(','),
					lng: this.longitude,
					lat: this.latitude
				}, "POST").then(data => {
					uni.navigateBack()
					setTimeout(() => {
						uni.showToast({
							title: '发布成功',
						})
					}, 100)
				})
			}
		},
		methods: {
			click_e(e){
			                const v = e.detail.value
			                this.exist = '1'
			        
			                const zero = /^(0{2,})|[^0-9]/g
			                let final = 0
			                if (!v) {
			                  final = 0
			                } else {
			                  final = v.toString().replace(zero, (v) => {
			                    return 0
			                  })
			        
			                  if (final.split('')[0] * 1 === 0) {
			                    final = final.slice(1) - 0 || 0
			                  }
			                }
			                this.$nextTick(() => {
			                  this.exist = final.toString() || '0'
			                })
							// console.log(this.exist)
			            },
			click_l(e){
			                const v = e.detail.value
			                this.limit = '1'
			        
			                const zero = /^(0{2,})|[^0-9]/g
			                let final = 0
			                if (!v) {
			                  final = 0
			                } else {
			                  final = v.toString().replace(zero, (v) => {
			                    return 0
			                  })
			        
			                  if (final.split('')[0] * 1 === 0) {
			                    final = final.slice(1) - 0 || 0
			                  }
			                }
			                this.$nextTick(() => {
			                  this.limit = final.toString() || '0'
			                })
							// console.log(this.limit)
			            },
			goToLogin() {
				// uni.switchTab({
				// 	url: '/pages/login/index',
				// 	success: () => {
				// 		uni.$u.toast('请登录后操作');
				// 	},
				// 	fail: (res) => {
				// 		console.log('navigate failed', res);
				// 	}
				// })
				//login从tabbar取出后用
				uni.navigateTo({
					url: '/pages/login/index',
					success: () => {
						uni.$u.toast('请登录后操作');
					},
					fail: (res) => {
						console.log('navigate failed', res);
					}
				});
			},
			priceCheck(e){
			               this.$nextTick(() => {
			               					let val = e.target.value.toString();
											// console.log(val)
			               					val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
			               					val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
			               					val = val.replace(/^0+\./g, '0.');
			               					val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val
			               					val = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
			               					if (val.includes(".")) {
			               						let numDian = val.toString().split(".")[1].length;
			               						if (numDian === 2) {
			               							this.price= val.length;
			               						}
			               					} else {
			               						// this.moneyMaxLeng = 8;
			               					}
			               					this.price = val;
											// console.log(this.price)
			               				});
			 
			},
			preview(i){
				console.log("11111")
				console.log(i)
				// 预览图片
				uni.previewImage({
				    urls: this.imgarr,
					current:i,
				    longPressActions: {
				        itemList: [ '保存图片'],
				        success: function(data) {
				            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				        },
				        fail: function(err) {
				            console.log(err.errMsg);
				        }
				    }
				});
			},
			post() {
				// uni.uploadFile({
				//     url:" http://8.130.39.186:30088/seu/bbs/upload/post",     // 后端api接口
				//     filePath: "../../static/logo.png", // uni.chooseImage函数调用后获取的本地文件路劲
				//     name:'file',     //后端通过'file'获取上传的文件对象
				// 	formData: {
				// 	'user': 'test'
				// 	},
				//     // header:{'Authentication':uni.getStorageSync('Authentication')},
				//     success:(res) => {
				// 		console.log(res.data.code)
				//         if (res.data.code == 200){
				//             console.log('文件上传成功')
				// 			console.log(res.data.data)
				//         }
				//     }
				// });
				// console.log(this.message.length)
				// console.log(this.title.length)
			if(this.canPost){
				if(this.SectionIndex==1){
					if(this.uploadimg.length!=0)
					{
					this.$myRequest({
							url: '/post/add',
							method: "POST",
							header: {
								'Authentication': uni.getStorageSync('Authentication')
							},
							data: {
								"postParam": {
								        "title": this.title,
								        "content": this.message,
								        "section": this.SectionIndex.toString(), //见板块代码对应
										"price": this.price
								    },
								    "mediaList":this.uploadimg,
								    "tagList":this.tag
							}
						})
						.then(response => {
							console.log("uploadv "+this.uploadimg)
							uni.showToast({
								title: '发帖成功',
								//将值设置为 success 或者直接不用写icon这个参数
								icon: 'success',
								//显示持续时间为 2秒
								duration: 1000,
							})
							// console.log(response.data.data) //打印token测试
								this.title=""
								this.message=""
								this.tag=[]
								this.allTags=[{
							name: '开心',
							checked: false
						},
						{
							name: '玉玉了',
							checked: false
						},
						{
							name: '愉悦',
							checked: false
						},
						{
							name: 'I ♥ SEU',
							checked: false
						},
						],
						this.SectionIndex=0,
						this.imgarr=[],
						this.uploadimg=[],
						this.resarr=[],
						this.price="",
						this.exist="",
						this.limit="",
						console.log("发帖成功")
								uni.switchTab({
									url: '/pages/homePage/index',
									success: () => {
										console.log(1);
									},
									fail: (res) => {
										console.log('navigate failed', res);
									}
								})
							})
							.catch(error => {
								if (error.data.code == 500) {
									uni.$u.toast(error.data.message);
									return;
								}
							
								if (error.data.status == 401) {
									this.goToLogin();
									return;
								}
							});
					}
					else
					{
						uni.showToast({
							title: '必须包含图片',
							//将值设置为 success 或者直接不用写icon这个参数
							//显示持续时间为 2秒
							icon:"error",
							duration: 1000,
						})
					}
				}
				else if(this.SectionIndex==2){
					if(parseInt(this.exist)<parseInt(this.limit))
					{
						if(this.uploadimg.length!=0)
						{
						this.$myRequest({
								url: '/post/add',
								method: "POST",
								header: {
									'Authentication': uni.getStorageSync('Authentication')
								},
								data: {
									"postParam": {
									        "title": this.title,
									        "content": this.message,
									        "section": this.SectionIndex.toString(), //见板块代码对应
											"exist": this.exist,
											"limit":this.limit
									    },
									    "mediaList":this.uploadimg,
									    "tagList":this.tag
								}
							})
							.then(response => {
								console.log("uploadv "+this.uploadimg)
								uni.showToast({
									title: '发帖成功',
									//将值设置为 success 或者直接不用写icon这个参数
									icon: 'success',
									//显示持续时间为 2秒
									duration: 2000,
								})
								// console.log(response.data.data) //打印token测试
									this.title=""
									this.message=""
									this.tag=[]
									this.allTags=[{
								name: '开心',
								checked: false
							},
							{
								name: '玉玉了',
								checked: false
							},
							{
								name: '愉悦',
								checked: false
							},
							{
								name: 'I ♥ SEU',
								checked: false
							},
							],
									this.SectionIndex=0,
									this.imgarr=[],
									this.uploadimg=[],
									this.resarr=[],
									this.price="",
									this.exist="",
									this.limit="",
									console.log("发帖成功")
									uni.switchTab({
										url: '/pages/homePage/index',
										success: () => {
											console.log(1);
										},
										fail: (res) => {
											console.log('navigate failed', res);
										}
									})
							})
								.catch(error => {
									if (error.data.code == 500) {
										uni.$u.toast(error.data.message);
										return;
									}
								
									if (error.data.status == 401) {
										this.goToLogin();
										return;
									}
								});
							}
							else
							{
								uni.showToast({
																title: '必须包含图片',
																//将值设置为 success 或者直接不用写icon这个参数
																//显示持续时间为 2秒
																icon:"error",
																duration: 1000,
															})
							}
					}
					else{
						uni.$u.toast('已有人数应当小于最大人数');
						return;
						
					}
				}
				else{
				this.$myRequest({
						url: '/post/add',
						method: "POST",
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						data: {
							"postParam": {
							        "title": this.title,
							        "content": this.message,
							        "section": this.SectionIndex.toString() //见板块代码对应
							    },
							    "mediaList":this.uploadimg,
							    "tagList":this.tag
						}
					})
					.then(response => {
						console.log("uploadv "+this.uploadimg)
						uni.showToast({
							title: '发帖成功',
							//将值设置为 success 或者直接不用写icon这个参数
							icon: 'success',
							//显示持续时间为 2秒
							duration: 2000,
						})
						// console.log(response.data.data) //打印token测试
							this.title=""
							this.message=""
							this.tag=[]
							this.allTags=[{
						name: '开心',
						checked: false
					},
					{
						name: '玉玉了',
						checked: false
					},
					{
						name: '愉悦',
						checked: false
					},
					{
						name: 'I ♥ SEU',
						checked: false
					},
					],
							this.SectionIndex=0,
							this.imgarr=[],
							this.uploadimg=[],
							this.resarr=[],
							this.price="",
							this.exist="",
							this.limit="",
							console.log("发帖成功")
							uni.switchTab({
								url: '/pages/homePage/index',
								success: () => {
									console.log(1);
								},
								fail: (res) => {
									console.log('navigate failed', res);
								}
							})
						})
					.catch(error => {
						if (error.data.code == 500) {
							uni.$u.toast(error.data.message);
							return;
						}
					
						if (error.data.status == 401) {
							this.goToLogin();
							return;
						}
					});
					}
				}
			else{
					if (this.title.length == 0) {
						uni.$u.toast('标题不能为空');
						return;
					}
					
					if (this.message.length == 0) {
						uni.$u.toast('发帖内容不能为空');
						return;
					}
					
					
				}
				// this.$myRequest({
				// 		url: '/upload/post',
				// 		method: "POST",
				// 		data: {
				// 			"phone": this.phoneNumber,
				// 			"code": this.verificationCode
				// 		}
				// 	})
				// 	.then(response => {

				// 		}),
				// uni.setStorageSync('Authentication', response.data.data)
				// console.log('文件上传成功')
			},
			cancelAdd() {
				this.areaShow = false
				this.areaTxt = ''
			},
			confirmAdd() {
				if (this.areaTxt == '') {
					uni.showModal({

						content: '输入不能为空',
						showCancel: false,
						confirmText: '确定'
					});
					this.areaShow = false
					// this.areaTxt=''

				} else {
					// 输入值点击保存 判断标签是否存在，不存在在走 新建标签的流程
					console.log('选择的标签是:', this.areaTxt)
					let isSame = 0
					this.allTags.map((item, index) => {
						item.name == this.areaTxt ? isSame++ : ''
					})
					// if isSame==0则标签不存在要新建标签
					if (isSame != 0) {
						//存在
						console.log('存在')
						uni.showModal({

							content: '该标签已存在',
							showCancel: false,
							confirmText: '确定'
						});
						this.areaShow = false
						this.areaTxt = ''
					} else {
						// 不存在

						console.log('不存在')
						// let list = []
						// list = uni.getStorageSync('allTags')
						// console.log(list)
						let a = {
							'name': this.areaTxt,
							'checked': false
						}
						console.log(a)
						// list.push(a)
						// uni.setStorage({
						// 		key:'allTags',
						// 		data:{    //存的数据可以是很多条
						// 		'name': list.name,
						// 		'checked':list.checked
						// }
						// 	})	
						this.allTags.push(a)
						console.log(this.allTags)

						this.areaShow = false
						this.areaTxt = ''
					}
				}
			},

			chooseTag(index, item) {
				// console.log(this.SectionIndex.toString())
				this.allTags[index].checked = !this.allTags[index].checked
				let data = this.allTags
				let arr = []
				data.forEach(item => {
					if (item.checked) {
						arr.push(
							//这里是根据接口的要求截取的一些字段，如果你不需要筛选可以直接push(item)
							 item.name
						)
					}
				})
				this.tag = arr
				// console.log(this.tag)
				//this.form.patient.allergy = JSON.stringify(this.allergy)
			},
			addTag() {
				// uni.showModal({
				//         title: '请添加标签',
				//         content: '',
				//         editable:true,//是否显示输入框
				// 		placeholderText:'',//输入框提示内容
				//         confirmText: '确认',
				// 		maxlength:'8',
				//         cancelText: '取消',
				//         success: (res) => {
				//           if (res.confirm) {
				//             console.log('输入的内容：', res.content);
				//           }
				//         } 
				//       });
				this.areaShow = true
			},
			getimg() {
				// 从相册选择9张图
				var _this = this;
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: res => {
						// 预览图片
						// uni.previewImage({
						//     urls: res.tempFilePaths,
						//     longPressActions: {
						//         itemList: ['发送给朋友', '保存图片', '收藏'],
						//         success: function(data) {
						//             console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						//         },
						//         fail: function(err) {
						//             console.log(err.errMsg);
						//         }
						//     }
						// });
						// uni.showLoading({
						// 				title:'加载中...'
						// 			});
						this.resarr = res.tempFilePaths
						// uni.getImageInfo({
						// 							src: res.tempFilePaths[i],
						// 							success: (path) => {
						// 								pathToBase64(path.path).then(base64 => {
						// 										// console.log("base64="+base64); // 这就是转为base64格式的图片
						// 										// console.log(typeof base64)
						// 										if(this.imgarr === undefined) {
						// 										  this.imgarr = []
						// 										}
						// 										this.imgarr.push(base64)
						// 										console.log(this.imgarr.length)
						// 										// console.log("1111"+this.imgarr)	
						// 										// uni.hideLoading()
						// 									})
						// 									.catch(error => {
						// 										console.error(error)
						// 									})
						// 							},

						// 						})

						// this.$forceUpdate();
						// console.log(this.resarr.length)
						for ( let i=0;i<this.resarr.length;i++) {
							let data = this.resarr[i]
							console.log(data)
							uni.uploadFile({
								url: 'http://8.130.39.186:30088/seu/bbs/upload/post', //仅为示例，非真实的接口地址
								filePath: data,
								name: 'file',
								// formData: {
								// 	'user': 'test'
								// },
								header: {
									'Authentication': uni.getStorageSync('Authentication')
								},
								success: (res) => {
									let result =JSON.parse(res.data) ;
									console.log(result)
									if (result.code == 200) {
										console.log('文件上传成功')
										console.log("1111"+result.data)
										this.uploadimg.push(result.data)
										this.imgarr.push(result.data)
										// console.log("upload "+this.uploadimg)
									}
									else if(result.status === 401){
										this.goToLogin();
										console.log('未登录')
										return;
									}
									else{
										console.log('文件上传不成功')
									}
								}
							});
						}
						

					}
				});



			},
			del(i) {
				console.log(i)
				let imgurl=this.uploadimg[i]
				console.log(imgurl)
				this.$myRequest({
						header: {
							'Authentication': uni.getStorageSync('Authentication')
						},
						url: '/upload',
						method: "DELETE",
						data: {
							"url": imgurl, 
						}
					})
				.then(response => {
							this.imgarr.splice(i, 1)
							this.uploadimg.splice(i,1)
							// console.log(this.imgarr.length)
				})
				.catch(error => {
					if (error.data.code == 500) {
						uni.$u.toast(error.data.message);
						return;
					}
					
					if(error.data.code == 401){
						this.goToLogin();
						return;
					}
				});
				
			},
			getAddress() {
				var _this = this;
				uni.chooseLocation({
					success: function(res) {
						_this.address = res.address
						_this.longitude = res.longitude
						_this.latitude = res.latitude
					}
				});
			},
			bindPickerChange: function(e) {
				this.SectionIndex = e.detail.value;
			},

			onEditorReady() {
				uni
					.createSelectorQuery()
					.select("#editor")
					.context((res) => {
						this.editorCtx = res.context;
					})
					.exec();
			},
			onStatusChange(e) {
				const formats = e.detail;
				this.formats = formats;
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {},
				});
			},
			insertImage() {
				// 插入图片
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.editorCtx.insertImage({
							src: res.tempFilePaths[0],
							alt: "图像",
							success: function() {},
						});
					},
				});
			},
			hadleFontConfirm(e) {
				// 文字选项确认
				console.log("eeeeeeeeee", e, this.formats);
				const {
					bold,
					fontSize,
					list,
					italic
				} = this.formats
				let resultName, resultVal, fontWeight;
				const {
					label,
					name,
					value,
					id
				} = e;
				if (name == "title") {
					resultName = "fontSize";
					if (value == "big") {
						resultVal = "22px";
						fontWeight = "bold";
						if (fontSize == '22px' && bold) {
							if (fontSize) {
								this.editorCtx.format("fontSize", fontSize);
							}
							if (bold) {
								this.editorCtx.format("bold");
							}
							this.currentId = ''
							this.fontshow = false
							return
						}
					} else if (value == "small") {
						resultVal = "16px";
						fontWeight = "bold";

						if (list) {
							this.editorCtx.format("list", list);
						}
						if (this.formats.italic) {
							this.editorCtx.format("italic");
						}
						if (fontSize == '16px' && bold) {
							if (fontSize) {
								this.editorCtx.format("fontSize", fontSize);
							}
							if (bold) {
								this.editorCtx.format("bold");
							}
							this.currentId = ''
							this.fontshow = false
							return
						}
					}
				} else if (name == "list") {
					resultName = "list";
					resultVal = value;
					if (fontSize) {
						this.editorCtx.format("fontSize", fontSize);
					}
					if (bold) {
						this.editorCtx.format("bold");
					}
					if (italic) {
						this.editorCtx.format("italic");
					}
					if (list) {
						this.editorCtx.format("list", list);
						this.currentId = ''
						this.fontshow = false
						return
					}
				} else if (name == "bold") {
					resultName = "bold";
					if (this.formats.fontSize) {
						this.editorCtx.format("fontSize", this.formats.fontSize);
					}
					if (this.formats.list) {
						this.editorCtx.format("list", this.formats.list);
					}
					if (this.formats.italic) {
						this.editorCtx.format("italic");
					}
					if (bold) {
						this.editorCtx.format("bold");
						console.log("bold--------------------", this.formats)
						this.currentId = ''
						this.fontshow = false
						return
					}
				} else if (name == "italic") {
					resultName = "italic";
					if (this.formats.fontSize) {
						this.editorCtx.format("fontSize", this.formats.fontSize);
					}
					if (this.formats.list) {
						this.editorCtx.format("list", this.formats.list);
					}
					if (this.formats.bold) {
						this.editorCtx.format("bold");
					}
					if (italic) {
						this.editorCtx.format("italic");
						this.currentId = ''
						this.fontshow = false
						return
					}
				}
				if (resultName == "fontSize" && this.formats.fontSize != resultVal) {
					this.editorCtx.format(resultName, resultVal);
				}
				if (resultName == "list" && this.formats.list != resultVal) {
					this.editorCtx.format(resultName, resultVal);
				}
				if (resultName == "bold" && !this.formats.bold) {
					this.editorCtx.format("bold");
				}
				if (resultName == "italic" && !this.formats.italic) {
					this.editorCtx.format("italic");
				}
				if (fontWeight == "bold" && !this.formats.bold) {
					this.editorCtx.format("bold");
				}

				this.fontshow = false;
			},
			handleFontOptShows() {
				// 文字选项弹出
				console.log("this.formats--show", this.formats);
				let fontSize = this.formats.fontSize;
				let fontWeight = this.formats.bold;
				let italic = this.formats.italic;
				let list = this.formats.list;

				if (fontSize == "22px" && fontWeight) {
					// 一级标题
					this.currentId = "0";
				} else if (fontSize == "16px" && fontWeight) {
					// 二级标题
					this.currentId = "1"
				} else if (fontWeight && !fontSize) {
					this.currentId = "2"
				} else if (italic) {
					this.currentId = "3"
				} else if (list == "ordered") {
					this.currentId = "4";
				} else if (list == "bullet") {
					this.currentId = "5";
				} else {
					this.currentId = ''
				}
				// this.HandleGetContents();
				// this.handleGetSelectionText();
				this.fontshow = true;
				// if()
			},
			handleFocus(e) {
				uni.getSelectedTextRange({
					success: (res) => {},
					fail: (err) => {},
				});
			},
			handleBlur(e) {},

			handleInput(e) {
				console.log("eeeeeeeeeeeee", e, this.formats);
				let html = e.detail.html;
				this.textLength = e.detail.text.length;

				new Promise((resolve, reject) => {
					if (
						html.endsWith("<p><br></p>") ||
						html.endsWith("<li><br></li></ul>") ||
						html.endsWith("<li><br></li></ol>")
					) {
						resolve(this.formats);
					}
				}).then((res) => {
					if (!res.list) {
						this.currentId = ''
						if (res.fontSize) {
							this.editorCtx.format("fontSize", "16px");
						}
						if (res.bold) {
							this.editorCtx.format("bold");
						}
						if (res.list) {
							this.editorCtx.format("list", res.list);
						}
						if (res.italic) {
							this.editorCtx.format("italic", res.italic);
						}
					}
					this.HandleGetContents();
				});
			},
			handeleUploadImg() {
				// 插入图片
				this.insertImage();
			},
			handleUndo() {
				// 撤销
				this.editorCtx.undo();
			},
			handeleRedu() {
				//恢复
				this.editorCtx.redo();
			},
			// 回显数据
			handleSetContents() {
				let html = `
								<p>99999999999999</p>
							`;
				this.editorCtx.setContents({
					html: html,
				});
			},
			handleChooseCate() {
				//选择分类
				this.$refs.catesRef.doCate();
			},
			handleChooseAvil() {
				//选择谁可见
				this.$refs.avilRef.doAvail();
			},

			HandleGetContents() {
				this.editorCtx.getContents({
					success: (res) => {},
				});
			},
			handleGetSelectionText() {
				this.editorCtx.getSelectionText({
					success: (res) => {},
				});
			},
		},
		mounted() {
			uni.getSystemInfo({
				success: (res) => {
					this.bottomHeight = res.safeAreaInsets.bottom + 30 + "rpx";
				},
			});
			uni.onKeyboardHeightChange((obj) => {
				let height = obj.height;
				if (height == 0) {
					height += 160;
				}
				this.bottomHeight = height + "rpx";
			});
			// this.getTagList();
		},
		fontList: [
			//文字样式
			{
				name: "title",
				value: "big",
				label: "一级标题",
				attr: "",
				id: "0",
			},
			{
				name: "title",
				value: "small",
				label: "二级标题",
				attr: "",
				id: "1",
			},
			// 新增
			{
				name: "bold",
				value: null,
				label: "加粗",
				id: "2",
			},
			{
				name: "italic",
				value: null,
				label: "倾斜",
				id: "3",
			},
			// 新增结束
			{
				name: "list",
				value: "ordered",
				label: "有序列表",
				attr: "",
				id: "4",
			},
			{
				name: "list",
				value: "bullet",
				label: "无序列表",
				attr: "",
				id: "5",
			},
		],
	}
</script>

<style lang="scss" scoped>
	.tool-bar {
		height: 100rpx;
		background-color: #cde;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.is-hover {
		color: rgba(255, 255, 255, 0.6);
		background-color: #179b16;
		border-color: #179b16;
	}

	/deep/.u-field {
		padding: 0 !important;
	}

	.upload {
		image {
			width: 200rpx;
			height: 200rpx;
		}
	}

	.item {
		border-radius: 60rpx;
		margin-right: 28rpx;
		width: calc((100% - 28rpx * 3) / 3);

		image {
			width: 100%;
			height: 200rpx;
			border-radius: 10rpx;
		}
	}

	// 给最外层的盒子添加伪元素，列不满则左对齐
	.item-box::after {
		content: "";
		flex: auto;
	}

	.existing_label {
		width: 620rpx;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: space-between;
		flex-wrap: wrap;

		.u-page__tag-item {
			margin-top: 8px;
			// background: rgba(41, 41, 69, 0.05);
			margin-right: 0rpx;
		}

		// .u-page__tag-item:nth-child(3n){
		// 	margin-right: 0;
		// }
		.u-tag u-tag--circle u-tag--primary--plain u-tag--medium {
			margin-right: 0px !important;
		}

		/deep/ {
			.u-tag--primary {
				border-radius: 50px;
				background-color: rgba(41, 41, 69, 0.05);
				border-color: #00b331 !important;
				// border-image:linear-gradient(to right,rgba(93, 164, 247, 1), rgba(50, 133, 228, 1))1!important;
			}

			.u-tag-wrapper {
				// background:  rgba(41, 41, 69, 0.05);
				border-radius: 50px;
			}

			.u-tag u-tag--circle u-tag--primary u-tag--medium {
				background-color: rgba(41, 41, 69, 0.05);
			}

			.u-tag--medium {
				padding: 0 15px;
				background: rgba(41, 41, 69, 0.05);
			}

			.u-tag__close--medium {
				border: 1px solid rgba(122, 122, 140, 1);
				background: #FFFFFF !important;
			}

			.u-tag__close {
				// background-color: #FFFFFF!important;
				top: 12px;
				right: 18px;
			}

			.u-icon__icon {
				color: rgba(122, 122, 140, 1) !important;
			}

			// .u-tag u-tag--circle u-tag--primary--plain u-tag--medium {
			// 	background: red;
			// }
		}
	}
</style>