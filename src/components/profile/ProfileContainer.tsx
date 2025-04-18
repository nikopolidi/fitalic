import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import ProfileScreen from './ProfileScreen';

/**
 * Container component for the profile tab
 */
export const ProfileContainer: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
};

const useStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default ProfileContainer;
