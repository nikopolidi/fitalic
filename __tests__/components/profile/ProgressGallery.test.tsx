import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProgressGallery } from '../../../src/components/profile/ProgressGallery';
import { createStyleSheet } from 'react-native-unistyles';

// Mock the unistyles hook
jest.mock('react-native-unistyles', () => ({
  createStyleSheet: jest.fn().mockReturnValue({}),
  useStyles: jest.fn().mockReturnValue({
    styles: {
      container: {},
      header: {},
      title: {},
      filterContainer: {},
      filterButton: {},
      filterButtonText: {},
      selectedFilterButton: {},
      selectedFilterButtonText: {},
      galleryContainer: {},
      photoItem: {},
      photoImage: {},
      photoDate: {},
      emptyState: {},
      emptyStateText: {},
      addButton: {},
      addButtonText: {},
      modalContainer: {},
      modalContent: {},
      modalTitle: {},
      modalImage: {},
      modalDate: {},
      modalNotes: {},
      modalButtonsRow: {},
      closeButton: {},
      closeButtonText: {},
      deleteButton: {},
      deleteButtonText: {},
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

// Mock image picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file:///test/progress.jpg' }],
  }),
}));

describe('ProgressGallery', () => {
  const mockPhotos = [
    {
      id: 'photo-1',
      uri: 'https://example.com/photo1.jpg',
      date: new Date(2025, 3, 1).toISOString(),
      type: 'front',
      notes: 'Front view, week 1',
    },
    {
      id: 'photo-2',
      uri: 'https://example.com/photo2.jpg',
      date: new Date(2025, 3, 1).toISOString(),
      type: 'side',
      notes: 'Side view, week 1',
    },
    {
      id: 'photo-3',
      uri: 'https://example.com/photo3.jpg',
      date: new Date(2025, 3, 8).toISOString(),
      type: 'front',
      notes: 'Front view, week 2',
    },
  ];

  const mockAddProgressPhoto = jest.fn();
  const mockDeleteProgressPhoto = jest.fn();

  it('renders progress photos correctly', () => {
    const { getAllByTestId } = render(
      <ProgressGallery 
        progressPhotos={mockPhotos}
        addProgressPhoto={mockAddProgressPhoto}
        deleteProgressPhoto={mockDeleteProgressPhoto}
      />
    );
    
    const photos = getAllByTestId('progress-photo');
    expect(photos.length).toBe(3);
  });
  
  it('filters photos by type', () => {
    const { getByText, getAllByTestId } = render(
      <ProgressGallery 
        progressPhotos={mockPhotos}
        addProgressPhoto={mockAddProgressPhoto}
        deleteProgressPhoto={mockDeleteProgressPhoto}
      />
    );
    
    // Initially all photos should be shown
    expect(getAllByTestId('progress-photo').length).toBe(3);
    
    // Filter by front view
    const frontButton = getByText('Front');
    fireEvent.press(frontButton);
    
    // Should show only front view photos
    expect(getAllByTestId('progress-photo').length).toBe(2);
    
    // Filter by side view
    const sideButton = getByText('Side');
    fireEvent.press(sideButton);
    
    // Should show only side view photos
    expect(getAllByTestId('progress-photo').length).toBe(1);
    
    // Show all photos again
    const allButton = getByText('All');
    fireEvent.press(allButton);
    
    // Should show all photos
    expect(getAllByTestId('progress-photo').length).toBe(3);
  });
  
  it('opens photo detail modal when photo is pressed', () => {
    const { getAllByTestId, getByText, queryByText } = render(
      <ProgressGallery 
        progressPhotos={mockPhotos}
        addProgressPhoto={mockAddProgressPhoto}
        deleteProgressPhoto={mockDeleteProgressPhoto}
      />
    );
    
    // Modal should not be visible initially
    expect(queryByText('Front view, week 1')).toBeNull();
    
    // Press first photo
    const photos = getAllByTestId('progress-photo');
    fireEvent.press(photos[0]);
    
    // Modal should be visible with photo details
    expect(getByText('Front view, week 1')).toBeTruthy();
  });
  
  it('deletes photo when delete button is pressed in modal', () => {
    const { getAllByTestId, getByText } = render(
      <ProgressGallery 
        progressPhotos={mockPhotos}
        addProgressPhoto={mockAddProgressPhoto}
        deleteProgressPhoto={mockDeleteProgressPhoto}
      />
    );
    
    // Open photo detail modal
    const photos = getAllByTestId('progress-photo');
    fireEvent.press(photos[0]);
    
    // Press delete button
    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);
    
    // Check if deleteProgressPhoto was called with correct id
    expect(mockDeleteProgressPhoto).toHaveBeenCalledWith('photo-1');
  });
  
  it('closes modal when close button is pressed', () => {
    const { getAllByTestId, getByText, queryByText } = render(
      <ProgressGallery 
        progressPhotos={mockPhotos}
        addProgressPhoto={mockAddProgressPhoto}
        deleteProgressPhoto={mockDeleteProgressPhoto}
      />
    );
    
    // Open photo detail modal
    const photos = getAllByTestId('progress-photo');
    fireEvent.press(photos[0]);
    
    // Modal should be visible
    expect(getByText('Front view, week 1')).toBeTruthy();
    
    // Press close button
    const closeButton = getByText('Close');
    fireEvent.press(closeButton);
    
    // Modal should be hidden
    expect(queryByText('Front view, week 1')).toBeNull();
  });
  
  it('adds new photo when add button is pressed', async () => {
    const { getByText } = render(
      <ProgressGallery 
        progressPhotos={mockPhotos}
        addProgressPhoto={mockAddProgressPhoto}
        deleteProgressPhoto={mockDeleteProgressPhoto}
      />
    );
    
    // Press add button
    const addButton = getByText('Add Photo');
    fireEvent.press(addButton);
    
    // Wait for the image picker to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if addProgressPhoto was called with correct data
    expect(mockAddProgressPhoto).toHaveBeenCalledWith(expect.objectContaining({
      uri: 'file:///test/progress.jpg',
      type: expect.any(String),
      date: expect.any(String),
    }));
  });
  
  it('shows empty state when no photos are available', () => {
    const { getByText } = render(
      <ProgressGallery 
        progressPhotos={[]}
        addProgressPhoto={mockAddProgressPhoto}
        deleteProgressPhoto={mockDeleteProgressPhoto}
      />
    );
    
    expect(getByText('No progress photos yet')).toBeTruthy();
    expect(getByText('Add your first photo to start tracking your progress')).toBeTruthy();
  });
});
