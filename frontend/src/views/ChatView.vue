<template>
  <div class="jarvis-container">
    <!-- 背景效果 -->
    <div class="bg-effects">
      <div class="scan-line"></div>
      <div class="grid-overlay"></div>
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>
    </div>

    <!-- 头部 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-text">J.A.R.V.I.S</span>
          <span class="logo-sub">AI ASSISTANT</span>
        </div>
      </div>
      <div class="header-center">
        <div class="status-indicator" :class="{ active: isConnected }">
          <span class="status-dot"></span>
          <span class="status-text">{{ isConnected ? 'ONLINE' : 'OFFLINE' }}</span>
        </div>
      </div>
      <div class="header-right">
        <button class="mode-btn" @click="toggleMode" :class="{ active: showChat }">
          <svg v-if="!showChat" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 粒子球视图 -->
      <div v-if="!showChat" class="particle-view">
        <div class="particle-sphere" :class="{ pulsing: isVoiceActive }">
          <div class="sphere-ring ring-1"></div>
          <div class="sphere-ring ring-2"></div>
          <div class="sphere-ring ring-3"></div>
          <div class="sphere-core"></div>
          <div class="particle" v-for="i in 50" :key="i" :style="getParticleStyle(i)"></div>
        </div>
        <div class="ai-label">
          <span class="label-text">JARVIS</span>
          <span class="label-sub">READY</span>
        </div>
      </div>

      <!-- 对话记录视图 -->
      <div v-else class="chat-view">
        <div class="messages-container" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            </div>
            <p>开始对话吧</p>
          </div>
          <div v-for="msg in messages" :key="msg.id" :class="['message', msg.role]">
            <div class="message-avatar">
              <span v-if="msg.role === 'user'">U</span>
              <span v-else>J</span>
            </div>
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>
          <div v-if="isTyping" class="message assistant">
            <div class="message-avatar"><span>J</span></div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部输入区 -->
    <footer class="footer">
      <div class="input-container">
        <button class="voice-btn" :class="{ active: isVoiceActive }" @click="toggleVoice">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        </button>
        <input 
          v-model="inputText"
          type="text" 
          placeholder="输入消息..."
          @keydown.enter="sendMessage"
          class="message-input"
        />
        <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
      <div class="system-status">
        <span class="status-item">CPU: {{ systemStatus.cpu }}%</span>
        <span class="status-item">活动: {{ systemStatus.activity }}%</span>
        <span class="status-item">能量: {{ systemStatus.energy }}%</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const messages = ref<Message[]>([]);
const inputText = ref('');
const showChat = ref(false);
const isVoiceActive = ref(false);
const isConnected = ref(true);
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const systemStatus = ref({
  cpu: 23,
  activity: 87,
  energy: 94
});

const toggleMode = () => {
  showChat.value = !showChat.value;
};

const toggleVoice = () => {
  isVoiceActive.value = !isVoiceActive.value;
};

const getParticleStyle = (index: number) => {
  const angle = (index / 50) * 360;
  const radius = 80 + Math.random() * 40;
  const x = Math.cos(angle * Math.PI / 180) * radius;
  const y = Math.sin(angle * Math.PI / 180) * radius;
  const delay = Math.random() * 2;
  const duration = 2 + Math.random() * 2;
  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--delay': `${delay}s`,
    '--duration': `${duration}s`
  };
};

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!inputText.value.trim()) return;

  const userMessage: Message = {
    id: uuidv4(),
    role: 'user',
    content: inputText.value,
    timestamp: new Date()
  };

  messages.value.push(userMessage);
  inputText.value = '';
  showChat.value = true;
  scrollToBottom();

  // 模拟 AI 回复
  isTyping.value = true;
  setTimeout(() => {
    const aiMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '贾维斯收到，正在处理您的请求...',
      timestamp: new Date()
    };
    messages.value.push(aiMessage);
    isTyping.value = false;
    scrollToBottom();
  }, 1500);
};

