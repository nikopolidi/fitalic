import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from './providers/ThemeProvider';

import { initializeURLHandler } from '../src/utils/URLHandler';
import widgetService from '@/src/services/widgetService';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Инициализация обработчика URL и виджета
  useEffect(() => {
    const initApp = async () => {
      initializeURLHandler();
      try {
        // Инициализируем виджет с дефолтными значениями
        await widgetService.setTargetNutrition({
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 50
        });

        await widgetService.setConsumedNutrition({
          calories: 500,
          protein: 30,
          carbs: 50,
          fat: 15
        });
      } catch (error) {
        console.error('Error initializing widget:', error);
      }
    };

    initApp();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen 
        name="section/[id]" 
        options={{ 
          title: 'Секция',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
