import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useProgressStore, useUserStore } from '../../services/storage';
import { WeightEntry } from '../../types/database';

/**
 * Weight tracking component for progress monitoring
 */
export const WeightTracker: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  
  // Get weight entries from store
  const progressStore = useProgressStore();
  const userStore = useUserStore();
  const weightEntries = progressStore.weightEntries;
  const user = userStore.user;
  
  // Initialize weight input with current user weight
  useEffect(() => {
    if (user) {
      setWeightInput(user.anthropometry.weight.toString());
    }
  }, [user]);
  
  // Screen width for chart
  const screenWidth = Dimensions.get('window').width - 32;
  
  // Add new weight entry
  const handleAddEntry = () => {
    setIsModalVisible(true);
  };
  
  // Save weight entry
  const handleSaveEntry = () => {
    const weight = parseFloat(weightInput);
    
    if (isNaN(weight)) {
      // Show error for invalid weight
      return;
    }
    
    // Add weight entry
    progressStore.addWeightEntry({
      id: `weight_${Date.now()}`,
      weight,
      timestamp: Date.now(),
      notes: notesInput,
    });
    
    // Update user's current weight
    if (user) {
      userStore.updateAnthropometry({
        ...user.anthropometry,
        weight,
      });
    }
    
    // Reset and close modal
    setNotesInput('');
    setIsModalVisible(false);
  };
  
  // Delete weight entry
  const handleDeleteEntry = (entryId: string) => {
    progressStore.deleteWeightEntry(entryId);
  };
  
  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Prepare data for chart
  const prepareChartData = () => {
    // Sort entries by timestamp
    const sortedEntries = [...weightEntries].sort((a, b) => a.timestamp - b.timestamp);
    
    // Limit to last 10 entries for better visualization
    const recentEntries = sortedEntries.slice(-10);
    
    return {
      labels: recentEntries.map(entry => {
        const date = new Date(entry.timestamp);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: recentEntries.map(entry => entry.weight),
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };
  
  // Render weight entry item
  const renderEntryItem = ({ item }: { item: WeightEntry }) => (
    <View style={styles.entryItem}>
      <View style={styles.entryInfo}>
        <Text style={styles.entryDate}>{formatDate(item.timestamp)}</Text>
        <Text style={styles.entryWeight}>{item.weight} kg</Text>
        {item.notes && <Text style={styles.entryNotes}>{item.notes}</Text>}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEntry(item.id)}
      >
        <FontAwesome name="trash" size={16} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Weight Tracking</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <FontAwesome name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {weightEntries.length > 1 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={prepareChartData()}
            width={screenWidth}
            height={180}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#007AFF',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : null}
      
      {weightEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="balance-scale" size={48} color="#C7C7CC" />
          <Text style={styles.emptyText}>No weight entries yet</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddEntry}>
            <Text style={styles.emptyButtonText}>Add Your First Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={[...weightEntries].sort((a, b) => b.timestamp - a.timestamp)}
          renderItem={renderEntryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.entriesList}
        />
      )}
      
      {/* Add weight entry modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Weight Entry</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="numeric"
                placeholder="Enter your weight"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={notesInput}
                onChangeText={setNotesInput}
                placeholder="Add notes about this entry"
                multiline
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEntry}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 16,
    marginTop: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 8,
    paddingRight: 16,
  },
  entriesList: {
    paddingBottom: 16,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  entryWeight: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 4,
  },
  entryNotes: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});

export default WeightTracker;
