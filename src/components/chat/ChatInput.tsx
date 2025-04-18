import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
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
  const { theme } = useUnistyles();
  const styles = useStyles();

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
        <FontAwesome name="paperclip" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor={theme.colors.textTertiary}
        multiline
        maxLength={1000}
        editable={!isRecording}
      />
      
      {message.trim() ? (
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <FontAwesome name="send" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.micButton, isRecording && styles.recordingButton]} 
          onPress={handleMicPress}
        >
          <FontAwesome 
            name={isRecording ? "stop" : "microphone"} 
            size={20} 
            color={isRecording ? theme.colors.text : theme.colors.primary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const useStyles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  attachButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    maxHeight: 120,
    color: theme.colors.text,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  micButton: {
    backgroundColor: theme.colors.surface,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  recordingButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
}));

export default ChatInput;
