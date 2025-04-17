import { TabBarIcon } from '@/components/TabBarIcon';
import { Tabs } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: { 
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border 
        },
        headerStyle: { 
          backgroundColor: theme.colors.background 
        },
        headerTitleStyle: {
          color: theme.colors.text
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => 
            <TabBarIcon 
              name="home"
              color='primary'
            />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => 
            <TabBarIcon 
              name="user"
              color='primary'
            />,
        }}
      />
    </Tabs>
  );
} 