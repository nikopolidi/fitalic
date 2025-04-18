/**
 * AI service for fitness trainer and dietitian functionality
 */
import { AIResponse } from '../../types/database';
import { useChatStore, useUserStore } from '../storage';
import { DEFAULT_TEXT_RECOGNITION_MODEL } from './config';
import OpenAIService from './openai';

/**
 * AI Fitness Trainer service
 * Provides an interface for interacting with the AI fitness trainer
 */
export const AITrainerService = {
  /**
   * Send a message to the AI trainer
   * @param message User message content
   * @param attachments Optional attachments (images, audio)
   * @returns AI response
   */
  sendMessage: async (
    message: string,
    attachments?: { type: 'image' | 'audio'; uri: string }[]
  ): Promise<AIResponse> => {
    try {
      // Get user context for personalization
      const userStore = useUserStore.getState();
      const user = userStore.user;
      
      // Create user context object for the AI
      const userContext = user ? {
        anthropometry: user.anthropometry,
        nutritionGoals: user.nutritionGoals,
        preferences: user.preferences,
      } : undefined;
      
      // Get chat context (recent messages)
      const chatStore = useChatStore.getState();
      const chatContext = chatStore.getContextForAI();
      
      // Create a new message
      const newMessageId = chatStore.addMessage({
        role: 'user',
        content: message,
        timestamp: Date.now(),
        attachments,
      });
      
      // Process attachments if any
      let response: AIResponse;
      
      if (attachments && attachments.length > 0) {
        // Handle attachments (image or audio)
        const attachment = attachments[0]; // Process first attachment
        
        if (attachment.type === 'image') {
          // Process image (food recognition)
          // In a real implementation, we would load the image and convert to base64
          // For now, we'll use a placeholder
          response = await OpenAIService.analyzeFoodFromText(
            `Image of food with description: ${message}`,
            userContext
          );
        } else if (attachment.type === 'audio') {
          // Process audio (transcription)
          // In a real implementation, we would load the audio file
          // For now, we'll use the message directly
          response = await OpenAIService.sendChatRequest(
            [...chatContext, { id: newMessageId, role: 'user', content: message, timestamp: Date.now() }],
            'fitnessTrainer',
            { model: DEFAULT_TEXT_RECOGNITION_MODEL }
          );
        } else {
          // Fallback to regular chat
          response = await OpenAIService.sendChatRequest(
            [...chatContext, { id: newMessageId, role: 'user', content: message, timestamp: Date.now() }],
            'fitnessTrainer',
            { model: DEFAULT_TEXT_RECOGNITION_MODEL }
          );
        }
      } else {
        // Regular text message
        response = await OpenAIService.sendChatRequest(
          [...chatContext, { id: newMessageId, role: 'user', content: message, timestamp: Date.now() }],
          'fitnessTrainer',
          { model: DEFAULT_TEXT_RECOGNITION_MODEL }
        );
      }
      
      // Add AI response to chat
      chatStore.addMessage({
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
      });
      
      return response;
    } catch (error) {
      console.error('Error sending message to AI trainer:', error);
      
      // Add error message to chat
      const chatStore = useChatStore.getState();
      chatStore.addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: Date.now(),
      });
      
      throw error;
    }
  },
  
  /**
   * Transcribe audio to text using gpt-4o-mini-transcribe model
   * @param audioBlob Audio file blob
   * @returns Transcribed text
   */
  transcribeAudio: async (audioBlob: Blob): Promise<string> => {
    try {
      return await OpenAIService.transcribeAudio(audioBlob);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  },
  
  /**
   * Analyze food from text description using o4-mini model
   * @param description Food description
   * @returns Analysis of the food
   */
  analyzeFoodFromText: async (description: string): Promise<AIResponse> => {
    try {
      // Get user context for personalization
      const userStore = useUserStore.getState();
      const user = userStore.user;
      
      // Create user context object for the AI
      const userContext = user ? {
        anthropometry: user.anthropometry,
        nutritionGoals: user.nutritionGoals,
        preferences: user.preferences,
      } : undefined;
      
      return await OpenAIService.analyzeFoodFromText(description, userContext);
    } catch (error) {
      console.error('Error analyzing food from text:', error);
      throw error;
    }
  },
  
  /**
   * Analyze food from image using o4-mini model
   * @param imageBase64 Base64 encoded image
   * @param additionalText Additional text description
   * @returns Analysis of the food
   */
  analyzeFoodFromImage: async (
    imageBase64: string,
    additionalText: string = ''
  ): Promise<AIResponse> => {
    try {
      // Get user context for personalization
      const userStore = useUserStore.getState();
      const user = userStore.user;
      
      // Create user context object for the AI
      const userContext = user ? {
        anthropometry: user.anthropometry,
        nutritionGoals: user.nutritionGoals,
        preferences: user.preferences,
      } : undefined;
      
      return await OpenAIService.analyzeFoodFromImage(
        imageBase64,
        additionalText,
        userContext
      );
    } catch (error) {
      console.error('Error analyzing food from image:', error);
      throw error;
    }
  },
  
  /**
   * Start initial assessment for new users using o4-mini model
   * @returns Initial assessment questions
   */
  startInitialAssessment: async (): Promise<AIResponse> => {
    try {
      // Get user's preferred language
      const userStore = useUserStore.getState();
      const user = userStore.user;
      const language = user?.preferences?.language || 'en';
      
      const response = await OpenAIService.getInitialAssessment(language);
      
      // Add system message to chat
      const chatStore = useChatStore.getState();
      chatStore.addMessage({
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
      });
      
      return response;
    } catch (error) {
      console.error('Error starting initial assessment:', error);
      throw error;
    }
  },
  
  /**
   * Get workout recommendations using o4-mini model
   * @param goalDescription Description of workout goals
   * @returns Workout recommendations
   */
  getWorkoutRecommendations: async (goalDescription: string): Promise<AIResponse> => {
    try {
      // Get user context for personalization
      const userStore = useUserStore.getState();
      const user = userStore.user;
      
      // Create user context object for the AI
      const userContext = user ? {
        anthropometry: user.anthropometry,
        fitnessGoal: user.preferences.fitnessGoal,
        activityLevel: user.anthropometry.activityLevel,
        preferredWorkoutDuration: user.preferences.preferredWorkoutDuration,
        preferredWorkoutDays: user.preferences.preferredWorkoutDays,
      } : undefined;
      
      return await OpenAIService.getWorkoutRecommendations(
        goalDescription,
        userContext
      );
    } catch (error) {
      console.error('Error getting workout recommendations:', error);
      throw error;
    }
  },
};

export default AITrainerService;
