import React, { PureComponent } from 'react';
import { View, Text, AsyncStorage, Dimensions, StyleSheet, NetInfo, Image, ImageBackground} from 'react-native';
import styles from "../assets/styles/index";
// import NetInfo from "@react-native-community/netinfo";
import Email from "../assets/icons/email.svg"
import { Button } from 'react-native-elements';
import APIConnection from "../assets/data/APIConnection";


// function MiniOfflineSign() {
//     return (
//       <ImageBackground source={require('../assets/images/15.png')} style={styles.internetBG}>
//         <View style={{flexDirection: 'column', alignItems: 'center', padding: 20}}>
//           <Image style={styles.internetLogo} source={require('../assets/images/Findr_logo2x.png')} />
//           <View style={styles.email}>
//             <Email width={50} height={50}/>
//           </View>
//             <Text style={styles.internetText}>Oops! Looks like you haven't verified your account yet!</Text>
//           </View>
//           <Button title="Refresh" type="solid" onPress={() => this}/>
//       </ImageBackground>
// );
//   }
  
  class Verify extends PureComponent {
    state = {
      isConnected: false
    };
  
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected });
    };
  
    async handleVerification(){
      try {
        const status = await (new APIConnection()).fetchUser(await AsyncStorage.getItem('storedEmail'));
        console.log(status)
        if (status.active) {
          this.props.navigation.navigate("AppScreen");
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    render() {
      if (this.state.isConnected) {
        this.props.navigation.goBack();
      }
      // return null;
      return(
      <ImageBackground source={require('../assets/images/15.png')} style={styles.internetBG}>
        <View style={{flexDirection: 'column', alignItems: 'center', padding: 20}}>
          <Image style={styles.internetLogo} source={require('../assets/images/Findr_logo2x.png')} />
          <View style={styles.email}>
            <Email width={50} height={50}/>
          </View>
            <Text style={styles.internetText}>Oops! Looks like you haven't verified your account yet!</Text>
          </View>
          <Button title="Refresh" type="solid" onPress={() => this.handleVerification()}/>
      </ImageBackground>  
      ) 
  }
}

export default Verify;
