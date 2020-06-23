import React from "react";
import globalStyles from "../assets/styles";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  AsyncStorage,
  ImageBackground,
} from "react-native";
import ProfileItem from "../components/ProfileItem";
import Icon from "../components/Icon";
import APIConnection from "../assets/data/APIConnection";
import { ScrollView } from "react-navigation";

const PRIMARY_COLOR = "#7444C0";
const SECONDARY_COLOR = "#5636B8";
const WHITE = "#FFFFFF";
const GRAY = "#757E90";
const DARK_GRAY = "#363636";
const BLACK = "#000000";

const ONLINE_STATUS = "#46A575";
const OFFLINE_STATUS = "#D04949";

const STAR_ACTIONS = "#FFA200";
const LIKE_ACTIONS = "#2c9c91";
const DISLIKE_ACTIONS = "#363636";
const FLASH_ACTIONS = "#5028D7";

const ICON_FONT = "tinderclone";

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { API: new APIConnection(), profile: null };
  }

  async componentDidMount() {
    let user = await this.state.API.fetchUser(
      await AsyncStorage.getItem("storedEmail")
    );
    this.setState({ profile: user });
  }

  render() {
    const image = this.state.profile ? { uri: this.state.profile.image } : null;
    const name = this.state.profile ? this.state.profile.name : "";
    const age = this.state.profile ? this.state.profile.age : -1;
    const location = this.state.profile ? this.state.profile.uni : "";
    const gender = this.state.profile ? this.state.profile.gender : "";
    const major = this.state.profile ? this.state.profile.major : "";
    const email = this.state.profile ? this.state.profile.email : "";

    return (
      <ImageBackground
      source={require("../assets/images/15.png")}
      style={styles.bg}
      >
        <View style={styles.profileContainer}>
          <ScrollView>
            <Image
              source={require("../assets/images/Findr_logo2x.png")}
              style={globalStyles.profileLogo}
            />
            <View style={styles.header}>
              <View style={styles.profilepicWrap}>
                <Image style={styles.profilepic} source={image} />
              </View>
            </View>

            <View style={{paddingHorizontal: 10}}>
              <View style={{marginTop: DIMENSION_HEIGHT * 0.21}}>
                <ProfileItem
                  name={name}
                  age={age}
                  location={location}
                  info1={gender == "M" ? "Male" : "Female"}
                  info2={major}
                  info3={email}
                />
              </View>
              {/* <View style={{marginTop: DIMENSION_HEIGHT * 0.18}}>
                <ProfileItem
                  // name={name}
                  // age={age}
                  // location={location}
                  info1={gender == "M" ? "Male" : "Female"}
                  info2={major}
                  info3={email}
                  identifier={1}
                />
              </View>
              <View style={{marginTop: DIMENSION_HEIGHT * 0.18}}>
                <ProfileItem
                  // name={name}
                  // age={age}
                  // location={location}
                  info1={gender == "M" ? "Male" : "Female"}
                  info2={major}
                  info3={email}
                  identifier={2}
                />
              </View>
              <View style={{marginTop: DIMENSION_HEIGHT * 0.18, marginBottom: DIMENSION_HEIGHT * 0.02}}>
                <ProfileItem
                  // name={name}
                  // age={age}
                  // location={location}
                  info1={gender == "M" ? "Male" : "Female"}
                  info2={major}
                  info3={email}
                  identifier={3}
                />
              </View> */}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
    alignSelf: "stretch",
    backgroundColor: "rgba(26, 93, 87, 0.15)",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: DIMENSION_HEIGHT * 0.02
    // padding: 20,
    // backgroundColor: 'rgba(26, 93, 87, 0.15)',
  },
  profilepicWrap: {
    width: 280,
    height: 280,
    // borderRadius: 100,
    // borderColor: "rgba(26, 93, 87, 0.15)",
    // borderWidth: 16,
    // marginBottom: 160,
  },
  profilepic: {
    flex: 1,
    width: null,
    alignSelf: "stretch",
    borderRadius: 700,
    // borderColor: "#fff",
    // borderWidth: 4,
  },
  containerProfile: { marginHorizontal: 0 },
  photo: {
    width: DIMENSION_WIDTH,
    height: 450,
  },
  topIconLeft: {
    fontFamily: ICON_FONT,
    fontSize: 20,
    color: WHITE,
    paddingLeft: 20,
    marginTop: -20,
    transform: [{ rotate: "90deg" }],
  },
  topIconRight: {
    fontFamily: ICON_FONT,
    fontSize: 20,
    color: WHITE,
    paddingRight: 20,
  },
  actionsProfile: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconButton: { fontFamily: ICON_FONT, fontSize: 20, color: "#1a5d57" },
  textButton: {
    fontFamily: ICON_FONT,
    fontSize: 15,
    color: "#1a5d57",
    paddingLeft: 5,
  },
  circledButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  roundedButton: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    height: 50,
    borderRadius: 25,
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    elevation: 10,
  },
  name: {
    marginTop: 20,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  pos: {
    fontSize: 16,
    color: "#0394c0",
    fontWeight: "300",
    fontStyle: "italic",
  },
  profileContainer: {
    justifyContent: "space-between",
    flex: 1,
    // paddingHorizontal: 10,
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  }
});

export default Profile;
