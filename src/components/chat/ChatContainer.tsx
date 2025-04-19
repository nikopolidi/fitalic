import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AITrainerService } from '../../services/ai';
import { useChatStore } from '../../services/storage/chatStore';
import ChatScreen from './ChatScreen';

/**
 * Container component for the chat tab
 */
export const ChatContainer: React.FC = () => {
  // Use selectors directly to subscribe to changes
  const currentSession = useChatStore(state => state.getCurrentSession());
  const createSessionAction = useChatStore(state => state.createSession);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  
  // Effect to ensure a session exists
  useEffect(() => {
    if (!currentSession) {
      createSessionAction();
    }
    // Dependency on createSessionAction ensures effect runs if store initializes later
    // Dependency on currentSession ensures it re-checks if session becomes null somehow
  }, [currentSession, createSessionAction]); 
  
  // Messages are now derived reactively from the selected currentSession
  const messages = currentSession?.messages ?? [];

  // --- Handlers ---

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    try {
      await AITrainerService.sendMessage(text);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show an alert to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Could not start recording.');
    }
  };

  const handleStopRecording = async () => {
    if (!recording) return;
    
    setIsRecording(false);
    setIsLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      if (uri) {
        // Here you would typically send the audio URI for transcription
        // and then send the transcribed text via AITrainerService.sendMessage
        console.log('Recording stopped, URI:', uri);
        // For now, sending placeholder text:
        await AITrainerService.sendMessage('[Simulated Voice Message]');
      } else {
        throw new Error('Failed to get recording URI.');
      }
    } catch (error) {
      console.error('Failed to stop recording or send message:', error);
      Alert.alert('Error', 'Failed to process recording.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachment = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot access media library.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setIsLoading(true);
        await AITrainerService.sendMessage(
          'Analyze this food image.',
          [{ type: 'image', uri: imageUri }]
        );
      }
    } catch (error) {
      console.error('Error picking image or sending message:', error);
      Alert.alert('Error', 'Could not process image attachment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ChatScreen
        messages={sortBy(messages, 'timestamp').reverse()}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onAttachmentPress={handleAttachment}
        isRecording={isRecording}
      />
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
