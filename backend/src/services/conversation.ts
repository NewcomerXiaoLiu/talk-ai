import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message } from '../types';

const DATA_DIR = path.join(__dirname, '../../data');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');
const MESSAGES_DIR = path.join(DATA_DIR, 'messages');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(MESSAGES_DIR)) {
  fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

// 读取会话列表
export function getConversations(): Conversation[] {
  if (!fs.existsSync(CONVERSATIONS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(CONVERSATIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

// 保存会话列表
export function saveConversations(conversations: Conversation[]): void {
  fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
}

// 创建新会话
export function createConversation(title: string = '新对话'): Conversation {
  const conversation: Conversation = {
    id: uuidv4(),
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const conversations = getConversations();
  conversations.push(conversation);
  saveConversations(conversations);

  return conversation;
}

// 获取会话详情
export function getConversation(id: string): Conversation | undefined {
  const conversations = getConversations();
  return conversations.find(c => c.id === id);
}

// 删除会话
export function deleteConversation(id: string): boolean {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === id);
  
  if (index === -1) {
    return false;
  }

  conversations.splice(index, 1);
  saveConversations(conversations);

  // 删除会话消息文件
  const messagesFile = path.join(MESSAGES_DIR, `${id}.json`);
  if (fs.existsSync(messagesFile)) {
    fs.unlinkSync(messagesFile);
  }

  return true;
}

// 添加消息到会话
export function addMessage(conversationId: string, message: Message): Message {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('会话不存在');
  }

  conversation.messages.push(message);
  conversation.updatedAt = new Date();

  // 更新会话列表
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index !== -1) {
    conversations[index] = conversation;
    saveConversations(conversations);
  }

  // 保存消息到单独文件
  const messagesFile = path.join(MESSAGES_DIR, `${conversationId}.json`);
  fs.writeFileSync(messagesFile, JSON.stringify(conversation.messages, null, 2));

  return message;
}

// 获取会话消息
export function getMessages(conversationId: string): Message[] {
  const messagesFile = path.join(MESSAGES_DIR, `${conversationId}.json`);
  
  if (!fs.existsSync(messagesFile)) {
    return [];
  }

  const data = fs.readFileSync(messagesFile, 'utf-8');
  return JSON.parse(data);
}
