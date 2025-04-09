import { StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { testWidget, updateWidgetWithCustomData } from '@/src/utils/widgetTest';
import { WidgetInstructions } from '@/components/WidgetInstructions';

export default function TabTwoScreen() {
  const [customText, setCustomText] = useState('My test widget');
  const [customCount, setCustomCount] = useState('42');
  const [result, setResult] = useState<string | null>(null);

  // Test widget with random data
  const handleRandomTest = async () => {
    try {
      const success = await testWidget();
      setResult(success ? 'Widget updated successfully!' : 'Error updating widget');
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  // Test widget with custom data
  const handleCustomTest = async () => {
    try {
      const count = parseInt(customCount, 10) || 0;
      const success = await updateWidgetWithCustomData(customText, count);
      setResult(success ? 'Widget updated successfully!' : 'Error updating widget');
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Widget Test</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        
        {/* Widget instructions */}
        <WidgetInstructions />
        
        {/* Widget update section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Widget Data</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRandomTest}
          >
            <Text style={styles.buttonText}>Update with Random Data</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Text:</Text>
            <TextInput
              style={styles.input}
              value={customText}
              onChangeText={setCustomText}
              placeholder="Enter text for widget"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Count:</Text>
            <TextInput
              style={styles.input}
              value={customCount}
              onChangeText={setCustomCount}
              keyboardType="number-pad"
              placeholder="Enter number"
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleCustomTest}
          >
            <Text style={styles.buttonText}>Update with Custom Data</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.result}>{result}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  result: {
    fontSize: 16,
    color: '#333',
  },
});
