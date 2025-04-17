import '@/styles/unistyles.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useUnistyles } from 'react-native-unistyles';

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
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

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

  return <RootNavigator />;
}

function RootNavigator() {
  const { theme } = useUnistyles();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: { 
          backgroundColor: theme.colors.background 
        },
        headerTitleStyle: { 
          color: theme.colors.text 
        },
        headerTintColor: theme.colors.primary,
        contentStyle: { 
          backgroundColor: theme.colors.background 
        }
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen 
        name="section/[id]" 
        options={{
          title: 'Section',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
