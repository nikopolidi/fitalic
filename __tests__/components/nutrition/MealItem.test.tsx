import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MealItem } from '../../../src/components/nutrition/MealItem';
import { createStyleSheet } from 'react-native-unistyles';

// Mock the unistyles hook
jest.mock('react-native-unistyles', () => ({
  createStyleSheet: jest.fn().mockReturnValue({}),
  useStyles: jest.fn().mockReturnValue({
    styles: {
      container: {},
      header: {},
      title: {},
      calories: {},
      details: {},
      macroRow: {},
      macroLabel: {},
      macroValue: {},
      timeRow: {},
      timeText: {},
      buttonsRow: {},
      button: {},
      buttonText: {},
      deleteButton: {},
      deleteButtonText: {},
      image: {},
      imageContainer: {},
      notes: {},
      notesText: {},
    },
    theme: {
      colors: {
        primary: '#007AFF',
        secondary: '#E9E9EB',
        text: '#000000',
        textSecondary: '#8E8E93',
        background: '#FFFFFF',
        danger: '#FF3B30',
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

describe('MealItem', () => {
  const mockMeal = {
    id: 'test-id',
    name: 'Test Meal',
    calories: 500,
    protein: 30,
    carbs: 50,
    fat: 15,
    date: new Date().toISOString(),
    imageUri: null,
    notes: 'Test notes',
  };

  it('renders meal information correctly', () => {
    const { getByText } = render(
      <MealItem meal={mockMeal} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    
    expect(getByText('Test Meal')).toBeTruthy();
    expect(getByText('500 kcal')).toBeTruthy();
    expect(getByText('Protein: 30g')).toBeTruthy();
    expect(getByText('Carbs: 50g')).toBeTruthy();
    expect(getByText('Fat: 15g')).toBeTruthy();
    expect(getByText('Test notes')).toBeTruthy();
  });
  
  it('calls onEdit when edit button is pressed', () => {
    const mockEdit = jest.fn();
    const { getByText } = render(
      <MealItem meal={mockMeal} onEdit={mockEdit} onDelete={jest.fn()} />
    );
    
    const editButton = getByText('Edit');
    fireEvent.press(editButton);
    
    expect(mockEdit).toHaveBeenCalledWith(mockMeal);
  });
  
  it('calls onDelete when delete button is pressed', () => {
    const mockDelete = jest.fn();
    const { getByText } = render(
      <MealItem meal={mockMeal} onEdit={jest.fn()} onDelete={mockDelete} />
    );
    
    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);
    
    expect(mockDelete).toHaveBeenCalledWith(mockMeal.id);
  });
  
  it('renders meal image when imageUri is provided', () => {
    const mealWithImage = {
      ...mockMeal,
      imageUri: 'https://example.com/image.jpg',
    };
    
    const { getByTestId } = render(
      <MealItem meal={mealWithImage} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    
    expect(getByTestId('meal-image')).toBeTruthy();
  });
  
  it('formats date correctly', () => {
    const now = new Date();
    const mealWithCurrentDate = {
      ...mockMeal,
      date: now.toISOString(),
    };
    
    const { getByText } = render(
      <MealItem meal={mealWithCurrentDate} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    
    // Check if date is displayed in some format (exact format may vary)
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    expect(getByText(expect.stringContaining(formattedTime))).toBeTruthy();
  });
  
  it('does not render notes section when notes are empty', () => {
    const mealWithoutNotes = {
      ...mockMeal,
      notes: '',
    };
    
    const { queryByText } = render(
      <MealItem meal={mealWithoutNotes} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    
    expect(queryByText('Notes:')).toBeNull();
  });
});
