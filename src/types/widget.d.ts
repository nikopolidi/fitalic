import { ExpoConfig } from 'expo/config';
import { ConfigPlugin as OriginalConfigPlugin } from '@expo/config-plugins';

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

declare module '@expo/config-plugins' {
  interface ConfigPlugin extends OriginalConfigPlugin {
    (config: ExpoConfig): Promise<ExpoConfig> | ExpoConfig;
  }

  interface ModConfig {
    modRequest: {
      platformProjectRoot: string;
      projectName: string;
    };
  }

  interface ModPlugin {
    (config: ExpoConfig & ModConfig): Promise<ExpoConfig> | ExpoConfig;
  }

  function withDangerousMod(
    platform: string,
    mod: ModPlugin
  ): ConfigPlugin;
} 