import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ChatMessage } from '../../types/database';
import TextMD from '../TextMD';

type MessageBubbleProps = {
  message: ChatMessage;
  isLastMessage: boolean;
};

// Keep styles definition inside for this approach, although types might complain
const styles = StyleSheet.create((theme) => ({
  container: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs, // Base margin
    // Nested variants for container (role, isLast)
    variants: {
      role: { 
        user: {
          // alignSelf is handled by the wrapper now
          backgroundColor: theme.colors.primary,
          borderBottomRightRadius: theme.borderRadius.xs,
        },
        assistant: {
          // alignSelf is handled by the wrapper now
          backgroundColor: theme.colors.surfaceSecondary,
          borderBottomLeftRadius: theme.borderRadius.xs,
        },
        system: {}
      },
      isLast:{
        true: {
          marginBottom: theme.spacing.lg 
        },
      }
    }
  },
  text: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
    // variants: {
    //   role: {
    //     user: {
    //       color: theme.colors.textContrast,
    //     },
    //     assistant: {
    //       color: theme.colors.textTertiary,
    //     },
    //     system: { color: theme.colors.textSecondary }
    //   }
    // }
  },
  timestamp: {
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
    opacity: 0.7,
    variants:{
      role: { // Variant name is 'role' here for consistency
        user: {
          color: theme.colors.textContrast,
        },
        assistant: {
          color: theme.colors.textTertiary,
        },
        system: {
          color: theme.colors.textSecondary,
        },
      },
    },
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
    color: theme.colors.text,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  errorIcon: {
    // Absolute positioning relative to the outer wrapper
    position: 'absolute',
    bottom: theme.spacing.lg, // 8px below
    left: -theme.spacing.md,   // 8px from the left edge of the wrapper
    opacity: 0.8,
  },
}));

/**
 * Message bubble component for chat interface
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLastMessage 
}) => {
  const { theme } = useUnistyles();
  const isUser = message.role === 'user';

  // Apply variants defined within styles
  styles.useVariants({
    role: message.role, 
    isLast: isLastMessage,
    // 'color' variant key was specific to timestamp, use 'role' now
    // color: isUser ? 'user' : 'assistant' 
  });
  
  return (
    // Parent View for alignment and relative positioning
    <View style={{ alignSelf: isUser ? 'flex-end' : 'flex-start' }}> 
      {/* Conditionally render Error Icon outside the bubble, but inside the wrapper */}
      
      {/* The actual message bubble */}
      <View style={styles.container}>
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
        
        {/* Text content (color handled by variant) */}
        <Text style={styles.text}>
          <TextMD color={styles.text.color}>{message.content}</TextMD>
        </Text>
        
        {/* Footer remains inside the bubble */}
        <View style={styles.footerContainer}>
          {/* Error Icon is now moved outside */}
          {/* Timestamp (color handled by variant) */}
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
      {isUser && message.error && (
        <FontAwesome 
          name="exclamation-circle" 
          size={theme.typography.caption.fontSize} 
          color={theme.colors.error} 
          // Apply the absolute positioning style
          style={styles.errorIcon}
        />
      )}
      
    </View>
  );
};


export default MessageBubble;
