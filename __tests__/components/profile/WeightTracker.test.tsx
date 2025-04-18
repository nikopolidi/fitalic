import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WeightTracker } from '../../../src/components/profile/WeightTracker';
import { createStyleSheet } from 'react-native-unistyles';

// Mock the unistyles hook
jest.mock('react-native-unistyles', () => ({
  createStyleSheet: jest.fn().mockReturnValue({}),
  useStyles: jest.fn().mockReturnValue({
    styles: {
      container: {},
      header: {},
      title: {},
      chartContainer: {},
      addButton: {},
      addButtonText: {},
      entriesContainer: {},
      entryItem: {},
      entryDate: {},
      entryWeight: {},
      entryNotes: {},
      deleteButton: {},
      deleteButtonText: {},
      modalContainer: {},
      modalContent: {},
      modalTitle: {},
      input: {},
      textArea: {},
      modalButtonsRow: {},
      cancelButton: {},
      cancelButtonText: {},
      saveButton: {},
      saveButtonText: {},
    },
    theme: {
      colors: {
        primary: '#007AFF',
        secondary: '#E9E9EB',
        text: '#000000',
        textSecondary: '#8E8E93',
        background: '#FFFFFF',
        danger: '#FF3B30',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
      },
    },
  }),
}));

// Mock Victory chart component
jest.mock('victory-native', () => ({
  VictoryChart: jest.fn().mockReturnValue(null),
  VictoryLine: jest.fn().mockReturnValue(null),
  VictoryScatter: jest.fn().mockReturnValue(null),
  VictoryAxis: jest.fn().mockReturnValue(null),
  VictoryTheme: { material: {} },
}));

describe('WeightTracker', () => {
  const mockWeightEntries = [
    {
      id: 'entry-1',
      weight: 75,
      date: new Date(2025, 3, 1).toISOString(),
      notes: 'Starting weight',
    },
    {
      id: 'entry-2',
      weight: 74.5,
      date: new Date(2025, 3, 8).toISOString(),
      notes: 'After first week',
    },
    {
      id: 'entry-3',
      weight: 73.8,
      date: new Date(2025, 3, 15).toISOString(),
      notes: 'After second week',
    },
  ];

  const mockAddWeightEntry = jest.fn();
  const mockDeleteWeightEntry = jest.fn();

  it('renders weight entries correctly', () => {
    const { getAllByTestId, getByText } = render(
      <WeightTracker 
        weightEntries={mockWeightEntries}
        addWeightEntry={mockAddWeightEntry}
        deleteWeightEntry={mockDeleteWeightEntry}
      />
    );
    
    const entries = getAllByTestId('weight-entry');
    expect(entries.length).toBe(3);
    
    expect(getByText('75 kg')).toBeTruthy();
    expect(getByText('74.5 kg')).toBeTruthy();
    expect(getByText('73.8 kg')).toBeTruthy();
    
    expect(getByText('Starting weight')).toBeTruthy();
    expect(getByText('After first week')).toBeTruthy();
    expect(getByText('After second week')).toBeTruthy();
  });
  
  it('opens add entry modal when add button is pressed', () => {
    const { getByText, queryByText } = render(
      <WeightTracker 
        weightEntries={mockWeightEntries}
        addWeightEntry={mockAddWeightEntry}
        deleteWeightEntry={mockDeleteWeightEntry}
      />
    );
    
    // Modal should not be visible initially
    expect(queryByText('Add Weight Entry')).toBeNull();
    
    // Press add button
    const addButton = getByText('Add Weight Entry');
    fireEvent.press(addButton);
    
    // Modal should be visible
    expect(getByText('Add Weight Entry')).toBeTruthy();
  });
  
  it('adds new weight entry when form is submitted', () => {
    const { getByText, getByPlaceholderText } = render(
      <WeightTracker 
        weightEntries={mockWeightEntries}
        addWeightEntry={mockAddWeightEntry}
        deleteWeightEntry={mockDeleteWeightEntry}
      />
    );
    
    // Open modal
    const addButton = getByText('Add Weight Entry');
    fireEvent.press(addButton);
    
    // Fill form
    const weightInput = getByPlaceholderText('Weight (kg)');
    fireEvent.changeText(weightInput, '73.2');
    
    const notesInput = getByPlaceholderText('Notes (optional)');
    fireEvent.changeText(notesInput, 'After third week');
    
    // Submit form
    const saveButton = getByText('Save');
    fireEvent.press(saveButton);
    
    // Check if addWeightEntry was called with correct data
    expect(mockAddWeightEntry).toHaveBeenCalledWith(expect.objectContaining({
      weight: 73.2,
      notes: 'After third week',
      date: expect.any(String),
    }));
  });
  
  it('deletes weight entry when delete button is pressed', () => {
    const { getAllByText } = render(
      <WeightTracker 
        weightEntries={mockWeightEntries}
        addWeightEntry={mockAddWeightEntry}
        deleteWeightEntry={mockDeleteWeightEntry}
      />
    );
    
    // Press first delete button
    const deleteButtons = getAllByText('Delete');
    fireEvent.press(deleteButtons[0]);
    
    // Check if deleteWeightEntry was called with correct id
    expect(mockDeleteWeightEntry).toHaveBeenCalledWith('entry-1');
  });
  
  it('cancels adding entry when cancel button is pressed', () => {
    const { getByText, queryByText } = render(
      <WeightTracker 
        weightEntries={mockWeightEntries}
        addWeightEntry={mockAddWeightEntry}
        deleteWeightEntry={mockDeleteWeightEntry}
      />
    );
    
    // Open modal
    const addButton = getByText('Add Weight Entry');
    fireEvent.press(addButton);
    
    // Modal should be visible
    expect(getByText('Add Weight Entry')).toBeTruthy();
    
    // Press cancel button
    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);
    
    // Modal should be hidden
    expect(queryByText('Add Weight Entry')).toBeNull();
    
    // addWeightEntry should not have been called
    expect(mockAddWeightEntry).not.toHaveBeenCalled();
  });
  
  it('validates weight input', () => {
    const { getByText, getByPlaceholderText } = render(
      <WeightTracker 
        weightEntries={mockWeightEntries}
        addWeightEntry={mockAddWeightEntry}
        deleteWeightEntry={mockDeleteWeightEntry}
      />
    );
    
    // Open modal
    const addButton = getByText('Add Weight Entry');
    fireEvent.press(addButton);
    
    // Try to submit without entering weight
    const saveButton = getByText('Save');
    fireEvent.press(saveButton);
    
    // addWeightEntry should not have been called
    expect(mockAddWeightEntry).not.toHaveBeenCalled();
    
    // Enter invalid weight (non-numeric)
    const weightInput = getByPlaceholderText('Weight (kg)');
    fireEvent.changeText(weightInput, 'abc');
    
    // Try to submit
    fireEvent.press(saveButton);
    
    // addWeightEntry should not have been called
    expect(mockAddWeightEntry).not.toHaveBeenCalled();
    
    // Enter valid weight
    fireEvent.changeText(weightInput, '73.2');
    
    // Submit form
    fireEvent.press(saveButton);
    
    // Now addWeightEntry should have been called
    expect(mockAddWeightEntry).toHaveBeenCalled();
  });
});
