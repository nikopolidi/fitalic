import { ExtensionStorage } from '@bacons/apple-targets';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Создаем экземпляр хранилища для обмена данными
const storage = new ExtensionStorage('group.com.vitalii.nikopolidi.fitalic.shared');

// Ключи для хранения данных
const KEYS = {
  TARGET_NUTRITION: 'targetNutrition',
  CONSUMED_NUTRITION: 'consumedNutrition'
};

export const setTargetNutrition = async (data: NutritionData) => {
  try {
    await storage.set(KEYS.TARGET_NUTRITION, JSON.stringify(data));
    ExtensionStorage.reloadWidget()
  } catch (error) {
    console.error("Failed to set target nutrition", error);
  }
};

export const setConsumedNutrition = async (data: NutritionData) => {
  try {
    await storage.set(KEYS.CONSUMED_NUTRITION, JSON.stringify(data));
    ExtensionStorage.reloadWidget()
  } catch (error) {
    console.error("Failed to set consumed nutrition", error);
  }
}; 