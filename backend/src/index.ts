import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config';
import chatRoutes from './routes/chat';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = config.port;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/chat', chatRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Talk-AI 后端服务运行中' });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
