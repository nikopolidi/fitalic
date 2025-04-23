/**
 * Zustand store for progress tracking with MMKV persistence
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '../../storage/mmkv';
import {
  ProgressData,
  ProgressPhoto,
  WeightEntry,
  WorkoutSession
} from '../../types/database';

// Interface for the progress store
interface ProgressStore {
  progressData: ProgressData;
  
  // Photo actions
  addPhoto: (photo: Omit<ProgressPhoto, 'id'>) => string;
  updatePhoto: (photoId: string, updates: Partial<Omit<ProgressPhoto, 'id'>>) => void;
  deletePhoto: (photoId: string) => void;
  getPhotosByDateRange: (startDate: number, endDate: number) => ProgressPhoto[];
  
  // Weight actions
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => string;
  updateWeightEntry: (entryId: string, updates: Partial<Omit<WeightEntry, 'id'>>) => void;
  deleteWeightEntry: (entryId: string) => void;
  getWeightEntriesByDateRange: (startDate: number, endDate: number) => WeightEntry[];
  getLatestWeight: () => number | undefined;
  getWeightTrend: (days: number) => { date: number; weight: number }[];
  
  // Workout actions
  addWorkout: (workout: Omit<WorkoutSession, 'id'>) => string;
  updateWorkout: (workoutId: string, updates: Partial<Omit<WorkoutSession, 'id'>>) => void;
  deleteWorkout: (workoutId: string) => void;
  getWorkoutsByDateRange: (startDate: number, endDate: number) => WorkoutSession[];
  
  // General actions
  clearAllData: () => void;
}

// Create the store with persistence
export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progressData: {
        photos: [],
        weightEntries: [],
        workouts: []
      },
      
      // Photo methods
      addPhoto: (photoData) => {
        const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newPhoto: ProgressPhoto = {
          ...photoData,
          id: photoId
        };
        
        set(state => ({
          progressData: {
            ...state.progressData,
            photos: [...state.progressData.photos, newPhoto]
          }
        }));
        
        return photoId;
      },
      
      updatePhoto: (photoId, updates) => {
        set(state => ({
          progressData: {
            ...state.progressData,
            photos: state.progressData.photos.map(photo => 
              photo.id === photoId 
                ? { ...photo, ...updates } 
                : photo
            )
          }
        }));
      },
      
      deletePhoto: (photoId) => {
        set(state => ({
          progressData: {
            ...state.progressData,
            photos: state.progressData.photos.filter(photo => photo.id !== photoId)
          }
        }));
      },
      
      getPhotosByDateRange: (startDate, endDate) => {
        return get().progressData.photos.filter(
          photo => photo.date >= startDate && photo.date <= endDate
        ).sort((a, b) => b.date - a.date); // Sort by date descending (newest first)
      },
      
      // Weight methods
      addWeightEntry: (entryData) => {
        const entryId = `weight_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newEntry: WeightEntry = {
          ...entryData,
          id: entryId
        };
        
        set(state => ({
          progressData: {
            ...state.progressData,
            weightEntries: [...state.progressData.weightEntries, newEntry]
          }
        }));
        
        return entryId;
      },
      
      updateWeightEntry: (entryId, updates) => {
        set(state => ({
          progressData: {
            ...state.progressData,
            weightEntries: state.progressData.weightEntries.map(entry => 
              entry.id === entryId 
                ? { ...entry, ...updates } 
                : entry
            )
          }
        }));
      },
      
      deleteWeightEntry: (entryId) => {
        set(state => ({
          progressData: {
            ...state.progressData,
            weightEntries: state.progressData.weightEntries.filter(entry => entry.id !== entryId)
          }
        }));
      },
      
      getWeightEntriesByDateRange: (startDate, endDate) => {
        return get().progressData.weightEntries.filter(
          entry => entry.date >= startDate && entry.date <= endDate
        ).sort((a, b) => a.date - b.date); // Sort by date ascending
      },
      
      getLatestWeight: () => {
        const entries = get().progressData.weightEntries;
        if (entries.length === 0) return undefined;
        
        // Find entry with the most recent date
        const latestEntry = entries.reduce((latest, current) => 
          current.date > latest.date ? current : latest
        );
        
        return latestEntry.weight;
      },
      
      getWeightTrend: (days) => {
        const now = Date.now();
        const startDate = now - (days * 24 * 60 * 60 * 1000); // days in milliseconds
        
        const entries = get().getWeightEntriesByDateRange(startDate, now);
        
        // Group entries by day (to handle multiple entries per day)
        const entriesByDay: Record<string, WeightEntry[]> = {};
        
        entries.forEach(entry => {
          const date = new Date(entry.date);
          const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          
          if (!entriesByDay[dayKey]) {
            entriesByDay[dayKey] = [];
          }
          
          entriesByDay[dayKey].push(entry);
        });
        
        // Get average weight for each day
        return Object.entries(entriesByDay).map(([_, dayEntries]) => {
          const avgWeight = dayEntries.reduce((sum, entry) => sum + entry.weight, 0) / dayEntries.length;
          return {
            date: dayEntries[0].date, // Use the date of the first entry for this day
            weight: Math.round(avgWeight * 10) / 10 // Round to 1 decimal place
          };
        }).sort((a, b) => a.date - b.date); // Sort by date ascending
      },
      
      // Workout methods
      addWorkout: (workoutData) => {
        const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newWorkout: WorkoutSession = {
          ...workoutData,
          id: workoutId
        };
        
        set(state => ({
          progressData: {
            ...state.progressData,
            workouts: [...state.progressData.workouts, newWorkout]
          }
        }));
        
        return workoutId;
      },
      
      updateWorkout: (workoutId, updates) => {
        set(state => ({
          progressData: {
            ...state.progressData,
            workouts: state.progressData.workouts.map(workout => 
              workout.id === workoutId 
                ? { ...workout, ...updates } 
                : workout
            )
          }
        }));
      },
      
      deleteWorkout: (workoutId) => {
        set(state => ({
          progressData: {
            ...state.progressData,
            workouts: state.progressData.workouts.filter(workout => workout.id !== workoutId)
          }
        }));
      },
      
      getWorkoutsByDateRange: (startDate, endDate) => {
        return get().progressData.workouts.filter(
          workout => workout.date >= startDate && workout.date <= endDate
        ).sort((a, b) => b.date - a.date); // Sort by date descending (newest first)
      },
      
      // General methods
      clearAllData: () => {
        set({
          progressData: {
            photos: [],
            weightEntries: [],
            workouts: []
          }
        });
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = storage.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          storage.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      })),
    }
  )
);
