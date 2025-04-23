import Icon from '@/components/Icon';
import IconButton from '@/components/IconButton';
import Typography from '@/components/Typography';
import React, { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type ChatInputProps = {
  onSendMessage: (text: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAttachmentPress: () => void;
  isRecording: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
};

/**
 * Chat input component with text input, voice recording, and attachment buttons
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStartRecording,
  onStopRecording,
  onAttachmentPress,
  isRecording,
  isLoading = false,
  onCancel
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { theme } = useUnistyles();
  const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false);
  

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const toggleAttachmentMenu = () => {
    setIsAttachmentMenuVisible(prev => !prev);
  };

  const handleCameraPress = () => {
    console.log('Camera pressed');
    setIsAttachmentMenuVisible(false);
    // Add camera logic here
  };

  const handleGalleryPress = () => {
    console.log('Gallery pressed');
    setIsAttachmentMenuVisible(false);
    // Add gallery logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <IconButton
          family="fontAwesome"
          name={isAttachmentMenuVisible ? "close" : "paperclip"}
          size="md"
          onPress={toggleAttachmentMenu}
          disabled={isLoading}
        />
        
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          maxLength={1000}
          editable={!isLoading}
        />
        
        {isLoading ? (
          <IconButton 
            family="materialCommunityIcons" 
            name="stop-circle-outline" 
            size="md"
            iconSize="md"
            onPress={onCancel} 
            disabled={!onCancel}
          />
        ) : (
          <IconButton 
            family="materialIcons" 
            name="send" 
            size="md"
            iconSize="md"
            onPress={handleSend} 
            disabled={!message.trim()}
          />
        )}
      </View>

      <Modal
        transparent={true}
        visible={isAttachmentMenuVisible}
        onRequestClose={() => {
          setIsAttachmentMenuVisible(false);
        }}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={() => setIsAttachmentMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View onStartShouldSetResponder={() => true} style={styles.attachmentMenuContainer}>
              <View style={styles.attachmentMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={handleCameraPress}>
                  <Icon family="fontAwesome" name="camera" size="sm" color={'textSecondary'} />
                  <Typography style={styles.menuItemText}>Camera</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleGalleryPress}>
                  <Icon family="fontAwesome" name="picture-o" size="sm" color={'textSecondary'} />
                  <Typography style={styles.menuItemText}>Gallery</Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create((theme) => ({
  keyboardAvoidingView: {
    width: '100%',
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
    textAlignVertical: 'center',
  },
  attachmentMenuContainer: {
    position: 'absolute',
    bottom: 65,
    left: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  attachmentMenu: {
    maxWidth: 'auto',
    position: 'absolute',
    alignSelf: 'flex-start',
    bottom: 65,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomStartRadius: 0,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    flex: 1
  },
  menuItemText: {
    marginLeft: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
}));

export default ChatInput;
