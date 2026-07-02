import type { Message } from '../types';

// AI 提供者接口
export interface AIProvider {
  name: string;
  chat(messages: Message[]): Promise<string>;
  streamChat(messages: Message[]): AsyncGenerator<string>;
}

// MiMo API 实现（小米模型）
export class MiMoProvider implements AIProvider {
  name = 'mimo';
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, baseUrl: string, model: string = 'mimo-v2.5') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async chat(messages: Message[]): Promise<string> {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          model: this.model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        throw new Error(`MiMo API 请求失败: ${response.status}`);
      }

      const data: any = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('MiMo API 调用失败:', error);
      throw error;
    }
  }

  async *streamChat(messages: Message[]): AsyncGenerator<string> {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          model: this.model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`MiMo API 请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed: any = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // 解析失败，跳过
            }
          }
        }
      }
    } catch (error) {
      console.error('MiMo 流式调用失败:', error);
      throw error;
    }
  }
}

// 豆包 API 实现（备用）
export class DoubaoProvider implements AIProvider {
  name = 'doubao';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'doubao-pro') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(messages: Message[]): Promise<string> {
    // TODO: 实现豆包 API 调用
    console.log('调用豆包 API:', messages);
    return '豆包 API 返回的回复';
  }

  async *streamChat(messages: Message[]): AsyncGenerator<string> {
    // TODO: 实现豆包 API 流式调用
    console.log('调用豆包 API 流式:', messages);
    yield '豆包';
    yield ' API ';
    yield '流式';
    yield '回复';
  }
}

// 创建 AI 提供者工厂
export function createAIProvider(provider: string, config: any): AIProvider {
  switch (provider) {
    case 'mimo':
      return new MiMoProvider(config.apiKey, config.baseUrl, config.model);
    case 'doubao':
      return new DoubaoProvider(config.apiKey, config.model);
    default:
      throw new Error(`不支持的 AI 提供者: ${provider}`);
  }
}
