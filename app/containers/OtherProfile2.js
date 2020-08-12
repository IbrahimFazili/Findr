import React from "react";
import globalStyles from "../assets/styles";
import {
	StyleSheet,
	Dimensions,
	ImageBackground,
	NetInfo,
	Image,
	View,
	ScrollView as _NativeScrollView,
} from "react-native";
import APIConnection from "../assets/data/APIConnection";
import ProfilePicture from "../components/ProfilePageComponents/ProfilePicture";
import InfoContainer from "../components/ProfilePageComponents/InfoContainer";
import List from "../components/ProfilePageComponents/List";
import BasicInfo from "../components/ProfilePageComponents/BasicInfo";
import Header from "../components/ProfilePageComponents/Header";
import Tag from "../components/ProfilePageComponents/Tag";
import { Button } from "react-native-elements";

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			API: new APIConnection(),
			profile: null,
			isConnected: true,
			user_email: props.navigation.state.params.email,
			count: 0,
		};
	}

	async componentDidMount() {
		let user = await this.state.API.fetchUser(this.state.user_email);
		this.setState({ profile: user });
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

	_getAge(age) {
		if (typeof age === "number") {
			return age;
		}
		// MM-DD-YYYY
		const year = Number(age.split("-")[2]);
		return new Date().getFullYear() - year;
	}

	handleConnectivityChange = (isConnected) => {
		this.setState({ isConnected });
	};

	navigateToChat(name, image) {
		this.props.navigation.navigate("ChatPage", {
			user_name: name,
			user_image: image,
			user_email: this.state.user_email,
			own_email: this.state.own_email,
			messages: [],
		});
	}

	render() {
		const checksum = this.state.profile
			? this.state.profile.checksum
			: null;
		const image = this.state.profile
			? { uri: this.state.profile.image }
			: null;
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
		const experience = this.state.profile
			? this.state.profile.experience
			: [];

		if (!this.state.profile || this.state.count < 1)
			setTimeout(
				(() => this.setState({ count: this.state.count + 1 })).bind(
					this
				),
				50
			);

		if (!this.state.isConnected) {
			this.props.navigation.navigate("Internet");
		}

		return (
			<ImageBackground
				source={require("../assets/images/15.png")}
				style={styles.bg}
			>
				<_NativeScrollView style={{ position: "relative" }}>
					<Image
						source={require("../assets/images/Findr_logo2x.png")}
						style={globalStyles.profileLogo}
					/>

					<ProfilePicture
						image={image}
						checksum={checksum}
						editable={false}
						style={{
							width: DIMENSION_WIDTH * 0.4,
							height: DIMENSION_WIDTH * 0.4,
							marginTop: "5%",
							borderRadius: DIMENSION_WIDTH * 0.2,
							borderColor: "black",
							borderWidth: 1,
							alignSelf: "center",
						}}
					/>

					<View
						style={{
							top: DIMENSION_HEIGHT * 0.035,
							alignSelf: "center",
						}}
					>
						<Button
							title="Chat"
							buttonStyle={{
								width: DIMENSION_WIDTH * 0.4,
								height: DIMENSION_WIDTH * 0.1,
								borderRadius: DIMENSION_WIDTH * 0.04,
								backgroundColor: "#1a5d57",
								marginBottom: DIMENSION_HEIGHT * 0.02,
							}}
							onPress={() => this.navigateToChat(name, image)}
						></Button>
					</View>

					<InfoContainer
						comp={[
							<Header title={name} editable={false} />,
							<BasicInfo
								email={email}
								bio={bio}
								gender={gender}
								major={major}
								uni={uni}
								editable={false}
							/>,
						]}
						style={[styles.infoContainerStyle]}
						isOther={true}
					/>

					{/* InfoContainer (Keywords) */}
					<InfoContainer
						comp={[
							<Header
								title={"Interests"}
								style={{ marginTop: "3%" }}
								editable={false}
							/>,
							<Tag
								containerStyle={{
									width: DIMENSION_WIDTH * 0.8,
								}}
								tags={keywords}
								type={"interests"}
								editable={false}
							/>,
						]}
						style={styles.infoContainerStyleInterests}
						isOther={true}
					/>

					<InfoContainer
						comp={[
							<Header title={"Projects"} editable={false} />,
							<List
								style={{
									width: DIMENSION_WIDTH * 0.8,
									marginLeft: DIMENSION_WIDTH * 0.05,
									marginTop: DIMENSION_HEIGHT * 0.01,
									zIndex: Number.MAX_SAFE_INTEGER,
								}}
								items={
									projects && projects.length > 0
										? projects
										: [""]
								}
								editable={false}
							/>,
						]}
						style={styles.infoContainerStyleProjects}
						isOther={true}
					/>

					<InfoContainer
						comp={[
							<Header title={"Experience"} editable={false} />,
							<List
								style={{
									width: DIMENSION_WIDTH * 0.8,
									marginLeft: DIMENSION_WIDTH * 0.05,
									marginTop: DIMENSION_HEIGHT * 0.01,
									zIndex: Number.MAX_SAFE_INTEGER,
								}}
								items={
									experience && experience.length > 0
										? experience
										: []
								}
								editable={false}
							/>,
						]}
						style={styles.infoContainerStyleExperience}
						isOther={true}
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
		height: DIMENSION_HEIGHT * 0.45,
		marginBottom: DIMENSION_HEIGHT * 0.05,
		marginTop: "8%",
	},

	infoContainerStyleInterests: {
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		width: DIMENSION_WIDTH * 0.9,
		minHeight: DIMENSION_HEIGHT * 0.1,
		marginBottom: DIMENSION_HEIGHT * 0.05,
		marginTop: "8%",
	},
	infoContainerStyleProjects: {
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		width: DIMENSION_WIDTH * 0.9,
		minHeight: DIMENSION_HEIGHT * 0.1,
		marginBottom: DIMENSION_HEIGHT * 0.05,
		marginTop: "8%",
	},
	infoContainerStyleExperience: {
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		width: DIMENSION_WIDTH * 0.9,
		minHeight: DIMENSION_HEIGHT * 0.1,
		marginBottom: DIMENSION_HEIGHT * 0.05,
		marginTop: "8%",
	},
});

export default Profile;
