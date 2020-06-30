import React from "react";
import { View, ImageBackground, AsyncStorage, Image, NetInfo } from "react-native";
import CardStack, { Card } from "react-native-card-stack-swiper";
import Filters from "../components/Filters";
import CardItem from "../components/CardItem";
import styles from "../assets/styles";
import APIConnection from "../assets/data/APIConnection";
import OfflinePopup from "./OfflinePop";

const MAX_LENGTH = 150;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.addListener("didFocus", () => this.render());

    this.state = {
      cards: [],
      API: new APIConnection(),
      dataLoadRequired: true,
      isConnected: true,
    };
  }


  async componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }
  // ^^

  handleConnectivityChange = isConnected => {
      this.setState({ isConnected });
  };

  async componentWillMount() {
    try {
      let storedEmail = await AsyncStorage.getItem("storedEmail");
      if (storedEmail === null) {
        this.props.navigation.navigate("LogIn");
      }
      
      // this.props.navigation.navigate("Onboarding");
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    let storedEmail = await AsyncStorage.getItem("storedEmail");
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    // ^^

    if (storedEmail !== null && this.state.dataLoadRequired) {
      const data = await this.state.API.loadData(storedEmail);
      this.setState({ cards: data, dataLoadRequired: false });
    }
  }

  async loadData() {
    const data = await this.state.API.loadData(
      await AsyncStorage.getItem("storedEmail")
    );
    this.setState({ cards: data, dataLoadRequired: false });
  }

  render() {
    AsyncStorage.getItem("storedEmail")
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
        source={require("../assets/images/15.png")}
        style={styles.bg}
      >
        {/* <OfflinePopup /> */}
        {/* ^^ */}
        <Image
          style={styles.homeLogo}
          source={require("../assets/images/Findr_logo2x.png")}
        />
        <View style={styles.containerHome}>
          <View style={styles.homeCards}>
            <CardStack
              loop={true}
              verticalSwipe={false}
              renderNoMoreCards={() => null}
              ref={(swiper) => (this.swiper = swiper)}
            >
              {this.state.cards.map((item, index) => (
                <Card key={index}>
                  <CardItem
                    image={{ uri: item.image }}
                    name={item.name}
                    keywords={item.keywords}
                    description={
                      item.bio.length > MAX_LENGTH
                        ? item.bio.substring(0, MAX_LENGTH) + "..."
                        : item.bio
                    }
                    actions
                    onPressRight={() => this.swiper.swipeRight()}
                    onPressLeft={() => this.swiper.swipeLeft()}
                  />
                </Card>
              ))}
            </CardStack>
          </View>
          <View style={styles.filterStyle}>
            <Filters />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default Home;
