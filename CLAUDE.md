# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个名为 "talk-ai" 的对话 AI 项目。项目目标是构建一个 AI 对话系统，支持语音对话和文字对话功能。采用贾维斯（钢铁侠）风格的炫酷 UI 设计。

## 项目结构

```
talk-ai/
├── frontend/                 # 前端项目（Vue 3 + Vite）
│   ├── src/
│   │   ├── components/       # Vue 组件
│   │   ├── views/            # 页面视图
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── services/         # API 服务
│   │   ├── styles/           # SCSS 样式
│   │   ├── types/            # TypeScript 类型
│   │   └── assets/           # 静态资源
│   └── package.json
├── backend/                  # 后端项目（Node.js + Express）
│   ├── src/
│   │   ├── routes/           # API 路由
│   │   ├── services/         # 业务服务（AI、对话管理）
│   │   ├── config/           # 配置文件
│   │   └── types/            # TypeScript 类型
│   ├── data/                 # 数据存储
│   └── package.json
├── docs/                     # 文档
├── CLAUDE.md
└── README.md
```

## 技术栈

### 前端
- Vue 3 + Vite + TypeScript
- SCSS 样式
- Pinia（状态管理）
- 贾维斯风格 UI（粒子球、心跳动画、钢铁侠红金配色）

### 后端
- Node.js + Express + TypeScript
- JSON 文件存储数据
- AI 服务：豆包 API（可扩展架构）

## 开发命令

### 前端开发
```bash
cd frontend
pnpm install
pnpm dev
```

### 后端开发
```bash
cd backend
pnpm install
pnpm dev
```

## API 接口

### 聊天相关
- `POST /api/chat` - 发送消息
- `GET /api/chat/conversations` - 获取会话列表
- `POST /api/chat/conversations` - 创建新会话
- `GET /api/chat/conversations/:id` - 获取会话详情
- `DELETE /api/chat/conversations/:id` - 删除会话
- `GET /api/chat/conversations/:id/messages` - 获取会话消息

### 健康检查
- `GET /health` - 健康检查

## 环境变量

### 后端（参考 `backend/.env.example`）
```env
# AI 服务配置
DOUBAO_API_KEY=your_doubao_api_key
DOUBAO_MODEL=doubao-pro

# 语音服务配置（可选）
OPENAI_API_KEY=your_openai_api_key

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 前端（参考 `frontend/.env`）
```env
# Figma API 配置（开发用）
VITE_FIGMA_TOKEN=your_figma_token
VITE_FIGMA_FILE_KEY=your_figma_file_key
```

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

## 开发规范

### 语言
- 项目文档和注释使用中文
- 代码变量和函数名使用英文

### 代码规范
- 使用 TypeScript 进行开发
- 遵循清晰的命名约定
- 保持代码简洁易读

### Git 提交规范
- 使用语义化的提交信息
- 提交信息使用中文
- 格式：`类型: 描述内容`
- 类型：feat（新功能）、fix（修复）、docs（文档）、style（样式）、refactor（重构）、test（测试）、chore（构建/工具）

## 已完成功能

- [x] AI 服务集成（MiMo v2.5）
- [x] 语音对话功能（MiMo ASR/TTS）
- [x] 流式输出支持

## 待开发内容

- [ ] 部署配置
