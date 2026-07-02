<template>
  <div class="voice-recorder">
    <div class="recorder-btn" :class="{ recording: isRecording }" @mousedown="startRecording" @mouseup="stopRecording" @mouseleave="cancelRecording">
      <div class="btn-ring" v-if="isRecording"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    </div>
    <div class="recorder-status" v-if="isRecording">
      <span class="duration">{{ formatDuration(duration) }}</span>
      <span class="hint">松开发送，上滑取消</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const emit = defineEmits<{
  (e: 'start'): void;
  (e: 'stop', audioBlob: Blob): void;
  (e: 'cancel'): void;
}>();

const isRecording = ref(false);
const duration = ref(0);
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let timer: number | null = null;
let stream: MediaStream | null = null;

const startRecording = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    duration.value = 0;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.start();
    isRecording.value = true;
    emit('start');

    // 开始计时
    timer = window.setInterval(() => {
      duration.value++;
    }, 1000);
  } catch (error) {
    console.error('录音启动失败:', error);
  }
};

const stopRecording = () => {
  if (!isRecording.value || !mediaRecorder) return;

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    emit('stop', audioBlob);
    cleanup();
  };

  mediaRecorder.stop();
  isRecording.value = false;
};

const cancelRecording = () => {
  if (!isRecording.value || !mediaRecorder) return;

  mediaRecorder.onstop = () => {
    emit('cancel');
    cleanup();
  };

  mediaRecorder.stop();
  isRecording.value = false;
};

const cleanup = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  mediaRecorder = null;
  audioChunks = [];
  duration.value = 0;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

onUnmounted(() => {
  cleanup();
});
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.voice-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.recorder-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-primary, $color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-fast;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 30px rgba($color-primary, 0.5);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.recording {
    animation: recordingPulse 1s infinite;
    
    .btn-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid $color-primary;
      border-radius: 50%;
      animation: ringPulse 1s infinite;
    }
  }
  
  svg {
    color: white;
  }
}

@keyframes recordingPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba($color-primary, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba($color-primary, 0); }
}

@keyframes ringPulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.recorder-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  
  .duration {
    font-size: 16px;
    color: $color-primary;
    font-weight: bold;
    font-family: $font-tech;
  }
  
  .hint {
    font-size: 12px;
    color: $text-muted;
  }
}
</style>
