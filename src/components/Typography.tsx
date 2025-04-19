import { AppTheme } from '@/styles/theme';
import React from 'react';
import { TextProps as RNTextProps, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// Define the possible variant keys based on the AppTheme typography
export type TypographyVariant = keyof AppTheme['typography'];

// Define props for the Typography component
// Extends standard React Native TextProps
// Adds the 'variant' prop
export type TypographyProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: keyof AppTheme['colors'];
};

const DEFAULT_VARIANT: TypographyVariant = 'body';

/**
 * A custom Text component that applies typography styles from the theme
 * based on the provided `variant` prop.
 *
 * Inherits all standard React Native Text props.
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = DEFAULT_VARIANT,  // Default to 'body' variant
  style,                      // User-provided style overrides
  children,                   // Text content
  color,
  ...rest                     // Other standard Text props (e.g., onPress, numberOfLines)
}) => {
  styles.useVariants({variant})

  return (
    // Render the base Text component with merged styles and remaining props
    <Text style={[styles.text, {color: color}, style]} {...rest}>
      {children}
    </Text>
  );
};
const styles = StyleSheet.create(theme => ({
  text: {
    variants: {
      variant: theme.typography
    }
  }
}))
export default Typography; 