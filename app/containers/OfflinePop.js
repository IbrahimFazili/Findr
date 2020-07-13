import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet, NetInfo, Image, ImageBackground} from 'react-native';
import styles from "../assets/styles/index";
// import NetInfo from "@react-native-community/netinfo";
import Wifi_Icon from '../assets/icons/wifi.svg';

function MiniOfflineSign() {
    return (
      <ImageBackground source={require('../assets/images/15.png')} style={styles.internetBG}>
        <View style={{flexDirection: 'column', alignItems: 'center', padding: 20}}>
          <Image style={styles.internetLogo} source={require('../assets/images/Findr_logo2x.png')} />
          <View style={{marginTop: Dimensions.get('window').height * 0.1, padding: 20, flexDirection: 'column', alignItems: 'center'}}>
            <Wifi_Icon width={40} height={40}/>
            <Text style={styles.internetText}>Oops! Lost connection</Text>
          </View>
        </View>
      </ImageBackground>
);
  }
  
  class OfflineNotice extends PureComponent {
    state = {
      isConnected: false
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
      if (this.state.isConnected) {
        this.props.navigation.goBack();
      }
      // return null;
        return <MiniOfflineSign />;
  }
}

export default OfflineNotice;
