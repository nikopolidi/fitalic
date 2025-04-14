import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Fitalic',
  slug: 'fitalic',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'fitalic',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.vitalii.nikopolidi.fitalic',
    appleTeamId: '77MSYB58N6',
    infoPlist: {
      NSSupportsLiveActivities: true,
      NSSupportsLiveActivitiesFrequentUpdates: true,
      CFBundleDisplayName: 'Fitalic',
      LSApplicationCategoryType: 'public.app-category.healthcare-fitness'
    },
    entitlements: {
      "com.apple.security.application-groups": [
        "group.com.vitalii.nikopolidi.fitalic.shared"
      ]
    },
    buildNumber: '1',
    newArchEnabled: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.vitalii.nikopolidi.fitalic',
    newArchEnabled: true,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '18.0'
        }
      }
    ],
    '@bacons/apple-targets',
    // './plugins/withAppGroupEntitlements',
    // './plugins/withWidgetModule/index.js',
  ],
  experiments: {
    typedRoutes: true
  }
}); 