import { act, renderHook } from '@testing-library/react-hooks';
import { MMKV } from 'react-native-mmkv';
import { useProgressStore } from '../../../src/services/storage/progressStore';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  const mockMMKV = {
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  };
  return {
    MMKV: jest.fn(() => mockMMKV),
  };
});

describe('ProgressStore', () => {
  let mockMMKV: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockMMKV = new MMKV();
  });

  it('should initialize with empty arrays', () => {
    const { result } = renderHook(() => useProgressStore());
    
    expect(result.current.weightEntries).toEqual([]);
    expect(result.current.progressPhotos).toEqual([]);
  });

  it('should add a weight entry', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const newEntry = {
      id: 'test-id',
      weight: 75,
      date: new Date().getTime(),
      notes: 'Test notes',
    };
    
    act(() => {
      result.current.addWeightEntry(newEntry);
    });
    
    expect(result.current.weightEntries).toHaveLength(1);
    expect(result.current.weightEntries[0]).toEqual(newEntry);
    expect(mockMMKV.set).toHaveBeenCalledWith('weightEntries', JSON.stringify([newEntry]));
  });

  it('should update a weight entry', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const entry = {
      id: 'test-id',
      weight: 75,
      date: new Date().getTime(),
      notes: 'Test notes',
    };
    
    // Add an entry first
    act(() => {
      result.current.addWeightEntry(entry);
    });
    
    // Then update it
    const updatedEntry = {
      ...entry,
      weight: 74,
      notes: 'Updated notes',
    };
    
    act(() => {
      result.current.updateWeightEntry(updatedEntry);
    });
    
    expect(result.current.weightEntries).toHaveLength(1);
    expect(result.current.weightEntries[0]).toEqual(updatedEntry);
    expect(mockMMKV.set).toHaveBeenCalledWith('weightEntries', JSON.stringify([updatedEntry]));
  });

  it('should delete a weight entry', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const entry = {
      id: 'test-id',
      weight: 75,
      date: new Date().getTime(),
      notes: 'Test notes',
    };
    
    // Add an entry first
    act(() => {
      result.current.addWeightEntry(entry);
    });
    
    // Then delete it
    act(() => {
      result.current.deleteWeightEntry(entry.id);
    });
    
    expect(result.current.weightEntries).toHaveLength(0);
    expect(mockMMKV.set).toHaveBeenCalledWith('weightEntries', JSON.stringify([]));
  });

  it('should add a progress photo', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const newPhoto = {
      id: 'test-id',
      uri: 'file:///test/photo.jpg',
      date: new Date().getTime(),
      type: 'front' as const,
      notes: 'Test notes',
    };
    
    act(() => {
      result.current.addProgressPhoto(newPhoto);
    });
    
    expect(result.current.progressPhotos).toHaveLength(1);
    expect(result.current.progressPhotos[0]).toEqual(newPhoto);
    expect(mockMMKV.set).toHaveBeenCalledWith('progressPhotos', JSON.stringify([newPhoto]));
  });

  it('should delete a progress photo', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const photo = {
      id: 'test-id',
      uri: 'file:///test/photo.jpg',
      date: new Date().getTime(),
      type: 'front' as const,
      notes: 'Test notes',
    };
    
    // Add a photo first
    act(() => {
      result.current.addProgressPhoto(photo);
    });
    
    // Then delete it
    act(() => {
      result.current.deleteProgressPhoto(photo.id);
    });
    
    expect(result.current.progressPhotos).toHaveLength(0);
    expect(mockMMKV.set).toHaveBeenCalledWith('progressPhotos', JSON.stringify([]));
  });

  it('should get weight entries for a date range', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const entry1 = {
      id: 'test-id-1',
      weight: 75,
      date: today.toISOString(),
      notes: 'Today',
    };
    
    const entry2 = {
      id: 'test-id-2',
      weight: 76,
      date: lastWeek.toISOString(),
      notes: 'Last week',
    };
    
    const entry3 = {
      id: 'test-id-3',
      weight: 77,
      date: twoWeeksAgo.toISOString(),
      notes: 'Two weeks ago',
    };
    
    // Add all entries
    act(() => {
      result.current.addWeightEntry(entry1);
      result.current.addWeightEntry(entry2);
      result.current.addWeightEntry(entry3);
    });
    
    // Get entries for the last 10 days
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const recentEntries = result.current.getWeightEntriesForDateRange(tenDaysAgo, today);
    
    expect(recentEntries).toHaveLength(2);
    expect(recentEntries.map(e => e.id)).toContain('test-id-1');
    expect(recentEntries.map(e => e.id)).toContain('test-id-2');
  });

  it('should get progress photos for a specific type', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const frontPhoto = {
      id: 'test-id-1',
      uri: 'file:///test/front.jpg',
      date: new Date().getTime(),
      type: 'front' as const,
      notes: 'Front view',
    };
    
    const sidePhoto = {
      id: 'test-id-2',
      uri: 'file:///test/side.jpg',
      date: new Date().getTime(),
      type: 'side' as const,
      notes: 'Side view',
    };
    
    // Add both photos
    act(() => {
      result.current.addProgressPhoto(frontPhoto);
      result.current.addProgressPhoto(sidePhoto);
    });
    
    // Get front photos
    const frontPhotos = result.current.getProgressPhotosByType('front');
    
    expect(frontPhotos).toHaveLength(1);
    expect(frontPhotos[0].id).toBe('test-id-1');
  });

  it('should clear all progress data', () => {
    const { result } = renderHook(() => useProgressStore());
    
    const entry = {
      id: 'test-id',
      weight: 75,
      date: new Date().getTime(),
      notes: 'Test notes',
    };
    
    const photo = {
      id: 'test-id',
      uri: 'file:///test/photo.jpg',
      date: new Date().getTime(),
      type: 'front' as const,
      notes: 'Test notes',
    };
    
    // Add data first
    act(() => {
      result.current.addWeightEntry(entry);
      result.current.addProgressPhoto(photo);
    });
    
    // Then clear all data
    act(() => {
      result.current.clearAllProgressData();
    });
    
    expect(result.current.weightEntries).toHaveLength(0);
    expect(result.current.progressPhotos).toHaveLength(0);
    expect(mockMMKV.delete).toHaveBeenCalledWith('weightEntries');
    expect(mockMMKV.delete).toHaveBeenCalledWith('progressPhotos');
  });
});
