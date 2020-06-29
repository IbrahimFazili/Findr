import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet, NetInfo } from 'react-native';
import styles from "../assets/styles/index";
// import NetInfo from "@react-native-community/netinfo";

function MiniOfflineSign() {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    );
  }
  
  class OfflineNotice extends PureComponent {
    state = {
      isConnected: true
    };
  
    componentDidMount() {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }
  
    componentWillUnmount() {
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }
  
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected });
    };
  
    render() {
      if (!this.state.isConnected) {
        return <MiniOfflineSign />;
      }
      return null;
    }
  }

export default OfflineNotice;
