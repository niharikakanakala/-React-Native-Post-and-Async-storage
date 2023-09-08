import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import Home from './components/Home';
import Post from './components/Post';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MockNavigationContainer = ({ children }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

const MockNavigator = ({ component }) => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={component} />
  </Stack.Navigator>
);

// Mock AsyncStorage functions
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }));
  

// Clear mocked functions after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('Post Component', () => {
  it('should render the post number and data', () => {
    const postNumber = 1;
    const postData = 'This is a test post';
    const { getByTestId } = render(
      <Post number={postNumber} data={postData} />
    );

    const postNumberText = getByTestId('post-number');
    const postDataText = getByTestId('post-data');

    expect(postNumberText).toBeTruthy();
    expect(postDataText).toBeTruthy();
  });

  it('should have white background color and padding of 10', () => {
    const { getByTestId } = render(<Post />);
    const postContainer = getByTestId('post-container');
  
    const backgroundColor = postContainer.props.style.backgroundColor;
    expect(backgroundColor).toBe('white');
  
    const padding = postContainer.props.style.padding;
    expect(padding).toBe(10);

    const margin = postContainer.props.style.margin;
    expect(margin).toBe(10);
    const borderRadius = postContainer.props.style.borderRadius;
    expect(borderRadius).toBe(5);

    const borderWidth = postContainer.props.style.borderWidth;
    expect(borderWidth).toBe(1);
    
    const borderColor = postContainer.props.style.borderColor;
    expect(borderColor).toBe('gray');
  });
});

describe('Navigation Test', () => {

  it('should initialize AsyncStorage when the component mounts', async () => {
    // Mock AsyncStorage getItem and setItem methods
    AsyncStorage.getItem = jest.fn().mockResolvedValue(null);
    AsyncStorage.setItem = jest.fn().mockResolvedValue();
  
    const { getByText } = render(
      <MockNavigationContainer>
        <MockNavigator component={Home} />
      </MockNavigationContainer>
    );
  
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('postcount');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('postcount', '0');
    });
  });
  

  it('should delete one post from AsyncStorage', async () => {
    AsyncStorage.getItem = jest.fn().mockResolvedValue('3');
    AsyncStorage.removeItem = jest.fn().mockResolvedValue();
    AsyncStorage.setItem = jest.fn().mockResolvedValue();
  
    const { getByText } = render(
      <MockNavigationContainer>
        <MockNavigator component={Home} />
      </MockNavigationContainer>
    );
  
    const deleteOneButton = getByText('Delete One');
    fireEvent.press(deleteOneButton);
  
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('postcount');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('post2');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('postcount', '2');
    });
  });
  
  it('should navigate to ViewAll screen when button is pressed', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByText } = render(
      <MockNavigationContainer>
        <MockNavigator component={Home} />
      </MockNavigationContainer>
    );

    const viewAllButton = getByText('VIEW ALL');
    fireEvent.press(viewAllButton);
    await waitFor(() => {
      expect(getByText(/view all/i)).toBeTruthy();
    });
  });

  it('should post data to AsyncStorage', async () => {
    // Mock AsyncStorage methods
    AsyncStorage.getItem = jest.fn().mockResolvedValue('0');
    AsyncStorage.setItem = jest.fn().mockResolvedValue();
  
    const { getByPlaceholderText, getByText, getByTestId } = render(
    <NavigationContainer>
      <Home />
    </NavigationContainer> );
  
    const inputField = getByPlaceholderText('Type Something...');
    fireEvent.changeText(inputField, 'New Post');
  
    const postButton = getByText('Post');
    fireEvent.press(postButton);
  
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('postcount');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('post0', 'New Post');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('postcount', '1');
    });
  
    expect(inputField.props.value).toBe('');
  });
  
});

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <Home />
      </NavigationContainer> 
    );

    expect(getByText('POST AND SHOW')).toBeTruthy();
    expect(getByPlaceholderText('Type Something...')).toBeTruthy();
    expect(getByText('VIEW ALL')).toBeTruthy();
    expect(getByText('Delete One')).toBeTruthy();
    expect(getByText('Delete All')).toBeTruthy();
  });
 

  it('should reset text input after posting', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <Home />
      </NavigationContainer> 
    );

    const input = getByPlaceholderText('Type Something...');
    const postButton = getByText('Post');

    fireEvent.changeText(input, 'New Post');
    fireEvent.press(postButton);

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });


  it('should clear AsyncStorage when deleting all posts', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Home />
      </NavigationContainer> 
    );

    const deleteAllButton = getByText('Delete All');
    fireEvent.press(deleteAllButton);

    await waitFor(() => {
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });
