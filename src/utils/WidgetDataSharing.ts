// Utility for sharing data between the app and widget
// Uses UserDefaults and App Group for data sharing

import { NativeModules, Platform } from 'react-native';

// Define types for native modules
declare global {
  interface NativeModules {
    WidgetModule: {
      updateWidgetData: (
        appGroup: string, 
        key: string, 
        data: string, 
        callback: (success: boolean) => void
      ) => void;
    };
  }
}

interface WidgetData {
  text: string;
  count: number;
  lastUpdated: string;
}

/**
 * Class for managing widget data
 */
export class WidgetDataManager {
  private static readonly APP_GROUP = 'group.com.vitalii.nikopolidi.fitalic.shared';
  private static readonly STORAGE_KEY = 'fitalic_widget_data';

  /**
   * Updates widget data
   */
  static updateWidgetData(data: WidgetData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Check if we're on iOS and the WidgetModule is available
        if (Platform.OS === 'ios' && NativeModules.WidgetModule) {
          NativeModules.WidgetModule.updateWidgetData(
            this.APP_GROUP,
            this.STORAGE_KEY,
            JSON.stringify(data),
            (success: boolean) => {
              if (success) {
                console.log('Widget data updated successfully');
                resolve(true);
              } else {
                console.error('Failed to update widget data');
                resolve(false);
              }
            }
          );
        } else {
          // Handle non-iOS platform or missing module
          console.warn('WidgetModule not available on this platform');
          resolve(false);
        }
      } catch (error) {
        console.error('Error updating widget data:', error);
        reject(error);
      }
    });
  }

  /**
   * Gets sample data for widget update
   */
  static getSampleData(): WidgetData {
    return {
      text: 'Last update',
      count: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Updates widget with random data (for testing)
   */
  static async updateWidgetWithRandomData(): Promise<boolean> {
    return this.updateWidgetData(this.getSampleData());
  }
} 