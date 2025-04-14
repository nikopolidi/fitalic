const { withDangerousMod } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

const withAndroidWidget = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidProjectPath = path.join(projectRoot, 'android');
      const appPath = path.join(androidProjectPath, 'app');
      const mainPath = path.join(appPath, 'src', 'main');
      const resPath = path.join(mainPath, 'res');
      const layoutPath = path.join(resPath, 'layout');
      const xmlPath = path.join(resPath, 'xml');
      const drawablePath = path.join(resPath, 'drawable');
      const valuesPath = path.join(resPath, 'values');
      const javaPath = path.join(appPath, 'src', 'main', 'java', 'com', 'fitalic', 'app', 'widget');

      // Создаем необходимые директории
      [layoutPath, xmlPath, drawablePath, valuesPath, javaPath].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      // Копируем файлы из templates
      const templatesPath = path.join(__dirname, 'templates');
      
      // Копируем layout
      fs.copyFileSync(
        path.join(templatesPath, 'res', 'layout', 'fitalic_widget.xml'),
        path.join(layoutPath, 'fitalic_widget.xml')
      );

      // Копируем drawable files
      fs.copyFileSync(
        path.join(templatesPath, 'res', 'drawable', 'widget_background.xml'),
        path.join(drawablePath, 'widget_background.xml')
      );
      
      fs.copyFileSync(
        path.join(templatesPath, 'res', 'drawable', 'widget_preview.xml'),
        path.join(drawablePath, 'widget_preview.xml')
      );

      // Копируем xml
      fs.copyFileSync(
        path.join(templatesPath, 'res', 'xml', 'fitalic_widget_info.xml'),
        path.join(xmlPath, 'fitalic_widget_info.xml')
      );

      // Копируем values
      fs.copyFileSync(
        path.join(templatesPath, 'res', 'values', 'strings.xml'),
        path.join(valuesPath, 'widget_strings.xml')
      );

      // Копируем java
      fs.copyFileSync(
        path.join(templatesPath, 'java', 'com', 'fitalic', 'app', 'widget', 'FitalicWidgetProvider.java'),
        path.join(javaPath, 'FitalicWidgetProvider.java')
      );

      // Обновляем AndroidManifest.xml
      const manifestPath = path.join(mainPath, 'AndroidManifest.xml');
      let manifestContent = fs.readFileSync(manifestPath, 'utf-8');

      const widgetProvider = `
        <receiver
            android:name=".widget.FitalicWidgetProvider"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/fitalic_widget_info" />
        </receiver>`;

      manifestContent = mergeContents({
        tag: 'application',
        src: manifestContent,
        newSrc: widgetProvider,
        anchor: '</application>',
        offset: 0,
        comment: '<!-- @widget-provider -->',
      }).contents;

      fs.writeFileSync(manifestPath, manifestContent);

      return config;
    },
  ]);
};

module.exports = withAndroidWidget; 