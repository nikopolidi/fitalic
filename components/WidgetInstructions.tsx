import React from 'react';
import { View, Text, StyleSheet, Image, Platform, Linking, TouchableOpacity } from 'react-native';

/**
 * Component to guide users on how to add and use widgets
 */
export const WidgetInstructions: React.FC = () => {
  // Open widget settings if iOS 14+
  const openWidgetSettings = async () => {
    // We can't programmatically add widgets, but we can deep link to iOS settings
    if (Platform.OS === 'ios') {
      try {
        // Try to open widget settings (may not work on all iOS versions)
        await Linking.openURL('app-settings:');
      } catch (error) {
        console.error('Could not open settings:', error);
      }
    }
  };

  // If not on iOS, don't show widget instructions
  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Widgets are only available on iOS</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Fitalic Widget to Your Home Screen</Text>
      
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 1</Text>
        <Text style={styles.stepText}>
          Long press on your home screen until icons start to jiggle
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 2</Text>
        <Text style={styles.stepText}>
          Tap the "+" button in the top corner of the screen
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 3</Text>
        <Text style={styles.stepText}>
          Find "Fitalic" in the widget list and select it
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 4</Text>
        <Text style={styles.stepText}>
          Choose the widget size you want and tap "Add Widget"
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={openWidgetSettings}
      >
        <Text style={styles.buttonText}>Open iOS Settings</Text>
      </TouchableOpacity>
      
      <Text style={styles.note}>
        Note: iOS doesn't allow apps to add widgets programmatically. 
        Users must add widgets manually through the iOS interface.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  stepContainer: {
    marginBottom: 15,
  },
  stepTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 