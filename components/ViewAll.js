import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Post from './Post';

const ViewAll = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation(); // Get navigation object from react-navigation

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postcount = await AsyncStorage.getItem('postcount');
        if (postcount) {
          const count = parseInt(postcount);
          const fetchedPosts = [];

          for (let i = 0; i < count; i++) {
            const post = await AsyncStorage.getItem(`post${i}`);
            fetchedPosts.push(post);
          }

          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage: ', error);
      }
    }

    fetchPosts();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>View All</Text>

      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={() => {
          navigation.navigate('Home'); // Navigate to the 'Home' screen
        }}
      >
        <Text>Home</Text>
      </TouchableOpacity>

      <Text style={styles.countText}>
        COUNT : {posts.length}
      </Text>

      <View style={styles.postsContainer}>
        {posts.map((data, indx) => {
          return (
            <Post
              key={indx}
              number={indx + 1}
              data={data}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  viewAllButton: {
    padding: 10,
    margin: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  countText: {
    fontSize: 18,
    marginBottom: 10,
  },
  postsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ViewAll;
