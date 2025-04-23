import { FontAwesome } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useUserStore } from '../../services/storage/userStore';

type ProfileHeaderProps = {
  onEditPress: () => void;
  onAvatarPress: () => void;
};

/**
 * Profile header component with user info and avatar
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onEditPress,
  onAvatarPress
}) => {
  const { theme } = useUnistyles();
  
  const { user } = useUserStore();
  
  // Calculate BMI
  const bmi = useMemo(()=>{
    if(!user) return '0';
    // Access height and weight via user.anthropometry
    const height = user.anthropometry.height || 0;
    const weight = user.anthropometry.weight || 0;
    return height > 0
    ? (weight / ((height / 100) * (height / 100))).toFixed(1)
    : '0';
  }, [user]) // Add user as dependency
  
  // Determine BMI category
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: theme.colors.warning };
    if (bmi < 25) return { text: 'Normal', color: theme.colors.success };
    if (bmi < 30) return { text: 'Overweight', color: theme.colors.warning };
    return { text: 'Obese', color: theme.colors.error };
  };
  
  const bmiCategory = getBmiCategory(parseFloat(bmi));
  if(!user) return null;
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={onAvatarPress}
      >
        {user.avatarUri ? (
          <Image 
            source={{ uri: user.avatarUri }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome name="user" size={40} color={theme.colors.textSecondary} />
          </View>
        )}
        <View style={styles.editAvatarButton}>
          <FontAwesome name="camera" size={14} color={theme.colors.text} />
        </View>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name || 'Your Name'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.anthropometry.height || 0}</Text>
            <Text style={styles.statLabel}>cm</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.anthropometry.weight || 0}</Text>
            <Text style={styles.statLabel}>kg</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bmi}</Text>
            <Text style={styles.statLabel}>BMI</Text>
            <Text style={[styles.bmiCategory, { color: bmiCategory.color }]}>
              {bmiCategory.text}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={onEditPress}
      >
        <FontAwesome name="edit" size={16} color={theme.colors.text} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  bmiCategory: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignSelf: 'center',
  },
  editButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
}));

export default ProfileHeader;
