import { ExpoConfig, ConfigContext } from 'expo/config';
// import { Platform } from 'react-native';
// import { Platform } from 'expo-modules-core';

export default ({ config }: ConfigContext): ExpoConfig => {
  // Базовые плагины
  const basePlugins: ExpoConfig['plugins'] = [
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
    [
      './plugins/withAndroidWidget',
      {
        widgetName: 'Fitalic Widget',
        widgetDescription: 'Track your calories and protein goals',
        widgetResizeMode: 'none',
        widgetMinWidth: 200,
        widgetMinHeight: 100,
        widgetUpdatePeriodMillis: 1800000, // 30 minutes
        widgetLayout: {
          type: 'LinearLayout',
          children: [
            {
              type: 'TextView',
              id: 'target_calories',
              text: '0 cal',
              style: {
                textSize: '16sp',
                textColor: '#000000'
              }
            },
            {
              type: 'TextView',
              id: 'target_protein',
              text: '0g',
              style: {
                textSize: '16sp',
                textColor: '#000000'
              }
            }
          ]
        }
      }
    ]
  ];
  // Добавляем плагин виджета только для Android
  // if (Platform.OS === 'android') {
  //   basePlugins.push('./plugins/withAndroidWidget');
  // }

  const baseConfig: ExpoConfig = {
    ...config,
    name: config.name || 'Fitalic',
    slug: config.slug || 'fitalic',
    version: config.version || '1.0.0',
    orientation: config.orientation || 'portrait',
    icon: config.icon || './assets/images/icon.png',
    userInterfaceStyle: config.userInterfaceStyle || 'light',
    splash: config.splash || {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: config.assetBundlePatterns || ['**/*'],
    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: config.ios?.bundleIdentifier || 'com.fitalic.app'
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: config.android?.package || 'com.fitalic.app'
    },
    plugins: basePlugins,
  };

  return baseConfig;
}; 