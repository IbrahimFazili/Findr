import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";

const DIMENTIONS = Dimensions.get('window');

const nameStyle = [
    /* 
    @Ibby
    
    Use Relative CSS. DO NOT USE ABSOLUTE CSS
    
    Absolute CSS example: { paddingBottom: 7 }
    Relative CSS example: { paddingBottom: DIMENTIONS.height * 0.1 }

    DIMENTIONS.height * 0.1 implies a padding of 10% of the total window size.

    Use relative CSS otherwise we have to redo CSS to phones of different sizes

    ~ Lakshya
    */
    {
      paddingBottom: 7,
      marginTop: 0,
      color: '#363636',
      fontSize: 35,
      alignSelf: 'center'
    }
];

class ProfilePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isVisible: props.visible};
    }

    componentWillReceiveProps(props) {
        if(props.visible !== this.state.isVisible) {
            this.setState({ isVisible: props.visible })
        }
    }

    render() {
        return (
            <Modal 
            visible={this.state.isVisible} 
            onBackdropPress={() => this.setState({ isVisible: false })}
            style={styles.popupCard}
            >

                <Text style={nameStyle}>Lakshya Gupta</Text>

            </Modal>
        );
    }
}

export default ProfilePopup;
