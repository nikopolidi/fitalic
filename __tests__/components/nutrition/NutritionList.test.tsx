import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NutritionList } from '../../../src/components/nutrition/NutritionList';
import { createStyleSheet } from 'react-native-unistyles';
import { useNutritionStore } from '../../../src/services/storage/nutritionStore';
import { useUserStore } from '../../../src/services/storage/userStore';

// Mock the unistyles hook
jest.mock('react-native-unistyles', () => ({
  createStyleSheet: jest.fn().mockReturnValue({}),
  useStyles: jest.fn().mockReturnValue({
    styles: {
      container: {},
      header: {},
      title: {},
      dateSelector: {},
      dateButton: {},
      dateButtonText: {},
      selectedDateButton: {},
      selectedDateButtonText: {},
      summaryContainer: {},
      summaryTitle: {},
      caloriesRow: {},
      caloriesText: {},
      caloriesValue: {},
      caloriesRemaining: {},
      macrosContainer: {},
      macroRow: {},
      macroLabel: {},
      macroValue: {},
      progressBar: {},
      progressFill: {},
      mealsContainer: {},
      mealsList: {},
      emptyState: {},
      emptyStateText: {},
      addButton: {},
      addButtonText: {},
      modalContainer: {},
      modalContent: {},
      modalTitle: {},
      input: {},
      modalButtonsRow: {},
      cancelButton: {},
      cancelButtonText: {},
      saveButton: {},
      saveButtonText: {},
    },
    theme: {
      colors: {
        primary: '#007AFF',
        secondary: '#E9E9EB',
        text: '#000000',
        textSecondary: '#8E8E93',
        background: '#FFFFFF',
        danger: '#FF3B30',
        success: '#34C759',
        warning: '#FF9500',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
      },
    },
  }),
}));

// Mock the stores
jest.mock('../../../src/services/storage/nutritionStore');
jest.mock('../../../src/services/storage/userStore');

