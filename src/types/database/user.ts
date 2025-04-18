/**
 * User data types for the fitness application
 */

export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel = 
  | 'sedentary'        // Little to no exercise
  | 'lightlyActive'    // Light exercise 1-3 days/week
  | 'moderatelyActive' // Moderate exercise 3-5 days/week
  | 'veryActive'       // Hard exercise 6-7 days/week
  | 'extraActive';     // Very hard exercise & physical job or 2x training

export type FitnessGoal = 
  | 'weightLoss'       // Caloric deficit
  | 'maintenance'      // Maintain current weight
  | 'muscleGain'       // Lean muscle gain
  | 'recomposition'    // Fat loss and muscle gain
  | 'performance'      // Athletic performance
  | 'health';          // General health improvement

export type DietaryPreference = 
  | 'omnivore'         // No restrictions
  | 'vegetarian'       // No meat
  | 'vegan'            // No animal products
  | 'pescatarian'      // Vegetarian + fish
  | 'keto'             // Low carb, high fat
  | 'paleo'            // Whole foods, no processed
  | 'lowCarb'          // Reduced carbohydrates
  | 'lowFat'           // Reduced fat
  | 'glutenFree'       // No gluten
  | 'dairyFree'        // No dairy
  | 'custom';          // Custom restrictions

export type DietaryRestriction = {
  type: 'allergy' | 'intolerance' | 'preference';
  food: string;
};

export type Anthropometry = {
  height: number;       // in cm
  weight: number;       // in kg
  age: number;          // in years
  gender: Gender;
  activityLevel: ActivityLevel;
  bodyFatPercentage?: number; // optional, in %
  waistCircumference?: number; // optional, in cm
  hipCircumference?: number;   // optional, in cm
  chestCircumference?: number; // optional, in cm
};

export type NutritionGoals = {
  calories: number;     // daily calorie target
  protein: number;      // in grams
  carbs: number;        // in grams
  fat: number;          // in grams
  fiber?: number;       // optional, in grams
  sugar?: number;       // optional, in grams
  water?: number;       // optional, in ml
};

export type UserPreferences = {
  fitnessGoal: FitnessGoal;
  dietaryPreferences: DietaryPreference[];
  dietaryRestrictions: DietaryRestriction[];
  mealsPerDay: number;
  preferredWorkoutDuration: number; // in minutes
  preferredWorkoutDays: number[];   // 0-6, where 0 is Sunday
  language: string;                 // User's preferred language
};

export type UserData = {
  id: string;
  name: string;
  anthropometry: Anthropometry;
  nutritionGoals: NutritionGoals;
  preferences: UserPreferences;
  createdAt: number;    // timestamp
  updatedAt: number;    // timestamp
  avatarUri?: string;   // optional path to avatar image
};