// 更新系统状态
onMounted(() => {
  setInterval(() => {
    systemStatus.value.cpu = Math.floor(20 + Math.random() * 30);
    systemStatus.value.activity = Math.floor(70 + Math.random() * 30);
    systemStatus.value.energy = Math.floor(80 + Math.random() * 20);
  }, 3000);
});
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.jarvis-container {
  width: 100%;
  height: 100vh;
  background: $bg-darker;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

// 背景效果
.bg-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, $color-primary, transparent);
  animation: scan 4s linear infinite;
  opacity: 0.5;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba($color-primary, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba($color-primary, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid rgba($color-primary, 0.3);
  
  &-tl { top: 20px; left: 20px; border-right: none; border-bottom: none; }
  &-tr { top: 20px; right: 20px; border-left: none; border-bottom: none; }
  &-bl { bottom: 20px; left: 20px; border-right: none; border-top: none; }
  &-br { bottom: 20px; right: 20px; border-left: none; border-top: none; }
}

// 头部
.header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid $border-color;
  background: rgba($bg-dark, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
}

.logo {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: $color-secondary;
  letter-spacing: 4px;
}

.logo-sub {
  font-size: 10px;
  color: $text-muted;
  letter-spacing: 2px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $text-muted;
    transition: all $transition-normal;
  }
  
  &.active .status-dot {
    background: $color-primary;
    box-shadow: 0 0 10px $color-primary;
    animation: pulse 2s infinite;
  }
  
  .status-text {
    font-size: 12px;
    color: $text-muted;
    letter-spacing: 1px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.mode-btn {
  width: 44px;
  height: 44px;
  border: 1px solid $border-color;
  background: transparent;
  color: $text-secondary;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  
  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    background: rgba($color-primary, 0.1);
  }
  
  &.active {
    border-color: $color-secondary;
    color: $color-secondary;
    background: rgba($color-secondary, 0.1);
  }
}

// 主内容区
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

// 粒子球视图
.particle-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.particle-sphere {
  width: 300px;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.pulsing {
    .sphere-core {
      transform: scale(1.2);
      box-shadow: 0 0 60px $color-primary;
    }
    
    .sphere-ring {
      transform: scale(1.3);
      opacity: 0.8;
    }
  }
}

.sphere-ring {
  position: absolute;
  border: 1px solid rgba($color-primary, 0.3);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
  
  &.ring-1 {
    width: 280px;
    height: 280px;
    animation-duration: 8s;
  }
  
  &.ring-2 {
    width: 240px;
    height: 240px;
    animation-duration: 12s;
    animation-direction: reverse;
    border-color: rgba($color-secondary, 0.3);
  }
  
  &.ring-3 {
    width: 200px;
    height: 200px;
    animation-duration: 16s;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sphere-core {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, $color-primary, $color-accent);
  border-radius: 50%;
  box-shadow: 0 0 40px $color-primary, 0 0 80px rgba($color-primary, 0.5);
  transition: all $transition-slow;
  animation: corePulse 3s ease-in-out infinite;
}

@keyframes corePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: $color-secondary;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(var(--x), var(--y));
  animation: particleFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes particleFloat {
  0%, 100% { opacity: 0.3; transform: translate(var(--x), var(--y)) scale(1); }
  50% { opacity: 1; transform: translate(var(--x), calc(var(--y) - 10px)) scale(1.5); }
}

.ai-label {
  text-align: center;
  
  .label-text {
    display: block;
    font-size: 32px;
    font-weight: bold;
    color: $color-secondary;
    letter-spacing: 8px;
    text-shadow: 0 0 20px rgba($color-secondary, 0.5);
  }
  
  .label-sub {
    display: block;
    font-size: 14px;
    color: $text-muted;
    letter-spacing: 4px;
    margin-top: 8px;
  }
}

// 对话视图
.chat-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: $text-muted;
  
  .empty-icon {
    color: rgba($color-primary, 0.3);
  }
  
  p {
    font-size: 16px;
    letter-spacing: 2px;
  }
}

.message {
  display: flex;
  gap: 12px;
  max-width: 70%;
  animation: fadeIn 0.3s ease;
  
  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  
  &.assistant {
    align-self: flex-start;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
  
  .user & {
    background: linear-gradient(135deg, $color-primary, $color-accent);
  }
  
  .assistant & {
    background: linear-gradient(135deg, $color-secondary, $color-gold);
  }
}

.message-content {
  .message-text {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
    
    .user & {
      background: linear-gradient(135deg, $color-primary, $color-accent);
      border-bottom-right-radius: 4px;
    }
    
    .assistant & {
      background: $bg-card;
      border: 1px solid $border-color;
      border-bottom-left-radius: 4px;
    }
  }
  
  .message-time {
    font-size: 10px;
    color: $text-muted;
    margin-top: 4px;
    
    .user & {
      text-align: right;
    }
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  
  span {
    width: 6px;
    height: 6px;
    background: $color-primary;
    border-radius: 50%;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
  30% { transform: translateY(-8px); opacity: 1; }
}

// 底部输入区
.footer {
  padding: 20px 30px;
  border-top: 1px solid $border-color;
  background: rgba($bg-dark, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: 12px;
  transition: all $transition-fast;
  
  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 20px rgba($color-primary, 0.2);
  }
}

.voice-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: $text-secondary;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  
  &:hover {
    color: $color-primary;
    background: rgba($color-primary, 0.1);
  }
  
  &.active {
    color: $color-primary;
    background: rgba($color-primary, 0.2);
    animation: voicePulse 1s infinite;
  }
}

@keyframes voicePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba($color-primary, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba($color-primary, 0); }
}

.message-input {
  flex: 1;
  height: 44px;
  background: transparent;
  border: none;
  color: $text-primary;
  font-family: $font-tech;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: $text-muted;
  }
}

.send-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, $color-primary, $color-accent);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba($color-primary, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.system-status {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 12px;
  
  .status-item {
    font-size: 10px;
    color: $text-muted;
    letter-spacing: 1px;
  }
}
</style>
