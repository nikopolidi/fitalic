import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ChatInput } from '../../../src/components/chat/ChatInput';
import { createStyleSheet } from 'react-native-unistyles';

// Mock the unistyles hook
jest.mock('react-native-unistyles', () => ({
  createStyleSheet: jest.fn().mockReturnValue({}),
  useStyles: jest.fn().mockReturnValue({
    styles: {
      container: {},
      inputContainer: {},
      input: {},
      sendButton: {},
      sendButtonText: {},
      attachmentButton: {},
      attachmentButtonText: {},
      recordButton: {},
      recordButtonText: {},
      recordingContainer: {},
      recordingText: {},
      recordingTimer: {},
      recordingCancelButton: {},
      recordingCancelButtonText: {},
    },
    theme: {
      colors: {
        primary: '#007AFF',
        secondary: '#E9E9EB',
        text: '#000000',
        textSecondary: '#8E8E93',
        background: '#FFFFFF',
        danger: '#FF3B30',
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

// Mock permissions and image picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file:///test/image.jpg' }],
  }),
}));

jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    Recording: {
      createAsync: jest.fn().mockResolvedValue({
        recording: {
          startAsync: jest.fn(),
          stopAndUnloadAsync: jest.fn().mockResolvedValue({}),
          getStatusAsync: jest.fn().mockResolvedValue({ durationMillis: 5000 }),
        },
        status: { canRecord: true },
      }),
    },
  },
}));

describe('ChatInput', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <ChatInput onSendMessage={jest.fn()} />
    );
    
    expect(getByPlaceholderText('Type a message...')).toBeTruthy();
    expect(getByText('Send')).toBeTruthy();
  });
  
  it('handles text input changes', () => {
    const { getByPlaceholderText } = render(
      <ChatInput onSendMessage={jest.fn()} />
    );
    
    const input = getByPlaceholderText('Type a message...');
    fireEvent.changeText(input, 'Hello, world!');
    
    expect(input.props.value).toBe('Hello, world!');
  });
  
  it('calls onSendMessage when send button is pressed', () => {
    const mockSendMessage = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );
    
    const input = getByPlaceholderText('Type a message...');
    fireEvent.changeText(input, 'Hello, world!');
    
    const sendButton = getByText('Send');
    fireEvent.press(sendButton);
    
    expect(mockSendMessage).toHaveBeenCalledWith('Hello, world!', undefined);
    expect(input.props.value).toBe(''); // Input should be cleared after sending
  });
  
  it('does not send empty messages', () => {
    const mockSendMessage = jest.fn();
    const { getByText } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );
    
    const sendButton = getByText('Send');
    fireEvent.press(sendButton);
    
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
  
  it('handles attachment button press', async () => {
    const mockSendMessage = jest.fn();
    const { getByTestId } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );
    
    const attachmentButton = getByTestId('attachment-button');
    fireEvent.press(attachmentButton);
    
    // Wait for the image picker to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.any(String),
      [{ type: 'image', uri: 'file:///test/image.jpg' }]
    );
  });
  
  it('handles record button press', async () => {
    const mockSendMessage = jest.fn();
    const { getByTestId, getByText, queryByText } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );
    
    // Start recording
    const recordButton = getByTestId('record-button');
    fireEvent.press(recordButton);
    
    // Should show recording UI
    expect(getByText('Recording...')).toBeTruthy();
    
    // Stop recording
    const stopButton = getByText('Stop');
    fireEvent.press(stopButton);
    
    // Wait for the recording to process
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Recording UI should be hidden
    expect(queryByText('Recording...')).toBeNull();
    
    // Should have sent the message with audio attachment
    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.any(String),
      [{ type: 'audio', uri: expect.any(String) }]
    );
  });
  
  it('handles recording cancellation', () => {
    const mockSendMessage = jest.fn();
    const { getByTestId, getByText, queryByText } = render(
      <ChatInput onSendMessage={mockSendMessage} />
    );
    
    // Start recording
    const recordButton = getByTestId('record-button');
    fireEvent.press(recordButton);
    
    // Should show recording UI
    expect(getByText('Recording...')).toBeTruthy();
    
    // Cancel recording
    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);
    
    // Recording UI should be hidden
    expect(queryByText('Recording...')).toBeNull();
    
    // Should not have sent any message
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
