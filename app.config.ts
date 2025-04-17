import { ConfigContext, ExpoConfig } from 'expo/config';
// import { Platform } from 'react-native';
// import { Platform } from 'expo-modules-core';

export default ({ config }: ConfigContext): ExpoConfig => {
 
  const baseConfig: ExpoConfig = {
    ...config,
    name: config.name || 'Fitalic',
    slug: config.slug || 'fitalic',
    version: config.version || '1.0.0',
    scheme: config.scheme || 'fitalic',
    newArchEnabled: true,
    orientation: config.orientation || 'portrait',
    icon: config.icon || './assets/images/app_icons/ios/icon-1024.png',
    userInterfaceStyle: config.userInterfaceStyle || 'light',
    splash: config.splash || {
      image: './assets/images/app_icons/ios/icon-1024.png',
      resizeMode: 'contain',
      backgroundColor: '#000000'
    },
    assetBundlePatterns: config.assetBundlePatterns || ['**/*'],
    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: config.ios?.bundleIdentifier || 'com.fitalic.app',
      appleTeamId: config.ios?.appleTeamId || '28UPFCTKBR',
      icon: './assets/images/app_icons/ios/icon-1024.png',
      // icons: {
      //   iphone: {
      //     '2x': './assets/images/app_icons/ios/icon-60@2x.png',
      //     '3x': './assets/images/app_icons/ios/icon-60@3x.png'
      //   },
      //   ipad: {
      //     '2x': './assets/images/app_icons/ios/icon-76@2x.png'
      //   },
      //   ipadPro: {
      //     '2x': './assets/images/app_icons/ios/icon-83.5@2x.png'
      //   },
      //   notification: {
      //     '2x': './assets/images/app_icons/ios/icon-40@2x.png',
      //     '3x': './assets/images/app_icons/ios/icon-60@3x.png'
      //   },
      //   settings: {
      //     '2x': './assets/images/app_icons/ios/icon-29@2x.png',
      //     '3x': './assets/images/app_icons/ios/icon-29@3x.png'
      //   },
      //   spotlight: {
      //     '2x': './assets/images/app_icons/ios/icon-40@2x.png',
      //     '3x': './assets/images/app_icons/ios/icon-40@3x.png'
      //   }
      // }
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: './assets/images/app_icons/ios/icon-1024.png',
        backgroundColor: '#000000'
      },
      icon: './assets/images/app_icons/ios/icon-1024.png',
      package: config.android?.package || 'com.fitalic.app',
      // icons: {
      //   mdpi: './assets/images/app_icons/android/mipmap-mdpi/ic_launcher.png',
      //   hdpi: './assets/images/app_icons/android/mipmap-hdpi/ic_launcher.png',
      //   xhdpi: './assets/images/app_icons/android/mipmap-xhdpi/ic_launcher.png',
      //   xxhdpi: './assets/images/app_icons/android/mipmap-xxhdpi/ic_launcher.png',
      //   xxxhdpi: './assets/images/app_icons/android/mipmap-xxxhdpi/ic_launcher.png'
      // }
    },
    plugins: [
      'expo-router',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            deploymentTarget: '18.0',
            enableBitcode: false,
            buildConfiguration: 'Debug',
            enableModules: true,
            enableCxxModules: true,
            enableSwiftModules: true,
            enableObjcModules: true,
            enableCxxInterop: true,
            enableSwiftInterop: true,
            enableObjcInterop: true,
            enableCxxInteropModules: true,
            enableSwiftInteropModules: true,
            enableObjcInteropModules: true
          }
        }
      ],
      './plugins/withIosDeploymentTarget',
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
    ],
  };

  return baseConfig;
}; 