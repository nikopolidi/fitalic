
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../../types/database';

type MessageBubbleProps = {
  message: ChatMessage;
  isLastMessage: boolean;
};

/**
 * Message bubble component for chat interface
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLastMessage 
}) => {
  const isUser = message.role === 'user';
  
  return (
    <View 
      style={[
        styles.container, 
        isUser ? styles.userContainer : styles.assistantContainer,
        isLastMessage && styles.lastMessage
      ]}
    >
      {message.attachments && message.attachments.length > 0 && (
        <View style={styles.attachmentContainer}>
          {message.attachments.map((attachment, index) => (
            <View key={`attachment-${index}`} style={styles.attachment}>
              {attachment.type === 'image' && (
                <Image 
                  source={{ uri: attachment.uri }} 
                  style={styles.attachmentImage} 
                  resizeMode="cover"
                />
              )}
              {attachment.type === 'audio' && (
                <View style={styles.audioAttachment}>
                  <Text style={styles.audioText}>Voice Message</Text>
                  {/* Audio playback controls would go here */}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      
      <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
        {message.content}
      </Text>
      
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
    borderBottomLeftRadius: 4,
  },
  lastMessage: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.7,
  },
  attachmentContainer: {
    marginBottom: 8,
  },
  attachment: {
    marginBottom: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  audioAttachment: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default MessageBubble;
