import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import NutritionList from './NutritionList';

/**
 * Nutrition container component that wraps the NutritionList
 * This allows for easier integration with the tab navigation
 */
export const NutritionContainer: React.FC = () => {
  return (
    <View style={styles.container}>
      <NutritionList />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default NutritionContainer;
