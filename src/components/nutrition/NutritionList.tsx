import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useNutritionStore, useUserStore } from '../../services/storage';
import { Meal } from '../../types/database';
import MealItem from './MealItem';

/**
 * Component for displaying the nutrition tracking list
 */
export const NutritionList: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useUnistyles();
  
  // Get nutrition data from store
  const nutritionStore = useNutritionStore();
  const userStore = useUserStore();
  
  // Get user's nutrition goals
  const targetCalories = userStore.user?.nutritionGoals.calories || 2000;
  const targetMacros = userStore.user?.nutritionGoals || { protein: 150, carbs: 200, fat: 70 };
  
  // Get daily nutrition data for selected date
  const dailyNutrition = nutritionStore.getDailyNutrition(selectedDate.getTime());
  const meals = dailyNutrition?.meals || [];
  
  // Calculate remaining nutrition for the day
  const remaining = nutritionStore.calculateRemainingNutrition(
    selectedDate.getTime(),
    targetCalories,
    targetMacros
  );
  
  // Handle meal selection
  const handleMealPress = (meal: Meal) => {
    // In a real app, this would navigate to a meal detail screen
    console.log('Meal selected:', meal);
  };
  
  // Handle date change
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
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
      return date.toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  // Add a new meal
  const handleAddMeal = () => {
    // In a real app, this would navigate to a meal creation screen
    console.log('Add meal pressed');
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => changeDate(-1)}
        >
          <FontAwesome name="chevron-left" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => changeDate(1)}
        >
          <FontAwesome name="chevron-right" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Consumed</Text>
          <Text style={styles.summaryValue}>
            {dailyNutrition?.totalCalories || 0}
            <Text style={styles.summaryUnit}> kcal</Text>
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[
            styles.summaryValue,
            remaining.calories < 0 ? styles.negativeValue : null
          ]}>
            {remaining.calories}
            <Text style={styles.summaryUnit}> kcal</Text>
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Goal</Text>
          <Text style={styles.summaryValue}>
            {targetCalories}
            <Text style={styles.summaryUnit}> kcal</Text>
          </Text>
        </View>
      </View>
      
      <View style={styles.macroContainer}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>
            {dailyNutrition?.totalMacros.protein || 0}
            <Text style={styles.macroUnit}>g</Text>
          </Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${remaining.percentages.protein}%` },
                styles.proteinBar
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>
            {dailyNutrition?.totalMacros.carbs || 0}
            <Text style={styles.macroUnit}>g</Text>
          </Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${remaining.percentages.carbs}%` },
                styles.carbsBar
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fat</Text>
          <Text style={styles.macroValue}>
            {dailyNutrition?.totalMacros.fat || 0}
            <Text style={styles.macroUnit}>g</Text>
          </Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${remaining.percentages.fat}%` },
                styles.fatBar
              ]} 
            />
          </View>
        </View>
      </View>
      
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeaderText}>Meals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMeal}
        >
          <FontAwesome name="plus" size={16} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : meals.length > 0 ? (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealItem
              meal={item}
              onPress={handleMealPress}
              targetCalories={targetCalories}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="cutlery" size={48} color={theme.colors.borderLight} />
          <Text style={styles.emptyText}>No meals recorded for this day</Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAddMeal}
          >
            <Text style={styles.emptyButtonText}>Add Your First Meal</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm + 4,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dateButton: {
    padding: theme.spacing.sm,
  },
  dateText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  summaryUnit: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
  },
  negativeValue: {
    color: theme.colors.error,
  },
  macroContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  macroItem: {
    marginBottom: theme.spacing.sm,
  },
  macroLabel: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  macroValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  macroUnit: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  proteinBar: {
    backgroundColor: theme.colors.primary,
  },
  carbsBar: {
    backgroundColor: theme.colors.secondary,
  },
  fatBar: {
    backgroundColor: theme.colors.warning,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  listHeaderText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
  },
  emptyButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
}));

export default NutritionList;
