import { AppTheme } from '@/styles/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useUnistyles } from 'react-native-unistyles';

type ThemeColors = keyof Omit<AppTheme['colors'], 'opacity'>;

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: ThemeColors;
}

export function TabBarIcon({ name, color }: TabBarIconProps) {
  const { theme } = useUnistyles();

  return (
    <FontAwesome 
      size={28} 
      style={{ marginBottom: theme.spacing.xs }} 
      name={name} 
      color={theme.colors[color]} 
    />
  );
}
