import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { WeightEntry } from '../../types/database';

type WeightTrackerProps = {
  entries: WeightEntry[];
  onAddEntry: (weight: number, note: string) => void;
  onDeleteEntry: (entryId: string) => void;
};

/**
 * Component for tracking weight over time
 */
export const WeightTracker: React.FC<WeightTrackerProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry
}) => {
  const { theme } = useUnistyles();
  const [showAddModal, setShowAddModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  
  const screenWidth = Dimensions.get('window').width - (theme.spacing.md * 2);
  
  const sortedEntries = [...entries].sort((a, b) => a.date - b.date);
  
  const chartData = {
    labels: sortedEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: sortedEntries.map(entry => entry.weight),
        color: () => theme.colors.primary,
        strokeWidth: 2
      }
    ],
  };
  
  const handleAddEntry = () => {
    const weightValue = parseFloat(weight);
    if (!isNaN(weightValue) && weightValue > 0) {
      onAddEntry(weightValue, note);
      setWeight('');
      setNote('');
      setShowAddModal(false);
    }
  };
  
  const renderEntry = ({ item }: { item: WeightEntry }) => (
    <View style={styles.entryContainer}>
      <View style={styles.entryInfo}>
        <Text style={styles.entryWeight}>{item.weight} kg</Text>
        <Text style={styles.entryDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        {item.notes && (
          <Text style={styles.entryNote}>{item.notes}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDeleteEntry(item.id)}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <FontAwesome name="trash-o" size={18} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {entries.length > 1 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 1,
              color: () => theme.colors.primary,
              labelColor: () => theme.colors.textSecondary,
              style: {
                borderRadius: theme.borderRadius.md,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.colors.primary,
                fill: theme.colors.surface,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : null}
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Weight History</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <FontAwesome name="plus" size={16} color={theme.colors.text} />
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>
      
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No weight entries yet</Text>
          <TouchableOpacity 
            style={styles.emptyAddButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.emptyAddButtonText}>Add your first entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={[...entries].sort((a, b) => b.date - a.date)}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.entriesList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Weight Entry</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note (optional)</Text>
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                placeholder="Add a note"
                placeholderTextColor={theme.colors.textTertiary}
                multiline
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setWeight('');
                  setNote('');
                  setShowAddModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleAddEntry}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  chartContainer: {
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  chart: {
    borderRadius: theme.borderRadius.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  addButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
  entriesList: {
    paddingBottom: theme.spacing.md,
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  entryInfo: {
    flex: 1,
  },
  entryWeight: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  entryDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  entryNote: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  emptyAddButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  emptyAddButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.opacity(theme.colors.background, 0.9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
}));

export default WeightTracker;
