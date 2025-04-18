/**
 * OpenAI API client for AI fitness trainer functionality
 */
import { 
  DEFAULT_MODEL, 
  DEFAULT_TRANSCRIPTION_MODEL,
  DEFAULT_TEXT_RECOGNITION_MODEL,
  getApiKey, 
  API_ENDPOINTS, 
  SYSTEM_PROMPTS, 
  DEFAULT_PARAMS 
} from './config';
import { ChatMessage, AIResponse } from '../../types/database';

// Types for OpenAI API requests and responses
type ChatCompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatCompletionRequest = {
  model: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  response_format?: { type: string };
};

type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

type TranscriptionRequest = {
  file: Blob;
  model: string;
  language?: string;
  prompt?: string;
  response_format?: string;
  temperature?: number;
};

type TranscriptionResponse = {
  text: string;
};

/**
 * Make a request to the OpenAI API
 * @param endpoint API endpoint
 * @param method HTTP method
 * @param body Request body
 * @param headers Additional headers
 * @returns Response data
 */
const makeRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST',
  body?: any,
  headers?: Record<string, string>,
  isFormData = false
): Promise<T> => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY') {
      throw new Error('OpenAI API key is not configured. Please add it to your .env file.');
    }
    
    const defaultHeaders: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
    };
    
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API request failed: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Parse AI response to extract structured data
 * @param text Response text from AI
 * @returns Parsed response with structured data if available
 */
const parseAIResponse = (text: string): AIResponse => {
  try {
    // Check if the response contains a JSON block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        
        // Extract the text without the JSON block
        const textWithoutJson = text.replace(/```json\n[\s\S]*?\n```/, '').trim();
        
        return {
          text: textWithoutJson,
          data: jsonData,
          type: jsonData.type || 'general',
          nextSteps: jsonData.nextSteps || [],
          questions: jsonData.questions || [],
        };
      } catch (e) {
        console.error('Error parsing JSON from AI response:', e);
      }
    }
    
    // If no JSON block or parsing failed, return just the text
    return {
      text,
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return { text };
  }
};

/**
 * OpenAI API service for AI fitness trainer functionality
 */
