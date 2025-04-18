import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUserStore } from '../../services/storage';

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
  // Get user data from store
  const userStore = useUserStore();
  const user = userStore.user;
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.setupText}>Please set up your profile</Text>
        <TouchableOpacity style={styles.setupButton} onPress={onEditPress}>
          <Text style={styles.setupButtonText}>Set Up Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Format BMI value
  const calculateBMI = (): number => {
    const { height, weight } = user.anthropometry;
    // BMI = weight(kg) / height(m)²
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  };
  
  // Get BMI category
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={onAvatarPress}>
        {user.avatarUri ? (
          <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome name="user" size={40} color="#FFFFFF" />
          </View>
        )}
        <View style={styles.editAvatarButton}>
          <FontAwesome name="camera" size={14} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      
      <Text style={styles.name}>{user.name}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.anthropometry.height}</Text>
          <Text style={styles.statLabel}>Height (cm)</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.anthropometry.weight}</Text>
          <Text style={styles.statLabel}>Weight (kg)</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{bmi}</Text>
          <Text style={styles.statLabel}>BMI ({bmiCategory})</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <FontAwesome name="edit" size={16} color="#FFFFFF" style={styles.editIcon} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 8,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  setupText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 16,
    textAlign: 'center',
  },
  setupButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileHeader;
