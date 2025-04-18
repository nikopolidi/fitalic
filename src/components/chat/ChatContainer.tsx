import React from 'react';
import { View, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default ChatContainer;
