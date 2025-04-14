import { Platform, NativeModules } from 'react-native';
import { WidgetManager, NutritionData } from './types';

const { AndroidWidgetModule } = NativeModules;

const androidWidgetManager: WidgetManager = {
  setTargetNutrition: async (data: NutritionData) => {
    if (Platform.OS !== 'android' || !AndroidWidgetModule) return;
    try {
      await AndroidWidgetModule.setTargetNutrition(data);
    } catch (error) {
      console.error("Failed to set target nutrition for Android", error);
    }
  },
  
  setConsumedNutrition: async (data: NutritionData) => {
    if (Platform.OS !== 'android' || !AndroidWidgetModule) return;
    try {
      await AndroidWidgetModule.setConsumedNutrition(data);
    } catch (error) {
      console.error("Failed to set consumed nutrition for Android", error);
    }
  }
};

export default androidWidgetManager; 