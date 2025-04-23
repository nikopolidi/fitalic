import { TabBarIcon } from '@/components/TabBar/TabBarIcon';
import { useChatStore } from '@/services/storage';
// import { BottomTabBarProps } from '@react-navigation/bottom-tabs'; // Removed
import IconButton from '@/components/IconButton';
import TabBar from '@/components/TabBar/TabBar'; // Import the new TabBar
import { AppTheme } from '@/styles/theme';
import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native'; // Removed Text, View
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Custom TabBar Component - Removed from here
// function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
//   ...
// }

export default function TabLayout() {
  const { theme } = useUnistyles(); // Keep for theme access
  
  // Select state reactively
  const currentSessionId = useChatStore(state => state.currentSessionId);
  const messages = useChatStore(state => 
    state.sessions.find(s => s.id === state.currentSessionId)?.messages ?? []
  );
  const deleteSession = useChatStore(state => state.deleteSession);
  const createSession = useChatStore(state => state.createSession);

  const isChatEmpty = messages.length === 0;

  const handleClearChat = () => {
    // Use the reactively selected currentSessionId
    if (isChatEmpty || !currentSessionId) return; 

    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to delete all messages? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            // Delete the current session and immediately create a new one
            deleteSession(currentSessionId);
            createSession();
          },
          style: "destructive",
        },
      ]
    );
  };

  const chatHeaderRight = useCallback(()=>{
    return (
      <IconButton 
        onPress={handleClearChat} 
        disabled={isChatEmpty}
        name="trash-o"
        size={'md'}
      />
    )
  }, [isChatEmpty])

  return (
    <Tabs
      // Use the imported TabBar component
      tabBar={(props)=> <TabBar {...props} />}
      screenOptions={{
        headerStyle: {backgroundColor: styles.header.backgroundColor}, 
        headerTitleStyle: styles.headerTitle,
        headerTintColor: theme.colors.text,
        tabBarShowLabel: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused, color, size }) => 
            <TabBarIcon 
              family={"ionicons"}
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              color={color as keyof AppTheme['colors']}
              size={String(size) as keyof AppTheme['icon']['size']}
            />,
          headerRight: chatHeaderRight,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => 
            <TabBarIcon 
              family="ionicons"
              name={focused ? "nutrition" : "nutrition-outline"}
              color={color as keyof AppTheme['colors']}
              size={String(size) as keyof AppTheme['icon']['size']}
            />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => 
            <TabBarIcon 
              name={focused ? "user" : "user-o"}
              color={color as keyof AppTheme['colors']}
              size={String(size) as keyof AppTheme['icon']['size']}
            />,
        }}
      />
    </Tabs>
  );
}

// Define styles outside the component
// Keep only styles used outside the TabBar component
const styles = StyleSheet.create(theme => ({
  // Removed tabBarContainer and tabBarButton
  header: {
    backgroundColor: theme.colors.background, 
  },
  headerTitle: {
    color: theme.colors.text,
  },
  headerRightButton: {
    marginRight: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
})); 