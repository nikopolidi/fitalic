import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import ProfileScreen from './ProfileScreen';


const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));


/**
 * Container component for the profile tab
 */
export const ProfileContainer: React.FC = () => {

  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
};

export default ProfileContainer;
