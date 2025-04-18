import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { FontAwesome } from '@expo/vector-icons';
import ProfileHeader from './ProfileHeader';
import AnthropometryForm from './AnthropometryForm';
import ProgressGallery from './ProgressGallery';
import WeightTracker from './WeightTracker';
import { useUserStore } from '../../services/storage/userStore';
import { useProgressStore } from '../../services/storage/progressStore';

/**
 * Main profile screen component
 */
export const ProfileScreen: React.FC = () => {
  const { theme } = useUnistyles();
  const styles = useStyles();
  const { user, updateUser } = useUserStore();
  const { progressPhotos, weightEntries, addProgressPhoto, deleteProgressPhoto, addWeightEntry, deleteWeightEntry } = useProgressStore();
  
  const [showEditForm, setShowEditForm] = useState(false);
  
  const handleEditPress = () => {
    setShowEditForm(true);
  };
  
  const handleSaveProfile = (updatedUser: typeof user) => {
    updateUser(updatedUser);
    setShowEditForm(false);
  };
  
  const handleCancelEdit = () => {
    setShowEditForm(false);
  };
  
  const handleAvatarPress = () => {
    // Implement avatar selection logic
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
          photos={progressPhotos}
          onAddPhoto={addProgressPhoto}
          onDeletePhoto={deleteProgressPhoto}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight Tracker</Text>
        <WeightTracker 
          entries={weightEntries}
          onAddEntry={addWeightEntry}
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
          user={user}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      </Modal>
    </ScrollView>
  );
};

const useStyles = StyleSheet.create((theme) => ({
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
