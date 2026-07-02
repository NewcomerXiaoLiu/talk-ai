<template>
  <div class="audio-player">
    <button class="play-btn" @click="togglePlay" :class="{ playing: isPlaying }">
      <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </button>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  src: string;
}>();

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);

onMounted(() => {
  audio.value = new Audio(props.src);
  
  audio.value.addEventListener('timeupdate', () => {
    if (audio.value) {
      currentTime.value = audio.value.currentTime;
      duration.value = audio.value.duration || 0;
      progress.value = duration.value ? (currentTime.value / duration.value) * 100 : 0;
    }
  });
  
  audio.value.addEventListener('ended', () => {
    isPlaying.value = false;
    currentTime.value = 0;
    progress.value = 0;
  });
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});

const togglePlay = () => {
  if (!audio.value) return;
  
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const formatTime = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.audio-player {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: $bg-card;
  border-radius: 20px;
  border: 1px solid $border-color;
}

.play-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: $color-primary;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-fast;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba($color-primary, 0.5);
  }
  
  &.playing {
    background: $color-secondary;
  }
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba($color-primary, 0.2);
  border-radius: 2px;
  overflow: hidden;
  
  .progress {
    height: 100%;
    background: $color-primary;
    border-radius: 2px;
    transition: width 0.1s linear;
  }
}

.time {
  font-size: 10px;
  color: $text-muted;
  font-family: $font-tech;
  white-space: nowrap;
}
</style>
