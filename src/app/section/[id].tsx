import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function SectionScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useUnistyles();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Section {id}</Text>
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        This is a screen for section {id}. You can display relevant content here.
      </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 