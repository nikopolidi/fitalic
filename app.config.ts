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
    extra: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      "eas": {
        "projectId": "25fa6105-a4a4-4c73-8cc9-eb90c6c24e1f"
      },
    },
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
      infoPlist: {
        NSCameraUsageDescription: "Fitalic needs access to your camera to take progress photos",
        NSMicrophoneUsageDescription: "Fitalic needs access to your microphone to record voice notes",
        NSPhotoLibraryUsageDescription: "Fitalic needs access to your photo library to save and upload progress photos",
        NSPhotoLibraryAddUsageDescription: "Fitalic needs permission to save photos to your photo library"
      },
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: './assets/images/app_icons/ios/icon-1024.png',
        backgroundColor: '#000000'
      },
      icon: './assets/images/app_icons/ios/icon-1024.png',
      package: config.android?.package || 'com.fitalic.app',
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO",
        "READ_MEDIA_AUDIO"
      ],
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