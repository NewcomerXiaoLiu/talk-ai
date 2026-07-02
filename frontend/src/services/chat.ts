import { v4 as uuidv4 } from 'uuid';
import type { Message } from '../types';

const API_BASE = '/api/chat';

// 流式发送消息
export async function* streamMessage(
  content: string,
  conversationId?: string
): AsyncGenerator<{ type: string; data: any }> {
  const response = await fetch(`${API_BASE}/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, conversationId })
  });

  if (!response.ok) {
    throw new Error('流式请求失败');
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.conversationId) {
            yield { type: 'conversationId', data: data.conversationId };
          } else if (data.content) {
            yield { type: 'content', data: data.content };
          } else if (data.done) {
            yield { type: 'done', data: data.message };
          } else if (data.error) {
            yield { type: 'error', data: data.error };
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }
}

// 发送普通消息（非流式）
export async function sendMessage(
  content: string,
  conversationId?: string
): Promise<{ conversationId: string; message: Message }> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, conversationId })
  });

  if (!response.ok) {
    throw new Error('发送消息失败');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '发送消息失败');
  }

  return data;
}

// 获取会话列表
export async function getConversations() {
  const response = await fetch(`${API_BASE}/conversations`);
  const data = await response.json();
  return data.conversations || [];
}

// 获取会话消息
export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
  const data = await response.json();
  return data.messages || [];
}

// 创建会话
export async function createConversation(title?: string) {
  const response = await fetch(`${API_BASE}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  const data = await response.json();
  return data.conversation;
}

// 删除会话
export async function deleteConversation(conversationId: string) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  return data.success;
}
