import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfileHeader } from '../../../src/components/profile/ProfileHeader';
import { createStyleSheet } from 'react-native-unistyles';

// Mock the unistyles hook
jest.mock('react-native-unistyles', () => ({
  createStyleSheet: jest.fn().mockReturnValue({}),
  useStyles: jest.fn().mockReturnValue({
    styles: {
      container: {},
      avatarContainer: {},
      avatar: {},
      avatarPlaceholder: {},
      avatarPlaceholderText: {},
      editAvatarButton: {},
      editAvatarButtonText: {},
      infoContainer: {},
      nameText: {},
      statsContainer: {},
      statItem: {},
      statValue: {},
      statLabel: {},
      editButton: {},
      editButtonText: {},
    },
    theme: {
      colors: {
        primary: '#007AFF',
        secondary: '#E9E9EB',
        text: '#000000',
        textSecondary: '#8E8E93',
        background: '#FFFFFF',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
        full: 9999,
      },
    },
  }),
}));

// Mock image picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'file:///test/avatar.jpg' }],
  }),
}));

describe('ProfileHeader', () => {
  const mockUser = {
    id: 'test-id',
    name: 'John Doe',
    age: 30,
    height: 180,
    weight: 75,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietPreference: 'balanced',
    avatarUri: null,
    caloriesGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 65,
  };

  const mockUpdateUser = jest.fn();
  const mockCalculateBMI = jest.fn().mockReturnValue(23.15);
  const mockOnEditProfile = jest.fn();

  it('renders user information correctly', () => {
    const { getByText } = render(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateBMI}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('180 cm')).toBeTruthy();
    expect(getByText('75 kg')).toBeTruthy();
    expect(getByText('23.2')).toBeTruthy(); // BMI rounded to 1 decimal place
  });
  
  it('renders avatar placeholder when no avatar is set', () => {
    const { getByText } = render(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateBMI}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    expect(getByText('JD')).toBeTruthy(); // Initials from John Doe
  });
  
  it('renders avatar when avatarUri is provided', () => {
    const userWithAvatar = {
      ...mockUser,
      avatarUri: 'https://example.com/avatar.jpg',
    };
    
    const { getByTestId } = render(
      <ProfileHeader 
        user={userWithAvatar}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateBMI}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    expect(getByTestId('profile-avatar')).toBeTruthy();
  });
  
  it('calls onEditProfile when edit button is pressed', () => {
    const { getByText } = render(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateBMI}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    const editButton = getByText('Edit Profile');
    fireEvent.press(editButton);
    
    expect(mockOnEditProfile).toHaveBeenCalled();
  });
  
  it('handles avatar selection', async () => {
    const { getByTestId } = render(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateBMI}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    const avatarContainer = getByTestId('avatar-container');
    fireEvent.press(avatarContainer);
    
    // Wait for the image picker to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockUpdateUser).toHaveBeenCalledWith({
      ...mockUser,
      avatarUri: 'file:///test/avatar.jpg',
    });
  });
  
  it('displays correct BMI category', () => {
    // Mock different BMI values
    const mockCalculateUnderweight = jest.fn().mockReturnValue(17.5);
    const mockCalculateNormal = jest.fn().mockReturnValue(22.0);
    const mockCalculateOverweight = jest.fn().mockReturnValue(27.5);
    const mockCalculateObese = jest.fn().mockReturnValue(32.0);
    
    // Test underweight
    const { getByText, rerender } = render(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateUnderweight}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    expect(getByText('Underweight')).toBeTruthy();
    
    // Test normal weight
    rerender(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateNormal}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    expect(getByText('Normal')).toBeTruthy();
    
    // Test overweight
    rerender(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateOverweight}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    expect(getByText('Overweight')).toBeTruthy();
    
    // Test obese
    rerender(
      <ProfileHeader 
        user={mockUser}
        updateUser={mockUpdateUser}
        calculateBMI={mockCalculateObese}
        onEditProfile={mockOnEditProfile}
      />
    );
    
    expect(getByText('Obese')).toBeTruthy();
  });
});
