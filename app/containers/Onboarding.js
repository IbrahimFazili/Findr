import * as React from "react";
import {
  View,
  AsyncStorage,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Animated,
  Button,
} from "react-native";
import styles from "../assets/styles";
import Swiper from "react-native-swiper";
import APIConnection from "../assets/data/APIConnection";
import CardItem from "../components/CardItem";

const INPUT_RANGE = [0, 1, 2, 3];
const OUTPUT_RANGE = ["#8B9EAF", "#4D617C", "#679389", "#1A5D57"];
const FULL_HEIGHT = Dimensions.get("window").height;
const FULL_WIDTH = Dimensions.get("window").width;

class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.onPressNext = this.onPressNext.bind(this);
    this.state = {
      API: new APIConnection(),
      cards: [],
      idxActive: 0,
    };
    (this.animatedColorValue = new Animated.Value(0)),
      (this.backgroundColor = this.animatedColorValue.interpolate({
        inputRange: INPUT_RANGE,
        outputRange: OUTPUT_RANGE,
      }));
  }

  onIndexChanged = (newIndex) => {
    Animated.timing(this.animatedColorValue, {
      toValue: newIndex,
      duration: 250,
    }).start();
  };

  onPressPrev = () => {
    this.refs.swiper.scrollBy(-1);
  };

  onPressNext = () => {
    const { idxActive } = this.state;
    // Probably best set as a constant somewhere vs a hardcoded 5
    if (idxActive < 4) {
      this.refs.swiper.scrollBy(1);
    }
  };

  async componentDidMount() {
    const data = await this.state.API.loadData(
      "meredith.grey@seattlegrace.com"
    );
    this.setState({ cards: data });
  }

  render() {
    const { backgroundColor, onIndexChanged } = this;
    return (
      <Animated.View style={[styles.onboardingBg, { backgroundColor }]}>
        <View style={{ width: "100%", height: "100%" }}>
          <Swiper
            bounces={true}
            style={styles.onboardingWrapper}
            height={FULL_HEIGHT}
            loop={false}
            onIndexChanged={(newIndex) => {
              this.onIndexChanged(newIndex);
              this.setState({ idxActive: newIndex });
            }}
            ref={"swiper"}
            dot={
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,.3)",
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  marginLeft: 7,
                  marginRight: 7,
                  marginBottom: 10,
                }}
              />
            }
            activeDot={
              <View
                style={{
                  backgroundColor: "#FFF",
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  marginRight: 7,
                  marginLeft: 7,
                  marginBottom: 10,
                }}
              />
            }
            paginationStyle={{
              bottom: -23,
              left: null,
              right: 10,
            }}
          >
            <View style={styles.slide1}>
              <View style={styles.slideOneTop}>
                <Text style={styles.slideTwoHeader}>Efficient Work</Text>
                <Image
                  style={{
                    width: 50,
                    marginTop: FULL_HEIGHT * 0.015,
                    marginBottom: FULL_HEIGHT * 0.015,
                  }}
                  source={require("../assets/images/line.png")}
                />
                <Text style={styles.slideTwoNormal}>
                  Master the Art of Studying Efficiently
                </Text>
              </View>
              <View style={styles.slideoneCarousel}>
                <ScrollView
                  style={{ zIndex: Number.MAX_VALUE }}
                  ref={(ref) => (this.scrollView = ref)}
                  onLayout={() =>
                    this.scrollView.scrollToEnd({
                      animated: true,
                      duration: 5000,
                    })
                  }
                  loop={true}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingStart: 5,
                    paddingEnd: 5,
                  }}
                >
                  {this.state.cards.map((user) => (
                    <View>
                      <CardItem
                        variant
                        key={user.name}
                        image={{ uri: user.image }}
                        name={user.name}
                        status={"Online"}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
              <View
                style={{
                  marginLeft: FULL_WIDTH * 0.31,
                  marginTop: FULL_HEIGHT * 0.165,
                }}
              >
                <TouchableOpacity
                  onPress={this.onPressNext}
                  style={styles.OBnext}
                >
                  <Text style={styles.OBnextText1}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.slide2}>
              <View
                style={{
                  marginTop: FULL_HEIGHT * 0.05,
                  marginLeft: FULL_WIDTH * 0.05,
                }}
              >
                <TouchableOpacity onPress={this.onPressPrev}>
                  <Image
                    style={{
                      width: 80,
                      height: 20,
                      marginTop: FULL_HEIGHT * 0.02,
                      marginLeft: FULL_WIDTH * 0.02,
                      marginBottom: FULL_HEIGHT * 0.015,
                    }}
                    source={require("../assets/images/back_arrow.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.slideTwoContent}>
                <Text style={styles.slideTwoHeader}>Network Smarter</Text>
                <Image
                  style={{
                    width: 50,
                    marginTop: FULL_HEIGHT * 0.015,
                    marginBottom: FULL_HEIGHT * 0.015,
                  }}
                  source={require("../assets/images/line.png")}
                />
                <Text style={styles.slideTwoNormal}>
                  Get outside your comfort zone!
                </Text>
                <Text style={styles.slideTwoNormal}>
                  Find people in every field
                </Text>
                <Image
                  style={{ marginTop: FULL_HEIGHT * 0.05 }}
                  source={require("../assets/images/newicn_add.png")}
                />
                <TouchableOpacity
                  onPress={this.onPressNext}
                  style={styles.OBnext}
                >
                  <Text style={styles.OBnextText2}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.slide3}>
              <TouchableOpacity onPress={this.onPressPrev}>
                <Image
                  style={{
                    width: 80,
                    height: 20,
                    marginTop: FULL_HEIGHT * 0.07,
                    marginLeft: FULL_WIDTH * 0.07,
                    marginBottom: FULL_HEIGHT * 0.015,
                  }}
                  source={require("../assets/images/back_arrow.png")}
                />
              </TouchableOpacity>
              <View styles={styles.slide3content}>
                <Text style={styles.slide3Header}>Chat Rooms</Text>
                <Image
                  style={styles.slide3line}
                  source={require("../assets/images/line.png")}
                />
                <Text style={styles.slide3Normal}>
                  Talk to anyone around campus!
                </Text>
                <Image
                  style={{
                    marginTop: FULL_HEIGHT * 0.15,
                    marginLeft: FULL_WIDTH * 0.1,
                  }}
                  source={require("../assets/images/chatRoom.png")}
                />
                <View
                  style={{
                    marginLeft: FULL_WIDTH * 0.32,
                    marginTop: FULL_HEIGHT * 0.115,
                  }}
                >
                  <TouchableOpacity
                    onPress={this.onPressNext}
                    style={styles.OBnext}
                  >
                    <Text style={styles.OBnextText3}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.slide4}>
              <TouchableOpacity onPress={this.onPressPrev}>
                <Image
                  style={{
                    width: 80,
                    height: 20,
                    marginTop: FULL_HEIGHT * 0.16,
                    marginLeft: FULL_WIDTH * 0.06,
                    marginBottom: FULL_HEIGHT * 0.015,
                  }}
                  source={require("../assets/images/back_arrow.png")}
                />
              </TouchableOpacity>
              <View style={styles.slide4content}>
                <Image
                  style={styles.onboardinglogo}
                  source={require("../assets/images/Findr_white2x.png")}
                />
                <View style={styles.slide4buttons}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("SignUp")}
                    style={styles.onBoardingButt}
                  >
                    <Text style={styles.onBoardingButtText}>Sign Up</Text>
                  </TouchableOpacity>
                  <Image
                    style={styles.onBoardingSep}
                    source={require("../assets/images/OR_photo.png")}
                  />
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("LogIn")}
                    style={styles.onBoardingButt}
                  >
                    <Text style={styles.onBoardingButtText}>Log In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Swiper>
        </View>
      </Animated.View>
    );
  }
}

export default Onboarding;
