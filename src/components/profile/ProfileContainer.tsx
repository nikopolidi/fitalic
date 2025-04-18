import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default ProfileContainer;
