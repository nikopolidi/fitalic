/**
 * Zustand store for nutrition tracking with MMKV persistence
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from './mmkv';
import { 
  DailyNutrition, 
  Meal, 
  ConsumedFood, 
  FoodItem, 
  MealType, 
  MacroNutrients,
  NutritionResponse
} from '../../types/database';

// Interface for the nutrition store
interface NutritionStore {
  dailyEntries: DailyNutrition[];
  foodDatabase: FoodItem[];
  
  // Actions
  addMeal: (meal: Omit<Meal, 'id'>) => string;
  updateMeal: (mealId: string, updates: Partial<Omit<Meal, 'id'>>) => void;
  deleteMeal: (mealId: string) => void;
  
  addFoodToMeal: (mealId: string, food: Omit<ConsumedFood, 'totalCalories' | 'totalMacros'>) => void;
  updateFoodInMeal: (mealId: string, foodIndex: number, updates: Partial<ConsumedFood>) => void;
  removeFoodFromMeal: (mealId: string, foodIndex: number) => void;
  
  addFoodToDatabase: (food: Omit<FoodItem, 'id'>) => string;
  updateFoodInDatabase: (foodId: string, updates: Partial<Omit<FoodItem, 'id'>>) => void;
  deleteFoodFromDatabase: (foodId: string) => void;
  
  getDailyNutrition: (date: number) => DailyNutrition | undefined;
  getMealsByType: (date: number, type: MealType) => Meal[];
  
  calculateTotalNutrition: (date: number) => { calories: number; macros: MacroNutrients };
  calculateRemainingNutrition: (date: number, targetCalories: number, targetMacros: MacroNutrients) => { 
    calories: number; 
    macros: MacroNutrients;
    percentages: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }
  };
  
  clearAllData: () => void;
}

// Helper function to calculate total macros from a list of foods
const calculateTotalMacros = (foods: ConsumedFood[]): MacroNutrients => {
  return foods.reduce(
    (total, food) => ({
      protein: total.protein + (food.totalMacros.protein || 0),
      carbs: total.carbs + (food.totalMacros.carbs || 0),
      fat: total.fat + (food.totalMacros.fat || 0),
      fiber: (total.fiber || 0) + (food.totalMacros.fiber || 0),
      sugar: (total.sugar || 0) + (food.totalMacros.sugar || 0),
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );
};

// Helper function to calculate total calories from a list of foods
const calculateTotalCalories = (foods: ConsumedFood[]): number => {
  return foods.reduce((total, food) => total + food.totalCalories, 0);
};

// Helper function to calculate macros based on amount
const calculateMacrosForAmount = (
  baseMacros: MacroNutrients,
  baseAmount: number,
  actualAmount: number,
  isPerServing: boolean
): MacroNutrients => {
  const multiplier = isPerServing 
    ? actualAmount 
    : actualAmount / (baseAmount || 100);
  
  return {
    protein: Math.round((baseMacros.protein || 0) * multiplier * 10) / 10,
    carbs: Math.round((baseMacros.carbs || 0) * multiplier * 10) / 10,
    fat: Math.round((baseMacros.fat || 0) * multiplier * 10) / 10,
    fiber: baseMacros.fiber 
      ? Math.round((baseMacros.fiber || 0) * multiplier * 10) / 10 
      : undefined,
    sugar: baseMacros.sugar 
      ? Math.round((baseMacros.sugar || 0) * multiplier * 10) / 10 
      : undefined,
  };
};

// Helper function to calculate calories based on amount
const calculateCaloriesForAmount = (
  baseCalories: number,
  baseAmount: number,
  actualAmount: number,
  isPerServing: boolean
): number => {
  const multiplier = isPerServing 
    ? actualAmount 
    : actualAmount / (baseAmount || 100);
  
  return Math.round(baseCalories * multiplier);
};

// Create the store with persistence
export const useNutritionStore = create<NutritionStore>()(
  persist(
    (set, get) => ({
      dailyEntries: [],
      foodDatabase: [],
      
      addMeal: (mealData) => {
        const mealId = `meal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const { date } = mealData;
        
        // Calculate day start (midnight) for the date
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayStartTimestamp = dayStart.getTime();
        
        // Find or create daily entry
        const dailyEntries = [...get().dailyEntries];
        let dailyEntryIndex = dailyEntries.findIndex(entry => 
          new Date(entry.date).setHours(0, 0, 0, 0) === dayStartTimestamp
        );
        
        const newMeal: Meal = {
          ...mealData,
          id: mealId,
          totalCalories: calculateTotalCalories(mealData.foods),
          totalMacros: calculateTotalMacros(mealData.foods),
        };
        
        if (dailyEntryIndex >= 0) {
          // Update existing daily entry
          const updatedEntry = {
            ...dailyEntries[dailyEntryIndex],
            meals: [...dailyEntries[dailyEntryIndex].meals, newMeal],
          };
          
          // Recalculate totals
          updatedEntry.totalCalories = calculateTotalCalories(
            updatedEntry.meals.flatMap(meal => meal.foods)
          );
          updatedEntry.totalMacros = calculateTotalMacros(
            updatedEntry.meals.flatMap(meal => meal.foods)
          );
          
          dailyEntries[dailyEntryIndex] = updatedEntry;
        } else {
          // Create new daily entry
          const newDailyEntry: DailyNutrition = {
            id: `day_${dayStartTimestamp}`,
            date: dayStartTimestamp,
            meals: [newMeal],
            totalCalories: newMeal.totalCalories,
            totalMacros: newMeal.totalMacros,
          };
          
          dailyEntries.push(newDailyEntry);
        }
        
        set({ dailyEntries });
        return mealId;
      },
      
      updateMeal: (mealId, updates) => {
        const dailyEntries = [...get().dailyEntries];
        
        // Find the meal
        for (let i = 0; i < dailyEntries.length; i++) {
          const mealIndex = dailyEntries[i].meals.findIndex(meal => meal.id === mealId);
          
          if (mealIndex >= 0) {
            // Update the meal
            const updatedMeal = {
              ...dailyEntries[i].meals[mealIndex],
              ...updates,
            };
            
            // Recalculate totals if foods were updated
            if (updates.foods) {
              updatedMeal.totalCalories = calculateTotalCalories(updatedMeal.foods);
              updatedMeal.totalMacros = calculateTotalMacros(updatedMeal.foods);
            }
            
            dailyEntries[i].meals[mealIndex] = updatedMeal;
            
            // Recalculate daily totals
            dailyEntries[i].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            dailyEntries[i].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            
            break;
          }
        }
        
        set({ dailyEntries });
      },
      
      deleteMeal: (mealId) => {
        const dailyEntries = [...get().dailyEntries];
        
        // Find and remove the meal
        for (let i = 0; i < dailyEntries.length; i++) {
          const mealIndex = dailyEntries[i].meals.findIndex(meal => meal.id === mealId);
          
          if (mealIndex >= 0) {
            dailyEntries[i].meals.splice(mealIndex, 1);
            
            // Recalculate daily totals
            dailyEntries[i].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            dailyEntries[i].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            
            // Remove daily entry if no meals left
            if (dailyEntries[i].meals.length === 0) {
              dailyEntries.splice(i, 1);
            }
            
            break;
          }
        }
        
        set({ dailyEntries });
      },
      
      addFoodToMeal: (mealId, foodData) => {
        const dailyEntries = [...get().dailyEntries];
        const { foodItem, amount } = foodData;
        
        // Calculate nutrition based on amount
        const totalCalories = calculateCaloriesForAmount(
          foodItem.calories,
          foodItem.servingSize,
          amount,
          foodItem.isPerServing
        );
        
        const totalMacros = calculateMacrosForAmount(
          foodItem.macros,
          foodItem.servingSize,
          amount,
          foodItem.isPerServing
        );
        
        const newFood: ConsumedFood = {
          foodItem,
          amount,
          totalCalories,
          totalMacros,
        };
        
        // Find the meal and add the food
        for (let i = 0; i < dailyEntries.length; i++) {
          const mealIndex = dailyEntries[i].meals.findIndex(meal => meal.id === mealId);
          
          if (mealIndex >= 0) {
            // Add food to meal
            dailyEntries[i].meals[mealIndex].foods.push(newFood);
            
            // Recalculate meal totals
            dailyEntries[i].meals[mealIndex].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals[mealIndex].foods
            );
            dailyEntries[i].meals[mealIndex].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals[mealIndex].foods
            );
            
            // Recalculate daily totals
            dailyEntries[i].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            dailyEntries[i].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            
            break;
          }
        }
        
        set({ dailyEntries });
      },
      
      updateFoodInMeal: (mealId, foodIndex, updates) => {
        const dailyEntries = [...get().dailyEntries];
        
        // Find the meal
        for (let i = 0; i < dailyEntries.length; i++) {
          const mealIndex = dailyEntries[i].meals.findIndex(meal => meal.id === mealId);
          
          if (mealIndex >= 0 && foodIndex < dailyEntries[i].meals[mealIndex].foods.length) {
            // Update the food
            const updatedFood = {
              ...dailyEntries[i].meals[mealIndex].foods[foodIndex],
              ...updates,
            };
            
            // Recalculate nutrition if amount or food item changed
            if (updates.amount || updates.foodItem) {
              const foodItem = updatedFood.foodItem;
              const amount = updatedFood.amount;
              
              updatedFood.totalCalories = calculateCaloriesForAmount(
                foodItem.calories,
                foodItem.servingSize,
                amount,
                foodItem.isPerServing
              );
              
              updatedFood.totalMacros = calculateMacrosForAmount(
                foodItem.macros,
                foodItem.servingSize,
                amount,
                foodItem.isPerServing
              );
            }
            
            dailyEntries[i].meals[mealIndex].foods[foodIndex] = updatedFood;
            
            // Recalculate meal totals
            dailyEntries[i].meals[mealIndex].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals[mealIndex].foods
            );
            dailyEntries[i].meals[mealIndex].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals[mealIndex].foods
            );
            
            // Recalculate daily totals
            dailyEntries[i].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            dailyEntries[i].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            
            break;
          }
        }
        
        set({ dailyEntries });
      },
      
      removeFoodFromMeal: (mealId, foodIndex) => {
        const dailyEntries = [...get().dailyEntries];
        
        // Find the meal
        for (let i = 0; i < dailyEntries.length; i++) {
          const mealIndex = dailyEntries[i].meals.findIndex(meal => meal.id === mealId);
          
          if (mealIndex >= 0 && foodIndex < dailyEntries[i].meals[mealIndex].foods.length) {
            // Remove the food
            dailyEntries[i].meals[mealIndex].foods.splice(foodIndex, 1);
            
            // Recalculate meal totals
            dailyEntries[i].meals[mealIndex].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals[mealIndex].foods
            );
            dailyEntries[i].meals[mealIndex].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals[mealIndex].foods
            );
            
            // Recalculate daily totals
            dailyEntries[i].totalCalories = calculateTotalCalories(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            dailyEntries[i].totalMacros = calculateTotalMacros(
              dailyEntries[i].meals.flatMap(meal => meal.foods)
            );
            
            // Remove meal if no foods left
            if (dailyEntries[i].meals[mealIndex].foods.length === 0) {
              dailyEntries[i].meals.splice(mealIndex, 1);
              
              // Remove daily entry if no meals left
              if (dailyEntries[i].meals.length === 0) {
                dailyEntries.splice(i, 1);
              }
            }
            
            break;
          }
        }
        
        set({ dailyEntries });
      },
      
      addFoodToDatabase: (foodData) => {
        const foodId = `food_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newFood: FoodItem = {
          ...foodData,
          id: foodId,
        };
        
        set({ foodDatabase: [...get().foodDatabase, newFood] });
        return foodId;
      },
      
      updateFoodInDatabase: (foodId, updates) => {
        const foodDatabase = [...get().foodDatabase];
        const foodIndex = foodDatabase.findIndex(food => food.id === foodId);
        
        if (foodIndex >= 0) {
          foodDatabase[foodIndex] = {
            ...foodDatabase[foodIndex],
            ...updates,
          };
          
          set({ foodDatabase });
        }
      },
      
      deleteFoodFromDatabase: (foodId) => {
        const foodDatabase = get().foodDatabase.filter(food => food.id !== foodId);
        set({ foodDatabase });
      },
      
      getDailyNutrition: (date) => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayStartTimestamp = dayStart.getTime();
        
        return get().dailyEntries.find(entry => 
          new Date(entry.date).setHours(0, 0, 0, 0) === dayStartTimestamp
        );
      },
      
      getMealsByType: (date, type) => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayStartTimestamp = dayStart.getTime();
        
        const dailyEntry = get().dailyEntries.find(entry => 
          new Date(entry.date).setHours(0, 0, 0, 0) === dayStartTimestamp
        );
        
        if (!dailyEntry) return [];
        
        return dailyEntry.meals.filter(meal => meal.type === type);
      },
      
      calculateTotalNutrition: (date) => {
        const dailyEntry = get().getDailyNutrition(date);
        
        if (!dailyEntry) {
          return { 
            calories: 0, 
            macros: { protein: 0, carbs: 0, fat: 0 } 
          };
        }
        
        return {
          calories: dailyEntry.totalCalories,
          macros: dailyEntry.totalMacros,
        };
      },
      
      calculateRemainingNutrition: (date, targetCalories, targetMacros) => {
        const { calories, macros } = get().calculateTotalNutrition(date);
        
        const remainingCalories = Math.max(0, targetCalories - calories);
        const remainingProtein = Math.max(0, targetMacros.protein - (macros.protein || 0));
        const remainingCarbs = Math.max(0, targetMacros.carbs - (macros.carbs || 0));
        const remainingFat = Math.max(0, targetMacros.fat - (macros.fat || 0));
        
        // Calculate percentages of targets consumed
        const caloriePercentage = Math.min(100, Math.round((calories / targetCalories) * 100));
        const proteinPercentage = Math.min(100, Math.round(((macros.protein || 0) / targetMacros.protein) * 100));
        const carbsPercentage = Math.min(100, Math.round(((macros.carbs || 0) / targetMacros.carbs) * 100));
        const fatPercentage = Math.min(100, Math.round(((macros.fat || 0) / targetMacros.fat) * 100));
        
        return {
          calories: remainingCalories,
          macros: {
            protein: remainingProtein,
            carbs: remainingCarbs,
            fat: remainingFat,
          },
          percentages: {
            calories: caloriePercentage,
            protein: proteinPercentage,
            carbs: carbsPercentage,
            fat: fatPercentage,
          }
        };
      },
      
      clearAllData: () => {
        set({ dailyEntries: [], foodDatabase: [] });
      },
    }),
    {
      name: 'nutrition-storage',
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
