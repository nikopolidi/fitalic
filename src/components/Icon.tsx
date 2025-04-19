import { AppTheme } from '@/styles/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

// Map family names to component types
const iconComponents = {
  fontAwesome: FontAwesome,
  feather: Feather,
  materialIcons: MaterialIcons,
  materialCommunityIcons: MaterialCommunityIcons,
  ionicons: Ionicons,
  antDesign: AntDesign,
  entypo: Entypo,
} as const; // Use 'as const' for stricter typing

// Define the possible family names
export type IconFamily = keyof typeof iconComponents;

// Define general props applicable to all icon families
interface BaseIconProps {
  size?: keyof AppTheme['icon']['size'];
  color?: keyof AppTheme['colors'];
  style?: StyleProp<TextStyle>;
}

// Conditional type to get the correct name prop type based on family
type IconName<F extends IconFamily> = React.ComponentProps<typeof iconComponents[F]>['name'];

// Combine base props with family-specific name prop
export type IconProps<F extends IconFamily = 'fontAwesome'> = BaseIconProps & {
  family?: F;
  name: IconName<F>; // The type of 'name' depends on the 'family'
};

const DEFAULT_ICON_SIZE = 'md';

/**
 * A universal Icon component that renders an icon from a specified family.
 * Defaults to FontAwesome if family is not provided.
 */
export function Icon<F extends IconFamily = 'fontAwesome'>({ 
  family = 'fontAwesome' as F, // Default family
  name,
  size = DEFAULT_ICON_SIZE,
  color,
  style
}: IconProps<F>) {
  const {theme} = useUnistyles();
  const resolvedColor = (color ? theme.colors[color] : theme.colors.text) as string;
  const resolvedSize = theme.icon.size[size]
  // Use a switch statement for type-safe rendering
  switch (family) {
    case 'feather':
      return <Feather name={name as IconName<'feather'>} size={resolvedSize} color={resolvedColor} style={style} />;
    case 'materialIcons':
      return <MaterialIcons name={name as IconName<'materialIcons'>} size={resolvedSize} color={resolvedColor} style={style} />;
    case 'materialCommunityIcons':
      return <MaterialCommunityIcons name={name as IconName<'materialCommunityIcons'>} size={resolvedSize} color={resolvedColor} style={style} />;
    case 'ionicons':
      return <Ionicons name={name as IconName<'ionicons'>} size={resolvedSize} color={resolvedColor} style={style} />;
    case 'antDesign':
      return <AntDesign name={name as IconName<'antDesign'>} size={resolvedSize} color={resolvedColor} style={style} />;
    case 'entypo':
      return <Entypo name={name as IconName<'entypo'>} size={resolvedSize} color={resolvedColor} style={style} />;
    case 'fontAwesome': // Explicitly handle fontAwesome (and default)
    default:
      return <FontAwesome name={name as IconName<'fontAwesome'>} size={resolvedSize} color={resolvedColor} style={style} />;
  }
}

export default Icon; 