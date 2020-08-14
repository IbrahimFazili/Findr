import React from 'react';
import { Text, View, Dimensions, Image, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import PlaceHolder from "../assets/icons/placeholder_icon.svg"
import BackButtonIcon from "../assets/icons/back_black.svg";
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
            email: props.email,
            API: new APIConnection()
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
    
    async deleteU(email){
        //ADD response status codes
        await this.state.API.deleteUser({email});
    }

	render() {
		return (
			<Modal
                visible={this.state.isVisible}
                onBackdropPress={() => this.setState({ isVisible: false })}
                style={styles.confirmPassPopup}
                transparent={true}
                animationType={"fade"}
			>	
                <Text style={styles.confirmPassText}>Are you sure?</Text>
                <View style={styles.chatButton}>
                    <Button
					title="Cancel"
					type="outline"
					titleStyle={styles.buttonText}
					buttonStyle={styles.chatButtonStyle}
					onPress={()=>{this.setState({isVisible: false})}}
                    />
                </View>
                <View style={styles.ignoreButton}>
                    <Button
					title="Yes"
					type="outline"
					titleStyle={styles.ignoreText}
					buttonStyle={styles.ignoreButtonStyle}
					onPress={(() => {
                        this.setState({ isVisible: false});
                        AsyncStorage.removeItem('storedEmail');
                        this.state.API.MESSAGE_QUEUES = {};
                        this.state.API.observers = [];
                        this.deleteU(email),
                        this.props.navigation.navigate("LogIn"); 
                    }).bind(this)
                    }
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
