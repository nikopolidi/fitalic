import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.divider} />
      <Link href="/modal">
        <Text style={styles.linkText}>Открыть модалку</Text>
      </Link>
      {/* Замените EditScreenInfo на что-то другое или удалите */}
      {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
