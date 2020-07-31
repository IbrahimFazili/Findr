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

class OutOfCardsPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: props.visible,
			email: props.email
		};
	}

	componentWillReceiveProps(props) {
		if (props.visible !== this.state.isVisible) {
			this.setState({ isVisible: props.visible });
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
            style={styles.noCardPop}
            transparent={true}
            animationType={"fade"}
			>	
                <Text style={styles.noCardText}>Oops! You're out of cards</Text>
                <Text style={styles.noCardText1}>Try updating your keywords to get more!</Text>
                <View style={styles.viewProfileButton}>
                    <Button
					title="View Profile"
					type="outline"
					titleStyle={styles.ignoreText}
					buttonStyle={styles.ignoreButtonStyle}
					onPress={() => {
						this.setState({ isVisible: false });
						this.props.navigation.navigate("Profile", { email: this.state.email })
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

export default OutOfCardsPopup;
