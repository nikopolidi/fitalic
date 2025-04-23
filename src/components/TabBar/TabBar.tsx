import { AppTheme } from '@/styles/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { memo, useCallback } from 'react';
import { StyleProp, TextStyle, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Typography from '../Typography';

type TabBarButtonInternalProps = {
  route: BottomTabBarProps['state']['routes'][0];
  descriptor: BottomTabBarProps['descriptors'][string];
  navigation: BottomTabBarProps['navigation'];
  isFocused: boolean;
  activeColor: string;
  inactiveColor: string;
};

// Мемоизированный компонент для отдельной кнопки
const TabBarButtonInternal = memo<TabBarButtonInternalProps>(({ 
  route, 
  descriptor, 
  navigation, 
  isFocused, 
  activeColor, 
  inactiveColor 
}) => {
  const { options } = descriptor;
  const label = options.tabBarLabel !== undefined
    ? options.tabBarLabel
    : options.title !== undefined
      ? options.title
      : route.name;

  const tabBarIcon = options.tabBarIcon;
  const resolvedLabelColor = isFocused ? activeColor : inactiveColor;

  const onPress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  }, [navigation, isFocused, route.name, route.key, route.params]);

  const onLongPress = useCallback(() => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  }, [navigation, route.key]);

  const labelStyle: StyleProp<TextStyle> = {
    color: resolvedLabelColor,
    marginTop: 2, // theme.spacing.xxs? Check if needed
  };

  return (
    <TouchableOpacity
      key={route.key} // Key is important here as well for list reconciliation
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarButton}
    >
      {tabBarIcon && (
        tabBarIcon({ 
          focused: isFocused, 
          color: isFocused ? 'primary' : 'textSecondary', 
          // @ts-ignore Correcting size type if possible, otherwise keep ts-ignore
          size: 'lg' as keyof AppTheme['icon']['size'] // Assuming 'lg' is a valid key
        })
      )}
      {options.tabBarShowLabel !== false && (
        <Typography variant='bodySmall' style={labelStyle}>
          {typeof label === 'string' ? label : route.name}
        </Typography>
      )} 
    </TouchableOpacity>
  );
});

// Renamed from MyTabBar
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useUnistyles();

  // Colors can be derived directly from theme if consistent
  const activeColor = theme.colors.primary; // Or theme.colors.text if that's the intent
  const inactiveColor = theme.colors.textSecondary;

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const descriptor = descriptors[route.key];
        
        // Render the memoized button component
        return (
          <TabBarButtonInternal
            key={route.key} // Key is still needed for the list
            route={route}
            descriptor={descriptor}
            navigation={navigation}
            isFocused={isFocused}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
          />
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

export default memo(TabBar); 