// src/services/OpenAIService.ts
import { UserContext } from '@/types'
import { OpenAI } from 'openai'
import { ChatCompletionCreateParams } from 'openai/resources/chat/completions/completions.mjs'
import { Platform } from 'react-native'
import { AIResponse, ChatMessage } from '../../types/database'
import { UserData } from '../../types/database/user'
import {
  DEFAULT_MODEL,
  DEFAULT_TEXT_RECOGNITION_MODEL,
  DEFAULT_TRANSCRIPTION_MODEL,
  FUNCTION_CALLS,
  getApiKey,
  MAX_TOKENS,
  SYSTEM_PROMPTS,
  SystemPrompt,
  TEMPERATURE,
  TRANSCRIPTION_CONFIG
} from './openaiConfig'

// 1) initialize OpenAI client
const client = new OpenAI({
  apiKey: getApiKey(),
  // baseURL defaults to "https://api.openai.com/v1"
})

// FIX: Define ToolCall locally if not exported from types/database
// It's better to define and export this from your actual types file (e.g., src/types/database/index.ts)
export type ToolCall = {
  id: string; 
  function: {
    name: string;
    arguments: string; // JSON string
  };
};
// Extend AIResponse definition if needed, or assume it includes toolCalls: ToolCall[] | undefined;
// Example if AIResponse from import doesn't have it:
// type AIResponse = BaseAIResponse & { toolCalls?: ToolCall[] };

/** Internal JSON parser (unchanged) */
function parseAIResponse(text: string): Omit<AIResponse, 'toolCalls'> { // Return type adjusted slightly
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
  if (jsonMatch?.[1]) {
    try {
      const data = JSON.parse(jsonMatch[1])
      const stripped = text.replace(/```json\n[\s\S]*?\n```/, '').trim()
      return {
        text: stripped,
        data,
        type: data.type ?? 'general',
        nextSteps: data.nextSteps ?? [],
        questions: data.questions ?? [],
      }
    } catch {
      // fall back
    }
  }
  return { text }
}

// Helper to create a context summary string (you can customize this)
function formatUserContext(userData?: UserContext): string {
  if (!userData) return 'No user context available.';
  
  // Basic example - include key details. Be mindful of token limits.
  let context = `User Context:\n`;
  context += `- Name: ${userData.name}\n`;
  if (userData.anthropometry) {
    context += `- Anthropometry: Age ${userData.anthropometry.age}, Gender ${userData.anthropometry.gender}, Height ${userData.anthropometry.height}cm, Weight ${userData.anthropometry.weight}kg, Activity: ${userData.anthropometry.activityLevel}\n`;
  }
  if (userData.nutritionGoals) {
    context += `- Goals: ${userData.nutritionGoals.calories}kcal, P:${userData.nutritionGoals.protein}g, C:${userData.nutritionGoals.carbs}g, F:${userData.nutritionGoals.fat}g\n`;
  }
  if (userData.preferences) {
    context += `- Preferences: Goal ${userData.preferences.fitnessGoal}, Diet ${userData.preferences.dietaryPreferences.join(', ')}\n`;
  }
  
  if (userData.foodIntakes) {
    context += `- Today Food Intakes: ${JSON.stringify(userData.foodIntakes)}\n`;
  }

  // Add more context as needed (e.g., recent meals, stored memories)
  return context;
}

// FIX: Use correct OpenAI type ChatCompletionMessageToolCall for toolCalls parameter
function generateConfirmationTextForTools(toolCalls: ReadonlyArray<OpenAI.Chat.Completions.ChatCompletionMessageToolCall>): string {
  if (!toolCalls || toolCalls.length === 0) {
    return 'OK.'; 
  }
  
  if (toolCalls.length === 1) {
    const toolCall = toolCalls[0];
    if (toolCall.type === 'function') {
      const name = toolCall.function.name;
      let args: Record<string, any> = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch { /* ignore parsing error for confirmation text */ }
      
      switch (name) {
        case 'log_meal':
          const foodCount = args.foods && Array.isArray(args.foods) ? args.foods.length : 0;
          return `OK. I've logged ${foodCount || 'a'} food item(s) for your ${args.type || 'meal'}.`;
        case 'log_daily_nutrition':
          return `OK. I've logged the nutrition summary for the specified date.`;
        case 'update_anthropometry':
            const updatedFields = Object.keys(args).join(', ');
            return `OK. I've updated your anthropometry data: ${updatedFields}.`;
        case 'update_goals':
            return `OK. I've updated your nutrition goals and diet type.`;
        case 'store_memory':
            return args.confirmation || `OK. I've stored that information.`;
        default:
            return `OK. Action (${name}) processed.`; 
      }
    }
  }
  
  // Generic confirmation for multiple calls
  const functionNames = toolCalls
      .filter(tc => tc.type === 'function')
      .map(tc => tc.function.name)
      .join(', ');
  return `OK. Processing ${toolCalls.length} actions (${functionNames})...`; 
}

