import React from 'react';
import { View, Text, ImageBackground, Image} from 'react-native';
import styles from "../assets/styles";

class SplashScreen extends React.Component {
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2000
      )
    )
  }

  async componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('App');
    }
  }

  render() {
    return (
    <ImageBackground 
    source={require('../assets/images/15.png')}
    style={styles.bg}>
            <Image style={styles.logoSplash} source={require('../assets/images/Findr_logo2x.png')} />

    </ImageBackground>
    );
  }
}

export default SplashScreen;
