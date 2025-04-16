import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { initializeURLHandler } from '@/utils/URLHandler';
// @ts-expect-error
import widgetService from '@/services/widgetService';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: '#fff' },
      headerTintColor: '#000', 
      contentStyle: { backgroundColor: '#fff' }
    }}>
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
