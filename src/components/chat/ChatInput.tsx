import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type ChatInputProps = {
  onSendMessage: (text: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAttachmentPress: () => void;
  isRecording: boolean;
};

/**
 * Chat input component with text input, voice recording, and attachment buttons
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStartRecording,
  onStopRecording,
  onAttachmentPress,
  isRecording
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.attachButton} 
        onPress={onAttachmentPress}
      >
        <FontAwesome name="paperclip" size={20} color="#007AFF" />
      </TouchableOpacity>
      
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor="#8E8E93"
        multiline
        maxLength={1000}
        editable={!isRecording}
      />
      
      {message.trim() ? (
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <FontAwesome name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.micButton, isRecording && styles.recordingButton]} 
          onPress={handleMicPress}
        >
          <FontAwesome 
            name={isRecording ? "stop" : "microphone"} 
            size={20} 
            color={isRecording ? "#FFFFFF" : "#007AFF"} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
});

export default ChatInput;
