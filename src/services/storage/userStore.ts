/**
 * Zustand store for user data with MMKV persistence
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Anthropometry, FitnessGoal, NutritionGoals, UserData, UserPreferences } from '../../types/database';
import { storage } from './mmkv';

// Default values for a new user
const DEFAULT_ANTHROPOMETRY: Anthropometry = {
  height: 170,
  weight: 70,
  age: 30,
  gender: 'male',
  activityLevel: 'moderatelyActive',
};

const DEFAULT_NUTRITION_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 70,
};

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  fitnessGoal: 'maintenance',
  dietaryPreferences: ['omnivore'],
  dietaryRestrictions: [],
  mealsPerDay: 3,
  preferredWorkoutDuration: 60,
  preferredWorkoutDays: [1, 3, 5], // Monday, Wednesday, Friday
  language: 'en',
};

// Interface for the user store
interface UserStore {
  user: UserData | null;
  isInitialized: boolean;
  
  // Actions
  initializeUser: (name: string) => void;
  updateAnthropometry: (data: Partial<Anthropometry>) => void;
  updateNutritionGoals: (goals: Partial<NutritionGoals>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setAvatar: (uri: string) => void;
  calculateBMR: () => number;
  calculateTDEE: () => number;
  calculateNutritionGoals: (goal: FitnessGoal) => NutritionGoals;
  resetUser: () => void;
}

// Create the store with persistence
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isInitialized: false,
      
      initializeUser: (name: string) => {
        const userId = `user_${Date.now()}`;
        const timestamp = Date.now();
        
        set({
          user: {
            id: userId,
            name,
            anthropometry: DEFAULT_ANTHROPOMETRY,
            nutritionGoals: DEFAULT_NUTRITION_GOALS,
            preferences: DEFAULT_USER_PREFERENCES,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          isInitialized: true,
        });
      },
      
      updateAnthropometry: (data: Partial<Anthropometry>) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            anthropometry: {
              ...user.anthropometry,
              ...data,
            },
            updatedAt: Date.now(),
          },
        });
        
        // Recalculate nutrition goals based on new anthropometry
        const store = get();
        if (store.user) {
          store.updateNutritionGoals(
            store.calculateNutritionGoals(store.user.preferences.fitnessGoal)
          );
        }
      },
      
      updateNutritionGoals: (goals: Partial<NutritionGoals>) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            nutritionGoals: {
              ...user.nutritionGoals,
              ...goals,
            },
            updatedAt: Date.now(),
          },
        });
      },
      
      updatePreferences: (prefs: Partial<UserPreferences>) => {
        const { user } = get();
        if (!user) return;
        
        const newPreferences = {
          ...user.preferences,
          ...prefs,
        };
        
        set({
          user: {
            ...user,
            preferences: newPreferences,
            updatedAt: Date.now(),
          },
        });
        
        // If fitness goal changed, recalculate nutrition goals
        if (prefs.fitnessGoal && prefs.fitnessGoal !== user.preferences.fitnessGoal) {
          const store = get();
          if (store.user) {
            store.updateNutritionGoals(
              store.calculateNutritionGoals(prefs.fitnessGoal)
            );
          }
        }
      },
      
      setAvatar: (uri: string) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            avatarUri: uri,
            updatedAt: Date.now(),
          },
        });
      },
      
      // Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
      calculateBMR: () => {
        const { user } = get();
        if (!user) return 0;
        
        const { height, weight, age, gender } = user.anthropometry;
        
        if (gender === 'male') {
          return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          return 10 * weight + 6.25 * height - 5 * age - 161;
        }
      },
      
      // Calculate Total Daily Energy Expenditure
      calculateTDEE: () => {
        const { user } = get();
        if (!user) return 0;
        
        const bmr = get().calculateBMR();
        const { activityLevel } = user.anthropometry;
        
        const activityMultipliers = {
          sedentary: 1.2,
          lightlyActive: 1.375,
          moderatelyActive: 1.55,
          veryActive: 1.725,
          extraActive: 1.9,
        };
        
        return Math.round(bmr * activityMultipliers[activityLevel]);
      },
      
      // Calculate nutrition goals based on fitness goal
      calculateNutritionGoals: (goal: FitnessGoal): NutritionGoals => {
        const tdee = get().calculateTDEE();
        const { user } = get();
        if (!user) return DEFAULT_NUTRITION_GOALS;
        
        const { weight } = user.anthropometry;
        
        let calories: number;
        let proteinMultiplier: number;
        let fatMultiplier: number;
        
        switch (goal) {
          case 'weightLoss':
            calories = Math.round(tdee * 0.8); // 20% deficit
            proteinMultiplier = 2.2; // Higher protein for muscle preservation
            fatMultiplier = 0.35; // Moderate fat
            break;
          case 'maintenance':
            calories = tdee;
            proteinMultiplier = 1.8;
            fatMultiplier = 0.3;
            break;
          case 'muscleGain':
            calories = Math.round(tdee * 1.1); // 10% surplus
            proteinMultiplier = 2.0;
            fatMultiplier = 0.25;
            break;
          case 'recomposition':
            calories = tdee;
            proteinMultiplier = 2.2;
            fatMultiplier = 0.3;
            break;
          case 'performance':
            calories = Math.round(tdee * 1.05); // 5% surplus
            proteinMultiplier = 1.8;
            fatMultiplier = 0.25;
            break;
          case 'health':
            calories = tdee;
            proteinMultiplier = 1.6;
            fatMultiplier = 0.3;
            break;
          default:
            calories = tdee;
            proteinMultiplier = 1.8;
            fatMultiplier = 0.3;
        }
        
        // Calculate macros
        const protein = Math.round(weight * proteinMultiplier);
        const fat = Math.round((calories * fatMultiplier) / 9); // 9 calories per gram of fat
        const proteinCalories = protein * 4; // 4 calories per gram of protein
        const fatCalories = fat * 9;
        const remainingCalories = calories - proteinCalories - fatCalories;
        const carbs = Math.round(remainingCalories / 4); // 4 calories per gram of carbs
        
        return {
          calories,
          protein,
          carbs,
          fat,
          fiber: Math.round(carbs * 0.1), // Approximately 10% of carbs as fiber
        };
      },
      
      resetUser: () => {
        set({
          user: null,
          isInitialized: false,
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = storage.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          storage.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      })),
    }
  )
);
