import Constants from 'expo-constants';

// Default models to use for different purposes
export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_TRANSCRIPTION_MODEL = 'gpt-4o-mini-transcribe';
export const DEFAULT_TEXT_RECOGNITION_MODEL = 'gpt-4o-mini';

// Environment variables for API keys
export const getApiKey = (): string => {
  // In a real app, this would use process.env or expo-constants
  // For development, we'll use a placeholder that will be replaced
  return Constants.expoConfig?.extra?.openaiApiKey;
};

// API endpoints
export const API_BASE_URL = 'https://api.openai.com/v1';
export const API_ENDPOINTS = {
  chatCompletions: '/chat/completions',
  audioTranscriptions: '/audio/transcriptions',
  audioTranslations: '/audio/translations',
  imageGenerations: '/images/generations',
};


// Transcription configuration
export const TRANSCRIPTION_CONFIG = {
  language: 'en', // Default language, adjust as needed
  response_format: 'json', // or 'text', 'srt', 'vtt', 'verbose_json'
  // Add other parameters like 'temperature' or 'prompt' if needed
};

// Limits and parameters
export const MAX_TOKENS = 4096; // Maximum tokens for completion
export const TEMPERATURE = 0.7; // Controls randomness (0.0 - 2.0)
export const REQUEST_TIMEOUT = 60000; // Request timeout in milliseconds (60 seconds)

// Image generation configuration
export const IMAGE_GENERATION_CONFIG = {
  model: "dall-e-3", // Or "dall-e-2"
  n: 1, // Number of images to generate
  size: "1024x1024", // Image size
  quality: "standard", // or "hd"
  style: "vivid", // or "natural"
  response_format: "url", // or "b64_json"
};

// Text recognition configuration
export const TEXT_RECOGNITION_CONFIG = {
  detail: "auto", // or "low", "high"
  max_tokens: 300 // Max tokens for the description of the image content
};


// Re-export specific configurations
export * from './functions';
export * from './systemPrompts';

// Define SystemPrompt enum
export enum SystemPrompt {
  FITNESS_TRAINER = 'fitnessTrainer',
  INITIAL_ASSESSMENT = 'initialAssessment',
  FOOD_ANALYSIS = 'foodAnalysis',
  WORKOUT_ADVICE = 'workoutAdvice',
}

