// 消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'text' | 'voice';
  audioUrl?: string;
}

// 会话类型
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// 设置类型
export interface Settings {
  aiProvider: string;
  voiceEnabled: boolean;
  theme: 'light' | 'dark';
}
