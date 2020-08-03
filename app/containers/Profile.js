import React from "react";
import globalStyles from "../assets/styles";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  ImageBackground,
  NetInfo,
  RefreshControl,
  Image,
  Text,
  ScrollView as _NativeScrollView
} from "react-native";
import APIConnection from "../assets/data/APIConnection";
import { ScrollView } from "react-navigation";
import Settings from "../assets/icons/settings_fill.svg";
import ProfilePicture from "../components/ProfilePageComponents/ProfilePicture";
import InfoContainer from "../components/ProfilePageComponents/InfoContainer";
import List from "../components/ProfilePageComponents/List";
import BasicInfo from "../components/ProfilePageComponents/BasicInfo";
import Header from "../components/ProfilePageComponents/Header";

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      API: new APIConnection(),
      basicInfoEditable: false,
			profile: null,
      isConnected: true,
      placeholder: false,
      refreshing: false
		};
  }
  
  async loadData() {
    this.setState({ refreshing: true });
    let user = await this.state.API.fetchUser(
			await AsyncStorage.getItem("storedEmail")
		);
		this.setState({ profile: user, refreshing: false});
  }

	async componentDidMount() {
		this.loadData();
		NetInfo.isConnected.addEventListener(
			"connectionChange",
			this.handleConnectivityChange
    );
    
    APIConnection.attachProfilePageNotifier(this.loadData.bind(this));
	}

	async componentWillUnmount() {
		NetInfo.isConnected.removeEventListener(
			"connectionChange",
			this.handleConnectivityChange
		);
	}

	handleConnectivityChange = (isConnected) => {
		this.setState({ isConnected });
	};

  _getAge(age) {
    if (typeof age === "number"){ return age; }
    // MM-DD-YYYY
    const year = Number(age.split("-")[2]);
    return (new Date()).getFullYear() - year;
  }

  render() {
    const checksum = this.state.profile ? this.state.profile.checksum : null;
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
    const projects = this.state.profile ? this.state.profile.projects : [];
    const experience = this.state.profile ? this.state.profile.experience : [];

    if (!this.state.isConnected) {
      this.props.navigation.navigate("Internet");
    }

    return (
      <ImageBackground
      source={require("../assets/images/15.png")}
      style={styles.bg}
      >
        <_NativeScrollView
        refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.loadData.bind(this)}
          />
        }
        style={{ position: "relative" }}
        >
          <Image
          source={require("../assets/images/Findr_logo2x.png")}
          style={globalStyles.profileLogo}
          />
          <TouchableOpacity style={{ 
            alignSelf: "flex-end",
            marginTop: "-20%",
            marginRight: "5%",
            width: "10%",
            padding: "8%"
          }}>
            <Settings width={30} height={30} />
          </TouchableOpacity>

          <ProfilePicture
            image={image}
            checksum={checksum}
            style={{ 
              width: DIMENSION_HEIGHT * 0.25,
              height: DIMENSION_HEIGHT * 0.25,
              marginTop: "5%",
              borderRadius: 300,
              borderColor: "black", 
              borderWidth: 1,
              alignSelf: "center"
            }}
          />
          
          <InfoContainer
            comp={[
              (<Header title={name} />),
              (<BasicInfo
              email={email}
              bio={bio}
              gender={bio}
              />)
            ]}
            style={styles.infoContainerStyle}
          />

          {/* InfoContainer (Keywords) */}

          {/* InfoContainer (About Me) */}

          {/* InfoContainer (Experience, Projects, Courses) */}
          <InfoContainer
          comp={[
            (<Header title={"Projects"} />),
            (<List
            style={{ width: DIMENSION_WIDTH * 0.8, marginLeft: DIMENSION_WIDTH * 0.05, marginTop: DIMENSION_HEIGHT * 0.1 }}
            items={projects}
            />)
          ]}
          style={styles.infoContainerStyle}
          />

        <InfoContainer
          comp={[
            (<Header title={"Experience"} />),
            (<List
            style={{ width: DIMENSION_WIDTH * 0.8, marginLeft: DIMENSION_WIDTH * 0.05, marginTop: DIMENSION_HEIGHT * 0.1 }}
            items={experience ? experience : []}
            />)
          ]}
          style={styles.infoContainerStyle}
          />


        </_NativeScrollView>
        
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },
  infoContainerStyle: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: DIMENSION_WIDTH * 0.9,
    marginTop: "10%"
  }
});

export default Profile;
