import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

import MealItem from './MealItem';
import { useNutritionStore, useUserStore } from '../../services/storage';
import { Meal, DailyNutrition } from '../../types/database';

/**
 * Component for displaying the nutrition tracking list
 */
export const NutritionList: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
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
          <FontAwesome name="chevron-left" size={16} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => changeDate(1)}
        >
          <FontAwesome name="chevron-right" size={16} color="#007AFF" />
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
          <FontAwesome name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
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
          <FontAwesome name="cutlery" size={48} color="#C7C7CC" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dateButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  negativeValue: {
    color: '#FF3B30',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 8,
  },
  macroContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroItem: {
    marginBottom: 12,
  },
  macroLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  proteinBar: {
    backgroundColor: '#5856D6',
  },
  carbsBar: {
    backgroundColor: '#FF9500',
  },
  fatBar: {
    backgroundColor: '#FF2D55',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NutritionList;