export const OpenAIService = {
  /** 2) Chat completions via `openai` */
  async sendChatRequest(
    messages: ChatMessage[],
    systemPrompt: SystemPrompt = SystemPrompt.FITNESS_TRAINER,
    userData?: UserContext,
    options: Partial<{
      model: string
      temperature: number
      max_tokens: number
      top_p: number
      frequency_penalty: number
      presence_penalty: number
    }> = {}
  ): Promise<AIResponse> {

    const userContextString = formatUserContext(userData);

    // FIX: Access SYSTEM_PROMPTS using the enum member's associated string key
    // Assuming SystemPrompt enum values match SYSTEM_PROMPTS keys (e.g., SystemPrompt.FITNESS_TRAINER = 'fitnessTrainer')
    const systemPromptKey = systemPrompt as unknown as keyof typeof SYSTEM_PROMPTS; // Cast needed if enum values != keys
    const systemPromptContent = `${SYSTEM_PROMPTS[systemPromptKey]}\n\n${userContextString}`;

    const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPromptContent },
      ...messages.map(
        (m) =>
          ({
            role: m.role === 'user' || m.role === 'assistant' || m.role === 'system' ? m.role : 'user',
            content: m.content,
          } as OpenAI.Chat.Completions.ChatCompletionMessageParam)
      ),
    ];
    
    // Map FUNCTION_CALLS to the new tools format
    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = Object.values(FUNCTION_CALLS).map(funcDef => ({
        type: 'function',
        function: funcDef,
    }));

    const createParams: ChatCompletionCreateParams = {
      model: options.model ?? DEFAULT_MODEL,
      tools: tools, 
      tool_choice: 'auto',
      messages: formattedMessages,
      temperature: options.temperature ?? TEMPERATURE,
      max_tokens: options.max_tokens ?? MAX_TOKENS,
      top_p: options.top_p,
      frequency_penalty: options.frequency_penalty,
      presence_penalty: options.presence_penalty,
    };

    console.log('client.chat.completions.create sending:', JSON.stringify(createParams, null, 2));
    
    try {
      const res = await client.chat.completions.create(createParams);
      console.log('sendChatRequest received:', JSON.stringify(res, null, 2));

      const responseMessage = res.choices?.[0]?.message;

      if (!responseMessage) {
        console.error('OpenAI response missing message.');
        return { text: 'Sorry, I could not process that.' };
      }

      // FIX: Use tool_calls (snake_case) when accessing OpenAI response
      const toolCallsResponse = responseMessage.tool_calls; 
      const content = responseMessage.content;

      // Initialize with base structure (text) and allow toolCalls later
      let aiResponse: AIResponse = { text: content ?? '' }; 

      if (toolCallsResponse && toolCallsResponse.length > 0) {
        console.log(`Tool Calls Requested: ${toolCallsResponse.length}`);

        const processedToolCalls: ToolCall[] = toolCallsResponse
            .filter(tc => tc.type === 'function')
            .map(tc => {
                 if (!tc.id || !tc.function?.name || typeof tc.function?.arguments !== 'string') {
                     console.warn('Invalid tool call structure received:', tc);
                     return null; 
                 }
                 return {
                    id: tc.id,
                    function: {
                        name: tc.function.name,
                        arguments: tc.function.arguments,
                    },
                 };
            })
            .filter((tc): tc is ToolCall => tc !== null);

        
        if (processedToolCalls.length > 0) {
            // FIX: Pass the correct type to the confirmation function
            aiResponse.text = generateConfirmationTextForTools(toolCallsResponse); 
            // This assignment is correct if AIResponse type is fixed
            aiResponse.toolCalls = processedToolCalls; 
        } else if (!content) {
             aiResponse.text = 'OK. Processing tool actions.';
        }

      } else if (content) {
        const parsed = parseAIResponse(content);
        // Merge parsed data, preserving potential toolCalls if somehow they existed before
        aiResponse = { ...aiResponse, ...parsed }; 
      } else {
        console.warn('OpenAI response had no content or tool calls.');
        aiResponse.text = 'Got it.';
      }
      
      console.log('Returning AIResponse:', JSON.stringify(aiResponse, null, 2));
      return aiResponse;

    } catch (error) {
      console.error('Error calling OpenAI chat completion:', error);
      // Handle API errors
      return { text: 'Sorry, an error occurred while contacting the AI.' };
    }
  },

  /** 3) Audio transcription in Expo via `fetch(uri).blob()` */
  async transcribeAudio(
    fileUri: string,  // local URI from Expo ImagePicker or FileSystem
    options: Partial<{
      prompt?: string
      language?: string
      response_format?: string
      temperature?: number
    }> = {}
  ): Promise<string> {
    // fetch the file from the device (works in Expo)
    const uri = Platform.select({ ios: fileUri, android: fileUri, web: fileUri })
    if (!uri) throw new Error('Invalid file URI')

    const resp = await fetch(uri)
    const blob = await resp.blob()

    const params: any = {
      file:            blob,
      model:           DEFAULT_TRANSCRIPTION_MODEL,
      language:        options.language         ?? TRANSCRIPTION_CONFIG.language,
      response_format: options.response_format  ?? TRANSCRIPTION_CONFIG.response_format,
      temperature:     options.temperature      ?? TEMPERATURE,
    }
    if (options.prompt) params.prompt = options.prompt

    const result = await client.audio.transcriptions.create(params)
    return result.text
  },

  /** Analyze food from text */
  async analyzeFoodFromText(
    description: string,
    userData?: Partial<UserData>
  ): Promise<AIResponse> {
    const userMessage: ChatMessage = {
      id: `food_analysis_${Date.now()}`,
      role: 'user',
      content: `Please analyze this food: ${description}. Provide nutritional information and how it fits my goals.`,
      timestamp: Date.now(),
    };
    // FIX: Use UPPER_SNAKE_CASE enum member
    return this.sendChatRequest(
      [userMessage],
      SystemPrompt.FOOD_ANALYSIS, 
      userData,
      { model: DEFAULT_TEXT_RECOGNITION_MODEL }
    );
  },

  /** Analyze food from image (requires vision model) */
  async analyzeFoodFromImage(
    imageBase64: string,
    additionalText: string = '',
    userData?: UserContext
  ): Promise<AIResponse> {
    // Vision models might not support tool calls reliably yet.
    // Keep the direct call approach for vision.
    const visionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
       {
         role: 'system',
          // FIX: Access SYSTEM_PROMPTS with correct key string 'foodAnalysis'
         content: `${SYSTEM_PROMPTS.foodAnalysis}\n\n${formatUserContext(userData)}` 
       },
       {
         role: 'user',
         content: [
           {
             type: 'text',
             text: `Analyze this food image${additionalText ? ': ' + additionalText : ''}. Provide nutritional info & fit with goals.`,
           },
           {
             type: 'image_url',
             image_url: {
               url: `data:image/jpeg;base64,${imageBase64}`,
               detail: "low" 
             },
           },
         ],
       },
     ];
    
    const createParams: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: DEFAULT_MODEL, // Ensure vision model
      messages: visionMessages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    };

    console.log('client.chat.completions.create (vision) sending:', JSON.stringify(createParams, null, 2));
    try {
      const res = await client.chat.completions.create(createParams);
      console.log('sendChatRequest (vision) received:', JSON.stringify(res, null, 2));
      const content = res.choices?.[0]?.message?.content ?? '';
      // FIX: Return structure matching AIResponse (even without toolCalls)
      return { ...parseAIResponse(content) }; 
    } catch (error) {
       console.error('Error calling OpenAI vision completion:', error);
       return { text: 'Sorry, an error occurred while analyzing the image.' };
    }
  },

  /** Get initial assessment questions */
  async getInitialAssessment(language: string = 'en', userData?: UserData): Promise<AIResponse> {
    const userMessage: ChatMessage = {
      id: `initial_assessment_${Date.now()}`,
      role: 'user',
      content: `I'm new to fitness and nutrition. Can you help me get started? (Language: ${language})`,
      timestamp: Date.now(),
    };
    // FIX: Use UPPER_SNAKE_CASE enum member
    return this.sendChatRequest(
      [userMessage],
      SystemPrompt.INITIAL_ASSESSMENT,
      userData,
      { model: DEFAULT_TEXT_RECOGNITION_MODEL }
    );
  },

  /** Get workout recommendations */
  async getWorkoutRecommendations(
    goalDescription: string,
    userData?: Partial<UserContext>
  ): Promise<AIResponse> {
    const userMessage: ChatMessage = {
      id: `workout_${Date.now()}`,
      role: 'user',
      content: `I need workout recommendations for my goal: ${goalDescription}`,
      timestamp: Date.now(),
    };
    // FIX: Use UPPER_SNAKE_CASE enum member
    return this.sendChatRequest(
      [userMessage],
      SystemPrompt.WORKOUT_ADVICE, 
      userData
    );
  },

  // …you can refactor other endpoints (images, embeddings, etc.) in the same way.
}

export default OpenAIService
