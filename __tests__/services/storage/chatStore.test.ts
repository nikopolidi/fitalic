import { renderHook, act } from '@testing-library/react-hooks';
import { useChatStore } from '../../../src/services/storage/chatStore';
import { MMKV } from 'react-native-mmkv';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  const mockMMKV = {
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  };
  return {
    MMKV: jest.fn(() => mockMMKV),
  };
});

describe('ChatStore', () => {
  let mockMMKV: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockMMKV = new MMKV();
  });

  it('should initialize with empty messages array', () => {
    const { result } = renderHook(() => useChatStore());
    
    expect(result.current.messages).toEqual([]);
  });

  it('should add a message', () => {
    const { result } = renderHook(() => useChatStore());
    
    const newMessage = {
      role: 'user' as const,
      content: 'Test message',
      timestamp: Date.now(),
    };
    
    let messageId: string;
    
    act(() => {
      messageId = result.current.addMessage(newMessage);
    });
    
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].id).toBe(messageId);
    expect(result.current.messages[0].content).toBe('Test message');
    expect(mockMMKV.set).toHaveBeenCalled();
  });

  it('should delete a message', () => {
    const { result } = renderHook(() => useChatStore());
    
    const newMessage = {
      role: 'user' as const,
      content: 'Test message',
      timestamp: Date.now(),
    };
    
    let messageId: string;
    
    // Add a message first
    act(() => {
      messageId = result.current.addMessage(newMessage);
    });
    
    // Then delete it
    act(() => {
      result.current.deleteMessage(messageId);
    });
    
    expect(result.current.messages).toHaveLength(0);
    expect(mockMMKV.set).toHaveBeenCalled();
  });

  it('should clear all messages', () => {
    const { result } = renderHook(() => useChatStore());
    
    // Add a few messages
    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Message 1',
        timestamp: Date.now(),
      });
      
      result.current.addMessage({
        role: 'assistant',
        content: 'Message 2',
        timestamp: Date.now(),
      });
    });
    
    // Then clear all messages
    act(() => {
      result.current.clearMessages();
    });
    
    expect(result.current.messages).toHaveLength(0);
    expect(mockMMKV.delete).toHaveBeenCalledWith('chatMessages');
  });

  it('should get context for AI', () => {
    const { result } = renderHook(() => useChatStore());
    
    // Add a few messages
    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Message 1',
        timestamp: Date.now() - 3000,
      });
      
      result.current.addMessage({
        role: 'assistant',
        content: 'Message 2',
        timestamp: Date.now() - 2000,
      });
      
      result.current.addMessage({
        role: 'user',
        content: 'Message 3',
        timestamp: Date.now() - 1000,
      });
    });
    
    // Get context for AI
    const context = result.current.getContextForAI();
    
    // Should include all messages
    expect(context).toHaveLength(3);
    
    // Should be in chronological order
    expect(context[0].content).toBe('Message 1');
    expect(context[1].content).toBe('Message 2');
    expect(context[2].content).toBe('Message 3');
  });

  it('should get limited context for AI', () => {
    const { result } = renderHook(() => useChatStore());
    
    // Add more messages than the default limit
    for (let i = 0; i < 15; i++) {
      act(() => {
        result.current.addMessage({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i + 1}`,
          timestamp: Date.now() - (15 - i) * 1000, // Oldest first
        });
      });
    }
    
    // Get context for AI with a limit of 5
    const context = result.current.getContextForAI(5);
    
    // Should include only the 5 most recent messages
    expect(context).toHaveLength(5);
    
    // Should be the last 5 messages
    expect(context[0].content).toBe('Message 11');
    expect(context[4].content).toBe('Message 15');
  });

  it('should add a message with attachments', () => {
    const { result } = renderHook(() => useChatStore());
    
    const newMessage = {
      role: 'user' as const,
      content: 'Test message with attachment',
      timestamp: Date.now(),
      attachments: [
        { type: 'image' as const, uri: 'file:///test/image.jpg' }
      ],
    };
    
    let messageId: string;
    
    act(() => {
      messageId = result.current.addMessage(newMessage);
    });
    
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].attachments).toHaveLength(1);
    expect(result.current.messages[0].attachments?.[0].type).toBe('image');
    expect(result.current.messages[0].attachments?.[0].uri).toBe('file:///test/image.jpg');
    expect(mockMMKV.set).toHaveBeenCalled();
  });
});
