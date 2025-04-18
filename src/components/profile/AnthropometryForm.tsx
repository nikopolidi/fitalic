import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Picker } from '@react-native-picker/picker';
import { User } from '../../types/database';
import { FontAwesome } from '@expo/vector-icons';

type AnthropometryFormProps = {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
};

/**
 * Form for editing user anthropometry data
 */
export const AnthropometryForm: React.FC<AnthropometryFormProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const { theme } = useUnistyles();
  const styles = useStyles();
  
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState(user.age?.toString() || '');
  const [height, setHeight] = useState(user.height?.toString() || '');
  const [weight, setWeight] = useState(user.weight?.toString() || '');
  const [gender, setGender] = useState(user.gender || 'male');
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || 'moderate');
  const [goal, setGoal] = useState(user.goal || 'maintain');
  const [dietPreference, setDietPreference] = useState(user.dietPreference || 'balanced');

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      name,
      age: parseInt(age) || 0,
      height: parseFloat(height) || 0,
      weight: parseFloat(weight) || 0,
      gender,
      activityLevel,
      goal,
      dietPreference,
    };
    
    onSave(updatedUser);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={theme.colors.textTertiary}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Your age"
          placeholderTextColor={theme.colors.textTertiary}
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="Height"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="decimal-pad"
          />
        </View>
        
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Fitness Profile</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={activityLevel}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Sedentary (little or no exercise)" value="sedentary" />
            <Picker.Item label="Lightly active (light exercise 1-3 days/week)" value="light" />
            <Picker.Item label="Moderately active (moderate exercise 3-5 days/week)" value="moderate" />
            <Picker.Item label="Very active (hard exercise 6-7 days/week)" value="active" />
            <Picker.Item label="Extra active (very hard exercise & physical job)" value="very_active" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fitness Goal</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={goal}
            onValueChange={(itemValue) => setGoal(itemValue)}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Lose weight" value="lose" />
            <Picker.Item label="Maintain weight" value="maintain" />
            <Picker.Item label="Gain muscle" value="gain" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Diet Preference</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dietPreference}
            onValueChange={(itemValue) => setDietPreference(itemValue)}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Balanced" value="balanced" />
            <Picker.Item label="Vegetarian" value="vegetarian" />
            <Picker.Item label="Vegan" value="vegan" />
            <Picker.Item label="Keto" value="keto" />
            <Picker.Item label="Paleo" value="paleo" />
            <Picker.Item label="Mediterranean" value="mediterranean" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onCancel}
        >
          <FontAwesome name="times" size={16} color={theme.colors.text} />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
        >
          <FontAwesome name="check" size={16} color={theme.colors.text} />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const useStyles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    width: '48%',
  },
  cancelButton: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
}));

export default AnthropometryForm;
