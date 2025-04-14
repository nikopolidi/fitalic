import { ConfigPlugin, withAndroidManifest, withDangerousMod } from '@expo/config-plugins';
import { ExpoConfig } from 'expo/config';
import fs from 'fs';
import path from 'path';

interface WidgetConfig {
  widgetName: string;
  widgetDescription: string;
  widgetResizeMode: 'none' | 'horizontal' | 'vertical' | 'both';
  widgetMinWidth: number;
  widgetMinHeight: number;
  widgetUpdatePeriodMillis: number;
  widgetPreviewImage?: string;
  widgetLayout: {
    type: string;
    children: Array<{
      type: string;
      text?: string;
      id?: string;
      style?: Record<string, string>;
    }>;
  };
}

const withAndroidWidget: ConfigPlugin<WidgetConfig> = (config: ExpoConfig, widgetConfig: WidgetConfig) => {
  // Create widget layout file
  config = withDangerousMod(config, {
    platform: 'android',
    mod: 'widgetLayout',
    action: async (config) => {
      const layoutPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/layout/fitalic_widget.xml'
      );
      const layoutContent = generateWidgetLayout(widgetConfig.widgetLayout);
      fs.mkdirSync(path.dirname(layoutPath), { recursive: true });
      fs.writeFileSync(layoutPath, layoutContent);
      return config;
    },
  });

  // Create widget configuration file
  config = withDangerousMod(config, {
    platform: 'android',
    mod: 'widgetInfo',
    action: async (config) => {
      const infoPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/xml/fitalic_widget_info.xml'
      );
      const infoContent = generateWidgetInfo(widgetConfig);
      fs.mkdirSync(path.dirname(infoPath), { recursive: true });
      fs.writeFileSync(infoPath, infoContent);
      return config;
    },
  });

  // Update AndroidManifest.xml
  config = withAndroidManifest(config, async (config) => {
    const mainApplication = config.modResults.manifest.application?.[0];
    if (!mainApplication) {
      throw new Error('AndroidManifest.xml does not contain application element');
    }

    // Check if receiver already exists
    const existingReceiver = mainApplication.receiver?.find(
      (r) => r.$['android:name'] === '.widget.FitalicWidgetProvider'
    );

    if (!existingReceiver) {
      // Add receiver only if it doesn't exist
      mainApplication.receiver = [
        ...(mainApplication.receiver || []),
        {
          $: {
            'android:name': '.widget.FitalicWidgetProvider',
            'android:exported': 'true',
          },
          'intent-filter': [
            {
              action: [
                {
                  $: {
                    'android:name': 'android.appwidget.action.APPWIDGET_UPDATE',
                  },
                },
              ],
            },
          ],
          'meta-data': [
            {
              $: {
                'android:name': 'android.appwidget.provider',
                'android:resource': '@xml/fitalic_widget_info',
              },
            },
          ],
        },
      ];
    }

    return config;
  });

  return config;
};

function generateWidgetLayout(layout: WidgetConfig['widgetLayout']): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="8dp"
    android:background="@drawable/widget_background">
    <TextView
        android:id="@+id/widget_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/widget_title"
        android:textSize="16sp"
        android:textStyle="bold"
        android:layout_margin="8dp"/>
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_margin="8dp">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/widget_calories"/>
        <TextView
            android:id="@+id/target_calories"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:gravity="end"
            android:text="0"/>
    </LinearLayout>
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_margin="8dp">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/widget_protein"/>
        <TextView
            android:id="@+id/target_protein"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:gravity="end"
            android:text="0g"/>
    </LinearLayout>
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_margin="8dp">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/widget_fats"/>
        <TextView
            android:id="@+id/target_fats"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:gravity="end"
            android:text="0g"/>
    </LinearLayout>
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_margin="8dp">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/widget_carbs"/>
        <TextView
            android:id="@+id/target_carbs"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:gravity="end"
            android:text="0g"/>
    </LinearLayout>
</LinearLayout>`;
}

function generateWidgetInfo(config: WidgetConfig): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="${config.widgetMinWidth}dp"
    android:minHeight="${config.widgetMinHeight}dp"
    android:updatePeriodMillis="${config.widgetUpdatePeriodMillis}"
    android:initialLayout="@layout/fitalic_widget"
    android:resizeMode="${config.widgetResizeMode}"
    android:widgetCategory="home_screen"
    android:description="@string/app_name" />`;
}

export default withAndroidWidget; 