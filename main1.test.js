import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ViewAll from './components/ViewAll';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
  }));
  
  // Mock the useNavigation hook
  jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  }));

describe('ViewAll Component', () => {
  it('should render the heading and Home button', () => {
    const { getByText } = render(<ViewAll />);

    expect(getByText('View All')).toBeTruthy();
    expect(getByText('Home')).toBeTruthy();
  });

  it('should display the correct count of posts', async () => {
    AsyncStorage.getItem.mockResolvedValue('3'); 

    const { getByText } = render(<ViewAll />);

    await waitFor(() => expect(getByText('COUNT : 3')).toBeTruthy());
  });

  
});
