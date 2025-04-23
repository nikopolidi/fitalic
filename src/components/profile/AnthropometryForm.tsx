import { ActivityLevel, DietaryPreference, FitnessGoal, Gender, UserData } from '@/types/database';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type AnthropometryFormProps = {
  user: UserData;
  onSave: (updatedUser: Partial<UserData>) => void;
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
  
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState(user.anthropometry.age?.toString() || '');
  const [height, setHeight] = useState(user.anthropometry.height?.toString() || '');
  const [weight, setWeight] = useState(user.anthropometry.weight?.toString() || '');
  const [gender, setGender] = useState<Gender>(user.anthropometry.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.anthropometry.activityLevel || 'moderatelyActive');
  const [goal, setGoal] = useState<FitnessGoal>(user.preferences.fitnessGoal || 'maintenance');
  const [dietPreference, setDietPreference] = useState<DietaryPreference>(user.preferences.dietaryPreferences[0] || 'omnivore');

  const handleSave = () => {
    const updatedUserData: Partial<UserData> = {
      name,
      anthropometry: {
        ...user.anthropometry,
        age: parseInt(age) || user.anthropometry.age,
        height: parseFloat(height) || user.anthropometry.height,
        weight: parseFloat(weight) || user.anthropometry.weight,
        gender,
        activityLevel,
      },
      preferences: {
        ...user.preferences,
        fitnessGoal: goal,
        dietaryPreferences: [dietPreference, ...user.preferences.dietaryPreferences.slice(1)],
      },
    };
    
    onSave(updatedUserData);
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
          placeholderTextColor={theme.colors.textSecondary}
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
          placeholderTextColor={theme.colors.textSecondary}
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
            itemStyle={styles.pickerItem}
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
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
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
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Sedentary" value="sedentary" />
            <Picker.Item label="Lightly Active" value="lightlyActive" />
            <Picker.Item label="Moderately Active" value="moderatelyActive" />
            <Picker.Item label="Very Active" value="veryActive" />
            <Picker.Item label="Extra Active" value="extraActive" />
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
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Weight Loss" value="weightLoss" />
            <Picker.Item label="Maintenance" value="maintenance" />
            <Picker.Item label="Muscle Gain" value="muscleGain" />
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
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Omnivore" value="omnivore" />
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

const styles = StyleSheet.create((theme) => ({
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
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    flex: 1,
    minHeight: 44,
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: theme.colors.surfaceSecondary,
    color: theme.colors.text,
    borderRadius: theme.borderRadius.sm,
    minHeight: 44,
  },
  pickerItem: {
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceSecondary,
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
    borderRadius: theme.borderRadius.lg,
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
