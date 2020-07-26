import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import Swiper from 'react-native-swiper';
// import { BlurView } from '@react-native-community/blur';
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

class MatchPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: props.visible,
			Name: props.name,

		};
	}

	componentWillReceiveProps(props) {
		if (props.visible !== this.state.isVisible) {
			this.setState({ isVisible: props.visible });
		}
		if (props.name !== this.state.Name) {
			this.setState({ Name: props.name });
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
                <Text style={styles.usernameHome}>{this.state.Name}</Text>
                <Text style={styles.match}>It's a Match!</Text>
                <View style={styles.chatButton}>
                    <Button title="Chat" type="outline" titleStyle={styles.buttonText}
                    buttonStyle={styles.chatButtonStyle}
                    />
                </View>
                <View style={styles.ignoreButton}>
                    <Button title="View Profile" type="outline" titleStyle={styles.ignoreText}
                    buttonStyle={styles.ignoreButtonStyle}/>
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
