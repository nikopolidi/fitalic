import { WidgetDataManager } from './WidgetDataSharing';

/**
 * Пример использования WidgetDataManager
 */
export const testWidget = async () => {
  try {
    console.log('Testing widget update...');
    const result = await WidgetDataManager.updateWidgetWithRandomData();
    console.log('Widget update result:', result);
    return result;
  } catch (error) {
    console.error('Widget test failed:', error);
    return false;
  }
};

/**
 * Пример обновления виджета с кастомными данными
 */
export const updateWidgetWithCustomData = async (text: string, count: number) => {
  try {
    const data = {
      text,
      count,
      lastUpdated: new Date().toISOString(),
    };
    const result = await WidgetDataManager.updateWidgetData(data);
    console.log('Widget custom update result:', result);
    return result;
  } catch (error) {
    console.error('Widget custom update failed:', error);
    return false;
  }
}; 