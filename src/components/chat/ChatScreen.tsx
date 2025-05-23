import React, { useCallback, useMemo } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ChatMessage } from '../../types/database';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

type ChatScreenProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAttachmentPress: () => void;
  isRecording: boolean;
};

/**
 * Main chat screen component that displays messages and input
 */
export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages = [],
  isLoading,
  onSendMessage,
  onStartRecording,
  onStopRecording,
  onAttachmentPress,
  isRecording
}) => {
  
  const { theme } = useUnistyles();

  const lastMessageIndex = useMemo(()=>{
    return messages.length - 1
  }, [messages?.length])
  
  const renderMessage = useCallback(({ item, index }: { item: ChatMessage; index: number }) => (
    <MessageBubble 
      message={item} 
      isLastMessage={index === lastMessageIndex} 
    />
  ), [lastMessageIndex]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
    >
      {messages.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Start a conversation with your AI fitness trainer
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          inverted
        />
      )}
      
      <ChatInput
        onSendMessage={onSendMessage}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onAttachmentPress={onAttachmentPress}
        isRecording={isRecording}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messageList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.opacity(theme.colors.background, 0.7),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.h3.lineHeight,
  },
}));

export default ChatScreen;
