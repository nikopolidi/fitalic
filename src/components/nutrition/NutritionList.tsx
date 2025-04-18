import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Meal } from '../../types/database';
import MealItem from './MealItem';
import { FontAwesome } from '@expo/vector-icons';

type NutritionListProps = {
  meals: Meal[];
  isLoading: boolean;
  onAddMeal: () => void;
  onMealPress: (meal: Meal) => void;
  onDeleteMeal: (mealId: string) => void;
  dailyCalories: number;
  caloriesGoal: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Date;
  onDateChange: (date: Date) => void;
};

/**
 * Component for displaying the list of meals and nutrition summary
 */
export const NutritionList: React.FC<NutritionListProps> = ({
  meals,
  isLoading,
  onAddMeal,
  onMealPress,
  onDeleteMeal,
  dailyCalories,
  caloriesGoal,
  protein,
  carbs,
  fat,
  date,
  onDateChange
}) => {
  const { theme } = useUnistyles();
  const styles = useStyles();
  
  const renderMeal = ({ item }: { item: Meal }) => (
    <MealItem 
      meal={item} 
      onPress={onMealPress} 
      onDelete={onDeleteMeal} 
    />
  );

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const goToPreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const caloriesRemaining = caloriesGoal - dailyCalories;
  const caloriesProgress = Math.min(dailyCalories / caloriesGoal, 1);

  return (
    <View style={styles.container}>
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.dateButton}>
          <FontAwesome name="chevron-left" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        
        <TouchableOpacity onPress={goToNextDay} style={styles.dateButton}>
          <FontAwesome name="chevron-right" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryCard}>
        <View style={styles.caloriesSummary}>
          <Text style={styles.caloriesConsumed}>{dailyCalories}</Text>
          <Text style={styles.caloriesLabel}>calories consumed</Text>
        </View>
        
        <View style={styles.caloriesRemainingContainer}>
          <Text style={styles.caloriesRemainingLabel}>
            {caloriesRemaining > 0 ? 'Remaining' : 'Exceeded by'}
          </Text>
          <Text 
            style={[
              styles.caloriesRemaining, 
              caloriesRemaining < 0 && styles.caloriesExceeded
            ]}
          >
            {Math.abs(caloriesRemaining)}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${caloriesProgress * 100}%` },
                caloriesProgress >= 1 && styles.progressExceeded
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.mealsHeader}>
        <Text style={styles.mealsTitle}>Meals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={onAddMeal}
        >
          <FontAwesome name="plus" size={16} color={theme.colors.text} />
          <Text style={styles.addButtonText}>Add Meal</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary} 
          style={styles.loader} 
        />
      ) : meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals recorded for this day</Text>
          <TouchableOpacity 
            style={styles.emptyAddButton}
            onPress={onAddMeal}
          >
            <Text style={styles.emptyAddButtonText}>Add your first meal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={meals}
          renderItem={renderMeal}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.mealsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const useStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateButton: {
    padding: theme.spacing.sm,
  },
  dateText: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  caloriesSummary: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  caloriesConsumed: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text,
  },
  caloriesLabel: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  caloriesRemainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  caloriesRemainingLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  caloriesRemaining: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.success,
  },
  caloriesExceeded: {
    color: theme.colors.error,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBackground: {
    height: 8,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.full,
  },
  progressExceeded: {
    backgroundColor: theme.colors.error,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  macroLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  mealsTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  addButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
  mealsList: {
    paddingBottom: theme.spacing.xl,
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyAddButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
  },
  emptyAddButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
}));

export default NutritionList;
