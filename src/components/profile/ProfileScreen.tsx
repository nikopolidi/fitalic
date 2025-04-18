import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useProgressStore, useUserStore } from '../../services/storage';
import AnthropometryForm from './AnthropometryForm';
import ProfileHeader from './ProfileHeader';
import ProgressGallery from './ProgressGallery';
import WeightTracker from './WeightTracker';

/**
 * Main profile screen component
 */
export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isEditMode, setIsEditMode] = useState(false);
  const { theme } = useUnistyles();
  
  // Get user data from store
  const userStore = useUserStore();
  const progressStore = useProgressStore();
  const user = userStore.user;
  
  // Handle avatar selection
  const handleAvatarPress = async () => {
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
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const avatarUri = result.assets[0].uri;
        
        // Update user avatar
        userStore.updateAvatar(avatarUri);
      }
    } catch (error) {
      console.error('Error picking avatar image:', error);
    }
  };
  
  // Handle edit profile button press
  const handleEditPress = () => {
    setIsEditMode(true);
  };
  
  // Handle save profile
  const handleSaveProfile = () => {
    setIsEditMode(false);
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };
  
  return (
    <View style={{
      ...styles.container, 
      paddingTop: insets.top
    }}>
      {isEditMode ? (
        <AnthropometryForm
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileHeader
            onEditPress={handleEditPress}
            onAvatarPress={handleAvatarPress}
          />
          
          {/* Progress Photo Gallery */}
          <ProgressGallery />
          
          {/* Weight Tracker */}
          <WeightTracker />
          
          {/* Settings Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Notification Preferences</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Privacy Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>About Fitalic</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sectionContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FF00FF',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ProfileScreen;
