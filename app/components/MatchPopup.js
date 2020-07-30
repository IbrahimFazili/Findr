import React from 'react';
import { Text, View, Dimensions, Image } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import Swiper from 'react-native-swiper';
import PlaceHolder from "../assets/icons/placeholder_icon.svg"
import { Overlay, Button } from 'react-native-elements';
import CachedImage from './CachedImage';

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
			image: props.image,
		};
	}

	componentWillReceiveProps(props) {
		if (props.visible !== this.state.isVisible) {
			this.setState({ isVisible: props.visible });
		}
		if (props.name !== this.state.Name) {
			this.setState({ Name: props.name });
		}
		if (props.image !== this.state.image) {
			this.setState({ image: props.image });
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
				{/* { this.props.image.length === 0 ? <PlaceHolder width={30} height={30}/> 
				: <Image source={require('../assets/images/Findr_logo2x.png')} />
				} */}
				<Image 
				source={require('../assets/images/Findr_logo2x.png')}
				style={{
					position: 'absolute',
					top: DIMENTIONS.height * 0.03,
					width: DIMENTIONS.width * 0.2,
					height: DIMENTIONS.height * 0.1,
					borderColor: 'black',
					borderWidth: 1,
					borderRadius: 50,
					alignSelf: "center"
				}}
				/>
                <Text style={styles.usernameHome}>{"Scott Middough"}</Text>
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
