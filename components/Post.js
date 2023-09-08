import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Post = (props) => {
  return (
    <View style={styles.post} testID="post-container">
      <Text testID="post-number">POST: {props?.number}</Text>
      <Text testID="post-data">{props?.data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: 'white', 
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default Post;
