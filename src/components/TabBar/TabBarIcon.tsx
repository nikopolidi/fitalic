import { AppTheme } from '@/styles/theme';
import { StyleSheet } from 'react-native-unistyles';
import { Icon, IconFamily, IconProps } from '../Icon'; // Import IconProps instead of IconName

type ThemeColors = keyof AppTheme['colors']

interface TabBarIconProps<F extends IconFamily = 'fontAwesome'> {
  family?: F;
  name: IconProps<F>['name']; // Use IconProps<F>['name'] to get the correct name type
  color: ThemeColors; // Still accepts a theme color key
  size?: keyof AppTheme['icon']['size'];
}

export function TabBarIcon<F extends IconFamily = 'fontAwesome'>({ 
  family = 'fontAwesome' as F,
  name,
  color,
  size = 'md'
}: TabBarIconProps<F>) {

  return (
    <Icon 
      family={family}
      size={size} 
      style={styles.icon} 
      name={name} 
      color={color}
    />
  );
}
const styles = StyleSheet.create(theme => ({
  icon: {
    marginBottom: theme.spacing.xs,
  },
}));
