import { useProgressStore } from '@/services/storage/progressStore';
import { useUserStore } from '@/services/storage/userStore';
import type { ProgressPhoto, UserData, WeightEntry } from '@/types/database';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import AnthropometryForm from './AnthropometryForm';
import ProfileHeader from './ProfileHeader';
import ProgressGallery from './ProgressGallery';
import WeightTracker from './WeightTracker';

/**
 * Main profile screen component
 */
export const ProfileScreen: React.FC = () => {
  const { theme } = useUnistyles();
  const { user, updateUser } = useUserStore();
  const { progressData, addPhoto, deletePhoto, addWeightEntry, deleteWeightEntry } = useProgressStore();
  
  const [showEditForm, setShowEditForm] = useState(false);
  
  useEffect(() => {
    if (!user) {
      updateUser({});
    }
  }, [user]);

  const handleEditPress = () => {
    setShowEditForm(true);
  };
  
  const handleSaveProfile = (updatedProfile: Partial<UserData>) => {
    updateUser(updatedProfile);
    setShowEditForm(false);
  };
  
  const handleCancelEdit = () => {
    setShowEditForm(false);
  };
  
  const handleAvatarPress = () => {
    // Implement avatar selection logic
  };

  const handleAddWeightEntry = (weight: number, note: string) => {
    const newEntry: Omit<WeightEntry, 'id'> = { 
      date: new Date().getTime(), 
      weight, 
      notes: note
    };
    addWeightEntry(newEntry);
  };

  // Handler to trigger photo adding process using expo-image-picker
  const handleAddPhoto = async () => {
    // Request media library permissions
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaLibraryPermission.status !== 'granted') {
      Alert.alert('Permission required', 'Please grant media library permissions to select a photo.');
      return;
    }

    // Optionally, request camera permissions if you want to allow taking photos
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    // You might want to handle camera permission denial similarly

    // Show options to choose from library or take a photo
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        {
          text: 'Choose from Library',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [4, 4],
              quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const selectedImage = result.assets[0];
              const photoData: Omit<ProgressPhoto, 'id'> = {
                imageUri: selectedImage.uri,
                date: Date.now(),
                // Add other fields like notes if needed
              };
              addPhoto(photoData);
            }
          },
        },
        {
          text: 'Take Photo',
          onPress: async () => {
            if (cameraPermission.status !== 'granted') {
              Alert.alert('Permission required', 'Please grant camera permissions to take a photo.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 4],
              quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const takenImage = result.assets[0];
              const photoData: Omit<ProgressPhoto, 'id'> = {
                imageUri: takenImage.uri,
                date: Date.now(),
                // Add other fields like notes if needed
              };
              addPhoto(photoData);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ProfileHeader 
        onEditPress={handleEditPress}
        onAvatarPress={handleAvatarPress}
      />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Photos</Text>
        <ProgressGallery 
          photos={progressData.photos}
          onAddPhoto={handleAddPhoto}
          onDeletePhoto={deletePhoto}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight Tracker</Text>
        <WeightTracker 
          entries={progressData.weightEntries}
          onAddEntry={handleAddWeightEntry}
          onDeleteEntry={deleteWeightEntry}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="bell" size={20} color={theme.colors.primary} style={styles.settingIcon} />
          <Text style={styles.settingText}>Notifications</Text>
          <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="lock" size={20} color={theme.colors.primary} style={styles.settingIcon} />
          <Text style={styles.settingText}>Privacy</Text>
          <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="question-circle" size={20} color={theme.colors.primary} style={styles.settingIcon} />
          <Text style={styles.settingText}>Help & Support</Text>
          <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome name="info-circle" size={20} color={theme.colors.primary} style={styles.settingIcon} />
          <Text style={styles.settingText}>About</Text>
          <FontAwesome name="chevron-right" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={showEditForm}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowEditForm(false)}
      >
        <AnthropometryForm 
          user={user as UserData}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  settingIcon: {
    marginRight: theme.spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
}));

export default ProfileScreen;
