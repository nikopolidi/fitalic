import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Typography from '../Typography';

// Renamed from MyTabBar
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useUnistyles();

  // Colors can be derived directly from theme if consistent
  const activeColor = theme.colors.primary; // Or theme.colors.text if that's the intent
  const inactiveColor = theme.colors.textSecondary;

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;
            
        const tabBarIcon = options.tabBarIcon;
        // Determine label color (if shown) based on focus state
        const resolvedLabelColor = isFocused ? activeColor : inactiveColor;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        console.log('route.key',route.key)
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarButton}
          >
            {tabBarIcon && (
              // Pass focused, color key, AND a size number to satisfy the type signature
              tabBarIcon({ 
                focused: isFocused, 
                color: isFocused ? 'primary' : 'textSecondary', 
                // @ts-ignore it's fine as I use theme.icon.size
                size: 'lg' // Provide a default size number
              })
            )}
            {/* Optionally render the label */}
            {options.tabBarShowLabel !== false && (
              <Typography variant='bodySmall' style={{ color: resolvedLabelColor, marginTop: 2 }}>
                {typeof label === 'string' ? label : route.name}
              </Typography>
            )} 
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Define styles specifically for the TabBar
const styles = StyleSheet.create(theme => ({
  tabBarContainer: {
    backgroundColor: theme.colors.background, 
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    height: 80, // Adjusted height for potential labels
    borderTopWidth: 1, 
    // Background and border color set dynamically using theme
    paddingBottom: 5, // Add some padding for labels
    paddingTop: theme.spacing.sm,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}));

export default TabBar; 