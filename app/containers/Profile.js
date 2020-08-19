import React from "react";
import globalStyles from "../assets/styles";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  ImageBackground,
  RefreshControl,
  Image,
  Alert,
  ScrollView as _NativeScrollView
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import APIConnection from "../assets/data/APIConnection";
import Settings from "../assets/icons/menu_icon.svg";
import ProfilePicture from "../components/ProfilePageComponents/ProfilePicture";
import InfoContainer from "../components/ProfilePageComponents/InfoContainer";
import List from "../components/ProfilePageComponents/List";
import BasicInfo from "../components/ProfilePageComponents/BasicInfo";
import Header from "../components/ProfilePageComponents/Header";
import Tag from "../components/ProfilePageComponents/Tag";

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      API: new APIConnection(),
      basicInfoEditable: false,
      projectsEditable: false,
      experienceEditable: false,
      keywordsEditable: false,
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

  setBasicInfoEditable(basicInfoEditable) {
    this.setState({ basicInfoEditable });
  }

  setProjectsEditable(projectsEditable) {
    this.setState({ projectsEditable });
  }

  setExperienceEditable(experienceEditable) {
    this.setState({ experienceEditable });
  }

  setKeywordsEditable(keywordsEditable) {
    this.setState({ keywordsEditable });
  }

  async updateName(email, newName) {
    const status = await this.state.API.updateUserInfo({
      name: newName,
      email
    });

    if (status === 201) {
      APIConnection.ProfilePage.notify();
    } else {
      Alert.alert("Update failed", "Couldn't update your info, try again later");
    }
  }

  async updateProjects(email, updatedProjects) {
    const status = await this.state.API.updateUserInfo({
      projects: updatedProjects,
      email
    });

    if (status === 201) {
      APIConnection.ProfilePage.notify();
    } else {
      Alert.alert("Update failed", "Couldn't update your info, try again later");
    }
  }

  async updateExperience(email, updatedExperience) {
    const status = await this.state.API.updateUserInfo({
      experience: updatedExperience,
      email
    });

    if (status === 201) {
      APIConnection.ProfilePage.notify();
    } else {
      Alert.alert("Update failed", "Couldn't update your info, try again later");
    }
  }

  async updateKeywords(email, keywords) {
    this.setState({ refreshing: true });
    const status = await this.state.API.updateKeywords({
      email,
      keywords
    });

    this.setState({ refreshing: false });

    if (status === 201) {
      APIConnection.ProfilePage.notify();
    } else {
      Alert.alert("Update failed", "Couldn't update your info, try again later");
    }
  }

  render() {
    const checksum = this.state.profile ? this.state.profile.checksum : null;
    const image = this.state.profile ? { uri: this.state.profile.image } : null;
    const name = this.state.profile ? this.state.profile.name : "";
    const age = this.state.profile ? this.state.profile.age : -1;
    const uni = this.state.profile ? this.state.profile.uni : "";
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
          <TouchableOpacity
          style={{ 
            alignSelf: "flex-end",
            marginTop: "-22%",
            marginRight: "5%",
            width: "10%",
            padding: "8%"
          }}
          onPress={() => this.props.navigation.navigate("Settings")}
          >
            <Settings width={DIMENSION_WIDTH * 0.06} height={DIMENSION_HEIGHT * 0.06} />
          </TouchableOpacity>

          <ProfilePicture
            image={image}
            checksum={checksum}
            editable={true}
            style={{ 
              width: DIMENSION_HEIGHT * 0.25,
              height: DIMENSION_HEIGHT * 0.25,
              marginTop: "5%",
              borderRadius: 300,
              alignSelf: "center"
            }}
          />
          
          <InfoContainer
            comp={[
              (<Header
                title={name}
                editable={this.state.basicInfoEditable}
                updateCallback={((newName) => this.updateName(email, newName)).bind(this)}
              />),
              (<BasicInfo
              email={email}
              bio={bio}
              gender={gender}
              major={major}
              uni={uni}
              editable={this.state.basicInfoEditable}
              />)
            ]}
            style={styles.infoContainerStyle}
            setEditable={this.setBasicInfoEditable.bind(this)}
          />

          {/* InfoContainer (Keywords) */}
          <InfoContainer
          comp={[
            (<Header title={"Interests"} style={{ marginTop: "3%"}} editable={false}/>),
            (<Tag
            containerStyle={{ width: DIMENSION_WIDTH * 0.8}}
            tags={keywords}
            type={"interests"}
            editable={this.state.keywordsEditable}
            updateCallback={((newKeywords) => this.updateKeywords(email, newKeywords)).bind(this)}
            />)
          ]}
          style={styles.infoContainerStyle}
          setEditable={this.setKeywordsEditable.bind(this)}
          />

          {/* InfoContainer (Experience, Projects, Courses) */}
          <InfoContainer
          comp={[
            (<Header title={"Projects"} editable={false}/>),
            (<List
            style={{ 
              width: DIMENSION_WIDTH * 0.8,
              marginLeft: DIMENSION_WIDTH * 0.05,
              marginTop: DIMENSION_HEIGHT * 0.01,
              zIndex: Number.MAX_SAFE_INTEGER,
            }}
            items={projects && projects.length > 0 ? projects : [""]}
            editable={this.state.projectsEditable}
            updateCallback={((newValue) => this.updateProjects(email, newValue)).bind(this)}
            type={"projects"}
            />)
          ]}
          style={styles.infoContainerStyle}
          setEditable={this.setProjectsEditable.bind(this)}
          />

        <InfoContainer
          comp={[
            (<Header title={"Experience"} editable={false}/>),
            (<List
            style={{
              width: DIMENSION_WIDTH * 0.8,
              marginLeft: DIMENSION_WIDTH * 0.05,
              marginTop: DIMENSION_HEIGHT * 0.01,
              zIndex: Number.MAX_SAFE_INTEGER,
            }}
            items={experience && experience.length > 0 ? experience : [""]}
            editable={this.state.experienceEditable}
            updateCallback={((newValue) => this.updateExperience(email, newValue)).bind(this)}
            type={"experience"}
            />)
          ]}
          style={styles.infoContainerStyle}
          setEditable={this.setExperienceEditable.bind(this)}
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
    marginBottom: DIMENSION_HEIGHT * 0.05,
    marginTop: "8%"
  }
});

export default Profile;
