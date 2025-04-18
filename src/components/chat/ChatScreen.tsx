import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useChatStore } from '../../services/storage';
import { AITrainerService } from '../../services/ai';
import { ChatMessage } from '../../types/database';

/**
 * Main chat screen component
 */
export const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Get chat messages from store
  const chatStore = useChatStore();
  const currentSession = chatStore.getCurrentSession();
  const messages = currentSession?.messages || [];

  // Create a new session if none exists
  useEffect(() => {
    if (!currentSession) {
      chatStore.createSession();
      
      // Start initial assessment for new users
      startInitialAssessment();
    }
  }, [currentSession]);

  // Start initial assessment
  const startInitialAssessment = async () => {
    try {
      setIsLoading(true);
      await AITrainerService.startInitialAssessment();
    } catch (error) {
      console.error('Error starting initial assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a text message
  const handleSendMessage = async (text: string) => {
    try {
      setIsLoading(true);
      await AITrainerService.sendMessage(text);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle attachment (image) selection
  const handleAttachment = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return;
      }
      
      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        // Send image to AI for analysis
        setIsLoading(true);
        await AITrainerService.sendMessage(
          'Please analyze this food image.',
          [{ type: 'image', uri: imageUri }]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Permission to record audio was denied');
        return;
      }
      
      // Set up recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop voice recording and process audio
  const stopRecording = async () => {
    try {
      if (!recording) return;
      
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      // Get recording URI
      const uri = recording.getURI();
      setRecording(null);
      
      if (!uri) {
        console.error('No recording URI available');
        return;
      }
      
      // In a real implementation, we would transcribe the audio
      // and send it to the AI service
      
      // For now, we'll just send a placeholder message
      setIsLoading(true);
      await AITrainerService.sendMessage(
        'This is a voice message that would be transcribed.',
        [{ type: 'audio', uri }]
      );
    } catch (error) {
      console.error('Error stopping recording:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MessageBubble
            message={item}
            isLastMessage={index === messages.length - 1}
          />
        )}
        contentContainerStyle={[
          styles.messagesContainer,
          { paddingTop: insets.top + 10 }
        ]}
        showsVerticalScrollIndicator={false}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onAttachmentPress={handleAttachment}
        isRecording={isRecording}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
});

export default ChatScreen;
