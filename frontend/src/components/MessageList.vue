<template>
  <div class="message-list">
    <div 
      v-for="message in messages" 
      :key="message.id" 
      :class="['message', message.role]"
    >
      <div class="message-content">
        {{ message.content }}
      </div>
      <div class="message-time">
        {{ formatTime(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '../stores/chat';
import type { Message } from '../types';

const chatStore = useChatStore();
const messages = computed(() => chatStore.messages);

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message.assistant {
  margin-right: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  background: #f0f0f0;
}

.message.user .message-content {
  background: #007AFF;
  color: white;
}

.message.assistant .message-content {
  background: #e9e9eb;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
