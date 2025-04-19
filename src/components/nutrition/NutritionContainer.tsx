import { dummyAction } from '@/utils/dummy';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useNutritionStore } from '../../services/storage/nutritionStore';
import { useUserStore } from '../../services/storage/userStore';
import { Meal } from '../../types/database'; // Import Meal type if not already
import NutritionList from './NutritionList';

/**
 * Container component for the nutrition tab
 */
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));


export const NutritionContainer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get actions and data selectors from stores
  const getDailyNutrition = useNutritionStore(state => state.getDailyNutrition);
  const addMealAction = useNutritionStore(state => state.addMeal);
  const deleteMealAction = useNutritionStore(state => state.deleteMeal);
  const { user } = useUserStore();

  // Get derived data for the selected date
  const dailyEntry = getDailyNutrition(selectedDate.getTime());
  const meals = dailyEntry?.meals ?? [];
  const dailyCalories = dailyEntry?.totalCalories ?? 0;
  const protein = dailyEntry?.totalMacros.protein ?? 0;
  const carbs = dailyEntry?.totalMacros.carbs ?? 0;
  const fat = dailyEntry?.totalMacros.fat ?? 0;
  
  // Get user goals safely
  const nutritionGoals = user?.nutritionGoals;
  const caloriesGoal = nutritionGoals?.calories ?? 2000; // Default to 2000 if no user/goals

  // --- Handlers ---
  
  // Function to handle the initiation of adding a meal
  const handleAddMealPress = () => {
    console.log('handleAddMealPress triggered');
    dummyAction()
    // TODO: Implement navigation or modal logic to add a new meal
  };

  // Function to handle pressing a meal item (e.g., view details)
  const handleMealPress = (meal: Meal) => {
    console.log('handleMealPress triggered for meal:', meal.id);
    dummyAction()
    // TODO: Implement navigation or logic to view meal details
  };

  // Function to handle deleting a meal
  const handleDeleteMeal = (mealId: string) => {
    // Optional: Add confirmation dialog
    deleteMealAction(mealId);
  };
  
  // Function to handle date change
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      <NutritionList
        meals={meals}
        isLoading={false} // isLoading is not in the store, manage locally if needed
        onAddMeal={handleAddMealPress}
        onMealPress={handleMealPress} // Pass the new handler
        onDeleteMeal={handleDeleteMeal} // Pass the new handler
        dailyCalories={dailyCalories}
        nutritionGoals={caloriesGoal} // Pass the calorie goal
        protein={protein}
        carbs={carbs}
        fat={fat}
        date={selectedDate}
        onDateChange={handleDateChange} // Pass the state setter
      />
    </View>
  );
};


export default NutritionContainer;
