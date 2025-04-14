import { StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { setTargetNutrition, setConsumedNutrition } from '@/src/utils/WidgetManager';

export default function TabOneScreen() {
  // State for consumed nutrition
  const [consumedCalories, setConsumedCalories] = useState('0');
  const [consumedProtein, setConsumedProtein] = useState('0');
  const [consumedCarbs, setConsumedCarbs] = useState('0');
  const [consumedFat, setConsumedFat] = useState('0');
  
  // State for target nutrition
  const [targetCalories, setTargetCalories] = useState('2000');
  const [targetProtein, setTargetProtein] = useState('150');
  const [targetCarbs, setTargetCarbs] = useState('200');
  const [targetFat, setTargetFat] = useState('70');
  
  const [result, setResult] = useState<string | null>(null);

  // Update target nutrition values
  const updateTargetData = async () => {
    try {
      await setTargetNutrition({
        calories: parseInt(targetCalories) || 0,
        protein: parseInt(targetProtein) || 0,
        carbs: parseInt(targetCarbs) || 0,
        fat: parseInt(targetFat) || 0
      });
      
      setResult('Target nutrition updated successfully!');
    } catch (error) {
      setResult(`Error updating target nutrition: ${error}`);
    }
  };
  
  // Update consumed nutrition values
  const updateConsumedData = async () => {
    try {
      await setConsumedNutrition({
        calories: parseInt(consumedCalories) || 0,
        protein: parseInt(consumedProtein) || 0,
        carbs: parseInt(consumedCarbs) || 0,
        fat: parseInt(consumedFat) || 0
      });
      
      setResult('Consumed nutrition updated successfully!');
    } catch (error) {
      setResult(`Error updating consumed nutrition: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Fitalic Widget</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        
        {/* Consumed nutrition section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consumed Nutrition</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Calories:</Text>
            <TextInput
              style={styles.input}
              value={consumedCalories}
              onChangeText={setConsumedCalories}
              keyboardType="number-pad"
              placeholder="Enter calories"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Protein (g):</Text>
            <TextInput
              style={styles.input}
              value={consumedProtein}
              onChangeText={setConsumedProtein}
              keyboardType="number-pad"
              placeholder="Enter protein"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Carbs (g):</Text>
            <TextInput
              style={styles.input}
              value={consumedCarbs}
              onChangeText={setConsumedCarbs}
              keyboardType="number-pad"
              placeholder="Enter carbs"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fat (g):</Text>
            <TextInput
              style={styles.input}
              value={consumedFat}
              onChangeText={setConsumedFat}
              keyboardType="number-pad"
              placeholder="Enter fat"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={updateConsumedData}
          >
            <Text style={styles.buttonText}>Update Consumed Nutrition</Text>
          </TouchableOpacity>
        </View>
        
        {/* Target nutrition section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Nutrition</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Calories:</Text>
            <TextInput
              style={styles.input}
              value={targetCalories}
              onChangeText={setTargetCalories}
              keyboardType="number-pad"
              placeholder="Enter target calories"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Protein (g):</Text>
            <TextInput
              style={styles.input}
              value={targetProtein}
              onChangeText={setTargetProtein}
              keyboardType="number-pad"
              placeholder="Enter target protein"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Carbs (g):</Text>
            <TextInput
              style={styles.input}
              value={targetCarbs}
              onChangeText={setTargetCarbs}
              keyboardType="number-pad"
              placeholder="Enter target carbs"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fat (g):</Text>
            <TextInput
              style={styles.input}
              value={targetFat}
              onChangeText={setTargetFat}
              keyboardType="number-pad"
              placeholder="Enter target fat"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={updateTargetData}
          >
            <Text style={styles.buttonText}>Update Target Nutrition</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.result}>{result}</Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
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
  updateButton: {
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
