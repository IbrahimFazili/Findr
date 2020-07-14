import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet, NetInfo, Image, ImageBackground} from 'react-native';
import styles from "../assets/styles/index";
// import NetInfo from "@react-native-community/netinfo";

function MiniOfflineSign() {
    return (
      <ImageBackground source={require('../assets/images/15.png')} style={styles.internetBG}>
        <View style={{flexDirection: 'column', alignItems: 'center', padding: 20}}>
          <Image style={styles.internetLogo} source={require('../assets/images/Findr_logo2x.png')} />

            <Text style={styles.internetText}>Oops! Looks like you haven't verified your account yet!</Text>
          </View>
      </ImageBackground>
);
  }
  
  class Verify extends PureComponent {
    state = {
      isConnected: false
    };
  
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected });
    };
  
    render() {
      if (this.state.isConnected) {
        this.props.navigation.goBack();
      }
      // return null;
        return <MiniOfflineSign />;
  }
}

export default Verify;
