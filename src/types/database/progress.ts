/**
 * Progress tracking types for the fitness application
 */

export type ProgressPhoto = {
  id: string;
  date: number;  // timestamp
  imageUri: string;  // path to photo
  weight?: number;  // optional weight at time of photo
  notes?: string;  // optional notes about the photo
  bodyMeasurements?: {
    waist?: number;
    hips?: number;
    chest?: number;
    arms?: number;
    thighs?: number;
  };
};

export type WeightEntry = {
  id: string;
  date: number;  // timestamp
  weight: number;  // in kg
  notes?: string;  // optional notes
};

export type WorkoutType = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'sport'
  | 'custom';

export type WorkoutSession = {
  id: string;
  date: number;  // timestamp
  type: WorkoutType;
  name: string;
  duration: number;  // in minutes
  caloriesBurned?: number;  // optional estimated calories
  notes?: string;  // optional notes
  exercises?: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: number;  // in minutes
    distance?: number;  // in km
  }[];
};

export type ProgressData = {
  photos: ProgressPhoto[];
  weightEntries: WeightEntry[];
  workouts: WorkoutSession[];
};
