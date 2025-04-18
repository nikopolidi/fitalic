import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUserStore } from '../../services/storage';
import { Anthropometry, Gender, ActivityLevel, FitnessGoal, DietaryPreference } from '../../types/database';

type AnthropometryFormProps = {
  onSave: () => void;
  onCancel: () => void;
};

/**
 * Anthropometry form component for editing user profile data
 */
export const AnthropometryForm: React.FC<AnthropometryFormProps> = ({
  onSave,
  onCancel
}) => {
  // Get user data from store
  const userStore = useUserStore();
  const user = userStore.user;
  
  // Initialize form state with user data or defaults
  const [name, setName] = useState(user?.name || '');
  const [height, setHeight] = useState(user?.anthropometry.height.toString() || '170');
  const [weight, setWeight] = useState(user?.anthropometry.weight.toString() || '70');
  const [age, setAge] = useState(user?.anthropometry.age.toString() || '30');
  const [gender, setGender] = useState<Gender>(user?.anthropometry.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user?.anthropometry.activityLevel || 'moderatelyActive'
  );
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(
    user?.preferences.fitnessGoal || 'maintenance'
  );
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(
    user?.preferences.dietaryPreferences || ['omnivore']
  );
  
  // Handle form submission
  const handleSave = () => {
    if (!name.trim()) {
      // Show error for empty name
      return;
    }
    
    // Parse numeric values
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseInt(age, 10);
    
    if (isNaN(heightValue) || isNaN(weightValue) || isNaN(ageValue)) {
      // Show error for invalid numeric values
      return;
    }
    
    // Initialize user if not exists
    if (!user) {
      userStore.initializeUser(name);
    }
    
    // Update anthropometry
    userStore.updateAnthropometry({
      height: heightValue,
      weight: weightValue,
      age: ageValue,
      gender,
      activityLevel,
    });
    
    // Update preferences
    userStore.updatePreferences({
      fitnessGoal,
      dietaryPreferences,
    });
    
    // Notify parent component
    onSave();
  };
  
  // Toggle dietary preference
  const toggleDietaryPreference = (preference: DietaryPreference) => {
    if (dietaryPreferences.includes(preference)) {
      setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
    } else {
      setDietaryPreferences([...dietaryPreferences, preference]);
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          placeholder="Height in cm"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="Weight in kg"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Your age"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, gender === 'male' && styles.selectedOption]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.optionText, gender === 'male' && styles.selectedOptionText]}>
              Male
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.optionButton, gender === 'female' && styles.selectedOption]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.optionText, gender === 'female' && styles.selectedOptionText]}>
              Female
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.optionButton, gender === 'other' && styles.selectedOption]}
            onPress={() => setGender('other')}
          >
            <Text style={[styles.optionText, gender === 'other' && styles.selectedOptionText]}>
              Other
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Activity Level</Text>
      
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setActivityLevel('sedentary')}
        >
          <View style={styles.radioButton}>
            {activityLevel === 'sedentary' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Sedentary</Text>
            <Text style={styles.radioDescription}>Little to no exercise</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setActivityLevel('lightlyActive')}
        >
          <View style={styles.radioButton}>
            {activityLevel === 'lightlyActive' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Lightly Active</Text>
            <Text style={styles.radioDescription}>Light exercise 1-3 days/week</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setActivityLevel('moderatelyActive')}
        >
          <View style={styles.radioButton}>
            {activityLevel === 'moderatelyActive' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Moderately Active</Text>
            <Text style={styles.radioDescription}>Moderate exercise 3-5 days/week</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setActivityLevel('veryActive')}
        >
          <View style={styles.radioButton}>
            {activityLevel === 'veryActive' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Very Active</Text>
            <Text style={styles.radioDescription}>Hard exercise 6-7 days/week</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setActivityLevel('extraActive')}
        >
          <View style={styles.radioButton}>
            {activityLevel === 'extraActive' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Extra Active</Text>
            <Text style={styles.radioDescription}>Very hard exercise & physical job or 2x training</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Fitness Goal</Text>
      
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setFitnessGoal('weightLoss')}
        >
          <View style={styles.radioButton}>
            {fitnessGoal === 'weightLoss' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Weight Loss</Text>
            <Text style={styles.radioDescription}>Caloric deficit to lose weight</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setFitnessGoal('maintenance')}
        >
          <View style={styles.radioButton}>
            {fitnessGoal === 'maintenance' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Maintenance</Text>
            <Text style={styles.radioDescription}>Maintain current weight</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setFitnessGoal('muscleGain')}
        >
          <View style={styles.radioButton}>
            {fitnessGoal === 'muscleGain' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Muscle Gain</Text>
            <Text style={styles.radioDescription}>Caloric surplus to build muscle</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setFitnessGoal('recomposition')}
        >
          <View style={styles.radioButton}>
            {fitnessGoal === 'recomposition' && <View style={styles.radioButtonSelected} />}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioLabel}>Recomposition</Text>
            <Text style={styles.radioDescription}>Lose fat and gain muscle simultaneously</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Dietary Preferences</Text>
      
      <View style={styles.checkboxGroup}>
        {[
          { value: 'omnivore', label: 'Omnivore (No restrictions)' },
          { value: 'vegetarian', label: 'Vegetarian (No meat)' },
          { value: 'vegan', label: 'Vegan (No animal products)' },
          { value: 'pescatarian', label: 'Pescatarian (Vegetarian + fish)' },
          { value: 'keto', label: 'Keto (Low carb, high fat)' },
          { value: 'paleo', label: 'Paleo (Whole foods, no processed)' },
          { value: 'glutenFree', label: 'Gluten Free' },
          { value: 'dairyFree', label: 'Dairy Free' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.checkboxOption}
            onPress={() => toggleDietaryPreference(option.value as DietaryPreference)}
          >
            <View style={styles.checkbox}>
              {dietaryPreferences.includes(option.value as DietaryPreference) && (
                <FontAwesome name="check" size={12} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioTextContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: dietaryPreferences => 
      dietaryPreferences.includes ? '#007AFF' : 'transparent',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AnthropometryForm;
