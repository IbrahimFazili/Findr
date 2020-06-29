import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import styles from "../assets/styles/index"

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}
class OfflineNotice extends PureComponent {
  render() {
      return <MiniOfflineSign />;
  }
}

export default OfflineNotice;
