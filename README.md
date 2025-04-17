# Fitalic

Mobile fitness and healthy lifestyle application created using React Native and Expo.

## Features

- 🏋️ **Personalized workouts**: Create and track workout programs
- 📊 **Progress**: Visualize your progress over time
- 🍎 **Nutrition**: Food tracking and recommendations
- 🌙 **Dark theme**: Full dark mode support
- 📱 **Cross-platform**: Works on iOS and Android

## Technologies

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Unistyles](https://github.com/jpudysz/react-native-unistyles)
- [MMKV](https://github.com/mrousavy/react-native-mmkv)

## Installation

```bash
# Clone repository
git clone <repository>

# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
src/
├── app/              # Expo Router navigation
│   ├── (tabs)/       # Tab navigation
│   └── storage/      # Storage services
├── components/       # React components
│   ├── ui/           # UI components (buttons, cards, etc.)
│   └── ...           # Other components
└── styles/           # Styles and themes
    ├── theme.ts      # Theme configuration
    └── unistyles.ts  # Unistyles setup
```

## Usage

Developer documentation is located in the corresponding module directories:

- [Persisted Storage](src/app/storage/README.md)

## License

© 2024 Fitalic. All rights reserved.

This software is proprietary and protected by copyright law. Unauthorized copying, use, modification, merging, publication, distribution, or sale of either the original or modified code, or portions thereof, is strictly prohibited. The source code is provided without implied warranties and conditions of any kind, express or implied.

This code is provided exclusively for internal use by authorized employees and contractors who have appropriate permission from the copyright holder. 