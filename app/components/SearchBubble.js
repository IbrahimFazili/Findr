import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';

class SearchBubble extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.keyword}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a5d57',
    opacity: 0.9,
    alignItems: 'center',
    alignSelf: "center",
    height: 30,
    margin: 10,
    width: '100%',
    paddingHorizontal: 5,
    borderRadius: 20,
    marginRight: Dimensions.get("window").width * 0.05
  },
  text: {
      color: 'white',
      fontSize: 16,
  }
});

export default SearchBubble;


