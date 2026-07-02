# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个名为 "talk-ai" 的对话 AI 项目。项目目标是构建一个 AI 对话系统，支持语音对话和文字对话功能。

## 项目结构

```
talk-ai/
├── frontend/                 # 前端项目（Vue 3 + Vite）
├── backend/                  # 后端项目（Node.js + Express）
├── docs/                     # 文档
└── CLAUDE.md
```

## 技术栈

### 前端
- Vue 3 + Vite + TypeScript
- Pinia（状态管理）
- Vue Router（路由）

### 后端
- Node.js + Express + TypeScript
- JSON 文件存储数据
- AI 服务：豆包 API（可扩展）

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

后端需要配置以下环境变量（参考 `backend/.env.example`）：

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

## 开发规范

### 语言
- 项目文档和注释使用中文
- 代码变量和函数名使用英文

### 代码规范
- 遵循清晰的命名约定
- 保持代码简洁易读
- 添加必要的注释说明业务逻辑

### Git 提交规范
- 使用语义化的提交信息
- 提交信息使用中文
- 格式：`类型: 描述内容`
- 类型：feat（新功能）、fix（修复）、docs（文档）、style（样式）、refactor（重构）、test（测试）、chore（构建/工具）

## 待开发内容

- [ ] 完整的 AI 服务集成（豆包 API）
- [ ] 语音对话功能
- [ ] 流式输出支持
- [ ] 前端 UI 开发（等 Figma 设计稿）
- [ ] 用户认证功能
- [ ] 部署配置
