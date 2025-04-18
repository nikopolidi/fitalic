import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import ChatScreen from './ChatScreen';

/**
 * Chat container component that wraps the ChatScreen
 * This allows for easier integration with the tab navigation
 */
export const ChatContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default ChatContainer;
