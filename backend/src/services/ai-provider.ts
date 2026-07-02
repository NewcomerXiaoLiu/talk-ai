import type { Message } from '../types';

// AI 提供者接口
export interface AIProvider {
  name: string;
  chat(messages: Message[]): Promise<string>;
  streamChat(messages: Message[]): AsyncGenerator<string>;
}

// 豆包 API 实现
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
    case 'doubao':
      return new DoubaoProvider(config.apiKey, config.model);
    default:
      throw new Error(`不支持的 AI 提供者: ${provider}`);
  }
}
