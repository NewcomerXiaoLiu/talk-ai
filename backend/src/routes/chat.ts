import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createAIProvider } from '../services/ai-provider';
import { 
  createConversation, 
  getConversations, 
  getConversation, 
  deleteConversation,
  addMessage,
  getMessages
} from '../services/conversation';
import config from '../config';
import type { Message } from '../types';

const router = Router();

// 根据配置创建 AI 提供者
function getAIProvider() {
  const provider = config.ai.provider;
  
  switch (provider) {
    case 'mimo':
      return createAIProvider('mimo', config.ai.mimo);
    case 'doubao':
      return createAIProvider('doubao', config.ai.doubao);
    default:
      return createAIProvider('mimo', config.ai.mimo);
  }
}

// 发送消息
router.post('/', async (req: Request, res: Response) => {
  try {
    const { conversationId, content, type = 'text' } = req.body;

    // 获取或创建会话
    let conversation = getConversation(conversationId);
    if (!conversation) {
      conversation = createConversation();
    }

    // 创建用户消息
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
      type: type as 'text' | 'voice'
    };

    // 保存用户消息
    addMessage(conversation.id, userMessage);

    // 获取 AI 提供者并调用
    const aiProvider = getAIProvider();
    const messages = getMessages(conversation.id);
    const aiResponse = await aiProvider.chat(messages);

    // 创建 AI 回复
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      type: 'text'
    };

    // 保存 AI 回复
    addMessage(conversation.id, assistantMessage);

    res.json({
      success: true,
      conversationId: conversation.id,
      message: assistantMessage
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ success: false, error: '发送消息失败' });
  }
});

// 流式发送消息
router.post('/stream', async (req: Request, res: Response) => {
  try {
    const { conversationId, content, type = 'text' } = req.body;

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 获取或创建会话
    let conversation = getConversation(conversationId);
    if (!conversation) {
      conversation = createConversation();
    }

    // 创建用户消息
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
      type: type as 'text' | 'voice'
    };

    // 保存用户消息
    addMessage(conversation.id, userMessage);

    // 发送会话 ID
    res.write(`data: ${JSON.stringify({ conversationId: conversation.id })}\n\n`);

    // 获取 AI 提供者并流式调用
    const aiProvider = getAIProvider();
    const messages = getMessages(conversation.id);
    
    let fullResponse = '';
    
    for await (const chunk of aiProvider.streamChat(messages)) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    // 创建 AI 回复并保存
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
      type: 'text'
    };

    addMessage(conversation.id, assistantMessage);

    // 发送完成信号
    res.write(`data: ${JSON.stringify({ done: true, message: assistantMessage })}\n\n`);
    res.end();
  } catch (error) {
    console.error('流式发送消息失败:', error);
    res.write(`data: ${JSON.stringify({ error: '发送消息失败' })}\n\n`);
    res.end();
  }
});

// 获取会话列表
router.get('/conversations', (req: Request, res: Response) => {
  try {
    const conversations = getConversations();
    res.json({ success: true, conversations });
  } catch (error) {
    console.error('获取会话列表失败:', error);
    res.status(500).json({ success: false, error: '获取会话列表失败' });
  }
});

// 创建新会话
router.post('/conversations', (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const conversation = createConversation(title);
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('创建会话失败:', error);
    res.status(500).json({ success: false, error: '创建会话失败' });
  }
});

// 获取会话详情
router.get('/conversations/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const conversation = getConversation(id);
    
    if (!conversation) {
      return res.status(404).json({ success: false, error: '会话不存在' });
    }

    res.json({ success: true, conversation });
  } catch (error) {
    console.error('获取会话详情失败:', error);
    res.status(500).json({ success: false, error: '获取会话详情失败' });
  }
});

// 删除会话
router.delete('/conversations/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const success = deleteConversation(id);
    
    if (!success) {
      return res.status(404).json({ success: false, error: '会话不存在' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('删除会话失败:', error);
    res.status(500).json({ success: false, error: '删除会话失败' });
  }
});

// 获取会话消息
router.get('/conversations/:id/messages', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const messages = getMessages(id);
    res.json({ success: true, messages });
  } catch (error) {
    console.error('获取消息失败:', error);
    res.status(500).json({ success: false, error: '获取消息失败' });
  }
});

export default router;
