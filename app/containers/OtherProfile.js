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
	NetInfo,
} from "react-native";
import OtherProfileItem from "../components/OtherProfileItem";
import ProfileItem from "../components/ProfileItem";
import Icon from "../components/Icon";
import APIConnection from "../assets/data/APIConnection";
import { ScrollView } from "react-navigation";
import Settings from "../assets/icons/settings_fill.svg";

const PRIMARY_COLOR = "#7444C0";
const WHITE = "#FFFFFF";

const ICON_FONT = "tinderclone";

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

class OtherProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			API: new APIConnection(),
			profile: null,
			isConnected: true,
			user_email: props.navigation.state.params.email,
			own_email: props.navigation.state.params.own_email,
		};
	}

	async componentDidMount() {
		let user = await this.state.API.fetchUser(this.state.user_email);
		this.setState({ profile: user });
		console.log(user);
		NetInfo.isConnected.addEventListener(
			"connectionChange",
			this.handleConnectivityChange
		);
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

	render() {
		console.log(this.state.user_email);
		console.log(this.state.profile);
		const image = this.state.profile
			? { uri: this.state.profile.image }
			: null;
		const name = this.state.profile ? this.state.profile.name : "";
		const age = this.state.profile ? this.state.profile.age : -1;
		const location = this.state.profile ? this.state.profile.uni : "";
		const gender = this.state.profile ? this.state.profile.gender : "";
		const major = this.state.profile ? this.state.profile.major : "";
		const email = this.state.profile ? this.state.profile.email : "";
		const keywords = this.state.profile ? this.state.profile.keywords : [];
		const clubs = this.state.profile ? this.state.profile.clubs : [];
		const courses = this.state.profile ? this.state.profile.courses : [];

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
								onPress={() =>
									this.props.navigation.navigate("ChatPage", {
										user_name: name,
										user_image: image,
										user_email: this.state.user_email,
										own_email: this.state.own_email,
										messages: [],
									})
								}
							>
								<Settings
									width={DIMENSION_HEIGHT * 0.04}
									height={DIMENSION_HEIGHT * 0.04}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.header}>
							<View style={styles.profilepicWrap}>
								<Image
									style={styles.profilepic}
									source={image}
								/>
							</View>
						</View>
						<View style={{ paddingHorizontal: 10 }}>
							<View
								style={{ marginTop: DIMENSION_HEIGHT * 0.21 }}
							>
								<OtherProfileItem
									name={name}
									age={age}
									uni={location}
									gender={gender == "M" ? "Male" : "Female"}
									email={email}
									keywords={keywords}
									clubs={clubs}
									courses={courses}
									major={major}
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
		marginTop: DIMENSION_HEIGHT * 0.02,
	},
	profilepicWrap: {
		width: 280,
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
		flexDirection: "row",
		alignItems: "center",
	},
	profileSettings: {
		marginLeft: DIMENSION_HEIGHT * 0.15,
		marginTop: DIMENSION_HEIGHT * 0.01,
	},
	bg: {
		flex: 1,
		resizeMode: "cover",
		width: DIMENSION_WIDTH,
		height: DIMENSION_HEIGHT,
	},
});

export default OtherProfile;
