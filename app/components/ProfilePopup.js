import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import Swiper from 'react-native-swiper';
import { BlurView } from '@react-native-community/blur';
import {Overlay} from 'react-native-elements';

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
        this.state = { isVisible: props.visible, 
        Name: props.name,
        Courses: props.courses,
        Description: props.description};
    }

    componentWillReceiveProps(props) {
        if(props.visible !== this.state.isVisible) {
            this.setState({ isVisible: props.visible })
        }
        if(props.name !== this.state.Name) {
            this.setState({ Name: props.name })
        }
        if(props.courses !== this.state.Courses) {
            this.setState({ Courses: props.courses })
        }
        if(props.description !== this.state.Description) {
            this.setState({ Description: props.description })
        }
    }

    render() {
        return (
            <Modal 
            visible={this.state.isVisible} 
            onBackdropPress={() => this.setState({ isVisible: false })}
            style={styles.popupCard}
            transparent={true}
            animationType={"fade"}
            >
            {/* <BlurView
            blurType="chromeMaterialDark"
            style={styles.blurredView}
            > */}

            <Swiper
            onBackdropPress={()=> this.setState({isVisible: false})}
            activeDotColor="#1A5D57"
            from={1}
            loop={false}
            bounces={true}
            minDistanceForAction={0.1}
            controlsProps={{
                dotsTouchable: true,
                prevPos: 'left',
                nextPos: 'right',
                nextTitle: '>',
            }}
            paginationStyle={{bottom: DIMENTIONS.height * 0.05}}>
                
                <View>
                    <View style={styles.popupCardTitlePosition}>
                        <Text style={styles.popupCardTitle}>Additional Info</Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Name: {this.state.Name}</Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>University: University of Toronto</Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Major: Life Sciences</Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Courses: Eco100, ITA101, CSC108, 
                        MGM101, ANT102</Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Bio: {this.state.description}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.popupCardTitlePosition}>
                        <Text style={styles.popupCardTitle}>Additional Info</Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Projects: </Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Skills: </Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Relevant Experience: </Text>
                    </View>
                </View>
                <View>
                    <View style={styles.popupCardTitlePosition}>
                        <Text style={styles.popupCardTitle}>Additional Info</Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>Random Stuff: </Text>
                    </View>
                    <View>
                        <Text style={styles.biodata}>More Information: </Text>
                    </View>
                </View>
            </Swiper>
            {/* </BlurView> */}
            <Overlay isVisible={true} onBackdropPress={()=>this.setState({isVisible: false})}>
            </Overlay>
            </Modal>
        );
    }
}

export default ProfilePopup;
