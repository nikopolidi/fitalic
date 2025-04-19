// src/services/OpenAIService.ts
import { OpenAI } from 'openai'
import { Platform } from 'react-native'
import { AIResponse, ChatMessage } from '../../types/database'
import {
  DEFAULT_MODEL,
  DEFAULT_PARAMS,
  DEFAULT_TEXT_RECOGNITION_MODEL,
  DEFAULT_TRANSCRIPTION_MODEL,
  getApiKey,
  SYSTEM_PROMPTS
} from './config'

// 1) initialize OpenAI client
const client = new OpenAI({
  apiKey: getApiKey(),
  // baseURL defaults to "https://api.openai.com/v1"
})

/** Internal JSON parser (unchanged) */
function parseAIResponse(text: string): AIResponse {
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

export const OpenAIService = {
  /** 2) Chat completions via `openai` */
  async sendChatRequest(
    messages: ChatMessage[],
    systemPrompt: keyof typeof SYSTEM_PROMPTS = 'fitnessTrainer',
    options: Partial<{
      model: string
      temperature: number
      max_tokens: number
      top_p: number
      frequency_penalty: number
      presence_penalty: number
    }> = {}
  ): Promise<AIResponse> {
    const models = await client.models.list()
    console.log(models.data.map(m => m.id))

    const formatted = [
      { role: 'system' as const, content: SYSTEM_PROMPTS[systemPrompt] },
      ...messages.map(m => ({ role: m.role as any, content: m.content })),
    ]

    const params = {
      model:             options.model            ?? DEFAULT_MODEL,
      messages:          formatted,
      temperature:       options.temperature      ?? DEFAULT_PARAMS.chat.temperature,
      max_tokens:        options.max_tokens       ?? DEFAULT_PARAMS.chat.max_tokens,
      top_p:             options.top_p            ?? DEFAULT_PARAMS.chat.top_p,
      frequency_penalty: options.frequency_penalty ?? DEFAULT_PARAMS.chat.frequency_penalty,
      presence_penalty:  options.presence_penalty  ?? DEFAULT_PARAMS.chat.presence_penalty,
      // streaming: false, // enable if you ever want to stream
    }

    const res = await client.chat.completions.create(params)
    const content = res.choices?.[0]?.message?.content ?? ''
    return parseAIResponse(content)
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
      language:        options.language         ?? DEFAULT_PARAMS.transcription.language,
      response_format: options.response_format  ?? DEFAULT_PARAMS.transcription.response_format,
      temperature:     options.temperature      ?? DEFAULT_PARAMS.transcription.temperature,
    }
    if (options.prompt) params.prompt = options.prompt

    const result = await client.audio.transcriptions.create(params)
    return result.text
  },

  /** Analyze food from text */
  async analyzeFoodFromText(
    description: string,
    userContext: any = {}
  ): Promise<AIResponse> {
    const userMessage: ChatMessage = {
      id: `food_analysis_${Date.now()}`,
      role: 'user',
      content: `Please analyze this food: ${description}. Provide nutritional information and how it fits my goals.`,
      timestamp: Date.now(),
    };
    const contextMessage: ChatMessage = {
      id: `context_${Date.now()}`,
      role: 'system',
      content: `User context: ${JSON.stringify(userContext)}`,
      timestamp: Date.now(),
    };
    // Assuming sendChatRequest is defined within the same object or accessible scope
    return this.sendChatRequest(
      [contextMessage, userMessage],
      'foodAnalysis',
      { model: DEFAULT_TEXT_RECOGNITION_MODEL }
    );
  },

  /** Analyze food from image (requires vision model) */
  async analyzeFoodFromImage(
    imageBase64: string,
    additionalText: string = '',
    userContext: any = {}
  ): Promise<AIResponse> {
    const messages: any[] = [
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
            text: `Analyze this food image${additionalText ? ': ' + additionalText : ''}. Provide nutritional info & fit with goals.`,
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

    // Use sendChatRequest which handles the API call
    // Note: Ensure the DEFAULT_MODEL or passed model supports vision (e.g., gpt-4o, gpt-4-turbo)
    return this.sendChatRequest(
      messages, // Pass the specially formatted messages array
      'foodAnalysis', // Keep the system prompt context
      { model: DEFAULT_MODEL } // Ensure a vision-capable model is used
    );
  },

  /** Get initial assessment questions */
  async getInitialAssessment(language: string = 'en'): Promise<AIResponse> {
    const userMessage: ChatMessage = {
      id: `initial_assessment_${Date.now()}`,
      role: 'user',
      content: `I'm new to fitness and nutrition. Can you help me get started? (Language: ${language})`,
      timestamp: Date.now(),
    };
    return this.sendChatRequest(
      [userMessage],
      'initialAssessment',
      { model: DEFAULT_TEXT_RECOGNITION_MODEL }
    );
  },

  /** Get workout recommendations */
  async getWorkoutRecommendations(
    goalDescription: string,
    userContext: any = {}
  ): Promise<AIResponse> {
    const userMessage: ChatMessage = {
      id: `workout_${Date.now()}`,
      role: 'user',
      content: `I need workout recommendations for my goal: ${goalDescription}`,
      timestamp: Date.now(),
    };
    const contextMessage: ChatMessage = {
      id: `context_${Date.now()}`,
      role: 'system',
      content: `User context: ${JSON.stringify(userContext)}`,
      timestamp: Date.now(),
    };
    return this.sendChatRequest(
      [contextMessage, userMessage],
      'workoutAdvice',
      { model: DEFAULT_TEXT_RECOGNITION_MODEL }
    );
  },

  // …you can refactor other endpoints (images, embeddings, etc.) in the same way.
}

export default OpenAIService
