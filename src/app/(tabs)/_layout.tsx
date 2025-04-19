import { TabBarIcon } from '@/components/TabBarIcon';
import { useChatStore } from '@/services/storage';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Alert, TouchableOpacity } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function TabLayout() {
  const { theme } = useUnistyles();
  
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
          title: 'Chat',
          tabBarIcon: ({ focused, color }) => 
            <TabBarIcon 
              name={"comment"}
              color={focused ? 'primary': 'textSecondary'}
            />,
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleClearChat} 
              disabled={isChatEmpty}
              style={{ marginRight: theme.spacing.md }}
            >
              <FontAwesome 
                name="trash-o"
                size={22} 
                color={isChatEmpty ? theme.colors.textTertiary : theme.colors.error} 
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ focused, color }) => 
            <TabBarIcon 
              name="cutlery"
              color={focused ? 'primary': 'textSecondary'}
            />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => 
            <TabBarIcon 
              name={"user"}
              color={focused ? 'primary': 'textSecondary'}
            />,
        }}
      />
    </Tabs>
  );
} 