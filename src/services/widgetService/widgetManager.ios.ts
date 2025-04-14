import { Platform } from 'react-native';
import { WidgetManager, NutritionData } from './types';
import { ExtensionStorage } from '@bacons/apple-targets';

// Create storage instance for iOS
const iosStorage = new ExtensionStorage('group.com.vitalii.nikopolidi.fitalic.shared');

// Storage keys
const KEYS = {
  TARGET_NUTRITION: 'targetNutrition',
  CONSUMED_NUTRITION: 'consumedNutrition'
};

const iosWidgetManager: WidgetManager = {
  setTargetNutrition: async (data: NutritionData) => {
    if (Platform.OS !== 'ios') return;
    try {
      await iosStorage.set(KEYS.TARGET_NUTRITION, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to set target nutrition for iOS", error);
    }
  },
  
  setConsumedNutrition: async (data: NutritionData) => {
    if (Platform.OS !== 'ios') return;
    try {
      await iosStorage.set(KEYS.CONSUMED_NUTRITION, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to set consumed nutrition for iOS", error);
    }
  }
};

export default iosWidgetManager; 