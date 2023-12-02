<template>
	<view>
		<view class="plr">
						<textarea value="editorCtx" v-model="message" maxlength="1000" placeholder="输入内容（最多1000字）" class="w100" style="height: 450rpx;" />
						</view>
<view class="item-box flex flex-wrap u-m-l-36 u-m-r-8">
				<view class="item upload u-m-t-20 relative" v-for="(item,i) in imgarr" :key="i" v-show="imgarr.length!=0">
					<image :src="item.img1" v-if=""></image>
					<image @click="del(i)" src="../../static/del_image.png" class="absolute" style="width: 32rpx;height: 32rpx;top: 5rpx;right: 5rpx;" v-if=""></image>
				</view>
				<view class="item upload u-m-t-20" @click="getimg" v-show="imgarr.length < 9">
					<image src="../../static/upload_image.png" v-if=""></image>
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
				<view class="existing_label">
									<view class="u-page__tag-item" v-for="(item, index) in allTags" :key="index">
										<u-tag shape="circle"  :text="item.name" :bgColor="item.checked ? '#00ff7f':'#FFFFFF'" :color="item.checked ? '#FFFFFF':'#00b331'"  :name="index"
											@click="chooseTag(index,item)" borderColor='#00ff7f'   :closable='tagClosable'
											@close="closelabelTag">
										</u-tag>
									</view>
								</view>

					<picker @change="bindPickerChange" :value="SectionIndex" :range="Sectionarray" range-key="name">
								<view style="padding: 20rpx;background-color: #F8F8F8;color: #2D983A;">发布板块：&#32;&#32;&#32;&#32;{{ Sectionarray[SectionIndex].name }}</view>
					</picker>
					
					
					<button size="default" type="default" 
						style="margin-top: 20px;width: 283px;height: 40px;background-color: #2D983A;color: #FFFFFF;border: none;border-radius: 5px;font-size: 16px;text-align: center;line-height: 40px;cursor: pointer;" 
						hover-class="is-hover">发布帖子</button>
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
	
</template>

<script>

	export default {
		data() {
			return {
				textLength:0,
				currentId:'',
				editorCtx:'',
				fontshow:false,
				Sectionarray: [{ name: '所有帖子' }, { name: '二手交易' }, { name: '组队' }, { name: '身边趣事' }, { name: '时事新闻' }],
				SectionIndex: 0,
				bottomHeight:'',
				message:'',
				imgarr:[],
				address:'请选择',
				longitude:'',
				latitude:'',
				allTags:[
									{
										name:'开心',
										checked: false
									},
									{
										name:'玉玉了',
										checked: false
									},
									{
										name:'愉悦',
										checked: false
									},
									{
										name:'I ♥ SEU',
										checked: false
									},
								],
			tag:[],
			}
		},
		onNavigationBarButtonTap(){
					if(!this.message.trim()){
						uni.showToast({
							title:'请输入文字内容',
							icon:'none'
						})
					}else if(this.imgarr.length==0){
						uni.showToast({
							title:'请上传图片',
							icon:'none'
						})
					}else{
						let img=[]
						this.imgarr.forEach(item=>{
							img.push(item.img2)
						})
						this.$http('/api/dynamic/addDynamic',{
							content:this.message,
							img:img.join(','),
							lng:this.longitude,
							lat:this.latitude
						},"POST").then(data=>{
							uni.navigateBack()
							setTimeout(()=>{
								uni.showToast({
									title:'发布成功',
								})
							},100)
						})
					}
				},
		methods: {
			chooseTag(index,item) {
						this.allTags[index].checked = !this.allTags[index].checked
						let data = this.allTags
						let arr = []
						data.forEach(item=>{
							if(item.checked){
								arr.push({
									//这里是根据接口的要求截取的一些字段，如果你不需要筛选可以直接push(item)
									id: item.id,
									name: item.name
								})
							}
						})
						this.tag = arr
						console.log(this.tag)
						//this.form.patient.allergy = JSON.stringify(this.allergy)
					},

			getimg(){
							upload(9-this.imgarr.length).then((arr)=>{
								console.log(arr)
								this.imgarr.push(...arr)
							})
						},
			del(i){
							this.imgarr.splice(i,1)
						},
						getAddress(){
							var _this = this;
							uni.chooseLocation({
							    success: function (res) {
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
		mounted(){
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
					this.getTagList();
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
.tool-bar{
	height: 100rpx;
	background-color: #cde;
	display: flex;
	flex-direction:row;
	justify-content: center;
}
.is-hover {
	color: rgba(255, 255, 255, 0.6);
	background-color: #179b16;
	border-color: #179b16;
  }
/deep/.u-field{
		padding: 0 !important;
	}
	.upload {
		image{
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
				.u-tag u-tag--circle u-tag--primary--plain u-tag--medium{
					margin-right: 0px!important;
				}
				/deep/{
					.u-tag--primary{
						border-radius: 50px;
						background-color:rgba(41, 41, 69, 0.05);
						border-color: #00b331!important;
						// border-image:linear-gradient(to right,rgba(93, 164, 247, 1), rgba(50, 133, 228, 1))1!important;
					}
					.u-tag-wrapper {
						// background:  rgba(41, 41, 69, 0.05);
						border-radius: 50px;
					}
					.u-tag u-tag--circle u-tag--primary u-tag--medium {
						background-color:rgba(41, 41, 69, 0.05);
					}
					.u-tag--medium{
						padding: 0 15px;
						background:  rgba(41, 41, 69, 0.05);
					}
					.u-tag__close--medium{
						border: 1px solid rgba(122, 122, 140, 1);
						background:  #FFFFFF !important;
					}
					.u-tag__close{
						// background-color: #FFFFFF!important;
						top:12px;
						right: 18px;
					}
					.u-icon__icon{
						color:rgba(122, 122, 140, 1)!important;
					}
					// .u-tag u-tag--circle u-tag--primary--plain u-tag--medium {
					// 	background: red;
					// }
				}
			}
		
</style>
