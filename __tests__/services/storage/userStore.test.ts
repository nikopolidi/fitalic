import { renderHook, act } from '@testing-library/react-hooks';
import { useUserStore } from '../../../src/services/storage/userStore';
import { MMKV } from 'react-native-mmkv';

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

describe('UserStore', () => {
  let mockMMKV: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockMMKV = new MMKV();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserStore());
    
    expect(result.current.user).toEqual({
      id: expect.any(String),
      name: '',
      age: 0,
      height: 0,
      weight: 0,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
      dietPreference: 'balanced',
      avatarUri: null,
      caloriesGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatGoal: 65,
    });
  });

  it('should update user data', () => {
    const { result } = renderHook(() => useUserStore());
    
    const updatedUser = {
      ...result.current.user,
      name: 'Test User',
      age: 30,
      height: 180,
      weight: 75,
    };
    
    act(() => {
      result.current.updateUser(updatedUser);
    });
    
    expect(result.current.user).toEqual(updatedUser);
    expect(mockMMKV.set).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));
  });

  it('should calculate BMI correctly', () => {
    const { result } = renderHook(() => useUserStore());
    
    const updatedUser = {
      ...result.current.user,
      height: 180, // 1.8m
      weight: 72,  // 72kg
    };
    
    act(() => {
      result.current.updateUser(updatedUser);
    });
    
    // BMI = weight / (height/100)^2 = 72 / (1.8)^2 = 72 / 3.24 = 22.22
    expect(result.current.calculateBMI()).toBeCloseTo(22.22, 1);
  });

  it('should calculate calorie needs based on user data', () => {
    const { result } = renderHook(() => useUserStore());
    
    const updatedUser = {
      ...result.current.user,
      age: 30,
      height: 180,
      weight: 75,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
    };
    
    act(() => {
      result.current.updateUser(updatedUser);
    });
    
    // For a 30-year-old male, 180cm, 75kg with moderate activity and maintain goal
    // This is an approximation as the actual formula may vary
    expect(result.current.calculateCalorieNeeds()).toBeGreaterThan(1500);
    expect(result.current.calculateCalorieNeeds()).toBeLessThan(3000);
  });

  it('should update calorie and macro goals', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.updateNutritionGoals({
        caloriesGoal: 2500,
        proteinGoal: 180,
        carbsGoal: 250,
        fatGoal: 70,
      });
    });
    
    expect(result.current.user.caloriesGoal).toBe(2500);
    expect(result.current.user.proteinGoal).toBe(180);
    expect(result.current.user.carbsGoal).toBe(250);
    expect(result.current.user.fatGoal).toBe(70);
    expect(mockMMKV.set).toHaveBeenCalled();
  });

  it('should reset user data', () => {
    const { result } = renderHook(() => useUserStore());
    
    // First update the user
    act(() => {
      result.current.updateUser({
        ...result.current.user,
        name: 'Test User',
      });
    });
    
    // Then reset
    act(() => {
      result.current.resetUser();
    });
    
    // Check if it's back to default values
    expect(result.current.user.name).toBe('');
    expect(mockMMKV.delete).toHaveBeenCalledWith('user');
  });
});
