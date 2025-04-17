# React Native Unistyles 3.0

> Easily style cross platform React Native apps with a single StyleSheet

This documentation site is a source of truth for the good practices while building apps with React Native Unistyles.

## Documentation Sets

- [Abridged documentation](https://unistyl.es/llms-small.txt): a compact version of the documentation for React Native Unistyles 3.0, with non-essential content removed
- [Complete documentation](https://unistyl.es/llms-full.txt): the full documentation for React Native Unistyles 3.0

## Notes

- The complete documentation includes all content from the official documentation
- The content is automatically generated from the same source as the official documentation

## Quick Start

1. Install the package:
```bash
npm install react-native-unistyles
```

2. Wrap your app with UnistylesProvider:
```typescript
import { UnistylesProvider } from 'react-native-unistyles'

export default function App() {
  return (
    <UnistylesProvider>
      <YourApp />
    </UnistylesProvider>
  )
}
```

3. Create your theme:
```typescript
import { createTheme } from 'react-native-unistyles'

export const theme = createTheme({
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
})
```

4. Use styles in your components:
```typescript
import { styled } from 'react-native-unistyles'

const StyledView = styled(View, {
  backgroundColor: theme.colors.primary,
  padding: theme.spacing.md,
})
``` 