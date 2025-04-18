import { OpenAIService } from '../../../src/services/ai/openai';
import { DEFAULT_TRANSCRIPTION_MODEL, DEFAULT_TEXT_RECOGNITION_MODEL } from '../../../src/services/ai/config';

// Mock fetch
global.fetch = jest.fn();

describe('OpenAIService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Test response',
            },
          },
        ],
      }),
    });
  });

  it('should send chat request with correct model', async () => {
    const messages = [
      {
        id: 'test-id',
        role: 'user',
        content: 'Test message',
        timestamp: Date.now(),
      },
    ];

    await OpenAIService.sendChatRequest(messages, 'fitnessTrainer');

    expect(global.fetch).toHaveBeenCalled();
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    
    const requestBody = JSON.parse(options.body);
    expect(requestBody.model).toBeDefined();
    expect(requestBody.messages).toBeDefined();
    expect(requestBody.messages.length).toBeGreaterThan(1); // System prompt + user message
  });

  it('should send chat request with o4-mini model when specified', async () => {
    const messages = [
      {
        id: 'test-id',
        role: 'user',
        content: 'Test message',
        timestamp: Date.now(),
      },
    ];

    await OpenAIService.sendChatRequest(
      messages, 
      'fitnessTrainer',
      { model: DEFAULT_TEXT_RECOGNITION_MODEL }
    );

    expect(global.fetch).toHaveBeenCalled();
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    
    const requestBody = JSON.parse(options.body);
    expect(requestBody.model).toBe(DEFAULT_TEXT_RECOGNITION_MODEL);
  });

  it('should transcribe audio with gpt-4o-mini-transcribe model', async () => {
    // Mock FormData
    const mockAppend = jest.fn();
    global.FormData = jest.fn().mockImplementation(() => ({
      append: mockAppend,
    }));

    const audioBlob = new Blob(['test audio data'], { type: 'audio/mp3' });
    
    await OpenAIService.transcribeAudio(audioBlob);

    expect(global.fetch).toHaveBeenCalled();
    expect(mockAppend).toHaveBeenCalledWith('model', DEFAULT_TRANSCRIPTION_MODEL);
  });

  it('should analyze food from text with o4-mini model', async () => {
    await OpenAIService.analyzeFoodFromText('apple', { preferences: { diet: 'vegetarian' } });

    expect(global.fetch).toHaveBeenCalled();
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    
    const requestBody = JSON.parse(options.body);
    expect(requestBody.model).toBe(DEFAULT_TEXT_RECOGNITION_MODEL);
  });

  it('should get initial assessment with o4-mini model', async () => {
    await OpenAIService.getInitialAssessment('en');

    expect(global.fetch).toHaveBeenCalled();
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    
    const requestBody = JSON.parse(options.body);
    expect(requestBody.model).toBe(DEFAULT_TEXT_RECOGNITION_MODEL);
  });

  it('should get workout recommendations with o4-mini model', async () => {
    await OpenAIService.getWorkoutRecommendations('lose weight', { fitnessLevel: 'beginner' });

    expect(global.fetch).toHaveBeenCalled();
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    
    const requestBody = JSON.parse(options.body);
    expect(requestBody.model).toBe(DEFAULT_TEXT_RECOGNITION_MODEL);
  });

  it('should parse AI response with JSON data', async () => {
    // Mock response with JSON data
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: `Here's your nutrition info:
\`\`\`json
{
  "type": "nutrition",
  "calories": 100,
  "protein": 2,
  "carbs": 25,
  "fat": 0
}
\`\`\`
Hope this helps!`,
            },
          },
        ],
      }),
    });

    const messages = [
      {
        id: 'test-id',
        role: 'user',
        content: 'Analyze an apple',
        timestamp: Date.now(),
      },
    ];

    const response = await OpenAIService.sendChatRequest(messages, 'foodAnalysis');

    expect(response.text).toBe("Here's your nutrition info:\n\nHope this helps!");
    expect(response.type).toBe('nutrition');
    expect(response.data).toEqual({
      type: 'nutrition',
      calories: 100,
      protein: 2,
      carbs: 25,
      fat: 0
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({
        error: {
          message: 'Invalid request',
        },
      }),
    });

    const messages = [
      {
        id: 'test-id',
        role: 'user',
        content: 'Test message',
        timestamp: Date.now(),
      },
    ];

    await expect(OpenAIService.sendChatRequest(messages, 'fitnessTrainer'))
      .rejects.toThrow('API request failed');
  });
});
