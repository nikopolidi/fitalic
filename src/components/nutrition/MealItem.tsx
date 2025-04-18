import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
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
  const { theme } = useUnistyles();

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
      
      <FontAwesome name="chevron-right" size={16} color={theme.colors.borderLight} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm + 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  timeContainer: {
    marginRight: theme.spacing.sm + 4,
    alignItems: 'center',
    minWidth: 60,
  },
  time: {
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  mealType: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  nutritionContainer: {
    flexDirection: 'row',
  },
  macroContainer: {
    marginRight: theme.spacing.md,
  },
  macroLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  macroValue: {
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '500',
    color: theme.colors.text,
  },
  calorieContainer: {
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  calories: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  calorieUnit: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  caloriePercentage: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs - 2,
  },
  chevron: {
    marginLeft: theme.spacing.xs,
  },
}));

export default MealItem;
