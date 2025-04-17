import { StyleSheet, Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function HomeScreen() {
  const { theme } = useUnistyles();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Home</Text>
      <Text style={{ color: theme.colors.textSecondary }}>Welcome to the application</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 