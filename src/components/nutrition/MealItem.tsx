import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Meal } from '../../types/database';
import { FontAwesome } from '@expo/vector-icons';

type MealItemProps = {
  meal: Meal;
  onPress: (meal: Meal) => void;
  onDelete: (mealId: string) => void;
};

/**
 * Component for displaying a single meal item with nutrition information
 */
export const MealItem: React.FC<MealItemProps> = ({ meal, onPress, onDelete }) => {
  const styles = useStyles();
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(meal)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.time}>
          {new Date(meal.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{meal.calories}</Text>
          <Text style={styles.nutritionLabel}>kcal</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{meal.protein}g</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{meal.carbs}g</Text>
          <Text style={styles.nutritionLabel}>Carbs</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{meal.fat}g</Text>
          <Text style={styles.nutritionLabel}>Fat</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(meal.id)}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <FontAwesome name="trash-o" size={18} style={styles.deleteIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    flex: 1,
  },
  time: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  nutritionLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  deleteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  deleteIcon: {
    color: theme.colors.error,
  },
}));

export default MealItem;
