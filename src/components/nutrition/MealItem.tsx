import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Meal } from '../../types/database';

type MealItemProps = {
  meal: Meal;
  onPress: (meal: Meal) => void;
  targetCalories?: number;
};

/**
 * Component for displaying a meal item in the nutrition tracking list
 */
export const MealItem: React.FC<MealItemProps> = ({ 
  meal, 
  onPress,
  targetCalories = 2000 
}) => {
  // Format date to readable string
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate percentage of daily calories
  const caloriePercentage = Math.round((meal.totalCalories / targetCalories) * 100);
  
  // Get meal type display name
  const getMealTypeDisplay = (type: string): string => {
    switch (type) {
      case 'breakfast': return 'Breakfast';
      case 'morningSnack': return 'Morning Snack';
      case 'lunch': return 'Lunch';
      case 'afternoonSnack': return 'Afternoon Snack';
      case 'dinner': return 'Dinner';
      case 'eveningSnack': return 'Evening Snack';
      default: return 'Custom Meal';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(meal)}
      activeOpacity={0.7}
    >
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatDate(meal.time)}</Text>
        <Text style={styles.mealType}>{getMealTypeDisplay(meal.type)}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
        
        <View style={styles.nutritionContainer}>
          <View style={styles.macroContainer}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{meal.totalMacros.protein}g</Text>
          </View>
          
          <View style={styles.macroContainer}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{meal.totalMacros.carbs}g</Text>
          </View>
          
          <View style={styles.macroContainer}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{meal.totalMacros.fat}g</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.calorieContainer}>
        <Text style={styles.calories}>{meal.totalCalories}</Text>
        <Text style={styles.calorieUnit}>kcal</Text>
        <Text style={styles.caloriePercentage}>{caloriePercentage}%</Text>
      </View>
      
      <FontAwesome name="chevron-right" size={16} color="#C7C7CC" style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  timeContainer: {
    marginRight: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  mealType: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  nutritionContainer: {
    flexDirection: 'row',
  },
  macroContainer: {
    marginRight: 16,
  },
  macroLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  calorieContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
  calories: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  calorieUnit: {
    fontSize: 12,
    color: '#8E8E93',
  },
  caloriePercentage: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  chevron: {
    marginLeft: 4,
  },
});

export default MealItem;
