# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Talk-AI - 贾维斯风格 AI 对话系统，支持语音对话和文字对话。采用 MiMo v2.5 作为 AI 和语音服务。

## 开发命令

### 启动开发服务器
```bash
cd backend && pnpm dev   # 后端 :3000
cd frontend && pnpm dev  # 前端 :5173
```

### 构建
```bash
cd frontend && pnpm build  # vue-tsc + vite build
cd backend && pnpm build   # tsc
```

### 类型检查
```bash
cd frontend && npx vue-tsc --noEmit
cd backend && npx tsc --noEmit
```

## 架构

### 前端 (Vue 3 + Vite + TypeScript + Pinia)
- `src/views/ChatView.vue` - 主界面，集成粒子球/心跳动画/语音/聊天
- `src/components/` - VoiceRecorder（录音）、AudioPlayer（播放）
- `src/services/` - chat.ts（流式SSE）、voice.ts（ASR/TTS）
- `src/stores/` - Pinia 状态管理

### 后端 (Node.js + Express + TypeScript)
- `src/services/ai-provider.ts` - AI 服务抽象层（AIProvider 接口 + MiMoProvider）
- `src/services/voice.ts` - MiMo ASR/TTS 语音服务
- `src/services/conversation.ts` - JSON 文件存储会话数据
- `src/routes/chat.ts` - 聊天 API + SSE 流式端点
- `src/routes/voice.ts` - 语音 API（multipart upload）
- `src/config/index.ts` - 环境变量配置

### 数据流
```
前端 ChatView → chat.ts (fetch SSE) → /api/chat/stream → MiMoProvider.streamChat → MiMo API
前端 VoiceRecorder → voice.ts → /api/voice/transcribe → MiMo ASR → 文字 → ChatView
```

## 关键配置

### 环境变量 (backend/.env)
```env
AI_PROVIDER=mimo
MIMO_API_KEY=          # 必填
MIMO_BASE_URL=https://api.xiaomimimo.com/v1
MIMO_MODEL=mimo-v2.5
MIMO_DEFAULT_VOICE=冰糖
```

### MiMo API 认证
使用 `api-key` header（非 Bearer Token）：
```typescript
headers: { 'api-key': apiKey }
```

### MiMo ASR 请求格式
```json
{
  "model": "mimo-v2.5-asr",
  "messages": [{ "role": "user", "content": [{ "type": "input_audio", "input_audio": { "data": "data:audio/wav;base64,..." } }] }],
  "asr_options": { "language": "zh" }
}
```

### MiMo TTS 请求格式
```json
{
  "model": "mimo-v2.5-tts",
  "messages": [{ "role": "user", "content": "" }, { "role": "assistant", "content": "要合成的文本" }],
  "audio": { "format": "wav", "voice": "冰糖" }
}
```

### 可用音色
中文：冰糖、茉莉、苏打、白桦 | 英文：Mia、Chloe、Milo、Dean

## 开发规范

- 文档/注释用中文，变量/函数名用英文
- 包管理工具：pnpm
- Git 提交：`类型: 描述内容`（feat/fix/docs/style/refactor/test/chore）
- TypeScript 严格模式，类型标注明确
