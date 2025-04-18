/**
 * Nutrition and food tracking types for the fitness application
 */

export type MealType = 
  | 'breakfast'
  | 'morningSnack'
  | 'lunch'
  | 'afternoonSnack'
  | 'dinner'
  | 'eveningSnack'
  | 'custom';

export type MacroNutrients = {
  protein: number;  // in grams
  carbs: number;    // in grams
  fat: number;      // in grams
  fiber?: number;   // optional, in grams
  sugar?: number;   // optional, in grams
};

export type FoodItem = {
  id: string;
  name: string;
  calories: number;  // per 100g or per serving
  macros: MacroNutrients;
  servingSize: number;  // in grams
  servingUnit: 'g' | 'ml' | 'oz' | 'tbsp' | 'tsp' | 'cup' | 'piece' | 'custom';
  isPerServing: boolean;  // true if nutrition is per serving, false if per 100g
  imageUri?: string;  // optional path to food image
};

export type ConsumedFood = {
  foodItem: FoodItem;
  amount: number;  // number of servings or grams
  totalCalories: number;  // calculated based on amount
  totalMacros: MacroNutrients;  // calculated based on amount
};

export type Meal = {
  id: string;
  type: MealType;
  name: string;
  foods: ConsumedFood[];
  totalCalories: number;  // sum of all foods
  totalMacros: MacroNutrients;  // sum of all foods
  date: number;  // timestamp
  time: number;  // timestamp for time of day
  notes?: string;  // optional notes about the meal
  imageUri?: string;  // optional path to meal image
};

export type DailyNutrition = {
  id: string;
  date: number;  // timestamp for the day
  meals: Meal[];
  totalCalories: number;  // sum of all meals
  totalMacros: MacroNutrients;  // sum of all meals
  waterIntake?: number;  // optional, in ml
  notes?: string;  // optional notes about the day
};

export type NutritionResponse = {
  recognizedFood?: FoodItem;  // Food recognized from image or text
  mealSuggestion?: Meal;  // Suggested meal based on goals
  nutritionAdvice: string;  // Advice text from AI
  nextSteps: string;  // Suggested next steps
  questions?: string[];  // Follow-up questions
};
