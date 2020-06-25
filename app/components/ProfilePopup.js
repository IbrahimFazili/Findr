import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import Swiper from 'react-native-swiper';
import { BlurView } from '@react-native-community/blur';
import {Overlay} from 'react-native-elements';


class ProfilePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isVisible: props.visible, 
            Name: props.name,
            keywords: props.keywords,
            bio: props.bio,
            uni: props.uni
        };
    }

    componentWillReceiveProps(props) {
        if(props.visible !== this.state.isVisible) {
            this.setState({ isVisible: props.visible });
        }
        if(props.name !== this.state.Name) {
            this.setState({ Name: props.name });
        }
        if(props.keywords !== this.state.keywords) {
            for (let i = 0; i < props.keywords.length; i++) {
                props.keywords[i] = props.keywords[i].toUpperCase();
            }
            this.setState({ keywords: props.keywords });
        }
        if(props.bio !== this.state.bio) {
            this.setState({ bio: props.bio });
        }
        if(props.uni !== this.state.uni) {
            this.setState({ uni: props.uni });
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

            <View style={styles.popupCardTitlePosition}>
                <Text style={styles.popupCardTitle}>Additional Info</Text>
            </View>

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
            paginationStyle={{}}>
                
                <View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Name: {" "}
                            <Text style={styles.textValues}>{this.state.Name}</Text>
                        </Text>
                    </View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>University: {" "} 
                            <Text style={styles.textValues}>{this.state.uni}</Text>
                        </Text>
                    </View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Major: {" "}
                            <Text style={styles.textValues}>Life Sciences</Text>
                        </Text>
                    </View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Keywords: {" "}
                            <Text style={styles.textValues}>{this.state.keywords.join(", ")}</Text>
                        </Text>
                    </View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Bio: {" "}
                            <Text style={styles.textValues}>
                                {this.state.bio}
                            </Text>
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Projects: {" "}
                        <Text style={styles.textValues}></Text>
                        </Text>
                    </View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Skills: {" "}
                            <Text style={styles.textValues}></Text>
                        </Text>
                    </View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Relevant Experience: {" "}
                            <Text style={styles.textValues}></Text>
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>Random Stuff: {" "}
                            <Text style={styles.textValues}></Text>
                        </Text>
                    </View>
                    <View style={styles.popupStyling}>
                        <Text style={styles.biodata}>More Information: {" "}
                            <Text style={styles.textValues}></Text>
                        </Text>
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
