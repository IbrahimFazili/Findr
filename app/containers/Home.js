import React from "react";
import { View, ImageBackground, AsyncStorage, Image, NetInfo, TouchableOpacity } from "react-native";
import CardStack, { Card } from "react-native-card-stack-swiper";
import CardItem from "../components/CardItem";
import styles from "../assets/styles";
import APIConnection from "../assets/data/APIConnection";
import ProfilePopup from "../components/ProfilePopup";
import {Overlay} from "react-native-elements"
import MatchPopup from "../components/MatchPopup"

const MAX_LENGTH = 150;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.addListener('didFocus', () => this.render());

    this.state = {
      cards: [],
      visible: false,
      API: new APIConnection(),
      keywords: [],
      name: "",
      bio: "",
      uni: "",
      dataLoadRequired: true,
      isConnected: true,
      visible: false,
      name: "",
      image: "",
      keywords: [],
      bio: "",
      uni: "",
      matchPossible: false,
    };
  }


  async componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
      this.setState({ isConnected });
  };

  async componentWillMount() {
    
    try {
      let storedEmail = await AsyncStorage.getItem('storedEmail');
      if (storedEmail === null){
        if((await AsyncStorage.getItem('onboarding')) === "1") {
          this.props.navigation.navigate('LogIn');
        }

        if((await AsyncStorage.getItem('onboarding')) === "0"){
          await AsyncStorage.setItem('onboarding', '1');
          this.props.navigation.navigate("Onboarding");
        }
      } else {
        const verified = (await this.state.API.fetchUser(storedEmail)).active;
        if (!verified) this.props.navigation.navigate("Verify");
      }
    } 
    catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    await AsyncStorage.setItem('onboarding', '0');
    let storedEmail = await AsyncStorage.getItem("storedEmail");
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

    if (storedEmail !== null && this.state.dataLoadRequired) {
      const data = await this.state.API.loadData(storedEmail);
      this.setState({ cards: data, dataLoadRequired: false });
    }

    APIConnection.attachHomePageNotifier(this.loadData.bind(this));
  }

  async loadData() {
    const data = await this.state.API.loadData(
      await AsyncStorage.getItem('storedEmail')
    );
    this.setState({ cards: data, dataLoadRequired: false });
  }

  async handleRightSwipe(email, image, name, swiped=false) {
    const swipeStatus = await this.state.API.rightSwipe(
      await AsyncStorage.getItem('storedEmail'), 
      email
    );

    if (swipeStatus.success) {
      !swiped ? this.swiper.swipeRight() : null;
      APIConnection.MatchesPage ? APIConnection.MatchesPage.notify() : null;
      if (swipeStatus.isMatch){
        this.setState({ matchPossible: true, image, name, email });
      }
    } else {
      // server didn't register the right swipe or the request didn't make sense.
      // TODO: display some sort of error message to the user that something's wrong
    }
  }

  async handleLeftSwipe(email, swiped=false) {
    const success = await this.state.API.leftSwipe(
      await AsyncStorage.getItem('storedEmail'), 
      email
    );

    if (success) !swiped ? this.swiper.swipeLeft() : null;
    else {
      // server didn't register the left swipe or the request didn't make sense.
      // TODO: display some sort of error message to the user that something's wrong
    }
  }

  render() {
    AsyncStorage.getItem('storedEmail')
      .then((value) => {
        if (value !== null && this.state.dataLoadRequired) {
          this.loadData();
        }
      })
      .catch((err) => {
        console.log(er);
      });

    if (!this.state.isConnected) {
        this.props.navigation.navigate("Internet");
    }
    return (
      <ImageBackground
        source={require('../assets/images/15.png')}
        style={styles.bg}
      >
        {/* <OfflinePopup /> */}
        {/* ^^ */}
        <Image
          style={styles.homeLogo}
          source={require('../assets/images/Findr_logo2x.png')}
        />
        <View style={styles.containerHome}>
          <View style={styles.homeCards}>
            <CardStack
              loop={false}
              verticalSwipe={false}
              renderNoMoreCards={() => null}
              ref={(swiper) => (this.swiper = swiper)}
            >
              {this.state.cards.map((item, index) => (
                <Card key={index}
                onSwipedLeft={() => this.handleLeftSwipe(item.email, true)}
                onSwipedRight={() => this.handleRightSwipe(item.email, item.image, item.name, true)}
                >
                  <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={() => this.setState({
                    visible: true,
                    name: item.name,
                    keywords: item.keywords, 
                    bio: item.bio,
                    uni: item.uni,
                    image: item.image
                  })}
                  >
                    <CardItem
                      image={{ uri: item.image, checksum: item.checksum }}
                      name={item.name}
                      keywords={item.keywords}
                      email={item.email}
                      description={
                        item.bio.length > MAX_LENGTH
                          ? item.bio.substring(0, MAX_LENGTH) + '...'
                          : item.bio
                      }
                      actions
                      onPressRight={() => this.handleRightSwipe(item.email)}
                      onPressLeft={() => this.handleRightSwipe(item.email, item.image, item.name, true)}
                    />
                  </TouchableOpacity>
                </Card>
              ))}
            </CardStack>
          </View>

          <MatchPopup
          name={this.state.name}
          image={this.state.image}
          email={this.state.email}
          visible={this.state.matchPossible}
          navigation={this.props.navigation}
          />

          <ProfilePopup 
            visible={this.state.visible} 
            name={this.state.name}
            keywords={this.state.keywords}
            bio={this.state.bio}
            uni={this.state.uni}
          />
 
        </View>
      </ImageBackground>
    );
  }
}

export default Home;
