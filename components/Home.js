import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [text, setText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize 'postcount' in AsyncStorage if it doesn't exist
    async function initializeAsyncStorage() {
      try {
        const postcount = await AsyncStorage.getItem('postcount');
        if (postcount === null) {
          await AsyncStorage.setItem('postcount', '0');
        }
      } catch (error) {
        console.error('Error initializing AsyncStorage: ', error);
      }
    }
    initializeAsyncStorage();
  }, []);

  const postfunc = async () => {
    if (text === '') return;
    try {
      const postcount = await AsyncStorage.getItem('postcount');
      const postCount = parseInt(postcount || '0');
      await AsyncStorage.setItem(`post${postCount}`, text);
      await AsyncStorage.setItem('postcount', `${(postCount + 1) % 10}`);
      setText('');
    } catch (error) {
      console.error('Error storing data in AsyncStorage: ', error);
    }
  };

  const DeleteOne = async () => {
    try {
      const postcount = await AsyncStorage.getItem('postcount');
      const postCount = parseInt(postcount || '0');
      if (postCount > 0) {
        await AsyncStorage.removeItem(`post${postCount - 1}`);
        await AsyncStorage.setItem('postcount', `${postCount - 1}`);
      }
    } catch (error) {
      console.error('Error deleting data from AsyncStorage: ', error);
    }
  };
  const DeleteAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data from AsyncStorage: ', error);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.heading}>POST AND SHOW</Text>
    <View style={styles.buttonContainer}>
    <View style={styles.buttonSpacing}>
    <Button
      title="VIEW ALL"
      onPress={() => navigation.navigate('ViewAll')}
    />
   </View>
      <View style={styles.buttonSpacing}>
        <Button
          title="Delete One"
          onPress={DeleteOne}
        />
      </View>
      <View style={styles.buttonSpacing}>
        <Button
          title="Delete All"
          onPress={DeleteAll}
        />
      </View>
    </View>
    <View style={styles.textArea}>
      <TextInput
        multiline
        placeholder="Type Something..."
        style={styles.input}
        onChangeText={(newText) => setText(newText)}
        value={text}
      />
      <View style={styles.buttons}>
        <Button
          title="Reset"
          onPress={() => setText('')}
        />
        <Button
          title="Post"
          onPress={postfunc}
        />
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    textArea: {
      width: '80%',
      marginTop: 20,
    },
    input: {
      fontSize: 16,
      textTransform: 'capitalize',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      marginTop: 20,
    },
    buttonSpacing: {
      marginBottom: 10, // Added margin to create spacing between buttons
    },
  });
  

export default Home;
