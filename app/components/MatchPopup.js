import React from 'react';
import { Text, View, Dimensions, Image, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import PlaceHolder from "../assets/icons/placeholder_icon.svg"
import { Overlay, Button } from 'react-native-elements';

const DIMENTIONS = Dimensions.get("window");

const nameStyle = [
    {
      paddingBottom: 7,
      marginTop: 0,
      color: '#363636',
      fontSize: 35,
      alignSelf: 'center'
    }
];

const imageStyle = [
	{
		position: 'absolute',
		top: DIMENTIONS.height * 0.03,
		width: DIMENTIONS.width * 0.2,
		height: DIMENTIONS.height * 0.1,
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 50,
		alignSelf: "center"
	}
];

class MatchPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: props.visible,
			name: props.name,
			image: props.image,
			email: props.email
		};
	}

	componentWillReceiveProps(props) {
		if (props.visible !== this.state.isVisible) {
			this.setState({ isVisible: props.visible });
		}
		if (props.name !== this.state.name) {
			this.setState({ name: props.name });
		}
		if (props.image !== this.state.image) {
			this.setState({ image: props.image });
		}
		if (props.email !== this.state.email) {
			this.setState({ email: props.email });
		}
	}

	render() {
		return (
			<Modal
            visible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}
            style={styles.matchPop}
            transparent={true}
            animationType={"fade"}
			>	
				{ this.props.image.length === 0 ?
				<View style={{ alignSelf: "center" }}>
					<PlaceHolder width={30} height={30}/>
				</View>
				: <Image source={{ uri: this.state.image }} style={imageStyle} />
				}
				
                <Text style={styles.usernameHome}>{this.state.name}</Text>
                <Text style={styles.match}>It's a Match!</Text>
                <View style={styles.chatButton}>
                    <Button
					title="Chat"
					type="outline"
					titleStyle={styles.buttonText}
					buttonStyle={styles.chatButtonStyle}
					onPress={async () => {
						this.setState({ isVisible: false });
						this.props.navigation.navigate('ChatPage', {
							messages: [],
						  	own_email: await AsyncStorage.getItem('storedEmail'),
						  	user_name: this.state.name,
						  	user_image: { uri: this.state.image },
						  	user_email: this.state.email
						});
					}}
                    />
                </View>
                <View style={styles.ignoreButton}>
                    <Button
					title="View Profile"
					type="outline"
					titleStyle={styles.ignoreText}
					buttonStyle={styles.ignoreButtonStyle}
					onPress={() => {
						this.setState({ isVisible: false });
						this.props.navigation.navigate("OtherProfile2", { email: this.state.email })
					}}
					/>
                </View>
				
				<Overlay
           			visible={this.state.isVisible} onBackdropPress={()=> this.setState({isVisible: false})}
           		>  
				   </Overlay>
			</Modal>
		);
	}
}

export default MatchPopup;
