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

// 创建 AI 提供者
const aiProvider = createAIProvider(config.ai.provider, config.ai.doubao);

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

    // 调用 AI 生成回复
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
