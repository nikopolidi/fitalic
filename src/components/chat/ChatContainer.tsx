import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import ChatScreen from './ChatScreen';
import { useChatStore } from '../../services/storage/chatStore';

/**
 * Container component for the chat tab
 */
export const ChatContainer: React.FC = () => {
  const styles = useStyles();
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    startRecording, 
    stopRecording, 
    handleAttachment,
    isRecording 
  } = useChatStore();

  return (
    <View style={styles.container}>
      <ChatScreen
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onAttachmentPress={handleAttachment}
        isRecording={isRecording}
      />
    </View>
  );
};

const useStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default ChatContainer;
