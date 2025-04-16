import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <Link href="/modal" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Open Modal</Text>
        </TouchableOpacity>
      </Link>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
