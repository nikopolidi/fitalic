import React from 'react';
import { View, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});

export default NutritionContainer;
