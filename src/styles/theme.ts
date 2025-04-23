const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  } as const

const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  full: '50%'
} as const

export const defaultTheme = {
  colors: {
    // Base colors
    background: '#000000',
    backgroundSecondary: '#121212',
    surface: '#121212',
    surfaceSecondary: '#1E1E1E',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#666666',
    textContrast: '#000000',
    // Accent colors
    primary: '#E6418F', // Updated Primary
    primaryLight: '#F377AE', // Lighter variant
    primaryDark: '#B82E72', // Darker variant
    
    secondary: '#0ABAB5', // Tiffany Blue
    secondaryLight: '#1DDDDD', // Lighter variant
    secondaryDark: '#088F94', // Darker variant
    
    // System colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5856D6',
    
    // Borders and shadows
    border: '#333333',
    borderLight: '#444444',
    shadow: 'rgba(0, 0, 0, 0.5)',
    
    // Color functions
    opacity: (color: string, opacity: number) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
  },
  spacing,
  borderRadius,
  typography: {
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600',
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
    },
    h4: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
    },
    h5: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    h6: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    },
    code: {
      fontFamily: 'SpaceMono',
      fontSize: 14,
      lineHeight: 20,
    },
  },
  // Components
  components: {
    button: {
      padding: spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.md, // Add some rounding
      borderWidth: 1,
      borderColor: 'transparent',
      color: 'primary',
      // variants are acceccible from Stylesheet.create only if clearly set from theme
      variants: {
        variant: {
          primary: {
            backgroundColor: 'primary',
            color: 'text',
            borderColor: 'text',
          },
          secondary: {
            backgroundColor: 'secondary',
            color: 'text',
            borderColor: 'text',
          },
          outline: {
            backgroundColor: 'transparent',
            borderColor: 'primary',
            borderWidth: 1,
            color: 'primary',
          },
          ghost: {
            backgroundColor: 'transparent',
            color: 'primary',
          },
        },
        size: {
          sm: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            fontSize: 14,
          },
          md: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            fontSize: 16,
          },
          lg: {
            paddingVertical: 12,
            paddingHorizontal: 24,
            fontSize: 18,
          },
        },
        disabled: {
          true: {
            opacity: 0.5,
          },
          false: {
            opacity: 1,
          },
        },
        rounded:{
          true: {
            borderRadius: borderRadius.full,
          },
          false: {
            borderRadius: borderRadius.md,
          },
        }
      },
    },
    input: {
      variants: {
        outlined: {
          backgroundColor: 'transparent',
          borderColor: 'border',
          borderWidth: 1,
          color: 'text',
        },
        filled: {
          backgroundColor: 'surfaceSecondary',
          borderColor: 'transparent',
          color: 'text',
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: 'text',
        },
      },
      states: {
        error: {
          borderColor: 'error',
          color: 'error',
        },
        success: {
          borderColor: 'success',
          color: 'success',
        },
        warning: {
          borderColor: 'warning',
          color: 'warning',
        },
      },
      sizes: {
        sm: {
          height: 32,
          fontSize: 14,
        },
        md: {
          height: 40,
          fontSize: 16,
        },
        lg: {
          height: 48,
          fontSize: 18,
        },
      },
    },
    card: {
      variants: {
        elevated: {
          backgroundColor: 'surface',
          shadowColor: 'shadow',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        outlined: {
          backgroundColor: 'surface',
          borderColor: 'border',
          borderWidth: 1,
        },
        flat: {
          backgroundColor: 'surface',
        },
      },
    },
    badge: {
      variants: {
        primary: {
          backgroundColor: 'primary',
          color: 'text',
        },
        secondary: {
          backgroundColor: 'secondary',
          color: 'text',
        },
        success: {
          backgroundColor: 'success',
          color: 'text',
        },
        warning: {
          backgroundColor: 'warning',
          color: 'text',
        },
        error: {
          backgroundColor: 'error',
          color: 'text',
        },
      },
      sizes: {
        sm: {
          paddingVertical: 2,
          paddingHorizontal: 6,
          fontSize: 10,
        },
        md: {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 12,
        },
        lg: {
          paddingVertical: 6,
          paddingHorizontal: 10,
          fontSize: 14,
        },
      },
    },
  },
  // Icon functions
  icon: {
    size: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    },
    color: (variant: 'primary' | 'secondary' | 'text' | 'muted') => {
      const colors = {
        primary: '#FF00FF', // Fuchsia
        secondary: '#00FFFF', // Cyan
        text: '#FFFFFF',
        muted: '#A0A0A0',
      };
      return colors[variant];
    },
  },
} as const;

export type AppTheme = typeof defaultTheme; 