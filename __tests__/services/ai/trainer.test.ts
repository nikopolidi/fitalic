import { AITrainerService } from '../../../src/services/ai/trainer';
import OpenAIService from '../../../src/services/ai/openai';
import { useChatStore } from '../../../src/services/storage/chatStore';
import { useUserStore } from '../../../src/services/storage/userStore';

// Mock dependencies
jest.mock('../../../src/services/ai/openai');
jest.mock('../../../src/services/storage/chatStore');
jest.mock('../../../src/services/storage/userStore');

describe('AITrainerService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock store states
    (useChatStore.getState as jest.Mock).mockReturnValue({
      messages: [],
      addMessage: jest.fn().mockReturnValue('new-message-id'),
      getContextForAI: jest.fn().mockReturnValue([]),
    });
    
    (useUserStore.getState as jest.Mock).mockReturnValue({
      user: {
        anthropometry: {
          height: 180,
          weight: 75,
          activityLevel: 'moderate',
        },
        nutritionGoals: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
        },
        preferences: {
          language: 'en',
          fitnessGoal: 'maintain',
          preferredWorkoutDuration: 45,
          preferredWorkoutDays: ['monday', 'wednesday', 'friday'],
        },
      },
    });
    
    // Mock OpenAIService responses
    (OpenAIService.sendChatRequest as jest.Mock).mockResolvedValue({
      text: 'Test AI response',
    });
    
    (OpenAIService.transcribeAudio as jest.Mock).mockResolvedValue('Transcribed text');
    
    (OpenAIService.analyzeFoodFromText as jest.Mock).mockResolvedValue({
      text: 'Food analysis',
      type: 'nutrition',
      data: {
        calories: 100,
        protein: 5,
        carbs: 20,
        fat: 2,
      },
    });
    
    (OpenAIService.getInitialAssessment as jest.Mock).mockResolvedValue({
      text: 'Initial assessment questions',
      questions: ['Question 1', 'Question 2'],
    });
    
    (OpenAIService.getWorkoutRecommendations as jest.Mock).mockResolvedValue({
      text: 'Workout recommendations',
      type: 'workout',
    });
  });

  it('should send message to AI trainer', async () => {
    const response = await AITrainerService.sendMessage('Test message');
    
    expect(response.text).toBe('Test AI response');
    expect(useChatStore.getState().addMessage).toHaveBeenCalledTimes(2); // User message + AI response
    expect(OpenAIService.sendChatRequest).toHaveBeenCalled();
  });

  it('should send message with image attachment', async () => {
    const response = await AITrainerService.sendMessage('Test message with image', [
      { type: 'image', uri: 'file:///test/image.jpg' },
    ]);
    
    expect(OpenAIService.analyzeFoodFromText).toHaveBeenCalled();
    expect(useChatStore.getState().addMessage).toHaveBeenCalledTimes(2); // User message + AI response
  });

  it('should send message with audio attachment', async () => {
    const response = await AITrainerService.sendMessage('Test message with audio', [
      { type: 'audio', uri: 'file:///test/audio.mp3' },
    ]);
    
    expect(OpenAIService.sendChatRequest).toHaveBeenCalled();
    expect(useChatStore.getState().addMessage).toHaveBeenCalledTimes(2); // User message + AI response
  });

  it('should transcribe audio', async () => {
    const audioBlob = new Blob(['test audio data'], { type: 'audio/mp3' });
    const transcription = await AITrainerService.transcribeAudio(audioBlob);
    
    expect(transcription).toBe('Transcribed text');
    expect(OpenAIService.transcribeAudio).toHaveBeenCalledWith(audioBlob);
  });

  it('should analyze food from text', async () => {
    const response = await AITrainerService.analyzeFoodFromText('apple');
    
    expect(response.text).toBe('Food analysis');
    expect(response.type).toBe('nutrition');
    expect(OpenAIService.analyzeFoodFromText).toHaveBeenCalledWith('apple', expect.any(Object));
  });

  it('should analyze food from image', async () => {
    const imageBase64 = 'base64encodedimage';
    const response = await AITrainerService.analyzeFoodFromImage(imageBase64, 'apple');
    
    expect(OpenAIService.analyzeFoodFromImage).toHaveBeenCalledWith(
      imageBase64,
      'apple',
      expect.any(Object)
    );
  });

  it('should start initial assessment', async () => {
    const response = await AITrainerService.startInitialAssessment();
    
    expect(response.text).toBe('Initial assessment questions');
    expect(OpenAIService.getInitialAssessment).toHaveBeenCalledWith('en');
    expect(useChatStore.getState().addMessage).toHaveBeenCalledWith({
      role: 'assistant',
      content: 'Initial assessment questions',
      timestamp: expect.any(Number),
    });
  });

  it('should get workout recommendations', async () => {
    const response = await AITrainerService.getWorkoutRecommendations('lose weight');
    
    expect(response.text).toBe('Workout recommendations');
    expect(response.type).toBe('workout');
    expect(OpenAIService.getWorkoutRecommendations).toHaveBeenCalledWith(
      'lose weight',
      expect.any(Object)
    );
  });

  it('should handle errors when sending messages', async () => {
    // Mock error
    (OpenAIService.sendChatRequest as jest.Mock).mockRejectedValue(new Error('Test error'));
    
    await expect(AITrainerService.sendMessage('Test message'))
      .rejects.toThrow('Test error');
    
    // Should still add error message to chat
    expect(useChatStore.getState().addMessage).toHaveBeenCalledWith({
      role: 'assistant',
      content: expect.stringContaining('Sorry'),
      timestamp: expect.any(Number),
    });
  });
});
