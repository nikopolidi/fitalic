import { ExpoConfig } from 'expo/config';

declare module 'expo/config' {
  interface IOS {
    widget?: {
      name: string;
      bundleIdentifier: string;
      supportedFamilies: string[];
      supportedDeviceFamilies: string[];
      deploymentTarget: string;
      sourcePath: string;
      widgetConfig: {
        backgroundColors: {
          light: string;
          dark: string;
        };
        textColors: {
          light: string;
          dark: string;
        };
        defaultFontSize: number;
        defaultPadding: number;
      };
    };
  }
} 