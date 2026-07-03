# Talk-AI 对话系统

一个采用贾维斯（钢铁侠）风格的炫酷 AI 对话系统，支持语音对话和文字对话功能。

## 功能特性

- 贾维斯风格 UI - 深色科技背景、粒子球动画、钢铁侠红金配色
- 文字对话 - 支持与 AI 进行文字交流
- 语音对话 - 语音识别（MiMo ASR）+ 语音合成（MiMo TTS）
- 会话管理 - 创建、切换、删除会话
- 流式输出 - 支持实时流式显示 AI 回复

## 技术栈

### 前端
- Vue 3 + Vite + TypeScript
- SCSS 样式
- Pinia（状态管理）
- 贾维斯风格 UI 组件

### 后端
- Node.js + Express + TypeScript
- JSON 文件存储数据
- AI 服务：MiMo v2.5（小米模型，可扩展架构）
- 语音服务：MiMo ASR/TTS

## 项目结构

```
talk-ai/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/       # Vue 组件
│   │   ├── views/            # 页面视图
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── services/         # API 服务
│   │   ├── styles/           # SCSS 样式
│   │   └── types/            # TypeScript 类型
│   └── package.json
├── backend/                  # 后端项目
│   ├── src/
│   │   ├── routes/           # API 路由
│   │   ├── services/         # 业务服务
│   │   └── config/           # 配置文件
│   ├── data/                 # 数据存储
│   └── package.json
├── CLAUDE.md
└── README.md
```

## 快速开始

### 前置条件

- Node.js 18+
- pnpm

### 安装依赖

```bash
# 安装前端依赖
cd frontend
pnpm install

# 安装后端依赖
cd ../backend
pnpm install
```

### 配置环境变量

```bash
# 后端配置
cp backend/.env.example backend/.env
# 编辑 backend/.env 文件，填入 MiMo API 密钥
```

### 启动开发服务器

```bash
# 启动后端服务器
cd backend
pnpm dev

# 启动前端服务器（在另一个终端）
cd frontend
pnpm dev
```

### 访问应用

- 前端：http://localhost:5173
- 后端：http://localhost:3000

## UI 设计

### 贾维斯风格

- 深色科技背景 + 扫描线 + 粒子效果
- 钢铁侠红金配色（#EF4444 红色 + #F59E0B 金色）
- 科技感字体（Share Tech Mono / Fira Code）
- HUD 四角装饰 + 网格背景

### 界面功能

- 粒子球默认视图（3D 旋转 + 能量环动画）
- 心跳动画（语音按钮脉动效果）
- 模式切换（粒子视图/对话记录）
- 聊天界面（消息气泡 + 打字机效果）
- 系统状态监控（CPU/活动/能量）

## API 接口

### 聊天相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/chat | 发送消息 |
| POST | /api/chat/stream | 流式发送消息（SSE） |
| GET | /api/chat/conversations | 获取会话列表 |
| POST | /api/chat/conversations | 创建新会话 |
| GET | /api/chat/conversations/:id | 获取会话详情 |
| DELETE | /api/chat/conversations/:id | 删除会话 |
| GET | /api/chat/conversations/:id/messages | 获取会话消息 |

### 语音相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/voice/transcribe | 语音转文字（MiMo ASR） |
| POST | /api/voice/synthesize | 文字转语音（MiMo TTS） |

### 健康检查

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /health | 健康检查 |

## 环境变量

### 后端

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| AI_PROVIDER | AI 服务提供商 | mimo |
| MIMO_API_KEY | MiMo API 密钥 | - |
| MIMO_BASE_URL | MiMo API 地址 | https://api.xiaomimimo.com/v1 |
| MIMO_MODEL | 文本模型名称 | mimo-v2.5 |
| MIMO_DEFAULT_VOICE | 默认语音音色 | 冰糖 |
| PORT | 服务器端口 | 3000 |
| NODE_ENV | 运行环境 | development |

## 可用音色

| 音色名 | 语言 | 性别 |
|--------|------|------|
| 冰糖 | 中文 | 女性 |
| 茉莉 | 中文 | 女性 |
| 苏打 | 中文 | 男性 |
| 白桦 | 中文 | 男性 |
| Mia | 英文 | 女性 |
| Chloe | 英文 | 女性 |
| Milo | 英文 | 男性 |
| Dean | 英文 | 男性 |

## 开发规范

### Git 提交规范

使用语义化的提交信息，格式：`类型: 描述内容`

- feat: 新功能
- fix: 修复 bug
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
- chore: 构建/工具

## 已完成功能

- [x] AI 服务集成（MiMo v2.5）
- [x] 语音对话功能（MiMo ASR/TTS）
- [x] 流式输出支持

## 许可证

MIT
