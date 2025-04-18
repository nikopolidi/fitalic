import { act, renderHook } from '@testing-library/react-hooks';
import { MMKV } from 'react-native-mmkv';
import { useNutritionStore } from '../../../src/services/storage/nutritionStore';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  const mockMMKV = {
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  };
  return {
    MMKV: jest.fn(() => mockMMKV),
  };
});

describe('NutritionStore', () => {
  let mockMMKV: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockMMKV = new MMKV();
  });

  it('should initialize with empty meals array', () => {
    const { result } = renderHook(() => useNutritionStore());
    
    expect(result.current.meals).toEqual([]);
  });

  it('should add a meal', () => {
    const { result } = renderHook(() => useNutritionStore());
    
    const newMeal = {
      id: 'test-id',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 15,
      date: new Date().getTime(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    act(() => {
      result.current.addMeal(newMeal);
    });
    
    expect(result.current.meals).toHaveLength(1);
    expect(result.current.meals[0]).toEqual(newMeal);
    expect(mockMMKV.set).toHaveBeenCalledWith('meals', JSON.stringify([newMeal]));
  });

  it('should update a meal', () => {
    const { result } = renderHook(() => useNutritionStore());
    
    const meal = {
      id: 'test-id',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 15,
      date: new Date().getTime(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    // Add a meal first
    act(() => {
      result.current.addMeal(meal);
    });
    
    // Then update it
    const updatedMeal = {
      ...meal,
      name: 'Updated Meal',
      calories: 600,
    };
    
    act(() => {
      result.current.updateMeal(updatedMeal);
    });
    
    expect(result.current.meals).toHaveLength(1);
    expect(result.current.meals[0]).toEqual(updatedMeal);
    expect(mockMMKV.set).toHaveBeenCalledWith('meals', JSON.stringify([updatedMeal]));
  });

  it('should delete a meal', () => {
    const { result } = renderHook(() => useNutritionStore());
    
    const meal = {
      id: 'test-id',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 15,
      date: new Date().getTime(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    // Add a meal first
    act(() => {
      result.current.addMeal(meal);
    });
    
    // Then delete it
    act(() => {
      result.current.deleteMeal(meal.id);
    });
    
    expect(result.current.meals).toHaveLength(0);
    expect(mockMMKV.set).toHaveBeenCalledWith('meals', JSON.stringify([]));
  });

  it('should get meals for a specific date', () => {
    const { result } = renderHook(() => useNutritionStore());
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const meal1 = {
      id: 'test-id-1',
      name: 'Today Meal',
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 15,
      date: today.toISOString(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    const meal2 = {
      id: 'test-id-2',
      name: 'Yesterday Meal',
      calories: 600,
      protein: 35,
      carbs: 55,
      fat: 20,
      date: yesterday.toISOString(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    // Add both meals
    act(() => {
      result.current.addMeal(meal1);
      result.current.addMeal(meal2);
    });
    
    // Get meals for today
    const todayMeals = result.current.getMealsForDate(today);
    
    expect(todayMeals).toHaveLength(1);
    expect(todayMeals[0].id).toBe('test-id-1');
  });

  it('should calculate daily nutrition totals', () => {
    const { result } = renderHook(() => useNutritionStore());
    
    const today = new Date();
    
    const meal1 = {
      id: 'test-id-1',
      name: 'Breakfast',
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 15,
      date: today.toISOString(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    const meal2 = {
      id: 'test-id-2',
      name: 'Lunch',
      calories: 600,
      protein: 35,
      carbs: 55,
      fat: 20,
      date: today.toISOString(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    // Add both meals
    act(() => {
      result.current.addMeal(meal1);
      result.current.addMeal(meal2);
    });
    
    // Calculate totals for today
    const totals = result.current.getDailyNutritionTotals(today);
    
    expect(totals.calories).toBe(1100);
    expect(totals.protein).toBe(65);
    expect(totals.carbs).toBe(105);
    expect(totals.fat).toBe(35);
  });

  it('should clear all meals', () => {
    const { result } = renderHook(() => useNutritionStore());
    
    const meal = {
      id: 'test-id',
      name: 'Test Meal',
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 15,
      date: new Date().getTime(),
      imageUri: null,
      notes: 'Test notes',
    };
    
    // Add a meal first
    act(() => {
      result.current.addMeal(meal);
    });
    
    // Then clear all meals
    act(() => {
      result.current.clearMeals();
    });
    
    expect(result.current.meals).toHaveLength(0);
    expect(mockMMKV.delete).toHaveBeenCalledWith('meals');
  });
});
