import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileScreen from './ProfileScreen';

/**
 * Profile container component that wraps the ProfileScreen
 * This allows for easier integration with the tab navigation
 */
export const ProfileContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});

export default ProfileContainer;
