module.exports = {
  // Имя таргета
  name: "widget",
  // Отображаемое имя в Xcode
  displayName: "Fitalic Widget",
  // Тип таргета - widget для iOS виджетов
  type: "widget",
  // Шаблон для установки
  template: "widget",
  // Идентификатор бандла виджета
  bundleId: "com.vitalii.nikopolidi.fitalic.widget",
  // Настройка минимальной версии iOS
  deploymentTarget: "16.0",
  // Настройки прав доступа
  entitlements: {
    "com.apple.security.application-groups": [
      "group.com.vitalii.nikopolidi.fitalic.shared"
    ]
  },
  // Настройки Info.plist
  infoPlist: {
    NSExtension: {
      NSExtensionPointIdentifier: "com.apple.widgetkit-extension"
    },
    CFBundleDisplayName: "Fitalic",
    NSWidgetWantsLocation: false,
    NSWidgetAllowsEditing: true,
    NSWidgetDisplayMode: "expanded",
    NSSupportsLiveActivities: true,
    NSSupportsLiveActivitiesFrequentUpdates: true
  },
  // Необходимые фреймворки
  frameworks: ["WidgetKit", "SwiftUI"],
  // color scheme
  colors: {
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    accentColor: "#FF01A1"
  },
  images: {
    fat: './assets/fat.png',
    carbs: './assets/carbs.png',
    protein: './assets/protein.png',
    calories: './assets/calories.png',
  }
};