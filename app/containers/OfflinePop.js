import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet, NetInfo, Image, ImageBackground} from 'react-native';
import styles from "../assets/styles/index";
// import NetInfo from "@react-native-community/netinfo";

function MiniOfflineSign() {
    return (
      <ImageBackground source={require('../assets/images/15.png')} style={styles.internetBG}>
          <Image style={styles.internetLogo} source={require('../assets/images/Findr_logo2x.png')} />
          <Text style={styles.internetText}>It seems like your internet is down</Text>
      </ImageBackground>
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
        // return <MiniOfflineSign />;
  }
}

export default OfflineNotice;