export const OpenAIService = {
  /**
   * Send a chat completion request to OpenAI
   * @param messages Chat messages
   * @param systemPrompt System prompt to use
   * @param options Additional options
   * @returns AI response
   */
  sendChatRequest: async (
    messages: ChatMessage[],
    systemPrompt: keyof typeof SYSTEM_PROMPTS = 'fitnessTrainer',
    options: Partial<ChatCompletionRequest> = {}
  ): Promise<AIResponse> => {
    try {
      // Format messages for OpenAI API
      const formattedMessages: ChatCompletionMessage[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPTS[systemPrompt],
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ];
      
      // Prepare request
      const request: ChatCompletionRequest = {
        model: options.model || DEFAULT_MODEL,
        messages: formattedMessages,
        temperature: options.temperature || DEFAULT_PARAMS.chat.temperature,
        max_tokens: options.max_tokens || DEFAULT_PARAMS.chat.max_tokens,
        top_p: options.top_p || DEFAULT_PARAMS.chat.top_p,
        frequency_penalty: options.frequency_penalty || DEFAULT_PARAMS.chat.frequency_penalty,
        presence_penalty: options.presence_penalty || DEFAULT_PARAMS.chat.presence_penalty,
        response_format: { type: 'text' },
      };
      
      // Send request
      const response = await makeRequest<ChatCompletionResponse>(
        API_ENDPOINTS.chatCompletions,
        'POST',
        request
      );
      
      // Extract and parse response
      const responseText = response.choices[0]?.message.content || '';
      return parseAIResponse(responseText);
    } catch (error) {
      console.error('Error sending chat request:', error);
      throw error;
    }
  },
  
  /**
   * Transcribe audio to text using gpt-4o-mini-transcribe model
   * @param audioFile Audio file blob
   * @param options Additional options
   * @returns Transcribed text
   */
  transcribeAudio: async (
    audioFile: Blob,
    options: Partial<TranscriptionRequest> = {}
  ): Promise<string> => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', options.model || DEFAULT_TRANSCRIPTION_MODEL);
      
      if (options.language) {
        formData.append('language', options.language);
      } else {
        formData.append('language', DEFAULT_PARAMS.transcription.language);
      }
      
      if (options.prompt) {
        formData.append('prompt', options.prompt);
      }
      
      formData.append('response_format', 
        options.response_format || DEFAULT_PARAMS.transcription.response_format
      );
      
      formData.append('temperature', 
        String(options.temperature || DEFAULT_PARAMS.transcription.temperature)
      );
      
      // Send request
      const response = await makeRequest<TranscriptionResponse>(
        API_ENDPOINTS.audioTranscriptions,
        'POST',
        formData,
        {},
        true // isFormData
      );
      
      return response.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  },
  
  /**
   * Analyze food from text description using o4-mini model
   * @param description Food description
   * @param userContext User context for personalization
   * @returns Analysis of the food
   */
  analyzeFoodFromText: async (
    description: string,
    userContext: any = {}
  ): Promise<AIResponse> => {
    try {
      // Create a prompt that includes the food description and user context
      const userMessage: ChatMessage = {
        id: `food_analysis_${Date.now()}`,
        role: 'user',
        content: `Please analyze this food: ${description}. Provide nutritional information and how it fits my goals.`,
        timestamp: Date.now(),
      };
      
      // Add context about the user's goals and preferences
      const contextMessage: ChatMessage = {
        id: `context_${Date.now()}`,
        role: 'system',
        content: `User context: ${JSON.stringify(userContext)}`,
        timestamp: Date.now(),
      };
      
      // Send request with food analysis system prompt and o4-mini model
      return await OpenAIService.sendChatRequest(
        [contextMessage, userMessage],
        'foodAnalysis',
        { model: DEFAULT_TEXT_RECOGNITION_MODEL }
      );
    } catch (error) {
      console.error('Error analyzing food from text:', error);
      throw error;
    }
  },
  
  /**
   * Analyze food from image using o4-mini model
   * @param imageBase64 Base64 encoded image
   * @param additionalText Additional text description
   * @param userContext User context for personalization
   * @returns Analysis of the food
   */
  analyzeFoodFromImage: async (
    imageBase64: string,
    additionalText: string = '',
    userContext: any = {}
  ): Promise<AIResponse> => {
    try {
      // For GPT-4 Vision, we need to use a different approach
      // This is a simplified implementation that would need to be updated
      // when the actual API integration is done
      
      // Create messages with image content
      const messages: ChatCompletionMessage[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.foodAnalysis + 
            `\nAdditional context: ${JSON.stringify(userContext)}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this food image${additionalText ? ': ' + additionalText : ''}. Provide nutritional information and how it fits my goals.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ];
      
      // This is a placeholder for the actual implementation
      // In a real implementation, we would use the OpenAI API for vision with o4-mini model
      
      // Mock response for now
      return {
        text: "I'll need to implement the actual image analysis with OpenAI's vision capabilities using o4-mini model.",
        type: 'nutrition',
      };
    } catch (error) {
      console.error('Error analyzing food from image:', error);
      throw error;
    }
  },
  
  /**
   * Get initial assessment questions using o4-mini model
   * @param language User's preferred language
   * @returns Initial assessment questions
   */
  getInitialAssessment: async (language: string = 'en'): Promise<AIResponse> => {
    try {
      const userMessage: ChatMessage = {
        id: `initial_assessment_${Date.now()}`,
        role: 'user',
        content: `I'm new to fitness and nutrition. Can you help me get started? (Language: ${language})`,
        timestamp: Date.now(),
      };
      
      return await OpenAIService.sendChatRequest(
        [userMessage],
        'initialAssessment',
        { model: DEFAULT_TEXT_RECOGNITION_MODEL }
      );
    } catch (error) {
      console.error('Error getting initial assessment:', error);
      throw error;
    }
  },
  
  /**
   * Get workout recommendations using o4-mini model
   * @param userGoals User's fitness goals
   * @param userContext User context for personalization
   * @returns Workout recommendations
   */
  getWorkoutRecommendations: async (
    userGoals: string,
    userContext: any = {}
  ): Promise<AIResponse> => {
    try {
      const userMessage: ChatMessage = {
        id: `workout_${Date.now()}`,
        role: 'user',
        content: `I need workout recommendations for my goal: ${userGoals}`,
        timestamp: Date.now(),
      };
      
      const contextMessage: ChatMessage = {
        id: `context_${Date.now()}`,
        role: 'system',
        content: `User context: ${JSON.stringify(userContext)}`,
        timestamp: Date.now(),
      };
      
      return await OpenAIService.sendChatRequest(
        [contextMessage, userMessage],
        'workoutAdvice',
        { model: DEFAULT_TEXT_RECOGNITION_MODEL }
      );
    } catch (error) {
      console.error('Error getting workout recommendations:', error);
      throw error;
    }
  },
};

export default OpenAIService;
