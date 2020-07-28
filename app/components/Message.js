import React from 'react';
import styles from '../assets/styles';

import { Text, View } from 'react-native';
import CachedImage from './CachedImage';

const Message = ({ image, lastMessage, name, email }) => {
  return (
    <View style={styles.containerMessage}>
      <CachedImage
      uri={image.uri}
      uid={email}
      style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={{color: 'black', fontSize: 16}}>{name}</Text>
        <Text style={styles.message}>{lastMessage}</Text>
      </View>
    </View>
  );
};

export default Message;
