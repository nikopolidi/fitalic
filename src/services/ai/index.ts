/**
 * Entry point for AI services
 */

// Re-export configurations
export * from './openaiConfig';

// Re-export main services
export { default as OpenAIService } from './openai';
export { default as AITrainerService } from './trainer';