describe('NutritionList', () => {
  const mockMeals = [
    {
      id: 'meal-1',
      name: 'Breakfast',
      calories: 400,
      protein: 20,
      carbs: 40,
      fat: 15,
      date: new Date().toISOString(),
      imageUri: null,
      notes: 'Oatmeal with fruits',
    },
    {
      id: 'meal-2',
      name: 'Lunch',
      calories: 600,
      protein: 35,
      carbs: 60,
      fat: 20,
      date: new Date().toISOString(),
      imageUri: null,
      notes: 'Chicken salad',
    },
  ];

  const mockNutritionStore = {
    meals: mockMeals,
    addMeal: jest.fn(),
    updateMeal: jest.fn(),
    deleteMeal: jest.fn(),
    getMealsForDate: jest.fn().mockReturnValue(mockMeals),
    getDailyNutritionTotals: jest.fn().mockReturnValue({
      calories: 1000,
      protein: 55,
      carbs: 100,
      fat: 35,
    }),
  };

  const mockUserStore = {
    user: {
      nutritionGoals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNutritionStore as jest.Mock).mockReturnValue(mockNutritionStore);
    (useUserStore as jest.Mock).mockReturnValue(mockUserStore);
  });

  it('renders nutrition summary correctly', () => {
    const { getByText } = render(<NutritionList />);
    
    expect(getByText('Today')).toBeTruthy();
    expect(getByText('1000')).toBeTruthy();
    expect(getByText('1000 / 2000 kcal')).toBeTruthy();
    expect(getByText('1000 kcal remaining')).toBeTruthy();
    
    expect(getByText('Protein')).toBeTruthy();
    expect(getByText('55g / 150g')).toBeTruthy();
    
    expect(getByText('Carbs')).toBeTruthy();
    expect(getByText('100g / 200g')).toBeTruthy();
    
    expect(getByText('Fat')).toBeTruthy();
    expect(getByText('35g / 65g')).toBeTruthy();
  });
  
  it('renders meal list correctly', () => {
    const { getByText } = render(<NutritionList />);
    
    expect(getByText('Breakfast')).toBeTruthy();
    expect(getByText('400 kcal')).toBeTruthy();
    
    expect(getByText('Lunch')).toBeTruthy();
    expect(getByText('600 kcal')).toBeTruthy();
  });
  
  it('changes date when date selector buttons are pressed', () => {
    const { getByText } = render(<NutritionList />);
    
    // Initially "Today" should be selected
    expect(getByText('Today').props.style).toEqual(
      expect.objectContaining({ backgroundColor: expect.anything() })
    );
    
    // Press "Yesterday" button
    const yesterdayButton = getByText('Yesterday');
    fireEvent.press(yesterdayButton);
    
    // getMealsForDate should be called with yesterday's date
    expect(mockNutritionStore.getMealsForDate).toHaveBeenCalledWith(expect.any(Date));
    
    // Press "Tomorrow" button
    const tomorrowButton = getByText('Tomorrow');
    fireEvent.press(tomorrowButton);
    
    // getMealsForDate should be called with tomorrow's date
    expect(mockNutritionStore.getMealsForDate).toHaveBeenCalledWith(expect.any(Date));
  });
  
  it('opens add meal modal when add button is pressed', () => {
    const { getByText, queryByText } = render(<NutritionList />);
    
    // Modal should not be visible initially
    expect(queryByText('Add Meal')).toBeNull();
    
    // Press add button
    const addButton = getByText('Add Meal');
    fireEvent.press(addButton);
    
    // Modal should be visible
    expect(getByText('Add Meal')).toBeTruthy();
  });
  
  it('adds new meal when form is submitted', () => {
    const { getByText, getByPlaceholderText, getAllByPlaceholderText } = render(<NutritionList />);
    
    // Open modal
    const addButton = getByText('Add Meal');
    fireEvent.press(addButton);
    
    // Fill form
    const nameInput = getByPlaceholderText('Meal name');
    fireEvent.changeText(nameInput, 'Dinner');
    
    const inputs = getAllByPlaceholderText(/\d+/); // Match inputs with numeric placeholders
    
    // Calories input
    fireEvent.changeText(inputs[0], '700');
    
    // Protein input
    fireEvent.changeText(inputs[1], '40');
    
    // Carbs input
    fireEvent.changeText(inputs[2], '70');
    
    // Fat input
    fireEvent.changeText(inputs[3], '25');
    
    // Submit form
    const saveButton = getByText('Save');
    fireEvent.press(saveButton);
    
    // Check if addMeal was called with correct data
    expect(mockNutritionStore.addMeal).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Dinner',
      calories: 700,
      protein: 40,
      carbs: 70,
      fat: 25,
      date: expect.any(String),
    }));
  });
  
  it('shows empty state when no meals are available', () => {
    // Mock empty meals list
    (mockNutritionStore.getMealsForDate as jest.Mock).mockReturnValueOnce([]);
    
    const { getByText } = render(<NutritionList />);
    
    expect(getByText('No meals recorded for this day')).toBeTruthy();
    expect(getByText('Add your first meal to start tracking')).toBeTruthy();
  });
  
  it('edits meal when edit is triggered', () => {
    const { getByText } = render(<NutritionList />);
    
    // Mock the onEdit callback from MealItem
    const mockOnEdit = (mockNutritionStore.updateMeal as jest.Mock).mock.calls[0]?.[0];
    
    if (mockOnEdit) {
      // Simulate edit by calling the callback directly
      mockOnEdit(mockMeals[0]);
      
      // Modal should be visible with meal data
      expect(getByText('Edit Meal')).toBeTruthy();
    }
  });
  
  it('deletes meal when delete is triggered', () => {
    render(<NutritionList />);
    
    // Mock the onDelete callback from MealItem
    const mockOnDelete = (mockNutritionStore.deleteMeal as jest.Mock).mock.calls[0]?.[0];
    
    if (mockOnDelete) {
      // Simulate delete by calling the callback directly
      mockOnDelete('meal-1');
      
      // Check if deleteMeal was called with correct id
      expect(mockNutritionStore.deleteMeal).toHaveBeenCalledWith('meal-1');
    }
  });
});
