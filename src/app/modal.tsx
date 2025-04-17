import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function ModalScreen() {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Modal' }} />
      <Text style={[styles.title, { color: theme.colors.text }]}>Modal</Text>
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>This is a modal screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});
