import React from "react";
import styles from "../assets/styles";
import { Thumbnail } from "native-base";
import {
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	ImageBackground,
	FlatList,
	AsyncStorage,
	NetInfo,
	Dimensions,
} from "react-native";
import CardItem from "../components/CardItem";
import APIConnection from "../assets/data/APIConnection";

// import {BlurView} from '@react-native-community/blur';

const thumnailStyle = {
	marginHorizontal: 10,
	borderColor: "#1a5d57",
	borderWidth: 2.7,
};

class Matches extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			API: new APIConnection(),
			cards: [],
			pending_cards : [],
			visible: false,
			name: "",
			keywords: [],
			bio: "",
			uni: "",
			isConnected: true,
		};
	}

	async loadData(){
		const data = await this.state.API.fetchMatches(
			await AsyncStorage.getItem("storedEmail")
		);
		const pendingMatches = await this.state.API.fetchPendingMatches(
			await AsyncStorage.getItem("storedEmail")
		);
		this.scrollView.scrollToEnd({ animated: true, duration: 1000 });
		this.setState({ cards: data, pending_cards: pendingMatches });
	}

	async componentDidMount() {
		this.loadData();
		NetInfo.isConnected.addEventListener(
			"connectionChange",
			this.handleConnectivityChange
		);

		APIConnection.attachMatchPageNotifier(this.loadData.bind(this));
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
		if (!this.state.isConnected) {
			this.props.navigation.navigate("Internet");
		}
		return (
			<ImageBackground
				source={require("../assets/images/Home.png")}
				style={styles.bg}
			>
				<View style={styles.containerMatches}>
					<ScrollView>
						<Image
							style={styles.matchLogo}
							source={require("../assets/images/Findr_logo2x.png")}
						/>
						<View style={styles.matchTop}>
							<Text style={styles.matchTitle}>
								Pending Matches
							</Text>
						</View>

						<View style={{ flex: 3, height: 130 }}>
							<ScrollView
								ref={(ref) => (this.scrollView = ref)}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{
									alignItems: "center",
									paddingStart: 5,
									paddingEnd: 5,
								}}
							>
								{this.state.pending_cards.map((user) => (
									<View>
										<Thumbnail
											large
											style={thumnailStyle}
											source={{ uri: user.image }}
											key={user.name}
										/>
										<Text style={styles.thumbnailCaption}>
											{user.name.substring(
												0,
												user.name.search(" ")
											)}
										</Text>
									</View>
								))}
							</ScrollView>
						</View>

						<View style={styles.matchTopSub}>
							<Text style={styles.matchTitle}>Matches</Text>
						</View>
						<View style={{ paddingHorizontal: 10 }}>
							<FlatList
								numColumns={2}
								data={this.state.cards}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item }) => (
									<TouchableOpacity
										activeOpacity={1}
										onPress={() =>
											this.props.navigation.navigate(
												"OtherProfile2",
												{
													email: item.email,
												}
											)
										}
									>
										<CardItem
											image={{ uri: item.image, checksum: item.checksum }}
											name={item.name}
											status={"Online"}
											email={item.email}
											variant
										/>
									</TouchableOpacity>
								)}
							/>
						</View>
					</ScrollView>
				</View>
			</ImageBackground>
		);
	}
}

export default Matches;
