import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Message, Conversation } from '../types';

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref<Message[]>([]);
  const conversations = ref<Conversation[]>([]);
  const currentConversation = ref<string | null>(null);
  const isStreaming = ref(false);
  const isRecording = ref(false);

  // 方法
  const addMessage = (message: Message) => {
    messages.value.push(message);
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const setCurrentConversation = (id: string | null) => {
    currentConversation.value = id;
  };

  const setIsStreaming = (value: boolean) => {
    isStreaming.value = value;
  };

  const setIsRecording = (value: boolean) => {
    isRecording.value = value;
  };

  return {
    messages,
    conversations,
    currentConversation,
    isStreaming,
    isRecording,
    addMessage,
    clearMessages,
    setCurrentConversation,
    setIsStreaming,
    setIsRecording
  };
});
