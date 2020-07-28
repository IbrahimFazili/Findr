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
  NetInfo
} from "react-native";
import ProfileItem from "../components/ProfileItem";
import Icon from "../components/Icon";
import APIConnection from "../assets/data/APIConnection";
import { ScrollView } from "react-navigation";
import Settings from "../assets/icons/settings_fill.svg";
import ImagePicker from 'react-native-image-picker';
import PlaceHolder from "../assets/icons/placeholder_icon.svg"
import Pen from '../assets/icons/pen.svg';



const PRIMARY_COLOR = "#7444C0";
const WHITE = "#FFFFFF";

const ICON_FONT = "tinderclone";

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { API: new APIConnection(), profile: null, isConnected: true, };
  }

  async componentDidMount() {
    let user = await this.state.API.fetchUser(
      await AsyncStorage.getItem("storedEmail")
    );
    this.setState({ profile: user });
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  async componentWillUnmount(){
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  async _onChangeMedia(selection) {
    const media = {
      name: selection.fileName,
      type: selection.type,
      uri: selection.uri
    };
    const url = await this.state.API.updateProfilePicture(
      await AsyncStorage.getItem('storedEmail'),
      media.type
    )

    APIConnection.uploadPicture(url, media);
    var profile = {...this.state.profile}
    profile.image = media.uri
    this.setState({profile})
    // this.setState({ image: media.uri });
  }

  chooseImage = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };

        // file type: response.type
        // file name: response.fileName
        this._onChangeMedia(response);
      }
    });
  };

  _getFormattedGender(gender) {
    switch (gender) {
      case "" : return "";
      case "M": return "Male";
      case "F": return "Female";
      case "O": return "Other";
      case "P": return "Prefer Not To Say";
      default: return "";
    }
  }

  _getAge(age) {
    if (typeof age === "number"){ return age; }
    // MM-DD-YYYY
    const year = Number(age.split("-")[2]);
    return (new Date()).getFullYear() - year;
  }

  render() {
    const image = this.state.profile ? { uri: this.state.profile.image } : null;
    const name = this.state.profile ? this.state.profile.name : "";
    const age = this.state.profile ? this.state.profile.age : -1;
    const location = this.state.profile ? this.state.profile.uni : "";
    const gender = this.state.profile ? this.state.profile.gender : "";
    const email = this.state.profile ? this.state.profile.email : "";
    const keywords = this.state.profile ? this.state.profile.keywords : [];
    const clubs = this.state.profile ? this.state.profile.clubs : [];
    const courses = this.state.profile ? this.state.profile.courses : [];
    const major = this.state.profile ? this.state.profile.major : [];
    const bio = this.state.profile ? this.state.profile.bio : [];

    console.log(this.state);
    if (!this.state.isConnected) {
      this.props.navigation.navigate("Internet");
    }

    return (
      <ImageBackground
      source={require("../assets/images/15.png")}
      style={styles.bg}
      >
        <View style={styles.profileContainer}>
          <ScrollView>
            <View style={styles.profileLogoTop}>
              <Image
                source={require("../assets/images/Findr_logo2x.png")}
                style={globalStyles.profileLogo}
              />
              <TouchableOpacity
                style={styles.profileSettings}
                onPress={() => this.props.navigation.navigate("Settings")}
              >
                <Settings width={DIMENSION_HEIGHT * 0.04} height={DIMENSION_HEIGHT * 0.04}/>
              </TouchableOpacity>
            </View>
            <View style={styles.header}>
              <View style={styles.profilepicWrap}>
                {
                  image === null ?
                  <PlaceHolder  style={styles.profilepic} /> : 
                  <Image style={styles.profilepic} 
                  source={image} />
                }
               {/* <Image style={styles.profilepic} 
                  source={image} /> */}
                <TouchableOpacity onPress={() => this.chooseImage()}>
                  <View style={styles.penProfile}>
							      <Pen width={20} height={20}/>
                  </View>
							  </TouchableOpacity>
              </View>
            </View>
            <View style={{paddingHorizontal: 10}}>
              <View style={{marginTop: DIMENSION_HEIGHT * 0.21}}>
                <ProfileItem
                  name={name}
                  age={this._getAge(age)}
                  uni={location}
                  gender={this._getFormattedGender(gender)}
                  email={email}
                  keywords={keywords}
                  clubs={clubs}
                  courses={courses}
                  major={major}
                  bio={bio}
                />
              </View>
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
  },
  profilepicWrap: {
    width: 265,
    height: 280,
  },
  profilepic: {
    flex: 1,
    width: null,
    alignSelf: "stretch",
    borderRadius: 700,
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
  profileLogoTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSettings: {
    marginLeft: DIMENSION_HEIGHT * 0.15,
    marginTop: DIMENSION_HEIGHT * 0.01
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  }
});

export default Profile;
