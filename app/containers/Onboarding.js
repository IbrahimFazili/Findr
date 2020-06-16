import * as React from 'react';
import { View, AsyncStorage, Image, Text, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Animated, Button } from 'react-native';
import styles from '../assets/styles';
import Swiper from 'react-native-swiper'
import APIConnection from '../assets/data/APIConnection';
import CardItem from '../components/CardItem';

const INPUT_RANGE = [0, 1, 2, 3];
const OUTPUT_RANGE = ["#8B9EAF", "#4D617C", "#679389", "#1A5D57"];
const FULL_HEIGHT = Dimensions.get("window").height;

class Onboarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            API: new APIConnection(),
            cards: [],
        };  
        this.animatedColorValue = new Animated.Value(0),
        this.backgroundColor = this.animatedColorValue.interpolate({
            inputRange: INPUT_RANGE,
            outputRange: OUTPUT_RANGE,
            })
    }

    onIndexChanged = newIndex => {
        Animated.timing(this.animatedColorValue, {
          toValue: newIndex,
          duration: 250,
        }).start();
    };

    async componentDidMount() {
        const data = await this.state.API.loadData("meredith.grey@seattlegrace.com");
        this.setState({ cards: data });
    }

    render() {
        const { backgroundColor, onIndexChanged } = this;
        return (
            <Animated.View style={[styles.onboardingBg, { backgroundColor }]}>
                <View style={{width:"100%",height:"100%"}}>
                    <Swiper
                        style={styles.onboardingWrapper}
                        height={FULL_HEIGHT}
                        onIndexChanged={onIndexChanged.bind(this)}
                        dot={
                            <View
                            style={{
                                backgroundColor: 'rgba(0,0,0,.3)',
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                marginLeft: 7,
                                marginRight: 7,
                                marginBottom: 10
                            }}/>
                        }
                        activeDot={
                            <View
                            style={{
                                backgroundColor: '#FFF',
                                width: 12,
                                height: 12,
                                borderRadius: 10,
                                marginRight: 7,
                                marginLeft: 7,
                                marginBottom: 10
                            }}/>
                        }
                        paginationStyle={{
                            bottom: -23,
                            left: null,
                            right: 10
                        }}
                        loop={false}
                    >
                        <View style={styles.slide1}>         
                            <View style={styles.slideOneTop}>
                                <Text style={styles.slideTwoHeader}>Efficient Work</Text>
                                <Image style={{width: 50, marginTop: FULL_HEIGHT * 0.015, marginBottom: FULL_HEIGHT * 0.015}} source={require('../assets/images/line.png')}/>
                                <Text style={styles.slideTwoNormal}>Master the Art of Studying Efficiently</Text> 
                            </View>
                            <View style={styles.slideoneCarousel}>
                                <ScrollView
                                    style={{zIndex: Number.MAX_VALUE}}
                                    ref={ref => this.scrollView = ref}
                                    onLayout={() =>
                                        this.scrollView.scrollToEnd({animated: true, duration: 5000})
                                    }
                                    loop={true}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        alignItems: "center",
                                        paddingStart: 5,
                                        paddingEnd: 5,
                                    }}
                                >
                                    {this.state.cards.map((user) => (
                                    <View>
                                        <CardItem
                                            variant
                                            key={user.name}
                                            image={{ uri: user.image }}
                                            name={user.name}
                                            status={"Online"}
                                        />
                                    </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.slide2}>
                            <View style={styles.slideTwoContent}>
                                <Text style={styles.slideTwoHeader}>Network Smarter</Text>
                                <Image style={{width: 50, marginTop: FULL_HEIGHT * 0.015, marginBottom: FULL_HEIGHT * 0.015}} source={require('../assets/images/line.png')}/>
                                <Text style={styles.slideTwoNormal}>Get outside your comfort zone!</Text>
                                <Text style={styles.slideTwoNormal}>Find people in every field</Text>
                                <Image style={{marginTop: FULL_HEIGHT * 0.05}} source={require('../assets/images/newicn_add.png')}/>
                            </View>
                        </View>
                        <View style={styles.slide3}>
                            <View styles={styles.slide3content}>
                                <Text style={styles.slide3Header}>Chat Rooms</Text>
                                <Image style={styles.slide3line} source={require('../assets/images/line.png')}/>
                                <Text style={styles.slide3Normal}>Talk to anyone around campus!</Text>
                                <Image style={{marginTop: FULL_HEIGHT * 0.15}} source={require('../assets/images/chatRoom.png')}/>
                            </View>
                        </View>
                        <View style={styles.slide4}>
                            <View style={styles.slide4content}>
                                <Image style={styles.onboardinglogo} source={require('../assets/images/Findr_white2x.png')}/>
                                <View style={styles.slide4buttons}>
                                    <TouchableOpacity
                                        style={styles.onBoardingButt}>
                                        <Text style={styles.onBoardingButtText}>Sign Up</Text>
                                    </TouchableOpacity>
                                    <Image style={styles.onBoardingSep} source={require('../assets/images/OR_photo.png')}/>
                                    <TouchableOpacity
                                        style={styles.onBoardingButt}>
                                        <Text style={styles.onBoardingButtText}>Log In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Swiper>
                </View>
            </Animated.View>
        );
    }
}

export default Onboarding;
