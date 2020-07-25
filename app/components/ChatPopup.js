import React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { TouchableOpacity } from "react-native-gesture-handler";
const WHITE = "#FFFFFF";
const BLACK = "#000000";
import APIConnection from "../assets/data/APIConnection";

const DIMENTIONS = Dimensions.get("window");

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;
const ICON_FONT = "tinderclone";

const nameStyle = [
	{
		paddingBottom: 7,
		marginTop: 0,
		color: "#363636",
		fontSize: 35,
		alignSelf: "center",
	},
];

class ChatPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			API: new APIConnection(),
			isVisible: props.visible,
			email: props.email,
			navigate: props.navigation,
			own_email: props.own_email,
		};
		this.toggleView.bind(this);
	}

	componentWillReceiveProps(props) {
		if (props.visible !== this.state.isVisible) {
			this.setState({ isVisible: props.visible });
		}
	}
	toggleView() {
		this.setState({
			isVisible: !this.state.isVisible,
		});
	}

	onNavigate = () => {
		this.setState({ isVisible: false }),
			this.state.navigate.navigate("OtherProfile", {
				email: this.state.email,
			});
	};

	render() {
		return (
			<Modal
				visible={this.state.isVisible}
				onBackdropPress={() => this.setState({ isVisible: false })}
				style={styles.popupCard}
				transparent={true}
				animationType={"fade"}
			>
				<View>
					<TouchableOpacity
						style={styles.filters}
						onPress={async () =>
							await this.state.API.blockUser(
								this.state.own_email,
								this.state.email
							)
						}
					>
						<Text>Block</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filters}
						onPress={this.onNavigate}
					>
						<Text>View Profile</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
}
const styles = StyleSheet.create({
	filters: {
		backgroundColor: WHITE,
		padding: 10,
		borderRadius: 20,
		width: 100,
		// shadowOpacity: 0.05,
		// shadowRadius: 10,
		// shadowColor: BLACK,
		// shadowOffset: { height: 0, width: 0 },
		elevation: 10,
		alignSelf: "center",
	},
	popupCard: {
		backgroundColor: WHITE,
		borderRadius: 20,
		maxHeight: DIMENSION_HEIGHT * 0.7,
		maxWidth: DIMENSION_WIDTH * 0.85,
		alignSelf: "center",
		marginVertical: DIMENSION_HEIGHT * 0.13,
		borderRadius: 30,
		height: 300,
		width: 300,
		// overflow: "hidden",
	},
});

export default ChatPopup;
