<template>
	<view>
		
		<view class="editor-wrapper" style="background-color: #F8F8F8;">
					<editor id="editor" class="ql-container" @focus="handleFocus" @blur="handleBlur" @input="handleInput"
						placeholder="开始输入..." showImgSize showImgToolbar showImgResize @statuschange="onStatusChange"
						:read-only="readOnly" @ready="onEditorReady">
					</editor>
				</view>
		 
				<view class="bottom_opert bottom_safe" :style="{ bottom: bottomHeight }">
					<div class="text_info">
						{{ textLength > 0 ? textLength+"/100000" : "最多10万字" }}
					</div>
					<view class="more_opt">
						<view class="more_item" @click="handleChooseCate">
							{{
		            resultCateListult.length == 0
		              ? "选择分类"
		              : `已选择${resultCateListult.length}个分类`
		          }}
						</view>
						<view class="more_item" @click="handleChooseAvil">
							{{ resultVailInfo.resultName ? resultVailInfo.resultName : "谁可看" }}
						</view>
					</view>
					<view class="tool-bar">
						<!-- <view class="bottom_item" @click="handleFontOptShows"> 文字 </view> -->
						<view class="bottom_item" @click="handeleUploadImg"> 上传图片 </view>
						<view class="bottom_item" @click="handleUndo"> 撤销 </view>
		 
						<view class="bottom_item" @click="handeleRedu"> 恢复 </view>
					</view>
				</view>
				<picker @change="bindPickerChange" :value="SectionIndex" :range="Sectionarray" range-key="name">
							<view style="padding: 20rpx;background-color: #F8F8F8;">发布板块：{{ Sectionarray[SectionIndex].name }}</view>
				</picker>
				<!-- 	<u-picker :show="fontshow" :columns="fontList" keyName="label" :defaultIndex="defaultIndex"
					@confirm="hadleFontConfirm" @cancel="fontshow = false"> -->
				<!-- 字体类处理 -->
				<u-popup safeAreaInsetBottom :show="fontshow" mode="bottom" @close="fontListClose">
					<div class="content" round>
						<div class="content_item" v-for="(item,index) in fontList" :class="{activeItem:item.id ==currentId }"
							@click="hadleFontConfirm(item)">
							{{item.label}}
						</div>
					</div>
				</u-popup>
	</view>
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
				
			}
		},
		methods: {
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
							this.bottomHeight = res.safeAreaInsets.bottom + 40 + "px";
						},
					});
					uni.onKeyboardHeightChange((obj) => {
						let height = obj.height;
						if (height == 0) {
							height += 80;
						}
						this.bottomHeight = height + "px";
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

<style>
.tool-bar{
	height: 300rpx;
	background-color: #cde;
	display: flex;
	flex-direction:row;
	justify-content: center;
}
</style>
