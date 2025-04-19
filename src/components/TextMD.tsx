import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { StyleSheet } from 'react-native-unistyles';

import { omit } from 'lodash';
type TextMDProps = {
  children: string; // Markdown content as a string
  style?: StyleProp<ViewStyle>; // Optional style for the outer container
  color?: string; // Optional color override for all text
};

// Define base styles outside the component using the theme function
const styles = StyleSheet.create(theme => ({
  body: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text, // Default text color
    lineHeight: theme.typography.body.lineHeight,
  },
  paragraph: {
    marginTop: 0, 
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    // color: theme.colors.text, // Inherits from body by default
    lineHeight: theme.typography.body.lineHeight,
  },
  text: { // General text style if not overridden
    // color: theme.colors.text, // Inherits from body
    fontSize: theme.typography.body.fontSize,
  },
  textgroup: {
    marginTop: 0,
    marginBottom: theme.spacing.sm,
  },
  heading1: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    // color: theme.colors.text, // Inherits from body unless overridden
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
  },
  heading2: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    // color: theme.colors.text, // Inherits
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  heading3: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    // color: theme.colors.text, // Inherits
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  heading4: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textSecondary, // Explicit override
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  heading5: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textSecondary, // Explicit override
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  heading6: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textTertiary, // Explicit override
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  s: {
    textDecorationLine: 'line-through',
  },
  link: {
    color: theme.colors.primary, // Explicit link color
    textDecorationLine: 'underline',
  },
  blocklink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    paddingVertical: theme.spacing.sm,
  },
  bullet_list: {
    marginBottom: theme.spacing.md,
  },
  ordered_list: {
    marginBottom: theme.spacing.md,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
    // Text color within list items inherits from body
  },
  bullet_list_icon: {
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginTop: theme.typography.body.lineHeight / 3,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize * 0.5,
  },
  ordered_list_icon: {
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginTop: theme.typography.body.lineHeight / 3,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    minWidth: 18,
    textAlign: 'right',
  },
  code_inline: {
    backgroundColor: theme.colors.surfaceSecondary,
    color: theme.colors.textTertiary, // Explicit code color
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    fontFamily: theme.typography.code.fontFamily,
    fontSize: theme.typography.code.fontSize * 0.9,
  },
  code_block: { 
    backgroundColor: theme.colors.surfaceSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.textTertiary,
    fontFamily: theme.typography.code.fontFamily,
    fontSize: theme.typography.code.fontSize,
  },
  fence: {
    backgroundColor: theme.colors.surfaceSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.textTertiary,
    fontFamily: theme.typography.code.fontFamily,
    fontSize: theme.typography.code.fontSize,
  },
  blockquote: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderLeftColor: theme.colors.primary,
    borderLeftWidth: 4,
    marginBottom: theme.spacing.md,
    // Text inside blockquote inherits from body
  },
  hr: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: theme.spacing.lg,
  },
  table: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  thead: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  tbody: {},
  th: {
    flex: 1,
    padding: theme.spacing.sm,
    fontWeight: 'bold',
    // color: theme.colors.text, // Inherits
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  td: {
    flex: 1,
    padding: theme.spacing.sm,
    // color: theme.colors.textSecondary, // Inherits from body, but maybe override?
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}));

/**
 * A component to render Markdown text using react-native-markdown-display,
 * styled according to the application theme.
 * Accepts an optional `color` prop to override the default text color.
 */
export const TextMD: React.FC<TextMDProps> = ({ children, style, color }) => {

  // Create an overriding style object only if the color prop is provided
  const overrideStyle = React.useMemo(() => (
    color ? { body: { color } } : {}
  ), [color]);

  // Merge base styles with the override style
  const mergedStyles = React.useMemo(() => (
    // Use Object.assign or deep merge if necessary, spread might be shallow
    Object.assign({}, styles, overrideStyle)
  ), [overrideStyle]); // Dependency is overrideStyle

  return (
    <View style={style}>
      {/* Pass the merged styles to Markdown */}
      <Markdown style={omit(mergedStyles, 'useVariants')}>
        {children}
      </Markdown>
    </View>
  );
};

export default TextMD;
