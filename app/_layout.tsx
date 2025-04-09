import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';

import { initializeURLHandler } from '../src/utils/URLHandler';
import WidgetManager from '../src/utils/WidgetManager';

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
        await WidgetManager.updateWidget({
          sections: [
            { id: '1', title: 'Тренировка', color: '#FF3B30' },
            { id: '2', title: 'Статистика', color: '#34C759' },
          ],
          style: {
            backgroundColor: '#000000',
            dividerColor: '#FFFFFF',
            dividerWidth: 1,
            fontSize: 16,
            fontWeight: 600,
            padding: 12,
          },
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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
    </ThemeProvider>
  );
}
