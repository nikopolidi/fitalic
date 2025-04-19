/**
 * Index file for database types
 */

export * from './nutrition';
export * from './progress';
export * from './user';

// AI Chat types
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: {
    type: 'image' | 'audio';
    uri: string;
  }[];
  error?: boolean;
};

export type ChatSession = {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

export type AIResponse = {
  text: string;
  data?: any; // Structured data that can be parsed by the application
  type?: 'nutrition' | 'workout' | 'general' | 'anthropometry';
  nextSteps?: string[];
  questions?: string[];
};
