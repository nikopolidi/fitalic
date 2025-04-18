import React from 'react';
import { Image, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
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
  const styles = useStyles();
  
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

const useStyles = StyleSheet.create((theme) => ({
  container: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.xs,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceSecondary,
    borderBottomLeftRadius: theme.borderRadius.xs,
  },
  lastMessage: {
    marginBottom: theme.spacing.lg,
  },
  text: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
  userText: {
    color: theme.colors.text,
  },
  assistantText: {
    color: theme.colors.textTertiary,
  },
  timestamp: {
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
    opacity: 0.7,
  },
  attachmentContainer: {
    marginBottom: theme.spacing.sm,
  },
  attachment: {
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  audioAttachment: {
    backgroundColor: theme.colors.opacity(theme.colors.background, 0.05),
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioText: {
    fontSize: theme.typography.bodySmall.fontSize,
    marginLeft: theme.spacing.sm,
  },
}));

export default MessageBubble;
