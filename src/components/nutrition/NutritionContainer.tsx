import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import NutritionList from './NutritionList';
import { useNutritionStore } from '../../services/storage/nutritionStore';
import { useUserStore } from '../../services/storage/userStore';

/**
 * Container component for the nutrition tab
 */
export const NutritionContainer: React.FC = () => {
  const styles = useStyles();
  const { 
    meals, 
    isLoading, 
    addMeal, 
    deleteMeal, 
    viewMealDetails,
    dailyCalories,
    protein,
    carbs,
    fat,
    selectedDate,
    setSelectedDate
  } = useNutritionStore();
  
  const { caloriesGoal } = useUserStore();

  return (
    <View style={styles.container}>
      <NutritionList
        meals={meals}
        isLoading={isLoading}
        onAddMeal={addMeal}
        onMealPress={viewMealDetails}
        onDeleteMeal={deleteMeal}
        dailyCalories={dailyCalories}
        caloriesGoal={caloriesGoal}
        protein={protein}
        carbs={carbs}
        fat={fat}
        date={selectedDate}
        onDateChange={setSelectedDate}
      />
    </View>
  );
};

const useStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default NutritionContainer;
