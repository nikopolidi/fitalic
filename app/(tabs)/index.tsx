import { StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { Text, View } from '@/components/Themed';
import widgetService from '@/src/services/widgetService';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CALORIES_PER_GRAM } from '@/src/config/constants';
console.log('widgetService',widgetService)
const { setTargetNutrition, setConsumedNutrition } = widgetService;

export default function TabOneScreen() {
  const params = useLocalSearchParams();
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (params.input === 'keyboard' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [params.input]);

  // State for consumed nutrition
  const [consumedProtein, setConsumedProtein] = useState('0');
  const [consumedCarbs, setConsumedCarbs] = useState('0');
  const [consumedFat, setConsumedFat] = useState('0');
  
  // State for target nutrition
  const [targetProtein, setTargetProtein] = useState('150');
  const [targetCarbs, setTargetCarbs] = useState('200');
  const [targetFat, setTargetFat] = useState('70');
  
  const [result, setResult] = useState<string | null>(null);

  // Calculate calories based on macros
  const calculateCalories = (protein: string, carbs: string, fat: string) => {
    const proteinCalories = (parseInt(protein) || 0) * CALORIES_PER_GRAM.protein;
    const carbsCalories = (parseInt(carbs) || 0) * CALORIES_PER_GRAM.carbs;
    const fatCalories = (parseInt(fat) || 0) * CALORIES_PER_GRAM.fat;
    return proteinCalories + carbsCalories + fatCalories;
  };

  const consumedCalories = useMemo(() => 
    calculateCalories(consumedProtein, consumedCarbs, consumedFat).toString(),
    [consumedProtein, consumedCarbs, consumedFat]
  );

  const targetCalories = useMemo(() => 
    calculateCalories(targetProtein, targetCarbs, targetFat).toString(),
    [targetProtein, targetCarbs, targetFat]
  );

  // Update target nutrition values
  const updateTargetData = async () => {
    try {
      await setTargetNutrition({
        calories: parseInt(targetCalories),
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
        calories: parseInt(consumedCalories),
        protein: parseInt(consumedProtein) || 0,
        carbs: parseInt(consumedCarbs) || 0,
        fat: parseInt(consumedFat) || 0
      });
      
      setResult('Consumed nutrition updated successfully!');
    } catch (error) {
      setResult(`Error updating consumed nutrition: ${error}`);
    }
  };

  const handleMicPress = () => {
    console.log('onMicPress');
  };

  const handleSendPress = () => {
    console.log('onSendPress');
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
            <Text style={styles.caloriesValue}>{consumedCalories}</Text>
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
            <Text style={styles.caloriesValue}>{targetCalories}</Text>
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

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Введите текст..."
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleMicPress}>
              <Ionicons name="mic" size={24} color="#FF01A1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSendPress}>
              <Ionicons name="send" size={24} color="#FF01A1" />
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    height: 1,
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  caloriesValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  updateButton: {
    backgroundColor: '#FF01A1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  result: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
