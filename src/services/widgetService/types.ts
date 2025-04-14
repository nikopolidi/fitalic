export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WidgetManager {
  setTargetNutrition: (data: NutritionData) => Promise<void>;
  setConsumedNutrition: (data: NutritionData) => Promise<void>;
} 