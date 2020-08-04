import React from 'react';
import { Text, View, Dimensions, Image, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import PlaceHolder from "../assets/icons/placeholder_icon.svg"
import { Overlay, Button } from 'react-native-elements';
import APIConnection from '../assets/data/APIConnection';

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

class OutOfCardsPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: props.email
		};
	}

	componentWillReceiveProps(props) {
		if (props.email !== this.state.email) {
			this.setState({ email: props.email });
		}
	}

	render() {
		return (
			<View
			style={{ 
				position: 'absolute',
				zIndex: 0,
				marginLeft: DIMENTIONS.width * 0.05,
				paddingVertical: DIMENTIONS.height * 0.3 
			}}
			>	
                <Text style={styles.noCardText}>Looks like you don't have any matches</Text>
                <Text style={styles.noCardText1}>Refresh or update your interests to get more!</Text>
                <View style={styles.viewProfileButton}>
					<Button
					title="Refresh"
					type="outline"
					titleStyle={styles.viewProfileText}
					buttonStyle={styles.refreshButtonStyle}
					onPress={() => APIConnection.HomePage ? APIConnection.HomePage.notify() : null}
					/>

                    <Button
					title="View Profile"
					type="outline"
					titleStyle={styles.viewProfileText}
					buttonStyle={styles.viewProfileButtonStyle}
					onPress={() => {
						this.props.navigation.navigate("Profile", { email: this.state.email })
					}}
					/>
                </View>
			</View>
		);
	}
}

export default OutOfCardsPopup;
