<template>
  <div class="message-input">
    <textarea 
      v-model="inputText" 
      placeholder="输入消息..." 
      @keydown.enter.prevent="sendMessage"
    ></textarea>
    <button @click="sendMessage" :disabled="!inputText.trim()">
      发送
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '../stores/chat';
import { v4 as uuidv4 } from 'uuid';

const chatStore = useChatStore();
const inputText = ref('');

const sendMessage = () => {
  if (!inputText.value.trim()) return;

  const message = {
    id: uuidv4(),
    role: 'user' as const,
    content: inputText.value,
    timestamp: new Date(),
    type: 'text' as const
  };

  chatStore.addMessage(message);
  inputText.value = '';
};
</script>

<style scoped>
.message-input {
  display: flex;
  padding: 16px;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
}

button {
  padding: 12px 24px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
