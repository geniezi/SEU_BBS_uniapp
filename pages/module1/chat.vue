<template>
  <div class="chat-container">
    <div class="top-bar">
		<p class="chat-partner-name">{{ chatPartnerName }}</p>
    </div>
    <div class="message-container">
      <div v-for="message in messages" :key="message.id" class="message">
        <p class="message-time">{{ message.time }}</p>
        <div v-if="message.isMyMessage" class="my-message">
          <div class="message-bubble green-background">
            {{ message.text }}
          </div>
          <img class="avatar-right" src="/static/avatar2.jpg" alt="My Avatar" />
        </div>
        <div v-else class="other-message">
          <img class="avatar-left" src="/static/avatar1.jpg" alt="Partner Avatar" />
          <div class="message-bubble grey-background">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="input-container">
      <input type="text" class="message-input" placeholder="输入消息..." />
      <button class="send-button" @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      chatPartnerName: '张三',
      messages: [
        { id: 1, text: '你好123', time: '2023年11月14日 10:00:00', isMyMessage: false },
        { id: 2, text: '你好，有什么可以帮助你的吗12312312312312312312312312？', time: '2023年11月14日 10:01:00', isMyMessage: true },
        // 其他消息
      ]
    };
  },
  methods: {
		sendMessage(){
			console.log('test1')
            this.$myRequest({
			header: {
				'Authentication':uni.getStorageSync('Authentication')
				}, 
			url:  '/chat/send',
			method: 'POST',
			data: {
				"receiverId":1728297677709512704,
				"content":'testMessage',
				"picUrl":''
				},
			success: (res) => {
				console.log("send succ")	       		
				} 
			}); 
		}
		
		},

  
  		}

</script>

<style>
/* 样式可以根据实际情况进行调整 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.top-bar {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 10px;
  background-color: #f0f0f0;
}
.chat-partner-name {
  /* 样式定义 */
text-align: center;
font-weight: bold;
}
.message-container {
  flex: 1;
  overflow-y: scroll;
  padding: 10px;
}
.message {
  margin-bottom: 10px;
  text-align: center;
}
.message-time {
  color: #999;
}
.my-message {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.other-message {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.avatar-left {
  /* 样式定义 */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /* Add your styles here */
}
.avatar-right {
  /* 样式定义 */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /* Add your styles here */
}
.message-bubble {
  padding: 8px;
  border-radius: 10px;
  margin: 5px;
  max-width: 70%;
}
.grey-background {
  background-color: #f0f0f0;
}
.green-background {
  background-color: #dcf8c6;
}
.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
}
.message-input {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
}
.send-button {
  /* 样式定义 */
}
</style>
