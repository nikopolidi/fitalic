import React from 'react';
import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { StyleSheet as UnistylesSheet, useUnistyles } from 'react-native-unistyles';
import { AppTheme } from '../styles/theme'; // Adjust path if needed
import { Icon, IconFamily, IconProps } from './Icon';

// Define size and color keys based on the theme
type IconSizeKey = keyof AppTheme['icon']['size'];
type ColorKey = keyof AppTheme['colors'];
type ButtonSizeKey = keyof AppTheme['components']['button']['variants']['size'];
// Define Button Variants
type ButtonVariant = keyof AppTheme['components']['button']['variants']['variant'];

// Extend TouchableOpacity props, omit conflicting ones if necessary
// Use variant prop instead of color, keep size
export type IconButtonProps<F extends IconFamily = 'fontAwesome'> =
  Omit<TouchableOpacityProps, 'style'> & // Inherit touchable props
  {
    family?: F;
    name: IconProps<F>['name']; // Get name type from IconProps
    size?: ButtonSizeKey;       // Use theme size keys for the button container
    iconSize?: IconSizeKey;     // Use theme size keys for the icon glyph itself
    variant?: ButtonVariant;  // Use button variant
    style?: StyleProp<ViewStyle>; // Style for the TouchableOpacity container
    rounded?: boolean;
  };

const DEFAULT_ICON_SIZE_KEY: IconSizeKey = 'md';
const DEFAULT_BUTTON_SIZE_KEY: ButtonSizeKey = 'md';
const DEFAULT_VARIANT: ButtonVariant = 'ghost';

/**
 * Maps button variant to the appropriate icon color key.
 */
const getIconColorKey = (variant: ButtonVariant): ColorKey => {
  // This function determines the *icon's* color based on the button's variant.
  // You might adjust this logic based on your theme design.
  switch (variant) {
    case 'primary':
      return 'text'; // Example: White/light text on primary button
    case 'secondary':
       return 'text'; // Example: Text color for secondary button
    case 'outline':
      return 'primary'; // Example: Primary color icon for outline button
    case 'ghost':
        return 'primary'; // Example: Primary color icon for ghost button
    default:
      return 'text'; // Default icon color if variant doesn't match
  }
};

/**
 * A button component that displays an icon and handles press events.
 * Uses the universal Icon component internally and applies variants.
 */
export function IconButton<F extends IconFamily = 'fontAwesome'>({
  family,
  name,
  size = DEFAULT_BUTTON_SIZE_KEY,
  iconSize = DEFAULT_ICON_SIZE_KEY,
  variant = DEFAULT_VARIANT,
  style,
  disabled,
  rounded = true,
  onPress,
  ...rest // Other TouchableOpacity props
}: IconButtonProps<F>) {
  const { theme } = useUnistyles();

  // Apply variants to the button container
  styles.useVariants({
    variant: variant || DEFAULT_VARIANT,
    size: size || DEFAULT_BUTTON_SIZE_KEY,
    disabled: disabled ? 'true' : 'false',
    rounded: rounded ? 'true' : 'false'
  });

  // Determine the icon color based on the button's variant
  const iconColorKey = getIconColorKey(variant);

  return (
    <TouchableOpacity
      style={[styles.button, style]} // Apply the calculated styles + any custom style
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7} // Optional: standard feedback
      {...rest}
    >
      <Icon
        family={family}
        name={name}
        size={iconSize} // Pass size key ('sm', 'md', etc.) for the icon glyph
        color={iconColorKey} // Pass determined color key based on variant
        // No style needed here, centering is handled by the TouchableOpacity
      />
    </TouchableOpacity>
  );
}

const styles = UnistylesSheet.create((theme: AppTheme) => ({
  // Styles for the Icon itself are minimal now
  // icon:{
     // No variants needed here anymore, size is controlled by iconSize prop,
     // and positioning by the button container.
  // },

  // Styles for the TouchableOpacity container
  button: {
    // Base styles for the button container
    justifyContent: 'center', // Center icon vertically
    alignItems: 'center',   // Center icon horizontally
    borderWidth: 0, // Default border width, variants can override
    borderColor: 'transparent', // Default border color, variants override

    // --- Variants Start ---
    variants: {
      // Button Visual Variants (background, border)
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary, // Or use a border color from theme
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        link: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0, // Links typically have no border/background
          // Specific link styling if needed (like underline on text)
        },
      },
      // Button Size Variants (width, height)
      size: {
        // Define fixed dimensions for each size
        // Adjust these values based on your theme.spacing and desired look
        sm: {
          width: theme.spacing.xl, // Example: 32
          height: theme.spacing.xl,
        },
        md: {
          width: theme.spacing.xxl, // Example: 40
          height: theme.spacing.xxl,
        },
        lg: {
           width: theme.spacing.xxxl, // Example: 48
           height: theme.spacing.xxxl,
        },
        // Size 'link' might not need fixed dimensions if it behaves like text
        link: {
          // Links might not need fixed width/height unless desired
          paddingHorizontal: theme.spacing.xs, // Minimal padding for links
          height: 'auto', // Allow height to adjust
          width: 'auto', // Allow width to adjust
        },
      },
      // Rounding Variant
      rounded: {
        true: {
          borderRadius: theme.borderRadius.full, // Use a large value for circle
        },
        false: {
          borderRadius: theme.borderRadius.md, // Standard rounding
        },
      },
      // Disabled State Variant
      disabled: {
        true: {
           opacity: 0.5, // Standard way to show disabled state
           // You might want different background/border colors for disabled state
           // e.g., backgroundColor: theme.colors.disabled, borderColor: theme.colors.disabledBorder
        },
        false: {
           // Styles when not disabled (usually default)
        },
      },
    },
    // --- Variants End ---

    // Optional: Define compound variants if needed, e.g., for disabled primary button
    // compoundVariants: [{
    //   variant: 'primary',
    //   disabled: true,
    //   styles: {
    //     backgroundColor: theme.colors.primaryMuted, // Use a muted primary color
    //     borderColor: theme.colors.primaryMuted,
    //   }
    // }]
  },
}));

export default IconButton; 