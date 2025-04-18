import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MessageBubble } from '../../../src/components/chat/MessageBubble';
import { createStyleSheet } from 'react-native-unistyles';

// Mock the unistyles hook
jest.mock('react-native-unistyles', () => ({
  createStyleSheet: jest.fn().mockReturnValue({}),
  useStyles: jest.fn().mockReturnValue({
    styles: {
      container: {},
      userBubble: {},
      assistantBubble: {},
      messageText: {},
      timestamp: {},
      imageContainer: {},
      image: {},
      audioContainer: {},
      audioButton: {},
      audioButtonText: {},
    },
    theme: {
      colors: {
        primary: '#007AFF',
        secondary: '#E9E9EB',
        text: '#000000',
        textSecondary: '#8E8E93',
        background: '#FFFFFF',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
      },
    },
  }),
}));

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    const message = {
      id: 'test-id',
      role: 'user',
      content: 'Hello, this is a test message',
      timestamp: Date.now(),
    };
    
    const { getByText } = render(<MessageBubble message={message} />);
    
    expect(getByText('Hello, this is a test message')).toBeTruthy();
  });
  
  it('renders assistant message correctly', () => {
    const message = {
      id: 'test-id',
      role: 'assistant',
      content: 'I am the AI assistant',
      timestamp: Date.now(),
    };
    
    const { getByText } = render(<MessageBubble message={message} />);
    
    expect(getByText('I am the AI assistant')).toBeTruthy();
  });
  
  it('formats timestamp correctly', () => {
    const now = new Date();
    const message = {
      id: 'test-id',
      role: 'user',
      content: 'Test message',
      timestamp: now.getTime(),
    };
    
    const { getByText } = render(<MessageBubble message={message} />);
    
    // Check if timestamp is displayed in some format (exact format may vary)
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    expect(getByText(formattedTime)).toBeTruthy();
  });
  
  it('renders message with image attachment', () => {
    const message = {
      id: 'test-id',
      role: 'user',
      content: 'Check this image',
      timestamp: Date.now(),
      attachments: [
        { type: 'image', uri: 'https://example.com/image.jpg' }
      ],
    };
    
    const { getByTestId } = render(<MessageBubble message={message} />);
    
    expect(getByTestId('message-image')).toBeTruthy();
  });
  
  it('renders message with audio attachment', () => {
    const message = {
      id: 'test-id',
      role: 'user',
      content: 'Listen to this',
      timestamp: Date.now(),
      attachments: [
        { type: 'audio', uri: 'https://example.com/audio.mp3' }
      ],
    };
    
    const { getByText } = render(<MessageBubble message={message} />);
    
    expect(getByText('Play Audio')).toBeTruthy();
  });
  
  it('handles audio playback button press', () => {
    const mockPlayAudio = jest.fn();
    
    const message = {
      id: 'test-id',
      role: 'user',
      content: 'Listen to this',
      timestamp: Date.now(),
      attachments: [
        { type: 'audio', uri: 'https://example.com/audio.mp3' }
      ],
    };
    
    const { getByText } = render(
      <MessageBubble 
        message={message} 
        onPlayAudio={mockPlayAudio} 
      />
    );
    
    fireEvent.press(getByText('Play Audio'));
    
    expect(mockPlayAudio).toHaveBeenCalledWith('https://example.com/audio.mp3');
  });
});
